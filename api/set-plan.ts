import type { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// --- Firebase Admin SDK init (inline to avoid Vercel module resolution issues) ---
function getPrivateKey(): string {
  let key = process.env.FIREBASE_PRIVATE_KEY || '';
  if (key.startsWith('"') && key.endsWith('"')) {
    try { key = JSON.parse(key); } catch { /* use as-is */ }
  }
  return key.replace(/\\n/g, '\n');
}

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: getPrivateKey(),
    }),
  });
}

const adminAuth = getAuth();
const adminDb = getFirestore();

const VALID_PLANS = ['free', 'premium', 'pro'] as const;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // --- AUTH: Verify Firebase ID token ---
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing auth token' });
  }

  let uid: string;
  try {
    const idToken = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    uid = decodedToken.uid;
  } catch {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }

  const { plan } = req.body;

  if (!plan || !VALID_PLANS.includes(plan)) {
    return res.status(400).json({ error: 'Invalid plan. Must be: free, premium, or pro' });
  }

  // TODO: When Creem.io webhooks are configured, verify payment here
  // before allowing upgrade to premium/pro. For now, we log all changes
  // for audit trail and restrict writes to this server endpoint only.

  try {
    console.log(`[set-plan] uid=${uid} plan=${plan} at=${new Date().toISOString()}`);

    const userRef = adminDb.collection('users').doc(uid);
    await userRef.set({ plan }, { merge: true });

    return res.status(200).json({ success: true, plan });
  } catch (error) {
    console.error('Set plan error:', error);
    return res.status(500).json({ error: 'Failed to update plan' });
  }
}
