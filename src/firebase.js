// ╔══════════════════════════════════════════════════════════════╗
// ║   PASO 1: Pega aquí tu configuración de Firebase             ║
// ║   Ve a: console.firebase.google.com                          ║
// ║   → Tu proyecto → Configuración ⚙️ → Tus apps → Config      ║
// ╚══════════════════════════════════════════════════════════════╝

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCd2Odf0kvDh5nkX5CWcS0pKdItayaYsv8",
  authDomain: "tickets-feab1.firebaseapp.com",
  databaseURL: "https://tickets-feab1-default-rtdb.firebaseio.com",
  projectId: "tickets-feab1",
  storageBucket: "tickets-feab1.firebasestorage.app",
  messagingSenderId: "550027708700",
  appId: "1:550027708700:web:a2d9ac35a8b076f475d2d9",
  measurementId: "G-CEMLC32TGK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const analytics = getAnalytics(app);