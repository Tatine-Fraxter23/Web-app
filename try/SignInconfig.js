// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-analytics.js";
import {
  getFirestore,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";
import {
  getAuth,
  signInWithEmailAndPassword,
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
let Mainform = document.getElementById("mainform");

let SignInUser = (evt) => {
  evt.preventDefault();

  signInWithEmailAndPassword(auth, Emailinp.value, Passinp.value)
    .then(async (credentials) => {
      var ref = doc(db, "UserAuthList", credentials.user.uid);
      const docSnap = await getDoc(ref);

      if (docSnap.exists) {
        // Save user data to session storage
        sessionStorage.setItem(
          "user-info",
          JSON.stringify({
            Name: docSnap.data().Name,
          })
        );
        sessionStorage.setItem("user-creds", JSON.stringify(credentials.user));

        // Make sure the data is set before redirection
        setTimeout(() => {
          window.location.href = "homepage.html"; // Redirect to homepage after a short delay
        }, 500); // delay to allow sessionStorage to update
      } else {
        console.log("No such document!");
      }
    })

    .catch((error) => {
      alert(error.message);
      console.log(error.code);
      console.log(error.message);
    });
};

Mainform.addEventListener("submit", SignInUser);
