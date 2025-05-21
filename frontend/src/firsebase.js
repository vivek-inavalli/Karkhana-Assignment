import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBMbzPpcodLUGOlKKqAX3hOgt6vNI0E94o",
  authDomain: "project-cost-tracker-7ba44.firebaseapp.com",
  projectId: "project-cost-tracker-7ba44",
  storageBucket: "project-cost-tracker-7ba44.appspot.com",
  messagingSenderId: "694264052176",
  appId: "1:694264052176:web:99846ad268de3d1761a1d5",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const getItemsFromFirebase = async (userId) => {
  const itemsRef = collection(db, "users", userId, "items");
  const snapshot = await getDocs(itemsRef);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getOtherCostsFromFirebase = async (userId) => {
  const costsRef = collection(db, "users", userId, "otherCosts");
  const snapshot = await getDocs(costsRef);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
