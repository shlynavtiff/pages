// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, sendPasswordResetEmail } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA1VoJgNTtZJ_Y_zAbTUvuukv8mrFddadI",
  authDomain: "pagesapp-65612.firebaseapp.com",
  projectId: "pagesapp-65612",
  storageBucket: "pagesapp-65612.firebasestorage.app",
  messagingSenderId: "531855325201",
  appId: "1:531855325201:web:5589a94ca38bfc3f9c59b0",
  measurementId: "G-HXXG6478T8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider();

export {app, auth, signInWithPopup, provider, signOut, sendPasswordResetEmail}