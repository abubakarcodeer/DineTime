// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC4RPuHyoYjghLAhhKknLt4KtHvv5MEcNM",
  authDomain: "netflix-clone-adb5e.firebaseapp.com",
  projectId: "netflix-clone-adb5e",
  storageBucket: "netflix-clone-adb5e.firebasestorage.app",
  messagingSenderId: "869584238707",
  appId: "1:869584238707:web:d742cc40ebe888518d1206",
  measurementId: "G-LZPKE05JGB"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db =  getFirestore(app)
export const auth = getAuth(app)


