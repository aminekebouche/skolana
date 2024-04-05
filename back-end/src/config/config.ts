import dotenv from 'dotenv';
dotenv.config();
const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 1337;
const MONGO_USERNAME = process.env.MANGO_USERNAME || '';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '';
const MONGO_ENDURL = process.env.MONGO_ENDURL;
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_ENDURL}.mongodb.net`;
const BCRYPT_SALT = process.env.BCRYPT_SALT ? Number(process.env.BCRYPT_SALT) : 5;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const CLIENT_URL = process.env.CLIENT_URL || '';
const JWTSECRET = process.env.JWTSECRET || 'foo';
const API_KEY = process.env.API_KEY || '';
const AUTH_DOMAIN = process.env.AUTH_DOMAIN || '';
const PROJECT_ID = process.env.PROJECT_ID || '';
const FIRESTORE_DB_URL = process.env.FIRESTORE_DB_URL || '';
const STORAGE_BUCKET = process.env.STORAGE_BUCKET || '';
const MESSAGING_SENDER_ID = process.env.MESSAGING_SENDER_ID || '';
const MEASUREMENT_ID = process.env.MEASUREMENT_ID || '';

export const config = {
    mongo: {
        url: MONGO_URL
    },
    server: {
        port: SERVER_PORT
    },
    salt: {
        round: BCRYPT_SALT
    },
    google: {
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET
    },
    client: {
        url: CLIENT_URL
    },
    jwt: {
        secret: JWTSECRET
    },
    firebaseConfig: {
        apiKey: API_KEY,
        authDomain: AUTH_DOMAIN,
        projectId: PROJECT_ID,
        storageBucket: FIRESTORE_DB_URL,
        messagingSenderId: STORAGE_BUCKET,
        appId: MESSAGING_SENDER_ID,
        measurementId: MEASUREMENT_ID
    }
};
