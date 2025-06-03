import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-analytics.js";
import {
  getFirestore,
  doc,
  getDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";
import {
  getAuth,
  deleteUser,
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

let UserCred = JSON.parse(sessionStorage.getItem("user-creds"));
let UserInfo = JSON.parse(sessionStorage.getItem("user-info"));

let MsgHead = document.getElementById("msg");
let GreetHead = document.getElementById("greet");
let Signoutbtn = document.getElementById("signoutbutton");
let SectionList = document.getElementById("Sectionlist");

let Signout = () => {
  sessionStorage.removeItem("user-creds");
  sessionStorage.removeItem("user-info");
  window.location.href = "../signin-signup/SignIn.html";
};

let CheckCred = async () => {
  if (!sessionStorage.getItem("user-creds")) {
    window.location.href = "../signin-signup/SignIn.html";
  } else {
    MsgHead.innerText = `${UserCred.email}`;
    GreetHead.innerText = `${UserInfo.Name}`;

    // Fetch from Firestore
    const docRef = doc(db, "UserAuthList", UserCred.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      const section = userData.Section;

      if (Array.isArray(section) && section.length > 0) {
        SectionList.innerHTML = section
          .map((sec) => `<li><button class="section-btn" data-section="${sec}">${sec}</button></li>`)
          .join("");

        document.querySelectorAll(".section-btn").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            const selectedSection = e.target.getAttribute("data-section");
            console.log("Clicked section:", selectedSection);

            // Store in session and redirect to section page
            sessionStorage.setItem("selected-section", selectedSection);
            window.location.href = "../handledsections/handledsec.html";
          });
        });
      } else {
        SectionList.innerHTML = "<li>No section assigned.</li>";
      }
    }
  }
};

window.addEventListener("load", CheckCred);
Signoutbtn.addEventListener("click", Signout);

let DeleteBtn = document.getElementById("deleteAccount");

DeleteBtn.addEventListener("click", async () => {
  const user = auth.currentUser;

  if (user) {
    try {
      // Delete Firestore document first
      const userDocRef = doc(db, "UserAuthList", user.uid);
      await deleteDoc(userDocRef);
      console.log("Firestore document deleted");

      // Then delete user from Firebase Authentication
      await deleteUser(user);
      alert("Your account has been deleted.");

      // Clear session and redirect
      sessionStorage.clear();
      window.location.href = ".../signin-signup/SignIn.html";
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account. You might need to re-authenticate.");
    }
  } else {
    alert("No user is currently signed in.");
  }
});

const dropdownToggle = document.querySelector(".dropdown-toggle");
  const dropdownMenu = document.querySelector(".dropdown-menu");

  dropdownToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdownMenu.style.display = dropdownMenu.style.display === "flex" ? "none" : "flex";
  });

  document.addEventListener("click", (e) => {
    if (!dropdownMenu.contains(e.target)) {
      dropdownMenu.style.display = "none";
    }
  });

