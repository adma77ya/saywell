// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDdWn7b-CKQ48C3uOZCapCoqYWlW9H4sgA",
  authDomain: "saywell-5320c.firebaseapp.com",
  projectId: "saywell-5320c",
  storageBucket: "saywell-5320c.appspot.com",
  messagingSenderId: "481228489249",
  appId: "1:481228489249:web:42e45a275902c7d71f1960"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable logging in development
if (process.env.NODE_ENV === 'development') {
  console.log('Firebase initialized with config:', firebaseConfig);
}

export default app;