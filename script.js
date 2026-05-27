// =======================
// FIREBASE IMPORTS
// =======================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { 
  getFirestore, 
  collection, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy 
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


// =======================
// INIT
// =======================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let currentUserId = null;


// =======================
// AUTH
// =======================
signInAnonymously(auth)
  .then(() => {
    console.log("Anonymous login started");
  })
  .catch((error) => {
    console.error("AUTH ERROR:", error);
    alert("Internet/Auth issue. Try refreshing.");
  });

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUserId = user.uid;
    console.log("User ID:", currentUserId);

    loadCards();
    initSearch();

  } else {
    console.log("No user");
  }
});


// =======================
// LOAD CARDS
// =======================
function loadCards() {
  const container = document.getElementById("cardContainer");

  if (!container) return;

  const q = query(collection(db, "posts"), orderBy("time", "desc"));

  onSnapshot(q, (snapshot) => {

    container.innerHTML = "";

    if (snapshot.empty) {
      container.innerHTML = "<p>No posts yet 🚀</p>";
      return;
    }

    snapshot.forEach((docSnap) => {
      const item = docSnap.data();
      const id = docSnap.id;

      const card = document.createElement("div");
      card.className = "card " + item.type;

      card.innerHTML = `
        <div class="card-top">
          <span class="badge ${item.type}">
            ${item.type === "offer" ? "SKILL" : "NEED"}
          </span>
        </div>

        <h3 class="card-title">${item.skill}</h3>
        <p class="card-desc">${item.description}</p>

        <div class="card-bottom">
          <span class="time">${item.name}</span>
          <button class="contact-btn">Contact</button>
        </div>

        <button class="delete-btn">Delete</button>
      `;

      container.appendChild(card);

      // CONTACT BUTTON
      card.querySelector(".contact-btn").onclick = () => {
        window.open(`https://wa.me/${item.contact}`);
      };

      // DELETE BUTTON (only owner)
      const deleteBtn = card.querySelector(".delete-btn");

      if (item.userId === currentUserId) {
        deleteBtn.onclick = async () => {
          await deleteDoc(doc(db, "posts", id));
        };
      } else {
        deleteBtn.style.display = "none";
      }
    });
  });
}


// =======================
// SEARCH
// =======================
function initSearch() {
  const searchBar = document.getElementById("searchBar");

  if (!searchBar) return;

  searchBar.addEventListener("input", () => {
    const val = searchBar.value.toLowerCase();

    document.querySelectorAll(".card").forEach(card => {
      card.style.display = card.innerText.toLowerCase().includes(val)
        ? ""
        : "none";
    });
  });
}


// =======================
// FILTER
// =======================
window.filterCards = function(type) {
  document.querySelectorAll(".card").forEach(card => {
    if (type === "all" || card.classList.contains(type)) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
};