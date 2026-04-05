import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBimt_sG4HKonL4_zhhr08ORyifXcbTxkw",
  authDomain: "ifly-tour.firebaseapp.com",
  projectId: "ifly-tour",
  storageBucket: "ifly-tour.firebasestorage.app",
  messagingSenderId: "585935452667",
  appId: "1:585935452667:web:cdee2ed2ec8f7f5f39f35e",
  measurementId: "G-DG1K381WET"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);