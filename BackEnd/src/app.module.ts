import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { AiModule } from './ai/ai.module';
import { OpportunitiesModule } from './opportunities/opportunities.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    CoursesModule,
    CloudinaryModule,
    AiModule,
    OpportunitiesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
