import { Module } from '@nestjs/common';
import { NewsletterController } from './newsletter.controller';
import { NewsletterService } from './newsletter.service';
import { NewsletterRepository } from './newsletter.repository';
import { FirebaseModule } from '../firebase/firebase.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [FirebaseModule, UsersModule],
  controllers: [NewsletterController],
  providers: [NewsletterService, NewsletterRepository],
  exports: [NewsletterService, NewsletterRepository],
})
export class NewsletterModule {}

