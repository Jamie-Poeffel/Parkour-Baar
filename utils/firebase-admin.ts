import admin from "firebase-admin";
import type { Firestore } from "firebase-admin/firestore";

function getFirestoreInstance(): Firestore {
  if (admin.apps.length > 0) {
    return admin.firestore();
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Firebase Admin environment variables are missing.");
  }

  const app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });

  return app.firestore();
}

export const db = new Proxy({} as Firestore, {
  get(_target, property) {
    const firestore = getFirestoreInstance();
    const value = Reflect.get(firestore, property, firestore);

    return typeof value === "function" ? value.bind(firestore) : value;
  },
});
