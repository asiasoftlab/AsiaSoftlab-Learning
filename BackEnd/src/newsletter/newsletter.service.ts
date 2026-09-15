import { Injectable, ConflictException } from '@nestjs/common';
import { NewsletterRepository } from './newsletter.repository';
import { SubscribeNewsletterDto } from './dto/subscribe-newsletter.dto';
import { UpdateSubscriberStatusDto } from './dto/update-subscriber-status.dto';

@Injectable()
export class NewsletterService {
  constructor(private readonly newsletterRepository: NewsletterRepository) {}

  async subscribe(dto: SubscribeNewsletterDto) {
    const normalizedEmail = dto.email.toLowerCase().trim();
    const existing = await this.newsletterRepository.findByEmail(normalizedEmail);

    if (existing) {
      if (existing.status === 'active') {
        return {
          success: true,
          message: 'You are already subscribed to our newsletter!',
          subscriber: existing,
        };
      } else {
        // Reactivate previously unsubscribed email
        await this.newsletterRepository.updateStatus(existing.id, 'active');
        return {
          success: true,
          message: 'Welcome back! Your newsletter subscription has been reactivated.',
          subscriber: { ...existing, status: 'active' },
        };
      }
    }

    const newSubscriber = await this.newsletterRepository.create(normalizedEmail);
    return {
      success: true,
      message: 'Thank you for subscribing to our newsletter!',
      subscriber: newSubscriber,
    };
  }

  async findAll() {
    return this.newsletterRepository.findAll();
  }

  async updateStatus(id: string, dto: UpdateSubscriberStatusDto) {
    await this.newsletterRepository.updateStatus(id, dto.status);
    return { success: true, message: `Subscriber status updated to ${dto.status}` };
  }

  async remove(id: string) {
    await this.newsletterRepository.delete(id);
    return { success: true, message: 'Subscriber removed successfully' };
  }
}
