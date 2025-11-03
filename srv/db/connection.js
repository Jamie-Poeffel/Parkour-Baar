import admin from "firebase-admin";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const serviceAccount = require("./../credentials/parcourbaar-firebase-adminsdk-fbsvc-ec24814725.json");

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

export const db = admin.firestore();
