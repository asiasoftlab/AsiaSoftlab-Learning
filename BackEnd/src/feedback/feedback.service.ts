import { Injectable, BadRequestException } from '@nestjs/common';
import { FeedbackRepository } from './feedback.repository';
import { CreateFeedbackDto } from './dto/feedback.dto';
import { StudentFeedback } from './entities/feedback.entity';

@Injectable()
export class FeedbackService {
  constructor(private readonly feedbackRepository: FeedbackRepository) {}

  async submitFeedback(dto: CreateFeedbackDto, user: any): Promise<StudentFeedback> {
    const userId = user?.id || user?.uid;
    if (!userId) {
      throw new BadRequestException('User identification is required to submit feedback');
    }

    const userName = user?.displayName || user?.name || 'Student';
    const userEmail = user?.email || '';
    const userAvatar = user?.photoURL || user?.avatar || '';

    // Check if feedback already exists for this certificate
    if (dto.certificateNumber) {
      const existing = await this.feedbackRepository.findByCertificateNumber(dto.certificateNumber, userId);
      if (existing) {
        // Update existing feedback
        const updated: StudentFeedback = {
          ...existing,
          rating: dto.rating,
          contentRating: dto.contentRating ?? existing.contentRating,
          instructorRating: dto.instructorRating ?? existing.instructorRating,
          practicalRating: dto.practicalRating ?? existing.practicalRating,
          recommendLikelihood: dto.recommendLikelihood ?? existing.recommendLikelihood,
          tags: dto.tags ?? existing.tags,
          feedback: dto.feedback,
          isPublic: dto.isPublic !== undefined ? dto.isPublic : existing.isPublic,
          updatedAt: new Date(),
        };
        return this.feedbackRepository.create(updated);
      }
    }

    const newFeedback: StudentFeedback = {
      id: '',
      userId,
      userName,
      userEmail,
      userAvatar,
      courseId: dto.courseId || '',
      courseTitle: dto.courseTitle,
      certificateId: dto.certificateId || '',
      certificateNumber: dto.certificateNumber || '',
      rating: dto.rating,
      contentRating: dto.contentRating || dto.rating,
      instructorRating: dto.instructorRating || dto.rating,
      practicalRating: dto.practicalRating || dto.rating,
      recommendLikelihood: dto.recommendLikelihood || 'yes',
      tags: dto.tags || [],
      feedback: dto.feedback,
      isPublic: dto.isPublic !== undefined ? dto.isPublic : true,
      status: 'approved',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.feedbackRepository.create(newFeedback);
  }

  async getUserFeedbacks(user: any): Promise<StudentFeedback[]> {
    const userId = user?.id || user?.uid;
    if (!userId) return [];
    return this.feedbackRepository.findByUser(userId);
  }

  async checkCertificateFeedback(certificateNumber: string, user: any): Promise<{ hasFeedback: boolean; feedback: StudentFeedback | null }> {
    const userId = user?.id || user?.uid;
    if (!userId || !certificateNumber) {
      return { hasFeedback: false, feedback: null };
    }

    const feedback = await this.feedbackRepository.findByCertificateNumber(certificateNumber, userId);
    return {
      hasFeedback: !!feedback,
      feedback,
    };
  }

  async getCourseFeedbacks(courseId: string): Promise<StudentFeedback[]> {
    const list = await this.feedbackRepository.findByCourse(courseId);
    return list.filter((f) => f.status === 'approved');
  }

  async getAllFeedbacks(): Promise<StudentFeedback[]> {
    return this.feedbackRepository.findAll();
  }

  async updateStatus(id: string, status: 'approved' | 'pending' | 'rejected'): Promise<{ success: boolean }> {
    await this.feedbackRepository.updateStatus(id, status);
    return { success: true };
  }

  async deleteFeedback(id: string): Promise<{ success: boolean }> {
    await this.feedbackRepository.delete(id);
    return { success: true };
  }
}
