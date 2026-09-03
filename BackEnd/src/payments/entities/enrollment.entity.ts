export class Enrollment {
  id: string; // Composite ID: `${userId}_${courseId}`
  userId: string;
  courseId: string;
  orderId: string;
  paymentId: string;
  amount: number;
  currency: string;
  status: 'active' | 'completed' | 'cancelled';
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  courseTitle: string;
  courseThumbnailUrl?: string;
  enrolledAt: Date;
  updatedAt: Date;
}
