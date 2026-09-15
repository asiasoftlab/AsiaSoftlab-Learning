import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards, HttpCode, HttpStatus, } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { SubscribeNewsletterDto } from './dto/subscribe-newsletter.dto';
import { UpdateSubscriberStatusDto } from './dto/update-subscriber-status.dto';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Post('subscribe')
  @HttpCode(HttpStatus.OK)
  subscribe(@Body() dto: SubscribeNewsletterDto) {
    return this.newsletterService.subscribe(dto);
  }

  @Get('subscribers')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin')
  findAll() {
    return this.newsletterService.findAll();
  }

  @Patch('subscribers/:id/status')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateSubscriberStatusDto,
  ) {
    return this.newsletterService.updateStatus(id, dto);
  }

  @Delete('subscribers/:id')
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.newsletterService.remove(id);
  }
}
