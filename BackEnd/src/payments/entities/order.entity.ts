export class PaymentOrder {
  id: string; // The order ID (either razorpay_order_id or internal ID)
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  paymentGateway: 'razorpay';
  userId: string;
  courseId: string;
  amount: number; // in INR
  amountInPaise: number;
  currency: string; // 'INR'
  status: 'created' | 'attempted' | 'paid' | 'failed' | 'cancelled';
  receipt: string;
  studentDetails: {
    name: string;
    email: string;
    phone: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
