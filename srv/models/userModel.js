import { db } from "../db/connection.js";

export const findUsers = async () => {
    const snapshot = await db.collection("accounts").get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const findUserById = async (id) => {
    const doc = await db.collection("accounts").doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
};

export const findUserByEmail = async (email) => {
    const querySnapshot = await db
        .collection("accounts")
        .where("email", "==", email.toLowerCase())
        .get();

    if (querySnapshot.empty) return null;

    const userDoc = querySnapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() };
};


export const createUser = async (user) => {
    const docRef = await db.collection("accounts").add(user);
    return docRef.id;
};

export const updateUser = async (id, user) => {
    await db.collection("accounts").doc(id).update(user);
};

export const deleteUser = async (id) => {
    await db.collection("accounts").doc(id).delete();
};
