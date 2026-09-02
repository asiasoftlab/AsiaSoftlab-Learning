import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsRepository {
  private readonly collectionName = 'notifications';

  constructor(private readonly firebaseService: FirebaseService) {}

  async create(notification: Notification): Promise<Notification> {
    try {
      const db = this.firebaseService.getFirestore();
      const docRef = db.collection(this.collectionName).doc();
      const notifWithId = { ...notification, id: docRef.id };
      
      const payload = {
        ...notifWithId,
        createdAt: new Date(),
      };

      await docRef.set(payload);
      return notifWithId;
    } catch (error: any) {
      console.error('FIREBASE CREATE NOTIFICATION ERROR:', error);
      throw new InternalServerErrorException('Failed to create notification in database: ' + error.message);
    }
  }

  async findAll(): Promise<Notification[]> {
    try {
      const db = this.firebaseService.getFirestore();
      const snapshot = await db.collection(this.collectionName).orderBy('createdAt', 'desc').get();
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          message: data.message,
          type: data.type || 'info',
          createdAt: data.createdAt?.toDate(),
        } as Notification;
      });
    } catch (error) {
      console.error('FIREBASE FETCH NOTIFICATIONS ERROR:', error);
      throw new InternalServerErrorException('Failed to retrieve notifications');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const db = this.firebaseService.getFirestore();
      await db.collection(this.collectionName).doc(id).delete();
    } catch (error: any) {
      console.error('FIREBASE DELETE NOTIFICATION ERROR:', error);
      throw new InternalServerErrorException('Failed to delete notification: ' + error.message);
    }
  }

  async update(id: string, updateData: Partial<Notification>): Promise<void> {
    try {
      const db = this.firebaseService.getFirestore();
      await db.collection(this.collectionName).doc(id).update(updateData);
    } catch (error: any) {
      console.error('FIREBASE UPDATE NOTIFICATION ERROR:', error);
      throw new InternalServerErrorException('Failed to update notification: ' + error.message);
    }
  }
}
