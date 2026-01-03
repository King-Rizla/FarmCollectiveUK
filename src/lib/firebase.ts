
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-I_BWoJnc_U5AZ2FxpwLqoYCqwdE8MkM",
  authDomain: "farmcollective-fcuk.firebaseapp.com",
  projectId: "farmcollective-fcuk",
  storageBucket: "farmcollective-fcuk.firebasestorage.app",
  messagingSenderId: "87982265910",
  appId: "1:87982265910:web:4d4ad50dda89f77ce12a97"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
