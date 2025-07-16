document.getElementById('emailSubmit').addEventListener('click', emailAuth);
document.getElementById('googleBtn').addEventListener('click', googleAuth);

async function emailAuth(){
  const email = document.getElementById('email').value.trim().toLowerCase();
  const pass  = document.getElementById('pass').value.trim();
  if(!email || !pass){alert('Fields missing');return;}
  try{
    await EP.auth.signInWithEmailAndPassword(email,pass);
  }catch(err){
    if(err.code==='auth/user-not-found'){
      await EP.auth.createUserWithEmailAndPassword(email,pass);
    }else{
      alert(err.message);return;
    }
  }
  const user = EP.auth.currentUser;
  await ensureUserDoc(user);
  EP.setSession(user.uid);
  location.href='dashboard.html';
}

async function googleAuth(){
  if(!EP.ready){return emailFallbackGoogle();}
  try{
    await EP.auth.signInWithPopup(EP.googleProvider);
  }catch(e){
    try{await EP.auth.signInWithRedirect(EP.googleProvider);}
    catch(e2){return emailFallbackGoogle();}
  }
  const user = EP.auth.currentUser;
  if(!user){return emailFallbackGoogle();}
  await ensureUserDoc(user);
  EP.setSession(user.uid);
  location.href='dashboard.html';
}

function emailFallbackGoogle(){
  const e=prompt('Google Email (Manual):');if(!e)return;
  EP.auth.createUserWithEmailAndPassword(e,'x')
    .then(async ()=>{
      const u=EP.auth.currentUser;
      await ensureUserDoc(u);
      EP.setSession(u.uid);
      location.href='dashboard.html';
    })
    .catch(()=>alert('Manual Google signup fail.'));
}

/* create/update Firestore doc */
async function ensureUserDoc(user){
  if(!user)return;
  const uid=user.uid;
  const ref=EP.db.collection('users').doc(uid);
  const snap=await ref.get();
  const ts=Date.now();
  const tz=Intl.DateTimeFormat().resolvedOptions().timeZone||'';
  const ua=navigator.userAgent;
  if(!snap.exists){
    await ref.set({
      name:user.displayName||user.email.split('@')[0],
      email:user.email,
      plan:'free',
      created:ts,
      lastLogin:ts,
      loginHistory:[{ts,tz,ua}],
      uploads:{thumbs:[],logos:[],videos:[]}
    });
  }else{
    await ref.set({
      lastLogin:ts,
      loginHistory:firebase.firestore.FieldValue.arrayUnion({ts,tz,ua})
    },{merge:true});
  }
    }
