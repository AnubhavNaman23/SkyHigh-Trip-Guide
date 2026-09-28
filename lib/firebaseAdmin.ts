import * as admin from 'firebase-admin';

let db: admin.firestore.Firestore | null = null;
let isAdminInitialized = false;

// Initialize Firebase Admin SDK — gracefully handle missing credentials
if (!admin.apps.length) {
    const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;

    if (!projectId || !privateKey || !clientEmail) {
        console.warn(
            '[SkyHigh] Firebase Admin credentials not found. ' +
            'Set FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_PRIVATE_KEY, and FIREBASE_ADMIN_CLIENT_EMAIL ' +
            'in your .env file to enable server-side data fetching.'
        );
    } else {
        try {
            // Remove possible wrapping quotes and fix escaped newlines
            const cleanedPrivateKey = privateKey
                .replace(/^"/, '')
                .replace(/"$/, '')
                .replace(/\\n/g, '\n');

            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId,
                    privateKey: cleanedPrivateKey,
                    clientEmail,
                }),
            });

            isAdminInitialized = true;
            console.log('[SkyHigh] Firebase Admin initialized successfully.');
        } catch (err) {
            console.error('[SkyHigh] Firebase Admin initialization failed:', err);
        }
    }
} else {
    isAdminInitialized = true;
}

if (isAdminInitialized) {
    db = admin.firestore();
}

export { admin, db };

