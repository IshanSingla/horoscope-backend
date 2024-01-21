import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

// Ensure environment variables are loaded (use dotenv or similar if needed)
// require('dotenv').config(); // Uncomment this line if you are using dotenv

const serviceAccount = require('../../firebase-admin.json');



// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export default admin;
