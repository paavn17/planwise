// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = { 
  apiKey: "AIzaSyDyDHvyvY83hyfBNq2YCFyCOwL1mf3OrRg",
  authDomain: "planwise-39abd.firebaseapp.com",
  projectId: "planwise-39abd",
  storageBucket: "planwise-39abd.firebasestorage.app",
  messagingSenderId: "387772750180",
  appId: "1:387772750180:web:ad986cd9a6ab445d2dc271",
  measurementId: "G-R0XE38PT8M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const db = getFirestore(app);

export { app , auth, db}