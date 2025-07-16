let ADMIN_AUTHED=false;

function adminLogin(){
  const e=document.getElementById('adminEmail').value.trim().toLowerCase();
  const p=document.getElementById('adminPass').value.trim();
  if(e===EP.ADMIN_EMAIL.toLowerCase() && p===EP.ADMIN_PASS){
    ADMIN_AUTHED=true;
    document.getElementById('adminLoginBox').classList.add('hidden');
    document.getElementById('adminPanel').classList.remove('hidden');
    loadAdminUsers();
  }else{
    alert('Wrong admin credentials');
  }
}

async function loadAdminUsers(){
  if(!EP.ready){alert('Firebase offline');return;}
  const snap=await EP.db.collection('users').get();
  const list=document.getElementById('userList');
  const stats=document.getElementById('adminStats');
  let total=0,premium=0;
  list.innerHTML='';
  snap.forEach(doc=>{
    total++;
    const u=doc.data();
    if(u.plan==='premium')premium++;
    const last=EP.formatDate(u.lastLogin);
    list.innerHTML+=`
      <div>
        <strong>${u.name}</strong>
        <small>${u.email}</small>
        <small>Plan: ${u.plan.toUpperCase()} | Last: ${last}</small>
        <button class="btn sm primary" onclick="adminSet('${doc.id}','premium')">Premium</button>
        <button class="btn sm" onclick="adminSet('${doc.id}','free')">Free</button>
        <a class="btn sm" href="profile.html?uid=${doc.id}">View</a>
      </div>`;
  });
  stats.innerHTML=`
    <p><strong>Total:</strong> ${total}</p>
    <p><strong>Premium:</strong> ${premium}</p>
    <p><strong>Free:</strong> ${total-premium}</p>
  `;
}

async function adminSet(uid,plan){
  await EP.saveUserDoc(uid,{plan});
  loadAdminUsers();
}

function adminLogout(){
  ADMIN_AUTHED=false;
  document.getElementById('adminPanel').classList.add('hidden');
  document.getElementById('adminLoginBox').classList.remove('hidden');
}
