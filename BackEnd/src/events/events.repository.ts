 import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { Event } from './entities/event.entity';

@Injectable()
export class EventsRepository {
  private readonly collectionName = 'events';

  constructor(private readonly firebaseService: FirebaseService) {}

  async create(event: Event): Promise<Event> {
    try {
      const db = this.firebaseService.getFirestore();
      const docRef = db.collection(this.collectionName).doc();
      const eventWithId = { ...event, id: docRef.id };
      
      const payload = {
        ...eventWithId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await docRef.set(payload);
      return eventWithId;
    } catch (error: any) {
      console.error('FIREBASE CREATE ERROR:', error);
      throw new InternalServerErrorException('Failed to create event in database: ' + error.message);
    }
  }

  async findAll(): Promise<Event[]> {
    try {
      const db = this.firebaseService.getFirestore();
      const snapshot = await db.collection(this.collectionName).orderBy('createdAt', 'desc').get();
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          date: data.date,
          time: data.time,
          type: data.type,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        } as Event;
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve events');
    }
  }

  async update(id: string, updateData: Partial<Event>): Promise<Event> {
    try {
      const db = this.firebaseService.getFirestore();
      const docRef = db.collection(this.collectionName).doc(id);
      const updatePayload = {...updateData,updatedAt: new Date(),};
      await docRef.update(updatePayload);
      
      const updatedDoc = await docRef.get();
      const data = updatedDoc.data();
      
      return {
        id: updatedDoc.id,
        ...data,
        createdAt: data?.createdAt?.toDate(),
        updatedAt: data?.updatedAt?.toDate(),
      } as Event;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update event');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const db = this.firebaseService.getFirestore();
      await db.collection(this.collectionName).doc(id).delete();
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete event');
    }
  }
}
