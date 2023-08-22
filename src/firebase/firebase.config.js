import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore";
import { getAuth } from "firebase/auth";
// import firebase from 'firebase/compat/app';
// import firebaseui from 'firebaseui'
// import 'firebaseui/dist/firebaseui.css'
// import { require } from "firebase/firebaseui";

const firebaseConfig = {
  apiKey: "AIzaSyD3qhCuvAh6_JEBR5onnOC8alJziRMswjk",
  authDomain: "receptura-f8c2f.firebaseapp.com",
  databaseURL: "https://receptura-f8c2f-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "receptura-f8c2f",
  storageBucket: "receptura-f8c2f.appspot.com",
  messagingSenderId: "735022595038",
  appId: "1:735022595038:web:deb1f2ba5f184e5302fb4f",
  measurementId: "G-F0VP1DFVB3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
// console.log("auth=" , auth)


export { db, auth}