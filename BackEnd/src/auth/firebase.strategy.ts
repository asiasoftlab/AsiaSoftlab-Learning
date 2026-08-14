import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class FirebaseStrategy extends PassportStrategy(Strategy, 'bearer') {
  constructor(private readonly firebaseService: FirebaseService) {
    super();
  }

  async validate(token: string) {
    try {
      const decodedToken = await this.firebaseService.getAuth().verifyIdToken(token);
      if (!decodedToken) {
        throw new UnauthorizedException();
      }
      return decodedToken; // This becomes req.user
    } catch (error) {
      throw new UnauthorizedException('Invalid Firebase Token');
    }
  }
}
