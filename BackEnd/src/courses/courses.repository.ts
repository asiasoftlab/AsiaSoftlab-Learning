import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { Course } from './entities/course.entity';

@Injectable()
export class CoursesRepository {
  private readonly collectionName = 'courses';

  constructor(private readonly firebaseService: FirebaseService) {}

  async create(course: Course): Promise<Course> {
    try {
      const db = this.firebaseService.getFirestore();
      // Generate a new ID if one isn't provided
      const docRef = db.collection(this.collectionName).doc();
      const courseWithId = { ...course, id: docRef.id };
      
      await docRef.set({
        ...courseWithId,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
      });
      return courseWithId;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create course in database');
    }
  }

  async findAll(): Promise<Course[]> {
    try {
      const db = this.firebaseService.getFirestore();
      const snapshot = await db.collection(this.collectionName).orderBy('createdAt', 'desc').get();
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          description: data.description,
          instructorId: data.instructorId,
          price: data.price,
          imageUrl: data.imageUrl,
          published: data.published,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        } as Course;
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve courses');
    }
  }

  async findById(id: string): Promise<Course | null> {
    try {
      const db = this.firebaseService.getFirestore();
      const doc = await db.collection(this.collectionName).doc(id).get();
      
      if (!doc.exists) {
        return null;
      }
      
      const data = doc.data();
      return {
        id: doc.id,
        title: data?.title,
        description: data?.description,
        instructorId: data?.instructorId,
        price: data?.price,
        imageUrl: data?.imageUrl,
        published: data?.published,
        createdAt: data?.createdAt?.toDate(),
        updatedAt: data?.updatedAt?.toDate(),
      } as Course;
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve course');
    }
  }

  async update(id: string, updateData: Partial<Course>): Promise<Course> {
    try {
      const db = this.firebaseService.getFirestore();
      const docRef = db.collection(this.collectionName).doc(id);
      const doc = await docRef.get();
      
      if (!doc.exists) {
        throw new NotFoundException('Course not found');
      }

      const updatePayload = {
        ...updateData,
        updatedAt: new Date(),
      };

      await docRef.update(updatePayload);
      
      const updatedDoc = await docRef.get();
      const data = updatedDoc.data();
      
      return {
        id: updatedDoc.id,
        ...data,
        createdAt: data?.createdAt?.toDate(),
        updatedAt: data?.updatedAt?.toDate(),
      } as Course;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to update course');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const db = this.firebaseService.getFirestore();
      await db.collection(this.collectionName).doc(id).delete();
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete course');
    }
  }
}
