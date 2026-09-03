import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { PaymentOrder } from './entities/order.entity';
import { Enrollment } from './entities/enrollment.entity';

@Injectable()
export class PaymentsRepository {
  private readonly ordersCollection = 'orders';
  private readonly enrollmentsCollection = 'enrollments';

  constructor(private readonly firebaseService: FirebaseService) {}

  async saveOrder(order: PaymentOrder): Promise<PaymentOrder> {
    try {
      const db = this.firebaseService.getFirestore();
      const docRef = db.collection(this.ordersCollection).doc(order.razorpayOrderId);
      
      const payload: any = {
        ...order,
        createdAt: order.createdAt || new Date(),
        updatedAt: order.updatedAt || new Date(),
      };

      Object.keys(payload).forEach((key) => {
        if (payload[key] === undefined) {
          delete payload[key];
        }
      });

      await docRef.set(payload);
      return order;
    } catch (error: any) {
      console.error('Error saving order to Firestore:', error);
      throw new InternalServerErrorException('Failed to save payment order');
    }
  }

  async findOrderByRazorpayId(razorpayOrderId: string): Promise<PaymentOrder | null> {
    try {
      const db = this.firebaseService.getFirestore();
      const doc = await db.collection(this.ordersCollection).doc(razorpayOrderId).get();
      if (!doc.exists) {
        return null;
      }
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data?.createdAt?.toDate ? data.createdAt.toDate() : data?.createdAt,
        updatedAt: data?.updatedAt?.toDate ? data.updatedAt.toDate() : data?.updatedAt,
      } as PaymentOrder;
    } catch (error: any) {
      console.error('Error finding order in Firestore:', error);
      throw new InternalServerErrorException('Failed to retrieve payment order');
    }
  }

  async updateOrderStatus(
    razorpayOrderId: string,
    status: 'paid' | 'failed' | 'cancelled',
    paymentId?: string,
    signature?: string,
  ): Promise<void> {
    try {
      const db = this.firebaseService.getFirestore();
      const docRef = db.collection(this.ordersCollection).doc(razorpayOrderId);
      const updateData: any = {
        status,
        updatedAt: new Date(),
      };
      if (paymentId) updateData.razorpayPaymentId = paymentId;
      if (signature) updateData.razorpaySignature = signature;

      await docRef.set(updateData, { merge: true });
    } catch (error: any) {
      console.error('Error updating order status in Firestore:', error);
      throw new InternalServerErrorException('Failed to update order status');
    }
  }

  async createEnrollment(enrollment: Enrollment): Promise<Enrollment> {
    try {
      const db = this.firebaseService.getFirestore();
      // Use composite key `${userId}_${courseId}` to guarantee duplicate prevention at DB level
      const docId = enrollment.id || `${enrollment.userId}_${enrollment.courseId}`;
      const docRef = db.collection(this.enrollmentsCollection).doc(docId);

      const payload: any = {
        ...enrollment,
        id: docId,
        enrolledAt: enrollment.enrolledAt || new Date(),
        updatedAt: enrollment.updatedAt || new Date(),
      };

      Object.keys(payload).forEach((key) => {
        if (payload[key] === undefined) {
          delete payload[key];
        }
      });

      await docRef.set(payload);
      return { ...enrollment, id: docId };
    } catch (error: any) {
      console.error('Error creating enrollment in Firestore:', error);
      throw new InternalServerErrorException('Failed to record course enrollment');
    }
  }

  async findEnrollment(userId: string, courseId: string): Promise<Enrollment | null> {
    try {
      const db = this.firebaseService.getFirestore();
      const docId = `${userId}_${courseId}`;
      const doc = await db.collection(this.enrollmentsCollection).doc(docId).get();
      if (!doc.exists) {
        return null;
      }
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        enrolledAt: data?.enrolledAt?.toDate ? data.enrolledAt.toDate() : data?.enrolledAt,
        updatedAt: data?.updatedAt?.toDate ? data.updatedAt.toDate() : data?.updatedAt,
      } as Enrollment;
    } catch (error: any) {
      console.error('Error checking enrollment in Firestore:', error);
      throw new InternalServerErrorException('Failed to verify course enrollment');
    }
  }

  async findEnrollmentsByUserId(userId: string): Promise<Enrollment[]> {
    try {
      const db = this.firebaseService.getFirestore();
      const snapshot = await db.collection(this.enrollmentsCollection).where('userId', '==', userId).where('status', '==', 'active').get();

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          enrolledAt: data?.enrolledAt?.toDate ? data.enrolledAt.toDate() : data?.enrolledAt,
          updatedAt: data?.updatedAt?.toDate ? data.updatedAt.toDate() : data?.updatedAt,
        } as Enrollment;
      });
    } catch (error: any) {
      console.error('Error retrieving user enrollments:', error);
      throw new InternalServerErrorException('Failed to fetch user enrollments');
    }
  }
}
