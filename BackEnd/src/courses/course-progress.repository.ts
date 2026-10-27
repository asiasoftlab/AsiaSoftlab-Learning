import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { CourseProgress, CourseCertificate } from './entities/course-progress.entity';

@Injectable()
export class CourseProgressRepository {
  private readonly progressCollection = 'course_progress';
  private readonly certificatesCollection = 'course_certificates';
  private readonly enrollmentsCollection = 'enrollments';
  private readonly ordersCollection = 'orders';

  constructor(private readonly firebaseService: FirebaseService) {}

  async findByUserAndCourse(userId: string, courseId: string): Promise<CourseProgress | null> {
    try {
      const db = this.firebaseService.getFirestore();
      const docId = `${userId}_${courseId}`;
      const doc = await db.collection(this.progressCollection).doc(docId).get();

      if (!doc.exists) {
        return null;
      }

      const data = doc.data();
      return {
        id: doc.id,
        userId: data?.userId,
        courseId: data?.courseId,
        completedLessonIds: data?.completedLessonIds || [],
        lastAccessedLessonId: data?.lastAccessedLessonId,
        isCompleted: !!data?.isCompleted,
        completedAt: data?.completedAt?.toDate ? data.completedAt.toDate() : data?.completedAt,
        createdAt: data?.createdAt?.toDate ? data.createdAt.toDate() : (data?.createdAt || new Date()),
        updatedAt: data?.updatedAt?.toDate ? data.updatedAt.toDate() : (data?.updatedAt || new Date()),
      } as CourseProgress;
    } catch (error: any) {
      console.error('Error fetching course progress from Firestore:', error);
      throw new InternalServerErrorException('Failed to retrieve course progress');
    }
  }

  async saveProgress(progress: CourseProgress): Promise<CourseProgress> {
    try {
      const db = this.firebaseService.getFirestore();
      const docId = progress.id || `${progress.userId}_${progress.courseId}`;
      const docRef = db.collection(this.progressCollection).doc(docId);

      const payload: any = {
        ...progress,
        id: docId,
        updatedAt: new Date(),
      };

      if (!payload.createdAt) {
        payload.createdAt = new Date();
      }

      Object.keys(payload).forEach((key) => {
        if (payload[key] === undefined) {
          delete payload[key];
        }
      });

      await docRef.set(payload, { merge: true });
      return { ...progress, id: docId };
    } catch (error: any) {
      console.error('Error saving course progress in Firestore:', error);
      throw new InternalServerErrorException('Failed to persist course progress');
    }
  }

  async checkUserEnrollment(userId: string, courseId: string): Promise<boolean> {
    try {
      const db = this.firebaseService.getFirestore();
      const docId = `${userId}_${courseId}`;
      const doc = await db.collection(this.enrollmentsCollection).doc(docId).get();

      if (doc.exists && doc.data()?.status === 'active') {
        return true;
      }

      // Fallback check in orders collection
      const orderSnapshot = await db
        .collection(this.ordersCollection)
        .where('userId', '==', userId)
        .where('courseId', '==', courseId)
        .where('status', '==', 'paid')
        .limit(1)
        .get();

      return !orderSnapshot.empty;
    } catch (error: any) {
      console.error('Error checking user enrollment:', error);
      return false;
    }
  }

  async findCertificate(userId: string, courseId: string): Promise<CourseCertificate | null> {
    try {
      const db = this.firebaseService.getFirestore();
      const docId = `cert_course_${courseId}_${userId}`;
      const doc = await db.collection(this.certificatesCollection).doc(docId).get();

      if (!doc.exists) {
        return null;
      }

      const data = doc.data();
      return {
        id: doc.id,
        courseId: data?.courseId,
        courseTitle: data?.courseTitle,
        userId: data?.userId,
        recipientName: data?.recipientName,
        recipientEmail: data?.recipientEmail,
        certificateNumber: data?.certificateNumber,
        issuedDate: data?.issuedDate?.toDate ? data.issuedDate.toDate() : data?.issuedDate,
        issuer: data?.issuer,
        ceoName: data?.ceoName,
        ceoTitle: data?.ceoTitle,
        createdAt: data?.createdAt?.toDate ? data.createdAt.toDate() : (data?.createdAt || new Date()),
      } as CourseCertificate;
    } catch (error: any) {
      console.error('Error retrieving course certificate:', error);
      throw new InternalServerErrorException('Failed to retrieve course certificate');
    }
  }

  async saveCertificate(certificate: CourseCertificate): Promise<CourseCertificate> {
    try {
      const db = this.firebaseService.getFirestore();
      const docId = certificate.id || `cert_course_${certificate.courseId}_${certificate.userId}`;
      const docRef = db.collection(this.certificatesCollection).doc(docId);

      const payload: any = {
        ...certificate,
        id: docId,
        createdAt: certificate.createdAt || new Date(),
      };

      Object.keys(payload).forEach((key) => {
        if (payload[key] === undefined) {
          delete payload[key];
        }
      });

      await docRef.set(payload, { merge: true });
      return { ...certificate, id: docId };
    } catch (error: any) {
      console.error('Error saving course certificate:', error);
      throw new InternalServerErrorException('Failed to save course certificate');
    }
  }

  async findCertificatesByUserId(userId: string): Promise<CourseCertificate[]> {
    try {
      const db = this.firebaseService.getFirestore();
      const snapshot = await db
        .collection(this.certificatesCollection)
        .where('userId', '==', userId)
        .get();

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          courseId: data?.courseId,
          courseTitle: data?.courseTitle,
          userId: data?.userId,
          recipientName: data?.recipientName,
          recipientEmail: data?.recipientEmail,
          certificateNumber: data?.certificateNumber,
          issuedDate: data?.issuedDate?.toDate ? data.issuedDate.toDate() : data?.issuedDate,
          issuer: data?.issuer,
          ceoName: data?.ceoName,
          ceoTitle: data?.ceoTitle,
          createdAt: data?.createdAt?.toDate ? data.createdAt.toDate() : data?.createdAt,
        } as CourseCertificate;
      });
    } catch (error: any) {
      console.error('Error retrieving user course certificates:', error);
      return [];
    }
  }
}
