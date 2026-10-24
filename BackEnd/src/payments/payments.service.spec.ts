import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { PaymentsRepository } from './payments.repository';
import { CoursesRepository } from '../courses/courses.repository';
import { ServiceUnavailableException } from '@nestjs/common';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let coursesRepository: Partial<CoursesRepository>;
  let paymentsRepository: Partial<PaymentsRepository>;

  beforeEach(async () => {
    // Preserve original environment variables
    delete process.env.RAZORPAY_KEY_ID;
    delete process.env.RAZORPAY_KEY_SECRET;

    coursesRepository = {
      findById: jest.fn().mockResolvedValue({
        id: 'course-123',
        title: 'Drone Survey 101',
        price: 999,
      }),
    };

    paymentsRepository = {
      findEnrollment: jest.fn().mockResolvedValue(null),
      findOrderByRazorpayId: jest.fn(),
      saveOrder: jest.fn(),
      updateOrderStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: PaymentsRepository, useValue: paymentsRepository },
        { provide: CoursesRepository, useValue: coursesRepository },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  afterEach(() => {
    delete process.env.RAZORPAY_KEY_ID;
    delete process.env.RAZORPAY_KEY_SECRET;
  });

  describe('isConfigured', () => {
    it('should return false when keys are undefined', () => {
      expect(service.isConfigured()).toBe(false);
    });

    it('should return false when keys are placeholder values', () => {
      process.env.RAZORPAY_KEY_ID = 'rzp_test_placeholder_key';
      process.env.RAZORPAY_KEY_SECRET = 'placeholder_secret';
      expect(service.isConfigured()).toBe(false);
    });

    it('should return true when legitimate keys are provided', () => {
      process.env.RAZORPAY_KEY_ID = 'rzp_test_valid_key_123';
      process.env.RAZORPAY_KEY_SECRET = 'valid_secret_456';
      expect(service.isConfigured()).toBe(true);
    });
  });

  describe('createOrder when unconfigured', () => {
    it('should throw ServiceUnavailableException instead of crashing with HTTP 500', async () => {
      process.env.RAZORPAY_KEY_ID = 'rzp_test_placeholder_key';
      process.env.RAZORPAY_KEY_SECRET = 'placeholder_secret';

      await expect(
        service.createOrder('user-1', {
          courseId: 'course-123',
          studentName: 'Test Student',
          studentEmail: 'student@example.com',
          studentPhone: '9876543210',
        }),
      ).rejects.toThrow(ServiceUnavailableException);
    });
  });

  describe('verifyPayment when unconfigured', () => {
    it('should throw ServiceUnavailableException cleanly', async () => {
      await expect(
        service.verifyPayment('user-1', {
          razorpay_order_id: 'order_123',
          razorpay_payment_id: 'pay_123',
          razorpay_signature: 'sig_123',
          courseId: 'course-123',
        }),
      ).rejects.toThrow(ServiceUnavailableException);
    });
  });
});
