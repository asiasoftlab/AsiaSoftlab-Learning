import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { Course, CourseLesson } from './entities/course.entity';

@Injectable()
export class CoursesRepository {
  private readonly collectionName = 'courses';

  constructor(private readonly firebaseService: FirebaseService) {}

  async create(course: Course): Promise<Course> {
    try {
      const db = this.firebaseService.getFirestore();
      const docRef = db.collection(this.collectionName).doc();
      const courseWithId = { ...course, id: docRef.id };
      
      const payload = {
        ...courseWithId,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
      };

      Object.keys(payload).forEach(key => {
        if (payload[key as keyof typeof payload] === undefined) {
          delete payload[key as keyof typeof payload];
        }
      });

      await docRef.set(payload);
      return courseWithId;
    } catch (error: any) {
      console.error('FIREBASE CREATE ERROR:', error);
      throw new InternalServerErrorException('Failed to create course in database: ' + error.message);
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
          category: data.category,
          level: data.level,
          price: data.price,
          originalPrice: data.originalPrice,
          thumbnailUrl: data.thumbnailUrl,
          thumbnailPublicId: data.thumbnailPublicId,
          status: data.status,
          totalDuration: data.totalDuration,
          averageRating: data.averageRating || 0,
          ratingCount: data.ratingCount || 0,
          enrollmentCount: data.enrollmentCount || 0,
          instructorId: data.instructorId,
          lessons: data.lessons || [],
          learningObjectives: data.learningObjectives || [],
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
        category: data?.category,
        level: data?.level,
        price: data?.price,
        originalPrice: data?.originalPrice,
        thumbnailUrl: data?.thumbnailUrl,
        thumbnailPublicId: data?.thumbnailPublicId,
        status: data?.status,
        totalDuration: data?.totalDuration,
        averageRating: data?.averageRating || 0,
        ratingCount: data?.ratingCount || 0,
        enrollmentCount: data?.enrollmentCount || 0,
        instructorId: data?.instructorId,
        lessons: data?.lessons || [],
        learningObjectives: data?.learningObjectives || [],
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

      // Remove undefined fields so Firestore doesn't error
      Object.keys(updatePayload).forEach(key => {
        if (updatePayload[key as keyof typeof updatePayload] === undefined) {
          delete updatePayload[key as keyof typeof updatePayload];
        }
      });

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
