import { Injectable, OnModuleInit } from '@nestjs/common';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

@Injectable()
export class FirebaseService implements OnModuleInit {
  onModuleInit() {
    // The user mentioned they will update this part with their credentials
    if (!getApps().length) {
      initializeApp({
        // credential: cert(serviceAccount),
      });
    }
  }

  getAuth() {
    return getAuth();
  }
}
