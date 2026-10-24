import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { FirebaseService } from '../firebase/firebase.service';
import { Request } from 'express';

@Injectable()
export class FirebaseStrategy extends PassportStrategy(Strategy, 'firebase') {
  constructor(private readonly firebaseService: FirebaseService) {
    super();
  }

  async validate(req: Request) {
    const sessionCookie = req.cookies?.session;

    if (!sessionCookie) {
      throw new UnauthorizedException('No session cookie found');
    }

    try {
      const decodedToken = await this.firebaseService.getAuth().verifySessionCookie(sessionCookie, true);
      if (!decodedToken) {
        throw new UnauthorizedException();
      }
      return decodedToken; // This becomes req.user
    } catch (error) {
      const res = (req as any).res;
      if (res && typeof res.clearCookie === 'function') {
        const isProduction = process.env.NODE_ENV === 'production';
        const isSecure = isProduction || process.env.FRONTEND_URL?.includes('https://');
        res.clearCookie('session', {
          path: '/',
          httpOnly: true,
          secure: isSecure,
          sameSite: 'lax',
        });
      }
      throw new UnauthorizedException('Invalid Firebase Session');
    }
  }
}
