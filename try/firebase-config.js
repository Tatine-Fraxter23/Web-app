// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-analytics.js";
import {
  getDatabase,
  ref,
  set,
  child,
  get,
} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-database.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA08wDjyAB6Xt1V5WAclVsGpzR8GwNOSHo",
  authDomain: "mobile-app-52620.firebaseapp.com",
  databaseURL:
    "https://mobile-app-52620-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mobile-app-52620",
  storageBucket: "mobile-app-52620.firebasestorage.app",
  messagingSenderId: "866255091750",
  appId: "1:866255091750:web:0f494d11d647de5a408ee7",
  measurementId: "G-3CNCPFYTKZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getDatabase();
const auth = getAuth(app);

let Emailinp = document.getElementById('emailinp');
let Passinp = document.getElementById('passwordinp');
let Fullname = document.getElementById('fullnameinp');
let Mainform = document.getElementById('mainform');

let RegisterUser = evt => {
    evt.preventDefault();

    createUserWithEmailAndPassword(auth, Emailinp.value, Passinp.value)
    .then((credentials) => {
        console.log(credentials);
    })
    .catch((error) => {
        alert(error.message);
        console.log(error.code);
        console.log(error.message);
    })
}

Mainform.addEventListener('submit', RegisterUser)