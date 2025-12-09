// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDIi4hCD5hYrTmLe2jltp4agRp9FRetCaw",
    authDomain: "compritas-mx.firebaseapp.com",
    projectId: "compritas-mx",
    storageBucket: "compritas-mx.firebasestorage.app",
    messagingSenderId: "275061007174",
    appId: "1:275061007174:web:fff897b32178e27838fb47",
    measurementId: "G-XRNQPK05MQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics
const analytics = getAnalytics(app);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Authentication
const auth = getAuth(app);

export { app, analytics, db, auth };
