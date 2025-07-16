// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "editorportfolio-e0034.firebaseapp.com",
  projectId: "editorportfolio-e0034",
  storageBucket: "editorportfolio-e0034.appspot.com",
  messagingSenderId: "48365121711",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();

// Signup
document.getElementById("signupBtn")?.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  await createUserWithEmailAndPassword(auth, email, password);
  alert("Account created!");
  window.location.href = "dashboard.html";
});

// Login
document.getElementById("loginBtn")?.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  await signInWithEmailAndPassword(auth, email, password);
  alert("Logged in!");
  window.location.href = "dashboard.html";
});

// Google Login
document.getElementById("googleLogin")?.addEventListener("click", async () => {
  await signInWithPopup(auth, provider);
  alert("Google Login Success!");
  window.location.href = "dashboard.html";
});

// Logout
function logout() {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
                                                         }
