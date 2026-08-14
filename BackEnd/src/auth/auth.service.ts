import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FirebaseService } from '../firebase/firebase.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      const userRecord = await this.firebaseService.getAuth().createUser({
        email: registerDto.email,
        password: registerDto.password,
        displayName: registerDto.displayName,
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

      return {
        message: 'Login successful',
        idToken: data.idToken,
        email: data.email,
        userId: data.localId,
        expiresIn: data.expiresIn,
      };
    } catch (error: any) {
      if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
        throw error;
      }
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
