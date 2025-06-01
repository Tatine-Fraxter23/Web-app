import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";
import {
  getDatabase,
  ref,
  onValue,
  get,
} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-database.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA08wDjyAB6Xt1V5WAclVsGpzR8GwNOSHo",
  authDomain: "mobile-app-52620.firebaseapp.com",
  databaseURL:
    "https://mobile-app-52620-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mobile-app-52620",
  storageBucket: "mobile-app-52620.appspot.com",
  messagingSenderId: "866255091750",
  appId: "1:866255091750:web:0f494d11d647de5a408ee7",
  measurementId: "G-3CNCPFYTKZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const rtdb = getDatabase();

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}


function getTodayInfo() {
  const today = new Date();
  const isoDate = today.toISOString().split("T")[0];

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayName = daysOfWeek[today.getDay()];

  const formattedDate = `${dayName} – ${today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })}`;

  return { isoDate, formattedDate };
}

// Get section from sessionStorage
const selectedSection = sessionStorage.getItem("selected-section");
const currentDayDateLabel = document.getElementById("current-day-date");
// DOM elements
const sectionTitle = document.getElementById("section-title");
const students = document.getElementById("students");
const sectionSchedule = document.getElementById("section-schedule");
const graphContainer = document.getElementById("attendance-graph");
const scannedInStudentsList = document.getElementById(
  "scanned-in-students-list"
);
const scannedInContainer = document.getElementById(
  "scanned-in-students-container"
);

// Initially hide the scanned in students container
scannedInContainer.style.display = "none";

let scannedInStudents = [];
let chartInstance = null;

let currentDate = getTodayDate();

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
  const { formattedDate } = getTodayInfo();
  sectionTitle.textContent = `Section: ${selectedSection}`;

  fetchStudentsBySection(selectedSection);
  fetchSectionSchedule(selectedSection);
  listenToAttendance(selectedSection);
} else {
  sectionTitle.textContent = "No section selected.";
  students.innerHTML = "<li>No section selected.</li>";
}

async function fetchSectionSchedule(sectionId) {
  const profUid = sessionStorage.getItem("professor-uid");

  if (!profUid) {
    sectionSchedule.textContent = "Professor ID not found.";
    return;
  }

  try {
    const profDocRef = doc(db, "sections", sectionId, "professors", profUid);
    const profSnap = await getDoc(profDocRef);

    if (profSnap.exists()) {
      const data = profSnap.data();
      sectionSchedule.textContent = `Schedule: ${
        data.schedule || "Not set"
      } | Subject: ${data.subject || "N/A"}`;
    } else {
      sectionSchedule.textContent =
        "Schedule: No data found for this professor.";
    }
  } catch (error) {
    console.error("Error fetching section schedule:", error);
    sectionSchedule.textContent = "Schedule: Error loading";
  }
}

// Listen to attendance realtime updates
let currentIsoDate = getTodayDate();

function listenToAttendance(sectionId) {
  const attendanceRef = ref(rtdb, "attendance");

  onValue(attendanceRef, (snapshot) => {
    const todayInfo = getTodayInfo();
    const isoDate = todayInfo.isoDate;
    const formattedDate = todayInfo.formattedDate;
    currentIsoDate = isoDate;

    let count = 0;
    scannedInStudents = [];

    snapshot.forEach((uidSnap) => {
      uidSnap.forEach((entrySnap) => {
        const data = entrySnap.val();

        if (
          data.section === sectionId &&
          data.status === "TIME IN" &&
          data.timestamp &&
          data.timestamp.startsWith(isoDate)
        ) {
          count++;
          if (data.Name && !scannedInStudents.includes(data.Name)) {
            scannedInStudents.push(data.Name);
          }
        }
      });
    });

    renderGraph(count, formattedDate);
    if (currentDayDateLabel) currentDayDateLabel.textContent = formattedDate;
  });
}

async function fetchAttendanceOnce(sectionId) {
  const attendanceRef = ref(rtdb, "attendance");
  const snapshot = await get(attendanceRef);
  const todayInfo = getTodayInfo();
  const isoDate = todayInfo.isoDate;
  const formattedDate = todayInfo.formattedDate;

  let count = 0;
  scannedInStudents = [];

  snapshot.forEach((uidSnap) => {
    uidSnap.forEach((entrySnap) => {
      const data = entrySnap.val();

      if (
        data.section === sectionId &&
        data.status === "TIME IN" &&
        data.timestamp &&
        data.timestamp.startsWith(isoDate)
      ) {
        count++;
        if (data.Name && !scannedInStudents.includes(data.Name)) {
          scannedInStudents.push(data.Name); // ✅ This must execute
        }
      }
    });
  });

  renderGraph(count, formattedDate);
  if (currentDayDateLabel) currentDayDateLabel.textContent = formattedDate;
}

// Render Attendance Graph with click to toggle scanned-in list
let lastCount = null;
let lastLabel = null;

function renderGraph(count, label) {
  // Always allow updating the list, even if the graph doesn’t change
  lastCount = count;
  lastLabel = label;

  const ctx = document.getElementById("attendance-graph").getContext("2d");

  if (chartInstance !== null) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: [label],
      datasets: [
        {
          label: "Number of Time Ins",
          data: [count],
          backgroundColor: "#7EC8E3", // soft sky blue
          borderRadius: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#EAEAEA", // light gray text
            font: {
              size: 14,
              weight: "bold",
            },
          },
        },
        tooltip: {
          backgroundColor: "#2A2D37", // dark tooltip bg
          titleColor: "#FFFFFF",
          bodyColor: "#C3B1E1", // lavender tooltip text
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#EAEAEA",
            font: {
              weight: "bold",
              size: 14,
            },
          },
          grid: {
            color: "#5A5E87", // subtle bluish grid lines
          },
        },
        y: {
          beginAtZero: true,
          precision: 0,
          ticks: {
            color: "#EAEAEA",
            font: {
              weight: "bold",
              size: 14,
            },
          },
          grid: {
            color: "#5A5E87",
          },
        },
      },
      onClick: toggleScannedInList,
    },
  });
}

// Toggle showing/hiding the list of scanned-in students
async function toggleScannedInList() {
  if (scannedInContainer.style.display === "none") {
    // Re-fetch attendance before showing the list
    await fetchAttendanceOnce(selectedSection);

    scannedInContainer.style.display = "block";
    populateScannedInList();
  } else {
    scannedInContainer.style.display = "none";
  }
}

// Populate the scanned-in students list in the DOM
function populateScannedInList() {
  scannedInStudentsList.innerHTML = "";

  if (scannedInStudents.length === 0) {
    scannedInStudentsList.innerHTML = "<li>No students scanned in today.</li>";
    return;
  }

  scannedInStudents.forEach((name) => {
    const li = document.createElement("li");
    li.textContent = name;
    scannedInStudentsList.appendChild(li);
  });
}

// 🟢 The refresh button code has been removed from here

document
  .getElementById("download-csv-btn")
  .addEventListener("click", async () => {
    const selectedDate = document.getElementById("attendance-date").value;
    if (!selectedDate) {
      alert("Please select a date before downloading.");
      return;
    }

    const attendanceRef = ref(rtdb, "attendance");
    const snapshot = await get(attendanceRef);

    const rows = [["name", "timein", "date", "section"]]; // Header row

    snapshot.forEach((uidSnap) => {
      uidSnap.forEach((entrySnap) => {
        const data = entrySnap.val();

        if (
          data.Name &&
          data.timestamp &&
          data.section === selectedSection &&
          data.status === "TIME IN" &&
          data.timestamp.includes(" ")
        ) {
          const [date, time] = data.timestamp.split(" ");
          if (date === selectedDate) {
            rows.push([data.Name, time, date, data.section]);
          }
        }
      });
    });

    if (rows.length === 1) {
      alert("No attendance data found for the selected date.");
      return;
    }

    function escapeCsvField(field) {
      if (typeof field !== "string") field = String(field);
      return `"${field.replace(/"/g, '""')}"`;
    }

    const csvContent = rows
      .map((row) => row.map(escapeCsvField).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `attendance_${selectedSection}_${selectedDate}.csv`
    );
    link.style.display = "none";
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
  });
