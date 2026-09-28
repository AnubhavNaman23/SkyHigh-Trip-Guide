/* eslint-disable @typescript-eslint/no-require-imports */
// Load environment variables FIRST before any other imports
require('dotenv').config({ path: require('path').resolve(process.cwd(), '.env') });

// Verify environment variables are loaded
console.log('Checking environment variables...');
const requiredEnvVars = [
    'FIREBASE_ADMIN_PROJECT_ID',
    'FIREBASE_ADMIN_PRIVATE_KEY',
    'FIREBASE_ADMIN_CLIENT_EMAIL'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars.join(', '));
    console.error('Please ensure .env.local contains all Firebase Admin credentials.');
    process.exit(1);
}

console.log('✅ Environment variables loaded successfully\n');

// Now import Firebase Admin
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
            privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        }),
    });
}

const db = admin.firestore();

// Import data files
const flightsData = require('../data/flights.json');
const hotelsData = require('../data/hotels.json');
const trainsData = require('../data/trains.json');
const busesData = require('../data/buses.json');
const cabsData = require('../data/cabs.json');

async function migrateData() {
    console.log('🚀 Starting Firestore migration...\n');

    const collections = {
        flights: flightsData,
        hotels: hotelsData,
        trains: trainsData,
        buses: busesData,
        cabs: cabsData,
    };

    try {
        for (const [collectionName, items] of Object.entries(collections)) {
            console.log(`📦 Migrating ${collectionName}...`);

            // Use batch writes for efficiency (max 500 per batch)
            const batchSize = 500;
            let batch = db.batch();
            let operationCount = 0;

            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const docRef = db.collection(collectionName).doc(item.id);
                batch.set(docRef, item);
                operationCount++;

                // Commit batch if we hit the limit or it's the last item
                if (operationCount === batchSize || i === items.length - 1) {
                    await batch.commit();
                    console.log(`  ✅ Uploaded ${Math.min(i + 1, items.length)} / ${items.length} items`);

                    // Start a new batch if there are more items
                    if (i < items.length - 1) {
                        batch = db.batch();
                        operationCount = 0;
                    }
                }
            }

            console.log(`✨ Successfully migrated ${items.length} ${collectionName}\n`);
        }

        console.log('🎉 Migration completed successfully!');
        console.log('\nSummary:');
        Object.entries(collections).forEach(([name, items]) => {
            console.log(`  - ${name}: ${items.length} items`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

// Run migration
migrateData();
