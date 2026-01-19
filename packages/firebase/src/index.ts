import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration from environment variables
// Note: These should be provided by the consuming app's environment or root .env
export const getFirebaseConfig = (env: any) => ({
    apiKey: env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.EXPO_PUBLIC_FIREBASE_APP_ID,
    measurementId: env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
});

export const initFirebase = (config: ReturnType<typeof getFirebaseConfig>) => {
    const app = initializeApp(config);
    const auth = getAuth(app);
    const db = getFirestore(app);
    return { app, auth, db };
};
