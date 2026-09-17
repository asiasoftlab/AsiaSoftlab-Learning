import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { Assessment, AssessmentSubmission } from './entities/assessment.entity';

@Injectable()
export class AssessmentsRepository {
  private readonly collectionName = 'assessments';
  private readonly submissionsCollectionName = 'assessment_submissions';

  constructor(private readonly firebaseService: FirebaseService) {}

  async create(assessment: Assessment): Promise<Assessment> {
    try {
      const db = this.firebaseService.getFirestore();
      const docRef = db.collection(this.collectionName).doc();
      const assessmentWithId: Assessment = { ...assessment, id: docRef.id };

      const payload: any = {
        ...assessmentWithId,
        createdAt: assessment.createdAt || new Date(),
        updatedAt: assessment.updatedAt || new Date(),
      };

      Object.keys(payload).forEach((key) => {
        if (payload[key] === undefined) {
          delete payload[key];
        }
      });

      await docRef.set(payload);
      return assessmentWithId;
    } catch (error: any) {
      console.error('FIREBASE CREATE ASSESSMENT ERROR:', error);
      throw new InternalServerErrorException('Failed to create assessment in database: ' + error.message);
    }
  }

  async findAll(): Promise<Assessment[]> {
    try {
      const db = this.firebaseService.getFirestore();
      const snapshot = await db.collection(this.collectionName).orderBy('createdAt', 'desc').get();

      if (snapshot.empty) {
        // If no records yet, seed with the real initial assessments
        return await this.seedInitialAssessments();
      }

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          courseId: data.courseId,
          courseTitle: data.courseTitle,
          category: data.category,
          description: data.description,
          thumbnailUrl: data.thumbnailUrl,
          thumbnailPublicId: data.thumbnailPublicId,
          durationMinutes: data.durationMinutes || 30,
          passingScore: data.passingScore || 70,
          maxAttempts: data.maxAttempts || 3,
          totalQuestions: data.totalQuestions || (data.questions ? data.questions.length : 0),
          questions: data.questions || [],
          status: data.status || 'Published',
          userStatus: data.userStatus,
          userScore: data.userScore,
          userAttempts: data.userAttempts,
          userProgress: data.userProgress,
          lastAttemptedAt: data.lastAttemptedAt ? (typeof data.lastAttemptedAt.toDate === 'function' ? data.lastAttemptedAt.toDate() : new Date(data.lastAttemptedAt)) : undefined,
          completedAt: data.completedAt ? (typeof data.completedAt.toDate === 'function' ? data.completedAt.toDate() : new Date(data.completedAt)) : undefined,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt ? new Date(data.createdAt) : new Date()),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : (data.updatedAt ? new Date(data.updatedAt) : new Date()),
        } as Assessment;
      });
    } catch (error: any) {
      console.error('FIREBASE FIND ALL ASSESSMENTS ERROR:', error);
      throw new InternalServerErrorException('Failed to retrieve assessments');
    }
  }

  async findById(id: string): Promise<Assessment | null> {
    try {
      const db = this.firebaseService.getFirestore();
      const doc = await db.collection(this.collectionName).doc(id).get();

      if (!doc.exists) {
        return null;
      }

      const data = doc.data()!;
      return {
        id: doc.id,
        title: data.title,
        courseId: data.courseId,
        courseTitle: data.courseTitle,
        category: data.category,
        description: data.description,
        thumbnailUrl: data.thumbnailUrl,
        thumbnailPublicId: data.thumbnailPublicId,
        durationMinutes: data.durationMinutes || 30,
        passingScore: data.passingScore || 70,
        maxAttempts: data.maxAttempts || 3,
        totalQuestions: data.totalQuestions || (data.questions ? data.questions.length : 0),
        questions: data.questions || [],
        status: data.status || 'Published',
        userStatus: data.userStatus,
        userScore: data.userScore,
        userAttempts: data.userAttempts,
        userProgress: data.userProgress,
        lastAttemptedAt: data.lastAttemptedAt ? (typeof data.lastAttemptedAt.toDate === 'function' ? data.lastAttemptedAt.toDate() : new Date(data.lastAttemptedAt)) : undefined,
        completedAt: data.completedAt ? (typeof data.completedAt.toDate === 'function' ? data.completedAt.toDate() : new Date(data.completedAt)) : undefined,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : (data.createdAt ? new Date(data.createdAt) : new Date()),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : (data.updatedAt ? new Date(data.updatedAt) : new Date()),
      } as Assessment;
    } catch (error: any) {
      console.error('FIREBASE FIND ASSESSMENTS BY ID ERROR:', error);
      throw new InternalServerErrorException('Failed to retrieve assessment');
    }
  }

  async update(id: string, updateData: Partial<Assessment>): Promise<Assessment> {
    try {
      const db = this.firebaseService.getFirestore();
      const docRef = db.collection(this.collectionName).doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new NotFoundException('Assessment not found');
      }

      const updatePayload: any = {
        ...updateData,
        updatedAt: new Date(),
      };

      if (updateData.questions) {
        updatePayload.totalQuestions = updateData.questions.length;
      }

      Object.keys(updatePayload).forEach((key) => {
        if (updatePayload[key] === undefined) {
          delete updatePayload[key];
        }
      });

      await docRef.update(updatePayload);

      const updated = await this.findById(id);
      return updated!;
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      console.error('FIREBASE UPDATE ASSESSMENT ERROR:', error);
      throw new InternalServerErrorException('Failed to update assessment: ' + error.message);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const db = this.firebaseService.getFirestore();
      await db.collection(this.collectionName).doc(id).delete();
    } catch (error: any) {
      console.error('FIREBASE DELETE ASSESSMENT ERROR:', error);
      throw new InternalServerErrorException('Failed to delete assessment');
    }
  }

  async saveSubmission(submission: AssessmentSubmission): Promise<AssessmentSubmission> {
    try {
      const db = this.firebaseService.getFirestore();
      const docRef = db.collection(this.submissionsCollectionName).doc();
      const subWithId: AssessmentSubmission = {
        ...submission,
        id: docRef.id,
      };

      const payload: any = {
        ...subWithId,
        completedAt: submission.completedAt || new Date(),
        lastAttemptedAt: submission.lastAttemptedAt || new Date(),
        createdAt: submission.createdAt || new Date(),
        updatedAt: submission.updatedAt || new Date(),
      };

      Object.keys(payload).forEach((key) => {
        if (payload[key] === undefined) {
          delete payload[key];
        }
      });

      await docRef.set(payload);

      // Also update the assessment document with latest submission snapshot if needed
      await this.updateAssessmentStatsAfterSubmission(submission.assessmentId, subWithId);

      return subWithId;
    } catch (error: any) {
      console.error('FIREBASE SAVE SUBMISSION ERROR:', error);
      throw new InternalServerErrorException('Failed to save assessment submission');
    }
  }

  async getSubmissionsByAssessmentId(assessmentId: string): Promise<AssessmentSubmission[]> {
    try {
      const db = this.firebaseService.getFirestore();
      const snapshot = await db.collection(this.submissionsCollectionName).where('assessmentId', '==', assessmentId).orderBy('createdAt', 'desc').get();
      return snapshot.docs.map((doc) => ({id: doc.id,...doc.data(),})) as AssessmentSubmission[];
    } catch (error: any) {
      console.error('FIREBASE GET SUBMISSIONS ERROR:', error);
      return [];
    }
  }

  async getAllSubmissions(): Promise<AssessmentSubmission[]> {
    try {
      const db = this.firebaseService.getFirestore();
      const snapshot = await db.collection(this.submissionsCollectionName).get();
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as AssessmentSubmission[];
    } catch (error: any) {
      console.error('FIREBASE GET ALL SUBMISSIONS ERROR:', error);
      return [];
    }
  }

  private async updateAssessmentStatsAfterSubmission(assessmentId: string, submission: AssessmentSubmission) {
    try {
      const db = this.firebaseService.getFirestore();
      const docRef = db.collection(this.collectionName).doc(assessmentId);
      const doc = await docRef.get();
      if (!doc.exists) return;

      const current = doc.data();
      const attempts = (current?.userAttempts || 0) + 1;
      const status = submission.passed ? 'completed' : 'failed';

      await docRef.update({
        userStatus: status,
        userScore: submission.score,
        userAttempts: attempts,
        userProgress: submission.passed ? 100 : Math.min(100, Math.round((submission.score / (current?.passingScore || 70)) * 100)),
        lastAttemptedAt: new Date(),
        completedAt: submission.passed ? new Date() : current?.completedAt || null,
        updatedAt: new Date(),
      });
    } catch (err) {
      console.error('Failed to update assessment meta stats:', err);
    }
  }

  private async seedInitialAssessments(): Promise<Assessment[]> {
    const db = this.firebaseService.getFirestore();
    const batch = db.batch();

    const initialData: Omit<Assessment, 'id'>[] = [
      {
        title: 'Frontend Development Assessment',
        courseTitle: 'Web Development Fundamentals',
        category: 'Web Development',
        description: 'Comprehensive test on HTML5, CSS3, JavaScript, DOM manipulation, responsive layouts, and modern frontend practices.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?w=600&auto=format&fit=crop&q=80',
        durationMinutes: 30,
        passingScore: 70,
        maxAttempts: 3,
        totalQuestions: 20,
        status: 'Published',
        userStatus: 'in_progress',
        userScore: 75,
        userAttempts: 2,
        userProgress: 75,
        lastAttemptedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        questions: [
          {
            id: 'q1',
            question: 'Which HTML5 element is used for the primary navigation links of a website?',
            options: ['<nav>', '<header>', '<section>', '<navigation>'],
            correctOptionIndex: 0,
            explanation: 'The <nav> tag defines a set of navigation links in HTML5.',
            points: 5,
          },
          {
            id: 'q2',
            question: 'What is the purpose of the CSS box-sizing property when set to border-box?',
            options: [
              'Includes padding and border in the element’s total width and height',
              'Excludes padding from the width calculation',
              'Increases outer margin automatically',
              'Aligns child elements to the grid container'
            ],
            correctOptionIndex: 0,
            explanation: 'border-box causes the browser to account for padding and border within the specified width/height.',
            points: 5,
          },
          {
            id: 'q3',
            question: 'Which JavaScript method is used to attach an event handler to an element without overwriting existing ones?',
            options: ['addEventListener', 'attachEvent', 'onclick', 'setEventListener'],
            correctOptionIndex: 0,
            explanation: 'addEventListener allows multiple handlers to be attached to the same event target.',
            points: 5,
          },
          {
            id: 'q4',
            question: 'What CSS layout module is best suited for 1-dimensional layouts (rows OR columns)?',
            options: ['Flexbox', 'CSS Grid', 'Float', 'Absolute Positioning'],
            correctOptionIndex: 0,
            explanation: 'Flexbox is designed for one-dimensional layouts, whereas Grid is 2-dimensional.',
            points: 5,
          },
        ],
      },
      {
        title: 'JavaScript Fundamentals',
        courseTitle: 'JavaScript Essentials',
        category: 'Programming',
        description: 'Test your understanding of JavaScript core concepts including closures, prototypes, event loop, promises, and async/await.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1579468118864-ddab3bb2b21c?w=600&auto=format&fit=crop&q=80',
        durationMinutes: 40,
        passingScore: 70,
        maxAttempts: 3,
        totalQuestions: 25,
        status: 'Published',
        userStatus: 'not_started',
        userScore: 0,
        userAttempts: 0,
        userProgress: 0,
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        questions: [
          {
            id: 'js1',
            question: 'What is the result of `typeof null` in JavaScript?',
            options: ['"object"', '"null"', '"undefined"', '"boolean"'],
            correctOptionIndex: 0,
            explanation: 'In JavaScript, typeof null returns "object", which is a historical bug in the language.',
            points: 5,
          },
          {
            id: 'js2',
            question: 'Which of the following creates a block-scoped variable?',
            options: ['let and const', 'var and let', 'var only', 'function declarations'],
            correctOptionIndex: 0,
            explanation: 'let and const are block-scoped declarations introduced in ES6.',
            points: 5,
          },
          {
            id: 'js3',
            question: 'What does the `Promise.all()` method return when one of the promises is rejected?',
            options: [
              'Immediately rejects with that error',
              'Waits for all other promises to resolve',
              'Returns an array of null values',
              'Silently ignores the rejection'
            ],
            correctOptionIndex: 0,
            explanation: 'Promise.all rejects immediately upon the first rejected promise.',
            points: 5,
          }
        ],
      },
      {
        title: 'Python for Beginners - Quiz',
        courseTitle: 'Python Programming',
        category: 'Data Science & AI',
        description: 'Evaluate your knowledge of Python syntax, data types, control flow, functions, and standard libraries.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&auto=format&fit=crop&q=80',
        durationMinutes: 30,
        passingScore: 70,
        maxAttempts: 3,
        totalQuestions: 20,
        status: 'Published',
        userStatus: 'failed',
        userScore: 56,
        userAttempts: 1,
        userProgress: 56,
        lastAttemptedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        questions: [
          {
            id: 'py1',
            question: 'Which data structure in Python is immutable?',
            options: ['Tuple', 'List', 'Dictionary', 'Set'],
            correctOptionIndex: 0,
            explanation: 'Tuples are immutable sequences in Python.',
            points: 5,
          },
          {
            id: 'py2',
            question: 'How do you define a function in Python?',
            options: ['def my_func():', 'function my_func():', 'func my_func():', 'define my_func():'],
            correctOptionIndex: 0,
            explanation: 'The `def` keyword is used to declare a function in Python.',
            points: 5,
          }
        ],
      },
      {
        title: 'Database Concepts Assessment',
        courseTitle: 'Database Management Systems',
        category: 'Databases',
        description: 'Covers relational database normalization, SQL queries, indexing, ACID transactions, and NoSQL storage engines.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
        durationMinutes: 20,
        passingScore: 70,
        maxAttempts: 3,
        totalQuestions: 15,
        status: 'Published',
        userStatus: 'completed',
        userScore: 88,
        userAttempts: 1,
        userProgress: 100,
        lastAttemptedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        questions: [
          {
            id: 'db1',
            question: 'What does the "A" in ACID database properties stand for?',
            options: ['Atomicity', 'Availability', 'Accuracy', 'Authentication'],
            correctOptionIndex: 0,
            explanation: 'Atomicity ensures that all operations in a transaction succeed or all fail together.',
            points: 5,
          },
          {
            id: 'db2',
            question: 'Which SQL clause is used to filter records after grouping with GROUP BY?',
            options: ['HAVING', 'WHERE', 'ORDER BY', 'FILTER'],
            correctOptionIndex: 0,
            explanation: 'The HAVING clause was added to SQL because the WHERE keyword could not be used with aggregate functions.',
            points: 5,
          }
        ],
      },
      {
        title: 'Cloud Computing Basics',
        courseTitle: 'Cloud Computing',
        category: 'Cloud & DevOps',
        description: 'Examines IaaS, PaaS, SaaS models, cloud security, scalability, serverless architectures, and virtualization.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
        durationMinutes: 30,
        passingScore: 70,
        maxAttempts: 3,
        totalQuestions: 20,
        status: 'Published',
        userStatus: 'not_started',
        userScore: 0,
        userAttempts: 0,
        userProgress: 0,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        questions: [
          {
            id: 'cc1',
            question: 'Which cloud service model provides virtual machines, raw storage, and virtual networks?',
            options: ['IaaS (Infrastructure as a Service)', 'PaaS (Platform as a Service)', 'SaaS (Software as a Service)', 'FaaS (Function as a Service)'],
            correctOptionIndex: 0,
            explanation: 'IaaS provides basic computing infrastructure resources on demand.',
            points: 5,
          }
        ],
      },
    ];

    const results: Assessment[] = [];
    for (const item of initialData) {
      const docRef = db.collection(this.collectionName).doc();
      const assessment: Assessment = { ...item, id: docRef.id };
      batch.set(docRef, assessment);
      results.push(assessment);
    }

    await batch.commit();
    return results;
  }
}
