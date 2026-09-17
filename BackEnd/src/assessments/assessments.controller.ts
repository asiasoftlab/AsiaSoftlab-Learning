import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AssessmentsService } from './assessments.service';
import { CreateAssessmentDto, UpdateAssessmentDto, SubmitAssessmentDto } from './dto/assessment.dto';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('assessments')
export class AssessmentsController {
  constructor(private readonly assessmentsService: AssessmentsService) {}

  @Post()
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin', 'instructor')
  @UseInterceptors(FileInterceptor('thumbnail'))
  async create(
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const createDto: CreateAssessmentDto = {
      title: body.title,
      courseId: body.courseId,
      courseTitle: body.courseTitle || 'General',
      category: body.category || 'General',
      description: body.description,
      durationMinutes: body.durationMinutes ? Number(body.durationMinutes) : 30,
      passingScore: body.passingScore ? Number(body.passingScore) : 70,
      maxAttempts: body.maxAttempts ? Number(body.maxAttempts) : 3,
      status: body.status || 'Published',
      questions: body.questions
        ? typeof body.questions === 'string'
          ? JSON.parse(body.questions)
          : body.questions
        : [],
    };

    return this.assessmentsService.createWithThumbnail(createDto, file);
  }

  @Get()
  findAll() {
    return this.assessmentsService.findAll();
  }

  @Get('stats')
  getStats() {
    return this.assessmentsService.getStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assessmentsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin', 'instructor')
  @UseInterceptors(FileInterceptor('thumbnail'))
  async update(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const updateDto: UpdateAssessmentDto = {
      title: body.title,
      courseId: body.courseId,
      courseTitle: body.courseTitle,
      category: body.category,
      description: body.description,
      durationMinutes: body.durationMinutes ? Number(body.durationMinutes) : undefined,
      passingScore: body.passingScore ? Number(body.passingScore) : undefined,
      maxAttempts: body.maxAttempts ? Number(body.maxAttempts) : undefined,
      status: body.status,
      questions: body.questions
        ? typeof body.questions === 'string'
          ? JSON.parse(body.questions)
          : body.questions
        : undefined,
    };

    return this.assessmentsService.update(id, updateDto, file);
  }

  @Delete(':id')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin', 'instructor')
  remove(@Param('id') id: string) {
    return this.assessmentsService.remove(id);
  }

  @Post(':id/submit')
  @UseGuards(FirebaseAuthGuard)
  submit(
    @Param('id') id: string,
    @Body() submitDto: SubmitAssessmentDto,
    @Req() req: any,
  ) {
    return this.assessmentsService.submitAssessment(id, submitDto, req.user);
  }

  @Get(':id/submissions')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin', 'instructor')
  getSubmissions(@Param('id') id: string) {
    return this.assessmentsService.getSubmissions(id);
  }
}
