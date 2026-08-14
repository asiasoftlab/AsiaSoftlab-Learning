import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FirebaseModule } from '../firebase/firebase.module';
import { PassportModule } from '@nestjs/passport';
import { FirebaseStrategy } from './firebase.strategy';

@Module({
  imports: [FirebaseModule, PassportModule.register({ defaultStrategy: 'bearer' })],
  providers: [AuthService, FirebaseStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
