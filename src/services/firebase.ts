import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import admin from "firebase-admin";

// Firebase Config for Client SDK
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENTID,
};

// Service Account Config for Admin SDK
const serviceAccount = {
  type: process.env.NEXT_PUBLIC_FIREBASE_TYPE,
  project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  private_key_id: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"), // Handle line breaks
  client_email: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
  client_id: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_ID,
  auth_uri: process.env.NEXT_PUBLIC_FIREBASE_AUTH_URI,
  token_uri: process.env.NEXT_PUBLIC_FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.NEXT_PUBLIC_FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.NEXT_PUBLIC_FIREBASE_UNIVERSE_DOMAIN,
};

// Initialize Admin SDK (check to avoid re-initialization)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

// Initialize Client SDK (check to avoid re-initialization)
export const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
