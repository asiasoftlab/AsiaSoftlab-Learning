import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { AssessmentsRepository } from './assessments.repository';
import { CreateAssessmentDto, UpdateAssessmentDto, SubmitAssessmentDto } from './dto/assessment.dto';
import { Assessment, AssessmentSubmission } from './entities/assessment.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class AssessmentsService {
  constructor(
    private readonly assessmentsRepository: AssessmentsRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createWithThumbnail(createDto: CreateAssessmentDto, file?: Express.Multer.File): Promise<Assessment> {
    try {
      let thumbnailUrl = '';
      let thumbnailPublicId = '';

      if (file) {
        const uploadResult = await this.cloudinaryService.uploadFile(file);
        thumbnailUrl = uploadResult.secure_url;
        thumbnailPublicId = uploadResult.public_id;
      }

      const questions = (createDto.questions || []).map((q, idx) => ({
        id: (q as any).id || `q_${Date.now()}_${idx}`,
        question: q.question,
        options: q.options || [],
        correctOptionIndex: Number(q.correctOptionIndex) || 0,
        explanation: q.explanation || '',
        points: q.points || 5,
      }));

      const assessment: Assessment = {
        id: '',
        title: createDto.title,
        courseId: createDto.courseId,
        courseTitle: createDto.courseTitle,
        category: createDto.category,
        description: createDto.description || '',
        thumbnailUrl: thumbnailUrl || undefined,
        thumbnailPublicId: thumbnailPublicId || undefined,
        durationMinutes: Number(createDto.durationMinutes) || 30,
        passingScore: Number(createDto.passingScore) || 70,
        maxAttempts: Number(createDto.maxAttempts) || 3,
        totalQuestions: questions.length,
        questions,
        status: createDto.status || 'Published',
        userStatus: 'not_started',
        userScore: 0,
        userAttempts: 0,
        userProgress: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return await this.assessmentsRepository.create(assessment);
    } catch (error: any) {
      console.error('CREATE ASSESSMENT SERVICE ERROR:', error);
      throw new InternalServerErrorException('Failed to create assessment: ' + error.message);
    }
  }

  async findAll(): Promise<Assessment[]> {
    return this.assessmentsRepository.findAll();
  }

  async findOne(id: string): Promise<Assessment> {
    const assessment = await this.assessmentsRepository.findById(id);
    if (!assessment) {
      throw new NotFoundException(`Assessment with ID ${id} not found`);
    }
    return assessment;
  }

  async update(id: string, updateDto: UpdateAssessmentDto, file?: Express.Multer.File): Promise<Assessment> {
    const existing = await this.findOne(id);

    let thumbnailUrl = existing.thumbnailUrl;
    let thumbnailPublicId = existing.thumbnailPublicId;

    if (file) {
      if (existing.thumbnailPublicId) {
        await this.cloudinaryService.deleteFile(existing.thumbnailPublicId).catch(() => null);
      }
      const uploadResult = await this.cloudinaryService.uploadFile(file);
      thumbnailUrl = uploadResult.secure_url;
      thumbnailPublicId = uploadResult.public_id;
    }

    const payload: Partial<Assessment> = {
      ...(updateDto.title && { title: updateDto.title }),
      ...(updateDto.courseId !== undefined && { courseId: updateDto.courseId }),
      ...(updateDto.courseTitle && { courseTitle: updateDto.courseTitle }),
      ...(updateDto.category && { category: updateDto.category }),
      ...(updateDto.description !== undefined && { description: updateDto.description }),
      ...(updateDto.durationMinutes !== undefined && { durationMinutes: Number(updateDto.durationMinutes) }),
      ...(updateDto.passingScore !== undefined && { passingScore: Number(updateDto.passingScore) }),
      ...(updateDto.maxAttempts !== undefined && { maxAttempts: Number(updateDto.maxAttempts) }),
      ...(updateDto.status && { status: updateDto.status }),
      ...(thumbnailUrl && { thumbnailUrl }),
      ...(thumbnailPublicId && { thumbnailPublicId }),
      updatedAt: new Date(),
    };

    if (updateDto.questions) {
      const questions = updateDto.questions.map((q, idx) => ({
        id: (q as any).id || `q_${Date.now()}_${idx}`,
        question: q.question,
        options: q.options || [],
        correctOptionIndex: Number(q.correctOptionIndex) || 0,
        explanation: q.explanation || '',
        points: q.points || 5,
      }));
      payload.questions = questions;
      payload.totalQuestions = questions.length;
    }

    return this.assessmentsRepository.update(id, payload);
  }

  async remove(id: string): Promise<{ success: boolean }> {
    const existing = await this.findOne(id);
    if (existing.thumbnailPublicId) {
      await this.cloudinaryService.deleteFile(existing.thumbnailPublicId).catch(() => null);
    }
    await this.assessmentsRepository.remove(id);
    return { success: true };
  }

  async getStats(): Promise<{
    totalAssessments: number;
    completed: number;
    inProgress: number;
    notStarted: number;
    failed: number;
    averageScore: number;
  }> {
    const list = await this.assessmentsRepository.findAll();
    const total = list.length;
    
    let completedCount = 0;
    let inProgressCount = 0;
    let notStartedCount = 0;
    let failedCount = 0;
    let totalScoreSum = 0;
    let scoredItemsCount = 0;

    list.forEach((item) => {
      const status = item.userStatus || 'not_started';
      if (status === 'completed') {
        completedCount++;
        if (item.userScore !== undefined) {
          totalScoreSum += item.userScore;
          scoredItemsCount++;
        }
      } else if (status === 'in_progress') {
        inProgressCount++;
      } else if (status === 'failed') {
        failedCount++;
        if (item.userScore !== undefined) {
          totalScoreSum += item.userScore;
          scoredItemsCount++;
        }
      } else {
        notStartedCount++;
      }
    });

    const averageScore = scoredItemsCount > 0 ? Math.round(totalScoreSum / scoredItemsCount) : 0;

    return {
      totalAssessments: total,
      completed: completedCount,
      inProgress: inProgressCount,
      notStarted: notStartedCount,
      failed: failedCount,
      averageScore,
    };
  }

  async submitAssessment(
    id: string,
    submitDto: SubmitAssessmentDto,
    user?: any,
  ): Promise<AssessmentSubmission> {
    const assessment = await this.findOne(id);
    const questions = assessment.questions || [];

    let pointsEarned = 0;
    let totalPoints = 0;

    const answersResult = (submitDto.answers || []).map((ans) => {
      const q = questions.find((item) => item.id === ans.questionId);
      const qPoints = q?.points || 5;
      totalPoints += qPoints;
      const isCorrect = q ? q.correctOptionIndex === ans.selectedOption : false;
      if (isCorrect) {
        pointsEarned += qPoints;
      }
      return {
        questionId: ans.questionId,
        selectedOption: ans.selectedOption,
        isCorrect,
      };
    });

    if (totalPoints === 0) totalPoints = 100;
    const score = Math.round((pointsEarned / totalPoints) * 100);
    const passed = score >= assessment.passingScore;

    const submission: AssessmentSubmission = {
      id: '',
      assessmentId: id,
      userId: user?.id || user?.uid || 'guest-user',
      userName: user?.displayName || user?.name || 'Admin Preview',
      userEmail: user?.email || 'admin@asiasoftlab.com',
      score,
      pointsEarned,
      totalPoints,
      passed,
      status: passed ? 'completed' : 'failed',
      attemptNumber: (assessment.userAttempts || 0) + 1,
      answers: answersResult,
      timeSpentSeconds: submitDto.timeSpentSeconds || 0,
      completedAt: new Date(),
      lastAttemptedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.assessmentsRepository.saveSubmission(submission);
  }

  async getSubmissions(assessmentId: string): Promise<AssessmentSubmission[]> {
    return this.assessmentsRepository.getSubmissionsByAssessmentId(assessmentId);
  }

  async getCertificatesForUser(user: any): Promise<any[]> {
    const userId = user?.id || user?.uid;
    if (!userId) return [];

    const submissions = await this.assessmentsRepository.getSubmissionsByUserId(userId);
    const passedSubmissions = submissions.filter((s) => s.passed);

    // Fetch assessments to enrich course titles and metadata
    const allAssessments = await this.assessmentsRepository.findAll();
    const assessmentMap = new Map(allAssessments.map((a) => [a.id, a]));

    const assessmentCerts = passedSubmissions.map((sub) => {
      const assessment = assessmentMap.get(sub.assessmentId);
      return {
        id: `cert_${sub.id}`,
        submissionId: sub.id,
        assessmentId: sub.assessmentId,
        courseId: assessment?.courseId,
        courseTitle: assessment?.courseTitle || assessment?.title || 'Certification of Achievement',
        recipientName: sub.userName || user?.displayName || user?.name || 'Student',
        recipientEmail: sub.userEmail || user?.email || '',
        score: sub.score,
        issuedDate: sub.completedAt || sub.createdAt || new Date(),
        certificateNumber: `ASVA2025-${(sub.id || '001234').substring(0, 6).toUpperCase()}`,
        issuer: 'ASVA (Asia Softlab Virtual Academy)',
        ceoName: 'Mr.Nishadh S',
        ceoTitle: 'Academic Director, ASVA',
      };
    });

    const courseCerts = await this.assessmentsRepository.findCourseCertificatesByUserId(userId);
    const formattedCourseCerts = courseCerts.map((c) => ({
      id: c.id,
      courseId: c.courseId,
      courseTitle: c.courseTitle,
      recipientName: c.recipientName || user?.displayName || user?.name || 'Student',
      recipientEmail: c.recipientEmail || user?.email || '',
      score: 100,
      issuedDate: c.issuedDate || c.createdAt || new Date(),
      certificateNumber: c.certificateNumber || `ASVA-CRS-${c.id.slice(-4).toUpperCase()}`,
      issuer: c.issuer || 'ASVA (Asia Softlab Virtual Academy)',
      ceoName: c.ceoName || 'Mr.Nishadh S',
      ceoTitle: c.ceoTitle || 'Academic Director, ASVA',
    }));

    return [...formattedCourseCerts, ...assessmentCerts];
  }
}
