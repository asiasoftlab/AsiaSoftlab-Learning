import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { CoursesRepository } from './courses.repository';
import { FirebaseModule } from '../firebase/firebase.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [FirebaseModule, AuthModule, UsersModule, CloudinaryModule],
  controllers: [CoursesController],
  providers: [CoursesService, CoursesRepository],
  exports: [CoursesService, CoursesRepository],
})
export class CoursesModule {}
