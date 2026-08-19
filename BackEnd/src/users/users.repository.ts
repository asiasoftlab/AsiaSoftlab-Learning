import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { User } from './entities/user.entity';

@Injectable()
export class UsersRepository {
  private readonly collectionName = 'users';

  constructor(private readonly firebaseService: FirebaseService) {}

  async create(user: User): Promise<User> {
    try {
      const db = this.firebaseService.getFirestore();
      await db.collection(this.collectionName).doc(user.id).set({
        ...user,
        createdAt: user.createdAt, // Will be serialized properly by Firestore SDK
        updatedAt: user.updatedAt,
      });
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create user in database');
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const db = this.firebaseService.getFirestore();
      const doc = await db.collection(this.collectionName).doc(id).get();
      
      if (!doc.exists) {
        return null;
      }
      
      const data = doc.data();
      return {
        id: doc.id,
        email: data?.email,
        displayName: data?.displayName,
        role: data?.role,
        createdAt: data?.createdAt?.toDate(),
        updatedAt: data?.updatedAt?.toDate(),
      } as User;
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve user');
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const db = this.firebaseService.getFirestore();
      const snapshot = await db.collection(this.collectionName).orderBy('createdAt', 'desc').get();
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          email: data?.email,
          displayName: data?.displayName,
          role: data?.role,
          createdAt: data?.createdAt?.toDate(),
          updatedAt: data?.updatedAt?.toDate(),
        } as User;
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve users');
    }
  }

  async updateRole(id: string, role: string): Promise<void> {
    try {
      const db = this.firebaseService.getFirestore();
      await db.collection(this.collectionName).doc(id).update({
        role,
        updatedAt: new Date(),
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to update user role');
    }
  }
}
