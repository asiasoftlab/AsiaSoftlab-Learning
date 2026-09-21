import {Controller,Get,Post,Body,Patch,Param,Delete,UseGuards,Req,} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto, UpdateFeedbackStatusDto } from './dto/feedback.dto';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @UseGuards(FirebaseAuthGuard)
  create(@Body() createFeedbackDto: CreateFeedbackDto, @Req() req: any) {
    return this.feedbackService.submitFeedback(createFeedbackDto, req.user);
  }

  @Get('my')
  @UseGuards(FirebaseAuthGuard)
  getMyFeedbacks(@Req() req: any) {
    return this.feedbackService.getUserFeedbacks(req.user);
  }

  @Get('check/:certificateNumber')
  @UseGuards(FirebaseAuthGuard)
  checkCertificateFeedback(
    @Param('certificateNumber') certificateNumber: string,
    @Req() req: any,
  ) {
    return this.feedbackService.checkCertificateFeedback(certificateNumber, req.user);
  }

  @Get('course/:courseId')
  getCourseFeedbacks(@Param('courseId') courseId: string) {
    return this.feedbackService.getCourseFeedbacks(courseId);
  }

  @Get('all')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin')
  getAll() {
    return this.feedbackService.getAllFeedbacks();
  }

  @Patch(':id/status')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateFeedbackStatusDto,
  ) {
    return this.feedbackService.updateStatus(id, dto.status);
  }

  @Delete(':id')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.feedbackService.deleteFeedback(id);
  }
}
