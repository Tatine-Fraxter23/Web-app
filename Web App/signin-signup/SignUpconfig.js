// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-analytics.js";
import {
  getFirestore,
  doc,
  setDoc, collection, query, where, getDocs
} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";
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

const db = getFirestore();
const auth = getAuth(app);

let Emailinp = document.getElementById("emailinp");
let Passinp = document.getElementById("passwordinp");
let Fullname = document.getElementById("fullnameinp");
let Mainform = document.getElementById("mainform");

function isValidName(name) {
  const regex = /^[A-Za-z\s]+$/;
  return regex.test(name);
}


let RegisterUser = async (evt) => {
  evt.preventDefault();

  if (!isValidName(Fullname.value)) {
    alert("Name can only contain letters and spaces. Please enter a valid name.");
    return;
  }

  // Check if name already exists in Firestore
  const nameQuery = await getDocs(
    query(collection(db, "UserAuthList"), where("Name", "==", Fullname.value))
  );

  if (!nameQuery.empty) {
    alert("This name is already in use. Please choose another name.");
    return; // stop registration
  }

  // If name is unique, proceed with registration
  createUserWithEmailAndPassword(auth, Emailinp.value, Passinp.value)
    .then(async (credentials) => {
      var ref = doc(db, "UserAuthList", credentials.user.uid);
      await setDoc(ref, {
        Name: Fullname.value,
        Email: Emailinp.value,
      });

      alert("Registration complete! You can sign in now.");
      window.location.href = "SignIn.html"; // redirect to sign-in page
    })
    .catch((error) => {
      if (error.code === "auth/email-already-in-use") {
        alert(
          "This email is already registered. Please use another email or login."
        );
      } else {
        alert(error.message);
      }
      console.log(error.code);
      console.log(error.message);
    });
};

Mainform.addEventListener("submit", RegisterUser);
