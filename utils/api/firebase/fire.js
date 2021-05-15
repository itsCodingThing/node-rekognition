import { readFileSync } from "fs";
import admin from "firebase-admin";

const firebaseCredentials = JSON.parse(readFileSync("firebase.json"));

admin.initializeApp({
    credential: admin.credential.cert(firebaseCredentials),
});

export const firestoreDB = admin.firestore();
