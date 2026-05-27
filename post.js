// =======================
// FIREBASE IMPORTS
// =======================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { 
  getFirestore, 
  collection, 
  addDoc 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";

const analytics = getAnalytics(app);

// =======================
// FIREBASE CONFIG
// =======================
const firebaseConfig = {
  apiKey: "AIzaSyCao1vBN_1P1HNXtp-nTxrhiFEMpre3E4A",
  authDomain: "skillyn-59950.firebaseapp.com",
  projectId: "skillyn-59950",
  storageBucket: "skillyn-59950.firebasestorage.app",
  messagingSenderId: "995899387926",
  appId: "1:995899387926:web:7f56395452f7c6dc9a4537",
  measurementId: "G-FQNC8C7YG7"
};

logEvent(analytics, "test_event");
// =======================
// INIT
// =======================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let currentUserId = null;


// =======================
// WAIT FOR PAGE LOAD
// =======================
document.addEventListener("DOMContentLoaded", () => {

  const skillBtn = document.getElementById("skillBtn");
  const demandBtn = document.getElementById("demandBtn");
  const offerBtn = document.getElementById("offerBtn");
  const askBtn = document.getElementById("askBtn");

  // Disable initially
  skillBtn.disabled = true;
  demandBtn.disabled = true;

  // Toggle
  offerBtn.onclick = showOffer;
  askBtn.onclick = showAsk;

  // Auth
 signInAnonymously(auth)
  .then(() => {
    console.log("Anonymous login started");
  })
  .catch((error) => {
    console.error("AUTH ERROR:", error);
    alert("Internet issue. Try switching network.");
  });

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUserId = user.uid;
    console.log("User ID:", currentUserId);

    document.getElementById("skillBtn").disabled = false;
    document.getElementById("demandBtn").disabled = false;
  } else {
    console.log("No user");
  }
});

  // Submit
  skillBtn.onclick = submitOffer;
  demandBtn.onclick = submitAsk;
});


// =======================
// TOGGLE
// =======================
function showOffer() {
  document.getElementById("offerForm").classList.remove("hidden");
  document.getElementById("askForm").classList.add("hidden");
}

function showAsk() {
  document.getElementById("askForm").classList.remove("hidden");
  document.getElementById("offerForm").classList.add("hidden");
}


// =======================
// SUBMIT OFFER
// =======================
async function submitOffer() {
  if (!currentUserId) {
    alert("Still loading... wait 1 second and try again");
    return;
  }

  const name = document.getElementById("offerName").value.trim();
  const skill = document.getElementById("offerSkill").value.trim();
  const desc = document.getElementById("offerDesc").value.trim();
  const contact = document.getElementById("offerContact").value.trim();

  if (!name || !skill || !desc || !contact) {
    alert("Please fill all fields");
    return;
  }

  try {
    await addDoc(collection(db, "posts"), {
      type: "offer",
      name,
      skill,
      description: desc,
      contact,
      userId: currentUserId,
      time: Date.now()
    });

    alert("Offer Posted!");
    window.location.href = "index.html";

  } catch (err) {
    console.error("POST ERROR:", err);
    alert(err.message);
  }
}


// =======================
// SUBMIT ASK
// =======================
async function submitAsk() {
  if (!currentUserId) {
    alert("Still loading... wait 1 second and try again");
    return;
  }

  const name = document.getElementById("askName").value.trim();
  const skill = document.getElementById("askSkill").value.trim();
  const desc = document.getElementById("askDesc").value.trim();
  const contact = document.getElementById("askContact").value.trim();

  if (!name || !skill || !desc || !contact) {
    alert("Please fill all fields");
    return;
  }

  try {
    await addDoc(collection(db, "posts"), {
      type: "ask",
      name,
      skill,
      description: desc,
      contact,
      userId: currentUserId,
      time: Date.now()
    });

    alert("Ask Posted!");
    window.location.href = "index.html";

  } catch (err) {
    console.error("POST ERROR:", err);
    alert(err.message);
  }
}