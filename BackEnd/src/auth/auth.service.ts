import { Injectable, UnauthorizedException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FirebaseService } from '../firebase/firebase.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      const userRecord = await this.firebaseService.getAuth().createUser({
        email: registerDto.email,
        password: registerDto.password,
        displayName: registerDto.displayName,
      });

      await this.usersService.create({
        id: userRecord.uid,
        email: userRecord.email || registerDto.email,
        displayName: userRecord.displayName || registerDto.displayName,
        role: 'student', // Enforce student role server-side
      });

      return {
        message: 'User registered successfully',
        userId: userRecord.uid,
      };
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async login(loginDto: LoginDto) {
    const apiKey = this.configService.get<string>('FIREBASE_API_KEY');
    
    if (!apiKey) {
      throw new BadRequestException('Firebase API key is not configured');
    }

    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: loginDto.email,
            password: loginDto.password,
            returnSecureToken: true,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new UnauthorizedException(data.error?.message || 'Invalid credentials');
      }

      // Create session cookie
      // Set session expiration to 5 days.
      const expiresIn = 60 * 60 * 24 * 5 * 1000;
      const sessionCookie = await this.firebaseService.getAuth().createSessionCookie(data.idToken, { expiresIn });

      return {
        message: 'Login successful',
        sessionCookie,
        email: data.email,
        userId: data.localId,
        expiresIn,
      };
    } catch (error: any) {
      if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
        throw error;
      }
      throw new UnauthorizedException('Authentication failed');
    }
  }

  async logout(sessionCookie: string) {
    try {
      const decodedClaims = await this.firebaseService.getAuth().verifySessionCookie(sessionCookie);
      await this.firebaseService.getAuth().revokeRefreshTokens(decodedClaims.sub);
    } catch (error) {
      // Ignore errors if token is already invalid
    }
  }
}
