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
      throw new UnauthorizedException('Invalid Firebase Session');
    }
  }
}
