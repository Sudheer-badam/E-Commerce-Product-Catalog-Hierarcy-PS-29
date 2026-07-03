import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  onModuleInit() {
    // In production, load from secure environment variables or secret manager
    // admin.initializeApp({
    //   credential: admin.credential.cert({
    //     projectId: process.env.FIREBASE_PROJECT_ID,
    //     clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    //     privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    //   }),
    // });
    console.log('Firebase Admin SDK Initialized');
  }

  async verifyToken(idToken: string) {
    try {
      // return await admin.auth().verifyIdToken(idToken);
      return { uid: 'mock-user-id', phone_number: '+1234567890' };
    } catch (error) {
      throw new Error('Unauthorized');
    }
  }
}
