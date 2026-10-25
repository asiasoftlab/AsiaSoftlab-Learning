import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);
  private authInstance: Auth;
  private firestoreInstance: Firestore;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const start = Date.now();
    if (!getApps().length) {
      const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
      const clientEmail = this.configService.get<string>('FIREBASE_CLIENT_EMAIL');
      const privateKey = this.configService.get<string>('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n');
      
      this.logger.log(`Initializing Firebase Admin (projectId configured: ${!!projectId}, clientEmail configured: ${!!clientEmail}, privateKey configured: ${!!privateKey})`);

      if (projectId && clientEmail && privateKey) {
        initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        });
        this.logger.log('Firebase Admin initialized successfully with credentials.');
      } else {
        this.logger.warn('Firebase Admin initialized without credentials (falling back to application default). Ensure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set.');
        initializeApp();
      }
    }

    this.authInstance = getAuth();
    this.firestoreInstance = getFirestore();
    this.logger.log(`Firebase initialization completed in ${Date.now() - start}ms`);
  }

  getAuth(): Auth {
    if (!this.authInstance) {
      this.authInstance = getAuth();
    }
    return this.authInstance;
  }

  getFirestore(): Firestore {
    if (!this.firestoreInstance) {
      this.firestoreInstance = getFirestore();
    }
    return this.firestoreInstance;
  }
}
