import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException, ServiceUnavailableException, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly coursesRepository: CoursesRepository,
  ) {}

  isConfigured(): boolean {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    return Boolean(
      key_id &&
      key_id.trim() !== '' &&
      key_id !== 'rzp_test_placeholder_key' &&
      key_secret &&
      key_secret.trim() !== '' &&
      key_secret !== 'placeholder_secret'
    );
  }

  private getRazorpayClient(): Razorpay {
    if (!this.isConfigured()) {
      throw new ServiceUnavailableException(
        'Razorpay payment gateway is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in the environment.',
      );
    }
    const key_id = process.env.RAZORPAY_KEY_ID!;
    const key_secret = process.env.RAZORPAY_KEY_SECRET!;
    return new Razorpay({ key_id, key_secret });
  }

  getPublicKey(): string {
    return process.env.RAZORPAY_KEY_ID || '';
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
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ServiceUnavailableException
      ) {
        throw error;
      }
      this.logger.error(`Razorpay order creation error: ${error?.error?.description || error?.message || 'Unknown error'}`);
      
      const isAuthOrConfigError =
        error?.statusCode === 401 ||
        error?.statusCode === 400 ||
        error?.error?.code === 'BAD_REQUEST_ERROR';

      if (isAuthOrConfigError) {
        throw new ServiceUnavailableException(
          'Payment service is unavailable due to gateway authentication error. Please verify Razorpay credentials in Render environment variables.',
        );
      }

      throw new InternalServerErrorException('Failed to create Razorpay payment order');
    }
  }

  async verifyPayment(userId: string, dto: VerifyPaymentDto) {
    if (!this.isConfigured()) {
      throw new ServiceUnavailableException(
        'Razorpay payment gateway is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in the environment.',
      );
    }

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
    const secret = process.env.RAZORPAY_KEY_SECRET!;
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

    // Call processSuccessfulPayment to update status to paid and create enrollment
    const enrollment = await this.processSuccessfulPayment(order.id, dto.razorpay_payment_id, dto.razorpay_signature);

    return {
      success: true,
      message: 'Payment verified and enrollment activated.',
      enrollment: enrollment || (await this.paymentsRepository.findEnrollment(userId, dto.courseId)),
    };
  }

  async processSuccessfulPayment(orderId: string, paymentId?: string, signature?: string): Promise<Enrollment | null> {
    let order = await this.paymentsRepository.findOrderById(orderId);
    if (!order) {
      order = await this.paymentsRepository.findOrderByRazorpayId(orderId);
    }
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // 1. Mark order as paid
    await this.paymentsRepository.updateOrderStatus(order.id, 'paid', paymentId, signature);

    const course = await this.coursesRepository.findById(order.courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // 2. Check if user is already enrolled (idempotency at enrollment level)
    const existingEnrollment = await this.paymentsRepository.findEnrollment(order.userId, course.id);
    if (existingEnrollment && existingEnrollment.status === 'active') {
      return existingEnrollment;
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

    const created = await this.paymentsRepository.createEnrollment(enrollment);

    // 4. Increment course enrollment count
    try {
      const newCount = (course.enrollmentCount || 0) + 1;
      await this.coursesRepository.update(course.id, { enrollmentCount: newCount });
    } catch (countError) {
      console.error('Failed to increment enrollment count on course:', countError);
    }

    return created;
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
    let enrollment = await this.paymentsRepository.findEnrollment(userId, courseId);
    
    // Auto-recovery / Self-healing: if enrollment doc is missing, check if a paid order exists for this user & course
    if (!enrollment || enrollment.status !== 'active') {
      const paidOrder = await this.paymentsRepository.findPaidOrderByUserAndCourse(userId, courseId);
      if (paidOrder) {
        const course = await this.coursesRepository.findById(courseId);
        const autoEnrollment: Enrollment = {
          id: `${userId}_${courseId}`,
          userId,
          courseId,
          orderId: paidOrder.id,
          paymentId: paidOrder.razorpayPaymentId || '',
          amount: paidOrder.amount || 0,
          currency: paidOrder.currency || 'INR',
          status: 'active',
          studentName: paidOrder.studentDetails?.name || 'Student',
          studentEmail: paidOrder.studentDetails?.email || '',
          studentPhone: paidOrder.studentDetails?.phone || '',
          courseTitle: course?.title || 'Course',
          courseThumbnailUrl: course?.thumbnailUrl || '',
          enrolledAt: paidOrder.createdAt || new Date(),
          updatedAt: new Date(),
        };
        await this.paymentsRepository.createEnrollment(autoEnrollment);
        enrollment = autoEnrollment;
      }
    }

    return {
      isEnrolled: !!(enrollment && enrollment.status === 'active'),
      enrollment: enrollment || null,
    };
  }

  async getMyEnrollments(userId: string) {
    let enrollments = await this.paymentsRepository.findEnrollmentsByUserId(userId);
    
    // Check if any paid orders are missing from the enrollments list and auto-enroll
    const paidOrders = await this.paymentsRepository.findPaidOrdersByUserId(userId);
    for (const pOrder of paidOrders) {
      const alreadyInList = enrollments.some((e) => e.courseId === pOrder.courseId);
      if (!alreadyInList && pOrder.courseId) {
        const course = await this.coursesRepository.findById(pOrder.courseId);
        const recoveredEnrollment: Enrollment = {
          id: `${userId}_${pOrder.courseId}`,
          userId,
          courseId: pOrder.courseId,
          orderId: pOrder.id,
          paymentId: pOrder.razorpayPaymentId || '',
          amount: pOrder.amount || 0,
          currency: pOrder.currency || 'INR',
          status: 'active',
          studentName: pOrder.studentDetails?.name || 'Student',
          studentEmail: pOrder.studentDetails?.email || '',
          studentPhone: pOrder.studentDetails?.phone || '',
          courseTitle: course?.title || 'Course',
          courseThumbnailUrl: course?.thumbnailUrl || '',
          enrolledAt: pOrder.createdAt || new Date(),
          updatedAt: new Date(),
        };
        await this.paymentsRepository.createEnrollment(recoveredEnrollment);
        enrollments.push(recoveredEnrollment);
      }
    }
    
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
