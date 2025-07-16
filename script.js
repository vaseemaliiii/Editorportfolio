let users = JSON.parse(localStorage.getItem('users')) || [];

// Signup
function signup() {
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const plan = document.getElementById('planSelect').value;

  users.push({ name, email, password, plan });
  localStorage.setItem('users', JSON.stringify(users));
  alert('Signup Successful');
  window.location.href = 'login.html';
}

// Login
function login() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    localStorage.setItem('loggedUser', JSON.stringify(user));
    window.location.href = 'dashboard.html';
  } else {
    alert('Invalid Credentials');
  }
}

// Dashboard
if (window.location.pathname.includes('dashboard.html')) {
  const user = JSON.parse(localStorage.getItem('loggedUser'));
  if (user) {
    document.getElementById('planInfo').innerText = `Your Plan: ${user.plan}`;
  }
}

// Logout
function logout() {
  localStorage.removeItem('loggedUser');
  window.location.href = 'index.html';
}

// Admin Login
function adminLogin() {
  const email = document.getElementById('adminEmail').value;
  const pass = document.getElementById('adminPass').value;

  if (email === 'vaseemali0909@gmail.com' && pass === 'admin123') {
    document.getElementById('adminSection').style.display = 'block';
    renderUsers();
  } else {
    alert('Wrong Admin Credentials');
  }
}

function renderUsers() {
  let list = '';
  users.forEach((u, index) => {
    list += `<p>${u.name} (${u.email}) - ${u.plan} <button onclick="makePremium(${index})">Make Premium</button></p>`;
  });
  document.getElementById('userList').innerHTML = list;
}

function makePremium(index) {
  users[index].plan = 'premium';
  localStorage.setItem('users', JSON.stringify(users));
  alert('User Upgraded to Premium');
  renderUsers();
}

// Google Login Placeholder
function googleLogin() {
  alert('Google Login Coming Soon!');
      }
