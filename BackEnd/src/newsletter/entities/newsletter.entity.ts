export class NewsletterSubscriber {
  id: string;
  email: string;
  status: 'active' | 'unsubscribed';
  createdAt: Date;
  updatedAt?: Date;
}
