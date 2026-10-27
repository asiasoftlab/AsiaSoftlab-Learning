import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { CoursesRepository } from './courses.repository';
import { CourseProgressRepository } from './course-progress.repository';
import { FirebaseModule } from '../firebase/firebase.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [FirebaseModule, AuthModule, UsersModule, CloudinaryModule, StorageModule],
  controllers: [CoursesController],
  providers: [CoursesService, CoursesRepository, CourseProgressRepository],
  exports: [CoursesService, CoursesRepository, CourseProgressRepository],
})
export class CoursesModule {}
