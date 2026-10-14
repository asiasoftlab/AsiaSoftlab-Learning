import { Test, TestingModule } from '@nestjs/testing';

jest.mock('./auth.service');
jest.mock('../users/users.service');

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: Partial<Record<keyof AuthService, jest.Mock>>;
  let usersService: Partial<Record<keyof UsersService, jest.Mock>>;

  beforeEach(async () => {
    authService = {
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
    };

    usersService = {
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: UsersService, useValue: usersService },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  describe('login', () => {
    it('should successfully log in and set cookie with user details including role', async () => {
      const mockLoginDto = { email: 'student@example.com', password: 'password123', rememberMe: true };
      const mockResult = {
        message: 'Login successful',
        sessionCookie: 'mock-session-cookie',
        email: 'student@example.com',
        userId: 'user-123',
        expiresIn: 1000 * 60 * 60 * 24 * 14,
      };

      authService.login!.mockResolvedValue(mockResult);
      usersService.findById!.mockResolvedValue({
        id: 'user-123',
        email: 'student@example.com',
        displayName: 'Student Jane',
        role: 'student',
      });

      const mockRes: any = {
        cookie: jest.fn(),
      };

      const response = await authController.login(mockLoginDto as any, mockRes);

      expect(authService.login).toHaveBeenCalledWith(mockLoginDto);
      expect(usersService.findById).toHaveBeenCalledWith('user-123');
      expect(mockRes.cookie).toHaveBeenCalledWith(
        'session',
        'mock-session-cookie',
        expect.objectContaining({
          httpOnly: true,
          path: '/',
        }),
      );
      expect(response).toEqual({
        success: true,
        message: 'Login successful',
        user: {
          id: 'user-123',
          email: 'student@example.com',
          displayName: 'Student Jane',
          role: 'student',
        },
      });
    });
  });

  describe('logout', () => {
    it('should clear session cookie and invoke authService.logout when session cookie is present', async () => {
      authService.logout!.mockResolvedValue(undefined);
      const mockReq: any = {
        cookies: { session: 'active-session-cookie' },
      };
      const mockRes: any = {
        clearCookie: jest.fn(),
      };

      const result = await authController.logout(mockReq, mockRes);

      expect(authService.logout).toHaveBeenCalledWith('active-session-cookie');
      expect(mockRes.clearCookie).toHaveBeenCalledWith(
        'session',
        expect.objectContaining({
          path: '/',
          httpOnly: true,
        }),
      );
      expect(result).toEqual({ success: true, message: 'Logged out successfully' });
    });
  });

  describe('getMe', () => {
    it('should return user info if found in database', async () => {
      usersService.findById!.mockResolvedValue({
        id: 'user-123',
        email: 'student@example.com',
        displayName: 'Student Jane',
        role: 'student',
      });

      const mockReq: any = { user: { uid: 'user-123' } };
      const result = await authController.getMe(mockReq);

      expect(result).toEqual({
        success: true,
        user: {
          id: 'user-123',
          email: 'student@example.com',
          displayName: 'Student Jane',
          role: 'student',
        },
      });
    });

    it('should throw UnauthorizedException if user not found in database', async () => {
      usersService.findById!.mockResolvedValue(null);
      const mockReq: any = { user: { uid: 'non-existent' } };

      await expect(authController.getMe(mockReq)).rejects.toThrow(UnauthorizedException);
    });
  });
});
