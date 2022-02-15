import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBqONMb27lsY2Jlnz8v_Q7LvFZ4TU2jDu8",
  authDomain: "fir-app-ea974.firebaseapp.com",
  projectId: "fir-app-ea974",
  storageBucket: "fir-app-ea974.appspot.com",
  messagingSenderId: "798169977201",
  appId: "1:798169977201:web:c12541e727e6bd7119a6d0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
