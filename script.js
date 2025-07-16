/* ========= GLOBAL STORAGE HELPERS ========= */
function getUsers(){
  return JSON.parse(localStorage.getItem('ep_users') || '[]');
}
function saveUsers(users){
  localStorage.setItem('ep_users', JSON.stringify(users));
}
function setLoggedUser(email){
  localStorage.setItem('ep_logged', email);
}
function getLoggedUser(){
  const email = localStorage.getItem('ep_logged');
  if(!email) return null;
  const users = getUsers();
  return users.find(u => u.email === email) || null;
}
function updateUser(updatedUser){
  const users = getUsers();
  const idx = users.findIndex(u => u.email === updatedUser.email);
  if(idx>-1){ users[idx] = updatedUser; saveUsers(users); }
}

/* ========= SIGNUP ========= */
function signupUser(){
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const plan = document.getElementById('planSelect').value; // free/premium

  if(!name || !email || !password){ alert('Fill all fields'); return; }

  const users = getUsers();
  if(users.some(u=>u.email===email)){ alert('User already exists'); return; }

  const newUser = {
    name,email,password,
    plan, // 'free' or 'premium'
    uploads:{thumbs:[],logos:[],videos:[]}
  };
  users.push(newUser);
  saveUsers(users);
  alert('Signup successful! Please login.');
  window.location.href = './login.html';
}

/* ========= LOGIN ========= */
function loginUser(){
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const users = getUsers();
  const user = users.find(u=>u.email===email && u.password===password);
  if(!user){ alert('Invalid credentials'); return; }
  setLoggedUser(user.email);
  window.location.href = './dashboard.html';
}

/* ========= LOGOUT ========= */
function logoutUser(){
  localStorage.removeItem('ep_logged');
  window.location.href = './index.html';
}

/* ========= DASHBOARD INIT ========= */
(function(){
  if(!window.location.pathname.endsWith('dashboard.html')) return;

  const user = getLoggedUser();
  if(!user){ window.location.href='./login.html'; return; }

  document.getElementById('dashWelcome').innerText = 'Hello, '+user.name;
  document.getElementById('dashPlan').innerText = 'Plan: '+(user.plan==='premium'?'Premium':'Free');
  document.getElementById('adsBox').style.display = user.plan==='free'?'block':'none';
  document.getElementById('upgradeBtn').style.display = user.plan==='free'?'inline-block':'none';

  const limits = user.plan==='premium'
    ? {thumbs:15,logos:7,videos:5}
    : {thumbs:5,logos:3,videos:2};

  document.getElementById('limitText').innerText =
    `Limits → Thumbs:${limits.thumbs} | Logos:${limits.logos} | Videos:${limits.videos}`;

  // restore previews
  renderUploads(user);

  // attach file handlers
  document.getElementById('thumbInput').addEventListener('change', e=>{
    handleUploadFiles(e.target.files,user,'thumbs',limits.thumbs);
  });
  document.getElementById('logoInput').addEventListener('change', e=>{
    handleUploadFiles(e.target.files,user,'logos',limits.logos);
  });
  document.getElementById('videoInput').addEventListener('change', e=>{
    handleUploadFiles(e.target.files,user,'videos',limits.videos,true);
  });

})();

/* ========= HANDLE FILE UPLOADS ========= */
function handleUploadFiles(fileList,user,key,limit,isVideo=false){
  const arr = Array.from(fileList);
  const currentCount = user.uploads[key].length;
  if(currentCount + arr.length > limit){
    alert(`Limit ${limit}. You already have ${currentCount}.`);
    return;
  }
  const readers = arr.map(file => new Promise(res=>{
    const fr = new FileReader();
    fr.onload = ()=>res(fr.result);
    fr.readAsDataURL(file);
  }));
  Promise.all(readers).then(data=>{
    user.uploads[key].push(...data);
    updateUser(user);
    renderUploads(user);
  });
}

function renderUploads(user){
  const wrap = document.getElementById('previewArea');
  if(!wrap) return;
  wrap.innerHTML='';
  user.uploads.thumbs.forEach(src=>{
    wrap.innerHTML+=`<div class="preview-item"><img src="${src}"></div>`;
  });
  user.uploads.logos.forEach(src=>{
    wrap.innerHTML+=`<div class="preview-item"><img src="${src}"></div>`;
  });
  user.uploads.videos.forEach(src=>{
    wrap.innerHTML+=`<div class="preview-item"><video src="${src}" controls></video></div>`;
  });
}

function saveUploads(){
  alert('Portfolio Saved!');
}

/* ========= UPGRADE (RAZORPAY DUMMY) ========= */
function startUpgrade(){
  const user = getLoggedUser();
  if(!user){window.location.href='./login.html';return;}

  // Real key बाद में डालना
  const options = {
    key: 'rzp_test_dummykey',
    amount: 39900,
    currency: 'INR',
    name: 'Editor Portfolio',
    description: 'Premium Plan (6 months)',
    handler: function (){
      user.plan='premium';
      updateUser(user);
      alert('Payment success (test). Premium activated!');
      window.location.reload();
    },
    prefill: { email:user.email },
    theme:{ color:'#f9b416' }
  };
  const rzp = new Razorpay(options);
  rzp.open();
}

/* ========= ADMIN ========= */
function adminLogin(){
  const email = document.getElementById('adminEmail').value.trim();
  const pass = document.getElementById('adminPassword').value;
  const ADMIN_EMAIL='vaseemali0909@gmail.com';
  const ADMIN_PASS='Admin@123';

  if(email===ADMIN_EMAIL && pass===ADMIN_PASS){
    document.getElementById('adminLoginBox').style.display='none';
    document.getElementById('adminSection').style.display='block';
    renderAdminUsers();
  }else{
    alert('Wrong admin credentials');
  }
}

function renderAdminUsers(){
  const holder = document.getElementById('userList');
  const users = getUsers();
  if(users.length===0){ holder.innerHTML='<p>No users yet.</p>'; return; }
  holder.innerHTML='';
  users.forEach((u,i)=>{
    holder.innerHTML += `
      <p>
        ${u.name} (${u.email}) - <strong>${u.plan}</strong>
        <button class="btn primary" onclick="adminMakePremium(${i})">Make Premium</button>
        <button class="btn" onclick="adminMakeFree(${i})">Make Free</button>
      </p>`;
  });
}

function adminMakePremium(i){
  const users = getUsers();
  users[i].plan='premium';
  saveUsers(users);
  renderAdminUsers();
  alert('User upgraded to Premium.');
}

function adminMakeFree(i){
  const users = getUsers();
  users[i].plan='free';
  saveUsers(users);
  renderAdminUsers();
  alert('User downgraded to Free.');
}

function adminLogout(){
  document.getElementById('adminLoginBox').style.display='block';
  document.getElementById('adminSection').style.display='none';
}
