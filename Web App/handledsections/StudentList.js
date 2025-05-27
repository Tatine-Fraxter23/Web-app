import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs, doc, getDoc 
} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";

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
const db = getFirestore();

// Get section from sessionStorage (declare it ONCE)
const selectedSection = sessionStorage.getItem("selected-section");


// DOM elements
const sectionTitle = document.getElementById("section-title");
const students = document.getElementById("students");
const sectionSchedule = document.getElementById("section-schedule");


// Fetch and display students
async function fetchStudentsBySection(section) {
  try {
    const studentsRef = collection(db, "StudentList");
    const q = query(studentsRef, where("section", "==", section));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      let html = "";
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        html += `<li>${data.Name} (${data.Email})</li>`;
      });
      students.innerHTML = html;
    } else {
      students.innerHTML = "<li>No students in this section.</li>";
    }
  } catch (error) {
    console.error("Error fetching students:", error);
    students.innerHTML = "<li>Error loading students.</li>";
  }
}

// Display section and call fetch function
if (selectedSection) {
  sectionTitle.textContent = `Section: ${selectedSection}`;
  fetchStudentsBySection(selectedSection);
  fetchSectionSchedule(selectedSection);
} else {
  sectionTitle.textContent = "No section selected.";
  students.innerHTML = "<li>No section selected.</li>";
}

async function fetchSectionSchedule(sectionId) {
  try {
    const sectionDocRef = doc(db, "sections", sectionId); // 👈 collection name must match exactly
    const sectionSnap = await getDoc(sectionDocRef);

    if (sectionSnap.exists()) {
      const data = sectionSnap.data();                                        
      sectionSchedule.textContent = `Schedule: ${data.schedule || "Not set"}`;
    } else {
      sectionSchedule.textContent = "Schedule: Not available";
    }
  } catch (error) {
    console.error("Error fetching section schedule:", error);
    sectionSchedule.textContent = "Schedule: Error loading";
  }
}

