// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"
import firebase from "firebase/compat/app"
import "firebase/compat/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC5ioWcfIFelAQ3HHO4P-pQe6Vz3l6HEbI",
    authDomain: "creativeproject-7d8d0.firebaseapp.com",
    projectId: "creativeproject-7d8d0",
    storageBucket: "creativeproject-7d8d0.appspot.com",
    messagingSenderId: "25581315797",
    appId: "1:25581315797:web:479fdd622e23179deda45c",
    measurementId: "G-3BD4Y1NVYR"
};

// Init ialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore();
export const storage = getStorage(app);
// firebase.initializeApp(firebaseConfig);
// export const db2 = firebase.firestore();
export default app;