import { Controller, Post, Get, Body, Param, UseGuards, Req, type RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { PaymentsService } from './payments.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import * as crypto from 'crypto';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
  ) {}

  @Get('config')
  getConfig() {
    return {
      keyId: this.paymentsService.getPublicKey(),
    };
  }

  @Post('create-order')
  @UseGuards(FirebaseAuthGuard)
  createOrder(@Body() createOrderDto: CreateOrderDto, @Req() req: any) {
    const userId = req.user?.uid || req.user?.id;
    return this.paymentsService.createOrder(userId, createOrderDto);
  }

  // Frontend still uses this for Razorpay, but it now just returns success immediately after verifying the signature. The webhook does the enrollment.
  @Post('verify')
  @UseGuards(FirebaseAuthGuard)
  verifyPayment(@Body() verifyPaymentDto: VerifyPaymentDto, @Req() req: any) {
    const userId = req.user?.uid || req.user?.id;
    return this.paymentsService.verifyPayment(userId, verifyPaymentDto);
  }

  @Post('webhook/razorpay')
  async handleRazorpayWebhook(@Req() req: any, @Body() body: any) {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'placeholder_webhook_secret';
    const signature = req.headers['x-razorpay-signature'] as string;

    const payload = req.rawBody ? req.rawBody.toString('utf8') : JSON.stringify(body);
    const expectedSignature = crypto.createHmac('sha256', secret).update(payload).digest('hex');

    if (expectedSignature !== signature) {
      return { status: 'invalid signature' };
    }

    if (body.event === 'payment.captured' || body.event === 'order.paid') {
      const paymentId = body.payload.payment?.entity?.id;
      const orderId = body.payload.payment?.entity?.order_id;
      
      if (orderId) {
        await this.paymentsService.processSuccessfulPayment(orderId, paymentId, signature);
      }
    }

    return { status: 'ok' };
  }

  @Get('orders/:orderId/status')
  @UseGuards(FirebaseAuthGuard)
  getOrderStatus(@Param('orderId') orderId: string) {
    return this.paymentsService.getOrderStatus(orderId);
  }

  @Get('check/:courseId')
  @UseGuards(FirebaseAuthGuard)
  checkEnrollment(@Param('courseId') courseId: string, @Req() req: any) {
    const userId = req.user?.uid || req.user?.id;
    return this.paymentsService.checkEnrollment(userId, courseId);
  }

  @Get('my-enrollments')
  @UseGuards(FirebaseAuthGuard)
  getMyEnrollments(@Req() req: any) {
    const userId = req.user?.uid || req.user?.id;
    return this.paymentsService.getMyEnrollments(userId);
  }

  @Get('admin/orders')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin')
  getAllOrders() {
    return this.paymentsService.getAllOrders();
  }
}
