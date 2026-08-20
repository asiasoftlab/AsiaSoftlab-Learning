import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { CoursesModule } from '../courses/courses.module';

@Module({
  imports: [CoursesModule],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
