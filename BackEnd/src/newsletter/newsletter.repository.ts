import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { NewsletterSubscriber } from './entities/newsletter.entity';

@Injectable()
export class NewsletterRepository {
  private readonly collectionName = 'newsletter_subscribers';

  constructor(private readonly firebaseService: FirebaseService) {}

  async findByEmail(email: string): Promise<NewsletterSubscriber | null> {
    try {
      const db = this.firebaseService.getFirestore();
      const snapshot = await db
        .collection(this.collectionName)
        .where('email', '==', email.toLowerCase().trim())
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        email: data.email,
        status: data.status || 'active',
        createdAt: data.createdAt?.toDate?.() || data.createdAt || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
      } as NewsletterSubscriber;
    } catch (error: any) {
      console.error('FIREBASE FIND NEWSLETTER SUBSCRIBER ERROR:', error);
      throw new InternalServerErrorException('Database query failed: ' + error.message);
    }
  }

  async create(email: string): Promise<NewsletterSubscriber> {
    try {
      const db = this.firebaseService.getFirestore();
      const docRef = db.collection(this.collectionName).doc();
      const now = new Date();
      const newSubscriber: NewsletterSubscriber = {
        id: docRef.id,
        email: email.toLowerCase().trim(),
        status: 'active',
        createdAt: now,
        updatedAt: now,
      };

      await docRef.set(newSubscriber);
      return newSubscriber;
    } catch (error: any) {
      console.error('FIREBASE CREATE NEWSLETTER SUBSCRIBER ERROR:', error);
      throw new InternalServerErrorException('Failed to save newsletter subscriber: ' + error.message);
    }
  }

  async findAll(): Promise<NewsletterSubscriber[]> {
    try {
      const db = this.firebaseService.getFirestore();
      const snapshot = await db.collection(this.collectionName).orderBy('createdAt', 'desc').get();
      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          email: data.email,
          status: data.status || 'active',
          createdAt: data.createdAt?.toDate?.() || data.createdAt || new Date(),
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
        } as NewsletterSubscriber;
      });
    } catch (error: any) {
      console.error('FIREBASE GET NEWSLETTER SUBSCRIBERS ERROR:', error);
      throw new InternalServerErrorException('Failed to retrieve newsletter subscribers: ' + error.message);
    }
  }

  async updateStatus(id: string, status: 'active' | 'unsubscribed'): Promise<void> {
    try {
      const db = this.firebaseService.getFirestore();
      await db.collection(this.collectionName).doc(id).update({
        status,
        updatedAt: new Date(),
      });
    } catch (error: any) {
      console.error('FIREBASE UPDATE NEWSLETTER SUBSCRIBER ERROR:', error);
      throw new InternalServerErrorException('Failed to update subscriber status: ' + error.message);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const db = this.firebaseService.getFirestore();
      await db.collection(this.collectionName).doc(id).delete();
    } catch (error: any) {
      console.error('FIREBASE DELETE NEWSLETTER SUBSCRIBER ERROR:', error);
      throw new InternalServerErrorException('Failed to delete newsletter subscriber: ' + error.message);
    }
  }
}
