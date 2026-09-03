export class PaymentOrder {
  id: string; // Razorpay order_id or local doc id
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  userId: string;
  courseId: string;
  amount: number; // in INR
  amountInPaise: number;
  currency: string; // 'INR'
  status: 'created' | 'paid' | 'failed' | 'cancelled';
  receipt: string;
  studentDetails: {
    name: string;
    email: string;
    phone: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
