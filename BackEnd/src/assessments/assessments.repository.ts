import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { Assessment, AssessmentSubmission } from './entities/assessment.entity';

@Injectable()
export class AssessmentsRepository {
  private readonly collectionName = 'assessments';
  private readonly submissionsCollectionName = 'assessment_submissions';

  constructor(private readonly firebaseService: FirebaseService) { }

  async create(assessment: Assessment): Promise<Assessment> {
    try {
      const db = this.firebaseService.getFirestore();
      const docRef = db.collection(this.collectionName).doc();
      const assessmentWithId: Assessment = { ...assessment, id: docRef.id };

      const payload: any = {
        ...assessmentWithId,
        createdAt: assessment.createdAt || new Date(),
        updatedAt: assessment.updatedAt || new Date(),
      };

      Object.keys(payload).forEach((key) => {
        if (payload[key] === undefined) {
          delete payload[key];
        }
      });

      await docRef.set(payload);
      return assessmentWithId;
    } catch (error: any) {
      console.error('FIREBASE CREATE ASSESSMENT ERROR:', error);
      throw new InternalServerErrorException('Failed to create assessment in database: ' + error.message);
    }
  }

  async findAll(): Promise<Assessment[]> {
    try {
      const db = this.firebaseService.getFirestore();
      const snapshot = await db.collection(this.collectionName).orderBy('createdAt', 'desc').get();

      if (snapshot.empty) {
        return [];
      }

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          courseId: data.courseId,
          courseTitle: data.courseTitle,
          category: data.category,
          description: data.description,
          thumbnailUrl: data.thumbnailUrl,
          thumbnailPublicId: data.thumbnailPublicId,
          durationMinutes: data.durationMinutes || 30,
          passingScore: data.passingScore || 70,
          maxAttempts: data.maxAttempts || 3,
          totalQuestions: data.totalQuestions || (data.questions ? data.questions.length : 0),
          questions: data.questions || [],
          status: data.status || 'Published',
          userStatus: data.userStatus,
          userScore: data.userScore,
          userAttempts: data.userAttempts,
          userProgress: data.userProgress,
          lastAttemptedAt: data.lastAttemptedAt ? (typeof data.lastAttemptedAt.toDate === 'function' ? data.lastAttemptedAt.toDate() : new Date(data.lastAttemptedAt)) : undefined,
          completedAt: data.completedAt ? (typeof data.completedAt.toDate === 'function' ? data.completedAt.toDate() : new Date(data.completedAt)) : undefined,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt ? new Date(data.createdAt) : new Date()),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : (data.updatedAt ? new Date(data.updatedAt) : new Date()),
        } as Assessment;
      });
    } catch (error: any) {
      console.error('FIREBASE FIND ALL ASSESSMENTS ERROR:', error);
      throw new InternalServerErrorException('Failed to retrieve assessments');
    }
  }

  async findById(id: string): Promise<Assessment | null> {
    try {
      const db = this.firebaseService.getFirestore();
      const doc = await db.collection(this.collectionName).doc(id).get();

      if (!doc.exists) {
        return null;
      }

      const data = doc.data()!;
      return {
        id: doc.id,
        title: data.title,
        courseId: data.courseId,
        courseTitle: data.courseTitle,
        category: data.category,
        description: data.description,
        thumbnailUrl: data.thumbnailUrl,
        thumbnailPublicId: data.thumbnailPublicId,
        durationMinutes: data.durationMinutes || 30,
        passingScore: data.passingScore || 70,
        maxAttempts: data.maxAttempts || 3,
        totalQuestions: data.totalQuestions || (data.questions ? data.questions.length : 0),
        questions: data.questions || [],
        status: data.status || 'Published',
        userStatus: data.userStatus,
        userScore: data.userScore,
        userAttempts: data.userAttempts,
        userProgress: data.userProgress,
        lastAttemptedAt: data.lastAttemptedAt ? (typeof data.lastAttemptedAt.toDate === 'function' ? data.lastAttemptedAt.toDate() : new Date(data.lastAttemptedAt)) : undefined,
        completedAt: data.completedAt ? (typeof data.completedAt.toDate === 'function' ? data.completedAt.toDate() : new Date(data.completedAt)) : undefined,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt ? new Date(data.createdAt) : new Date()),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : (data.updatedAt ? new Date(data.updatedAt) : new Date()),
      } as Assessment;
    } catch (error: any) {
      console.error('FIREBASE FIND ASSESSMENTS BY ID ERROR:', error);
      throw new InternalServerErrorException('Failed to retrieve assessment');
    }
  }

  async update(id: string, updateData: Partial<Assessment>): Promise<Assessment> {
    try {
      const db = this.firebaseService.getFirestore();
      const docRef = db.collection(this.collectionName).doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new NotFoundException('Assessment not found');
      }

      const updatePayload: any = {
        ...updateData,
        updatedAt: new Date(),
      };

      if (updateData.questions) {
        updatePayload.totalQuestions = updateData.questions.length;
      }

      Object.keys(updatePayload).forEach((key) => {
        if (updatePayload[key] === undefined) {
          delete updatePayload[key];
        }
      });

      await docRef.update(updatePayload);

      const updated = await this.findById(id);
      return updated!;
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      console.error('FIREBASE UPDATE ASSESSMENT ERROR:', error);
      throw new InternalServerErrorException('Failed to update assessment: ' + error.message);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const db = this.firebaseService.getFirestore();
      await db.collection(this.collectionName).doc(id).delete();
    } catch (error: any) {
      console.error('FIREBASE DELETE ASSESSMENT ERROR:', error);
      throw new InternalServerErrorException('Failed to delete assessment');
    }
  }

  async saveSubmission(submission: AssessmentSubmission): Promise<AssessmentSubmission> {
    try {
      const db = this.firebaseService.getFirestore();
      const docRef = db.collection(this.submissionsCollectionName).doc();
      const subWithId: AssessmentSubmission = {
        ...submission,
        id: docRef.id,
      };

      const payload: any = {
        ...subWithId,
        completedAt: submission.completedAt || new Date(),
        lastAttemptedAt: submission.lastAttemptedAt || new Date(),
        createdAt: submission.createdAt || new Date(),
        updatedAt: submission.updatedAt || new Date(),
      };

      Object.keys(payload).forEach((key) => {
        if (payload[key] === undefined) {
          delete payload[key];
        }
      });

      await docRef.set(payload);

      // Also update the assessment document with latest submission snapshot if needed
      await this.updateAssessmentStatsAfterSubmission(submission.assessmentId, subWithId);

      return subWithId;
    } catch (error: any) {
      console.error('FIREBASE SAVE SUBMISSION ERROR:', error);
      throw new InternalServerErrorException('Failed to save assessment submission');
    }
  }

  async getSubmissionsByAssessmentId(assessmentId: string): Promise<AssessmentSubmission[]> {
    try {
      const db = this.firebaseService.getFirestore();
      const snapshot = await db.collection(this.submissionsCollectionName).where('assessmentId', '==', assessmentId).orderBy('createdAt', 'desc').get();
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data(), })) as AssessmentSubmission[];
    } catch (error: any) {
      console.error('FIREBASE GET SUBMISSIONS ERROR:', error);
      return [];
    }
  }

  async getSubmissionsByUserId(userId: string): Promise<AssessmentSubmission[]> {
    try {
      const db = this.firebaseService.getFirestore();
      const snapshot = await db.collection(this.submissionsCollectionName)
        .where('userId', '==', userId)
        .get();
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as AssessmentSubmission[];
    } catch (error: any) {
      console.error('FIREBASE GET USER SUBMISSIONS ERROR:', error);
      return [];
    }
  }

  async getAllSubmissions(): Promise<AssessmentSubmission[]> {
    try {
      const db = this.firebaseService.getFirestore();
      const snapshot = await db.collection(this.submissionsCollectionName).get();
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as AssessmentSubmission[];
    } catch (error: any) {
      console.error('FIREBASE GET ALL SUBMISSIONS ERROR:', error);
      return [];
    }
  }

  private async updateAssessmentStatsAfterSubmission(assessmentId: string, submission: AssessmentSubmission) {
    try {
      const db = this.firebaseService.getFirestore();
      const docRef = db.collection(this.collectionName).doc(assessmentId);
      const doc = await docRef.get();
      if (!doc.exists) return;

      const current = doc.data();
      const attempts = (current?.userAttempts || 0) + 1;
      const status = submission.passed ? 'completed' : 'failed';

      await docRef.update({
        userStatus: status,
        userScore: submission.score,
        userAttempts: attempts,
        userProgress: submission.passed ? 100 : Math.min(100, Math.round((submission.score / (current?.passingScore || 70)) * 100)),
        lastAttemptedAt: new Date(),
        completedAt: submission.passed ? new Date() : current?.completedAt || null,
        updatedAt: new Date(),
      });
    } catch (err) {
      console.error('Failed to update assessment meta stats:', err);
    }
  }

  private async seedInitialAssessments(): Promise<Assessment[]> {
    const db = this.firebaseService.getFirestore();
    const batch = db.batch();

    const initialData: Omit<Assessment, 'id'>[] = [
    ];

    const results: Assessment[] = [];
    for (const item of initialData) {
      const docRef = db.collection(this.collectionName).doc();
      const assessment: Assessment = { ...item, id: docRef.id };
      batch.set(docRef, assessment);
      results.push(assessment);
    }

    await batch.commit();
    return results;
  }
}
