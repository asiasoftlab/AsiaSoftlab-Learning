import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { StudentFeedback } from './entities/feedback.entity';

@Injectable()
export class FeedbackRepository {
  private readonly collectionName = 'course_feedbacks';

  constructor(private readonly firebaseService: FirebaseService) {}

  async create(feedback: StudentFeedback): Promise<StudentFeedback> {
    try {
      const db = this.firebaseService.getFirestore();
      const docRef = feedback.id
        ? db.collection(this.collectionName).doc(feedback.id)
        : db.collection(this.collectionName).doc();

      const newFeedback: StudentFeedback = {
        ...feedback,
        id: docRef.id,
        createdAt: feedback.createdAt || new Date(),
        updatedAt: feedback.updatedAt || new Date(),
      };

      // Clean undefined fields for Firestore
      const cleanedData = JSON.parse(JSON.stringify(newFeedback));
      await docRef.set(cleanedData);
      return newFeedback;
    } catch (error: any) {
      console.error('FIREBASE CREATE FEEDBACK ERROR:', error);
      throw new InternalServerErrorException('Failed to save feedback: ' + error.message);
    }
  }

  async findByUser(userId: string): Promise<StudentFeedback[]> {
    try {
      const db = this.firebaseService.getFirestore();
      const snapshot = await db
        .collection(this.collectionName)
        .where('userId', '==', userId)
        .get();

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate?.() || data.createdAt || new Date(),
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt || new Date(),
        } as StudentFeedback;
      });
    } catch (error: any) {
      console.error('FIREBASE GET USER FEEDBACKS ERROR:', error);
      throw new InternalServerErrorException('Failed to get user feedbacks: ' + error.message);
    }
  }

  async findByCertificateNumber(certificateNumber: string, userId: string): Promise<StudentFeedback | null> {
    try {
      const db = this.firebaseService.getFirestore();
      const snapshot = await db
        .collection(this.collectionName)
        .where('certificateNumber', '==', certificateNumber)
        .where('userId', '==', userId)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate?.() || data.createdAt || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt || new Date(),
      } as StudentFeedback;
    } catch (error: any) {
      console.error('FIREBASE FIND FEEDBACK BY CERTIFICATE ERROR:', error);
      throw new InternalServerErrorException('Failed to check certificate feedback: ' + error.message);
    }
  }

  async findByCourse(courseId: string): Promise<StudentFeedback[]> {
    try {
      const db = this.firebaseService.getFirestore();
      const snapshot = await db
        .collection(this.collectionName)
        .where('courseId', '==', courseId)
        .get();

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate?.() || data.createdAt || new Date(),
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt || new Date(),
        } as StudentFeedback;
      });
    } catch (error: any) {
      console.error('FIREBASE GET COURSE FEEDBACKS ERROR:', error);
      throw new InternalServerErrorException('Failed to get course feedbacks: ' + error.message);
    }
  }

  async findAll(): Promise<StudentFeedback[]> {
    try {
      const db = this.firebaseService.getFirestore();
      const snapshot = await db.collection(this.collectionName).get();

      const items = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate?.() || data.createdAt || new Date(),
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt || new Date(),
        } as StudentFeedback;
      });

      // Sort in memory by createdAt descending
      return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error: any) {
      console.error('FIREBASE GET ALL FEEDBACKS ERROR:', error);
      throw new InternalServerErrorException('Failed to get all feedbacks: ' + error.message);
    }
  }

  async updateStatus(id: string, status: 'approved' | 'pending' | 'rejected'): Promise<void> {
    try {
      const db = this.firebaseService.getFirestore();
      await db.collection(this.collectionName).doc(id).update({
        status,
        updatedAt: new Date(),
      });
    } catch (error: any) {
      console.error('FIREBASE UPDATE FEEDBACK STATUS ERROR:', error);
      throw new InternalServerErrorException('Failed to update feedback status: ' + error.message);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const db = this.firebaseService.getFirestore();
      await db.collection(this.collectionName).doc(id).delete();
    } catch (error: any) {
      console.error('FIREBASE DELETE FEEDBACK ERROR:', error);
      throw new InternalServerErrorException('Failed to delete feedback: ' + error.message);
    }
  }
}
