import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-analytics.js";
import {
  getFirestore,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";
import {
  getAuth,
} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA08wDjyAB6Xt1V5WAclVsGpzR8GwNOSHo",
  authDomain: "mobile-app-52620.firebaseapp.com",
  databaseURL: "https://mobile-app-52620-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mobile-app-52620",
  storageBucket: "mobile-app-52620.appspot.com",
  messagingSenderId: "866255091750",
  appId: "1:866255091750:web:0f494d11d647de5a408ee7",
  measurementId: "G-3CNCPFYTKZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

// Get session user data
let UserCred = JSON.parse(sessionStorage.getItem("user-creds"));

// SectionList element
let SectionList = document.getElementById("Sectionlist");

// ✅ Section Fetcher Function
async function fetchUserSections(uid) {
  try {
    const docRef = doc(db, "UserAuthList", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      const section = userData.section;

      if (Array.isArray(section) && section.length > 0) {
        SectionList.innerHTML = section
          .map(
            (sec) => `<li><button class="button" data-section="${sec}">${sec}</button></li>`
          )
          .join("");

        document.querySelectorAll(".button").forEach((btn) => {
          btn.addEventListener("click", (e) => {
            const selectedSection = e.target.getAttribute("data-section");
            console.log("Clicked section:", selectedSection);
            sessionStorage.setItem("selected-section", selectedSection);
            window.location.href = "../signin-signup/SignIn.html";
          });
        });
      } else {
        SectionList.innerHTML = "<li>No section assigned.</li>";
      }
    } else {
      SectionList.innerHTML = "<li>User data not found.</li>";
    }
  } catch (error) {
    console.error("Error fetching sections:", error);
    SectionList.innerHTML = "<li>Error loading sections.</li>";
  }
}

// ✅ Call the function (only if user is logged in)
if (UserCred && UserCred.uid) {
  fetchUserSections(UserCred.uid);
} else {
  window.location.href = "../signin-signup/SignIn.html"; // redirect if not logged in
}
