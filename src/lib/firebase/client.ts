import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

function getFirebaseConfig() {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  if (!config.apiKey || !config.projectId || !config.appId) {
    throw new Error(
      "NEXT_PUBLIC_FIREBASE_* 환경변수가 필요합니다. (.env.local 참고)",
    );
  }

  return config;
}

export function getFirebaseApp(): FirebaseApp {
  if (getApps().length) return getApp();
  return initializeApp(getFirebaseConfig());
}

export function getFirebaseAuth() {
  return getAuth(getFirebaseApp());
}

export function getDb() {
  return getFirestore(getFirebaseApp());
}
