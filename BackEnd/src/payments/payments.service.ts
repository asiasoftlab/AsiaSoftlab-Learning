import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PaymentsRepository } from './payments.repository';
import { CoursesRepository } from '../courses/courses.repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { PaymentOrder } from './entities/order.entity';
import { Enrollment } from './entities/enrollment.entity';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly coursesRepository: CoursesRepository,
  ) {}

  private getRazorpayClient(): Razorpay {
    const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key';
    const key_secret = process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret';
    return new Razorpay({ key_id, key_secret });
  }

  getPublicKey(): string {
    return process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key';
  }

  async createOrder(userId: string, dto: CreateOrderDto) {
    const course = await this.coursesRepository.findById(dto.courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Check if user is already enrolled
    const existingEnrollment = await this.paymentsRepository.findEnrollment(userId, course.id);
    if (existingEnrollment && existingEnrollment.status === 'active') {
      throw new BadRequestException('You are already enrolled in this course');
    }

    const price = typeof course.price === 'number' ? course.price : Number(course.price) || 0;
    const amountInPaise = Math.max(Math.round(price * 100), 100); // Minimum 1 INR (100 paise) for Razorpay

    try {
      const razorpay = this.getRazorpayClient();
      const receipt = `rcpt_${Date.now()}_${userId.slice(0, 5)}`;
      const options = {
        amount: amountInPaise,
        currency: 'INR',
        receipt,
        notes: {
          courseId: course.id,
          courseTitle: course.title,
          userId,
          studentName: dto.studentName,
          studentEmail: dto.studentEmail,
          studentPhone: dto.studentPhone,
        },
      };

      const razorpayOrder = await razorpay.orders.create(options);

      // Save order in Firestore
      const paymentOrder: PaymentOrder = {
        id: razorpayOrder.id, // Using Razorpay's generated ID as our local ID for Razorpay orders
        razorpayOrderId: razorpayOrder.id,
        paymentGateway: 'razorpay',
        userId,
        courseId: course.id,
        amount: price,
        amountInPaise,
        currency: 'INR',
        status: 'created',
        receipt,
        studentDetails: {
          name: dto.studentName,
          email: dto.studentEmail,
          phone: dto.studentPhone,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await this.paymentsRepository.saveOrder(paymentOrder);

      return {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount, // in paise
        currency: razorpayOrder.currency,
        keyId: this.getPublicKey(),
        course: {
          id: course.id,
          title: course.title,
          price: course.price,
          originalPrice: course.originalPrice,
          thumbnailUrl: course.thumbnailUrl,
          totalDuration: course.totalDuration,
          level: course.level,
        },
      };
    } catch (error: any) {
      console.error('Razorpay order creation error:', error);
      throw new InternalServerErrorException(
        error?.error?.description || error?.message || 'Failed to create Razorpay payment order',
      );
    }
  }

  async verifyPayment(userId: string, dto: VerifyPaymentDto) {
    // 1. Check if user is already enrolled (idempotency)
    const existingEnrollment = await this.paymentsRepository.findEnrollment(userId, dto.courseId);
    if (existingEnrollment && existingEnrollment.status === 'active') {
      return {
        success: true,
        alreadyEnrolled: true,
        message: 'You are already enrolled in this course',
        enrollment: existingEnrollment,
      };
    }

    const course = await this.coursesRepository.findById(dto.courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // 2. Verify Razorpay cryptographic signature
    const secret = process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret';
    const text = `${dto.razorpay_order_id}|${dto.razorpay_payment_id}`;
    const generatedSignature = crypto.createHmac('sha256', secret).update(text).digest('hex');

    const isMatch = generatedSignature === dto.razorpay_signature;

    if (!isMatch) {
      // Record failure on order
      const orderToFail = await this.paymentsRepository.findOrderByRazorpayId(dto.razorpay_order_id);
      if (orderToFail) {
        await this.paymentsRepository.updateOrderStatus(
          orderToFail.id,
          'failed',
          dto.razorpay_payment_id,
          dto.razorpay_signature,
        ).catch(console.error);
      }

      throw new BadRequestException('Payment verification failed: invalid signature');
    }

    const order = await this.paymentsRepository.findOrderByRazorpayId(dto.razorpay_order_id);
    if (!order) {
       throw new NotFoundException('Order not found');
    }

    // Record verification success (note: actual fulfillment happens via webhook)
    await this.paymentsRepository.updateOrderStatus(order.id, 'paid', dto.razorpay_payment_id, dto.razorpay_signature);

    // Call processSuccessfulPayment directly for instant frontend enrollment (idempotency protects against webhook duplication)
    await this.processSuccessfulPayment(dto.razorpay_order_id, dto.razorpay_payment_id, dto.razorpay_signature);

    const enrollment = await this.paymentsRepository.findEnrollment(userId, dto.courseId);

    return {
      success: true,
      message: 'Payment verified and enrollment activated.',
      enrollment,
    };
  }

  async processSuccessfulPayment(orderId: string, paymentId?: string, signature?: string) {
    const order = await this.paymentsRepository.findOrderById(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status === 'paid') {
      // Idempotency: order already paid
      return;
    }

    // 1. Mark order as paid
    await this.paymentsRepository.updateOrderStatus(orderId, 'paid', paymentId, signature);

    const course = await this.coursesRepository.findById(order.courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // 2. Check if user is already enrolled (idempotency at enrollment level)
    const existingEnrollment = await this.paymentsRepository.findEnrollment(order.userId, course.id);
    if (existingEnrollment && existingEnrollment.status === 'active') {
      return;
    }

    // 3. Create student enrollment
    const studentName = order.studentDetails?.name || 'Student';
    const studentEmail = order.studentDetails?.email || '';
    const studentPhone = order.studentDetails?.phone || '';

    const enrollment: Enrollment = {
      id: `${order.userId}_${course.id}`,
      userId: order.userId,
      courseId: course.id,
      orderId: order.id,
      paymentId: paymentId || order.razorpayPaymentId || '',
      amount: order.amount,
      currency: order.currency,
      status: 'active',
      studentName,
      studentEmail,
      studentPhone,
      courseTitle: course.title,
      courseThumbnailUrl: course.thumbnailUrl,
      enrolledAt: new Date(),
      updatedAt: new Date(),
    };

    await this.paymentsRepository.createEnrollment(enrollment);

    // 4. Increment course enrollment count
    try {
      const newCount = (course.enrollmentCount || 0) + 1;
      await this.coursesRepository.update(course.id, { enrollmentCount: newCount });
    } catch (countError) {
      console.error('Failed to increment enrollment count on course:', countError);
    }
  }

  async getOrderStatus(orderId: string) {
    const order = await this.paymentsRepository.findOrderById(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return {
      orderId: order.id,
      status: order.status,
      paymentGateway: order.paymentGateway,
    };
  }

  async checkEnrollment(userId: string, courseId: string) {
    const enrollment = await this.paymentsRepository.findEnrollment(userId, courseId);
    return {
      isEnrolled: !!(enrollment && enrollment.status === 'active'),
      enrollment: enrollment || null,
    };
  }

  async getMyEnrollments(userId: string) {
    const enrollments = await this.paymentsRepository.findEnrollmentsByUserId(userId);
    
    // Enrich with full course data if available
    const enriched = await Promise.all(
      enrollments.map(async (enr) => {
        try {
          const course = await this.coursesRepository.findById(enr.courseId);
          return {
            ...enr,
            course: course || null,
          };
        } catch {
          return {
            ...enr,
            course: null,
          };
        }
      }),
    );

    return enriched;
  }

  async getAllOrders() {
    return this.paymentsRepository.findAllOrders();
  }
}
