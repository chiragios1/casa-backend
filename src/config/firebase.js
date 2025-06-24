const admin = require('firebase-admin');
const path = require('path');

let serviceAccount;

// In production, use environment variable for service account
if (process.env.NODE_ENV === 'production' && process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  // Decode base64 encoded service account key
  const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const serviceAccountString = Buffer.from(serviceAccountBase64, 'base64').toString('utf-8');
  serviceAccount = JSON.parse(serviceAccountString);
} else {
  // In development, use local file
  serviceAccount = require(path.join(__dirname, '../../serviceAccountKey.json'));
}

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL || "https://casa-49f11-default-rtdb.firebaseio.com/"
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = {
  admin,
  db,
  auth
}; 