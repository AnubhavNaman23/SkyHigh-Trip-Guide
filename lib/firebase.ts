import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
const googleProvider = new GoogleAuthProvider();

const hasFirebaseConfig = !!firebaseConfig.apiKey && !!firebaseConfig.projectId;

if (hasFirebaseConfig) {
    try {
        app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
        auth = getAuth(app);
        db = getFirestore(app);

        // Ensure persistence is set to LOCAL (browser default, but explicit is safer)
        setPersistence(auth, browserLocalPersistence).catch((error) => {
            console.error("[SkyHigh] Error setting auth persistence:", error);
        });
    } catch (err) {
        console.error("[SkyHigh] Firebase client initialization failed:", err);
    }
} else {
    console.warn(
        "[SkyHigh] Firebase client config missing. " +
        "Set NEXT_PUBLIC_FIREBASE_* variables in your .env to enable authentication."
    );
}

export { app, auth, db, googleProvider };

