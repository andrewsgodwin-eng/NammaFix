import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

let firebaseInitialized = false;

try {
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
    firebaseInitialized = true;
    console.log('🔥 Firebase Admin SDK initialized successfully');
  } else {
    console.log('ℹ️ Firebase credentials not provided; running with simulated auth tokens in development mode');
  }
} catch (error) {
  console.warn('⚠️ Firebase Admin init error:', error.message);
}

export const firebaseAdmin = admin;
export const isFirebaseReady = () => firebaseInitialized;
