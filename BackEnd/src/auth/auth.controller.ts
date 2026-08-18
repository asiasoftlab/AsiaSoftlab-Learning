import { Controller, Post, Get, Body, Res, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Response, Request } from 'express';
import { FirebaseAuthGuard } from './firebase-auth.guard';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(loginDto);
    
    // Set HTTP-only cookie
    res.cookie('session', result.sessionCookie, {
      maxAge: result.expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return {
      success: true,
      message: result.message,
      user: {
        id: result.userId,
        email: result.email,
      }
    };
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const sessionCookie = req.cookies?.session;
    if (sessionCookie) {
      await this.authService.logout(sessionCookie);
    }
    res.clearCookie('session', { path: '/' });
    return { success: true, message: 'Logged out successfully' };
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('me')
  async getMe(@Req() req: any) {
    // req.user contains the decoded Firebase token
    const user = await this.usersService.findById(req.user.uid);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
      }
    };
  }
}
