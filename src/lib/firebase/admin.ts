import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function initAdmin(): App | null {
  if (getApps().length) return getApps()[0]!;

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(
    /\\n/g,
    "\n",
  );

  if (!projectId || !clientEmail || !privateKey) return null;

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

export function getAdminApp() {
  return initAdmin();
}

export function getAdminAuth() {
  const app = initAdmin();
  if (!app) return null;
  return getAuth(app);
}

export function getAdminDb() {
  const app = initAdmin();
  if (!app) return null;
  return getFirestore(app);
}

export async function verifyIdToken(authHeader: string | null) {
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice("Bearer ".length).trim();
  if (!token) return null;

  const auth = getAdminAuth();
  if (!auth) {
    throw new Error(
      "Firebase Admin이 설정되지 않았습니다. FIREBASE_ADMIN_* 환경변수를 확인하세요.",
    );
  }

  return auth.verifyIdToken(token);
}
