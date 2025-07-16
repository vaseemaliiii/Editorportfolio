(async function(){
  if(!EP.ready){
    document.getElementById('profileName').innerText='Offline';
    return;
  }
  const params=new URLSearchParams(location.search);
  const uid=params.get('uid');
  if(!uid){
    document.getElementById('profileName').innerText='User not found';
    return;
  }
  const data=await EP.getUserDoc(uid);
  if(!data){
    document.getElementById('profileName').innerText='Profile missing';
    return;
  }
  document.getElementById('profileName').innerText=(data.name||'User')+"'s Portfolio";
  document.getElementById('profileInfo').innerHTML=`
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Plan:</strong> ${data.plan.toUpperCase()}</p>
  `;
  const box=document.getElementById('previewArea');box.innerHTML='';
  const up=data.uploads||{thumbs:[],logos:[],videos:[]};
  up.thumbs.forEach(u=>box.innerHTML+=`<div class="preview-item"><img src="${u}"></div>`);
  up.logos.forEach(u=>box.innerHTML+=`<div class="preview-item"><img src="${u}"></div>`);
  up.videos.forEach(u=>box.innerHTML+=`<div class="preview-item"><video src="${u}" controls></video></div>`);
})();
