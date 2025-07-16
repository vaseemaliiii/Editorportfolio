// Smooth Scroll
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// Free Plan Activation
function activateFree() {
  alert("Free plan activated! Limited uploads allowed.");
  localStorage.setItem('plan', 'free');
}

// Show UPI Modal
function showUPIModal() {
  document.getElementById('upiModal').style.display = 'flex';
}
function closeUPIModal() {
  document.getElementById('upiModal').style.display = 'none';
}

// AUTH LOGIC
const users = JSON.parse(localStorage.getItem('users')) || [];

document.getElementById('authForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  let user = users.find(u => u.email === email);
  if (user) {
    if (user.password === password) {
      alert("Login Successful!");
    } else {
      alert("Wrong Password!");
    }
  } else {
    users.push({ email, password, plan: 'free' });
    localStorage.setItem('users', JSON.stringify(users));
    alert("Account Created & Logged In!");
  }
});

// ADMIN LOGIN
const adminEmail = "vaseemali0909@gmail.com";
const adminPassword = "Admin@123";

document.getElementById('adminLoginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('adminEmail').value;
  const password = document.getElementById('adminPassword').value;

  if (email === adminEmail && password === adminPassword) {
    alert("Admin Logged In!");
    document.getElementById('adminDashboard').style.display = 'block';
    loadUsers();
  } else {
    alert("Invalid Admin Credentials!");
  }
});

function loadUsers() {
  const userList = document.getElementById('userList');
  userList.innerHTML = '';
  users.forEach((u, index) => {
    const div = document.createElement('div');
    div.innerHTML = `${u.email} - Plan: ${u.plan} <button onclick="makePremium(${index})">Make Premium</button>`;
    userList.appendChild(div);
  });
}

function makePremium(index) {
  users[index].plan = 'premium';
  localStorage.setItem('users', JSON.stringify(users));
  loadUsers();
  alert("User upgraded to Premium!");
    }
