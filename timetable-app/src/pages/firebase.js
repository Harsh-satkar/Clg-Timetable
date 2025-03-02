// firebase.js
dotenv.config();
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore"; 
import dotenv from 'dotenv';

const firebaseConfig = {
  apiKey: "AIzaSyDGLfo5fSsnDNwg-m6lgu95zFSBv2xFxeg",
  authDomain: "timetable-app-7ff8d.firebaseapp.com",
  projectId: "timetable-app-7ff8d",
  storageBucket: "timetable-app-7ff8d.firebasestorage.app",
  messagingSenderId: "404137538059",
  appId: "1:404137538059:web:891cd9dac74c7a8ecb8d0e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc };
//3GaNKMWTwodJHsjT2WKt
