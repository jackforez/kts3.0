// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDezmggebYCHL8Rdz42uBgnh32XbJ0JZCE",
  authDomain: "ktscorp-f5af2.firebaseapp.com",
  projectId: "ktscorp-f5af2",
  storageBucket: "ktscorp-f5af2.appspot.com",
  messagingSenderId: "684504447855",
  appId: "1:684504447855:web:739df110337e841c73469a",
  measurementId: "G-920CW595GD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
