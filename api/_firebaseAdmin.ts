import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

function getPrivateKey(): string {
  let key = process.env.FIREBASE_PRIVATE_KEY || '';
  // Vercel may wrap the key in quotes or double-escape newlines
  if (key.startsWith('"') && key.endsWith('"')) {
    try { key = JSON.parse(key); } catch { /* use as-is */ }
  }
  key = key.replace(/\\n/g, '\n');
  return key;
}

if (!getApps().length) {
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: getPrivateKey(),
      }),
    });
  } catch (error) {
    console.error('Firebase Admin init error:', error);
  }
}

export const adminAuth = getAuth();
export const adminDb = getFirestore();
export { FieldValue };
