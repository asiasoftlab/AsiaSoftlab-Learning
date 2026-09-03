import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

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

  @Post('verify')
  @UseGuards(FirebaseAuthGuard)
  verifyPayment(@Body() verifyPaymentDto: VerifyPaymentDto, @Req() req: any) {
    const userId = req.user?.uid || req.user?.id;
    return this.paymentsService.verifyPayment(userId, verifyPaymentDto);
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
}
