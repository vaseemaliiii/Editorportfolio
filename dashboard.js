let CURRENT_UID=null;
let CURRENT_USER=null;
let CURRENT_DATA=null;
let UNSUB=null;

initDash();

function initDash(){
  if(!EP.ready){alert('Firebase not ready');return;}
  CURRENT_UID = EP.getSession();
  if(!CURRENT_UID){location.href='auth.html';return;}
  EP.auth.onAuthStateChanged(u=>{
    if(!u){location.href='auth.html';return;}
    CURRENT_USER=u;
    watchUserDoc();
  });
}

function watchUserDoc(){
  if(UNSUB)UNSUB();
  UNSUB = EP.db.collection('users').doc(CURRENT_USER.uid)
    .onSnapshot(snap=>{
      if(!snap.exists){alert('User doc missing');return;}
      CURRENT_DATA=snap.data();
      renderDash();
    });
}

function renderDash(){
  const d=CURRENT_DATA;
  document.getElementById('dashWelcome').innerText='Hello, '+(d.name||'User');
  document.getElementById('userInfo').innerHTML=`
    <p><strong>Email:</strong> ${d.email}</p>
    <p><strong>Plan:</strong> ${d.plan.toUpperCase()}</p>
    <p><strong>Last Login:</strong> ${EP.formatDate(d.lastLogin)}</p>
  `;
  const limits=EP.LIMITS[d.plan]||EP.LIMITS.free;
  document.getElementById('limitText').innerText=
    `Limits → Thumbs:${limits.thumbs} Logos:${limits.logos} Videos:${limits.videos}`;
  document.getElementById('adsBox').classList.toggle('hidden',d.plan==='premium');
  document.getElementById('upgradeBtn').classList.toggle('hidden',d.plan==='premium');
  document.getElementById('thumbInput').onchange=e=>uploadFiles(e.target.files,'thumbs',limits.thumbs);
  document.getElementById('logoInput').onchange=e=>uploadFiles(e.target.files,'logos',limits.logos);
  document.getElementById('videoInput').onchange=e=>uploadFiles(e.target.files,'videos',limits.videos,true);
  renderUploads();
}

function renderUploads(){
  const box=document.getElementById('previewArea');
  box.innerHTML='';
  const up=CURRENT_DATA.uploads||{thumbs:[],logos:[],videos:[]};
  up.thumbs.forEach(u=>box.innerHTML+=`<div class="preview-item"><img src="${u}"></div>`);
  up.logos.forEach(u=>box.innerHTML+=`<div class="preview-item"><img src="${u}"></div>`);
  up.videos.forEach(u=>box.innerHTML+=`<div class="preview-item"><video src="${u}" controls></video></div>`);
}

/* upload to Firebase Storage */
async function uploadFiles(fileList,key,limit,isVideo){
  const up=CURRENT_DATA.uploads||{thumbs:[],logos:[],videos:[]};
  const cur=up[key].length;
  if(cur+fileList.length>limit){alert('Limit '+limit+' (already '+cur+')');return;}
  for(let i=0;i<fileList.length;i++){
    const f=fileList[i];
    const path=`users/${CURRENT_USER.uid}/${key}/${Date.now()}_${f.name}`;
    const ref = EP.stg.ref(path);
    await ref.put(f);
    const url=await ref.getDownloadURL();
    up[key].push(url);
  }
  CURRENT_DATA.uploads=up;
  await EP.saveUserDoc(CURRENT_USER.uid,{uploads:up});
  renderUploads();
}

async function saveUploads(){
  await EP.saveUserDoc(CURRENT_USER.uid,{uploads:CURRENT_DATA.uploads});
  alert('Portfolio saved!');
}

function logout(){
  EP.clearSession();
  EP.auth.signOut().finally(()=>location.href='index.html');
}

/* Premium self-upgrade */
async function selfUpgrade(){
  const code=prompt('Premium Code?');if(!code)return;
  if(code.trim().toLowerCase()!==EP.PREMIUM_CODE.toLowerCase()){alert('Galat code');return;}
  await EP.saveUserDoc(CURRENT_USER.uid,{plan:'premium'});
  alert('Premium unlocked!');
}

/* UPI Modal */
function openUPI(){document.getElementById('upiModal').style.display='flex';}
function closeUPI(){document.getElementById('upiModal').style.display='none';}

/* Share link */
function copyShareLink(){
  const link = new URL('profile.html', location.href).href + '?uid=' + CURRENT_USER.uid;
  const input=document.getElementById('shareLinkInput');
  input.value=link;
  document.getElementById('shareBox').classList.remove('hidden');
}
function copyShareInput(){
  const el=document.getElementById('shareLinkInput');
  el.select();el.setSelectionRange(0,9999);
  navigator.clipboard.writeText(el.value).then(()=>alert('Link copied!')).catch(()=>alert('Copy failed; long-press select.'));
}

/* Download JSON */
function downloadPortfolio(){
  const data = JSON.stringify(CURRENT_DATA,null,2);
  const url="data:text/json;charset=utf-8,"+encodeURIComponent(data);
  const a=document.createElement('a');
  a.href=url;
  a.download='portfolio.json';
  a.click();
}
