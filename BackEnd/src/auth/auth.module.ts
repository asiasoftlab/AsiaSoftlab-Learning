import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FirebaseModule } from '../firebase/firebase.module';
import { PassportModule } from '@nestjs/passport';
import { FirebaseStrategy } from './firebase.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [FirebaseModule, PassportModule.register({ defaultStrategy: 'bearer' }), forwardRef(() => UsersModule)],
  providers: [AuthService, FirebaseStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
