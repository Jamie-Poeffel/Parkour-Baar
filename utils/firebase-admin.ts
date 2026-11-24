import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

function getFirestoreInstance(): Firestore {
  if (getApps().length > 0) {
    return getFirestore();
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // `docker run --env-file` keeps the quotes from .env; strip them as well
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(
    /^"|"$/g,
    "",
  ).replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Firebase Admin environment variables are missing.");
  }

  const app = initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });

  return getFirestore(app);
}

export const db = new Proxy({} as Firestore, {
  get(_target, property) {
    const firestore = getFirestoreInstance();
    const value = Reflect.get(firestore, property, firestore);

    return typeof value === "function" ? value.bind(firestore) : value;
  },
});
