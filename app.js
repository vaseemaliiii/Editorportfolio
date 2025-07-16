// Global namespace
window.EP = {};

// Firebase init
(function(){
  const firebaseConfig = {
    apiKey: "AIzaSyB3Qmyu5Zhe2LjlxLT1E2lVAL7P8GGtyEs",
    authDomain: "editorportfolio-e0034.firebaseapp.com",
    projectId: "editorportfolio-e0034",
    storageBucket: "editorportfolio-e0034.appspot.com",
    messagingSenderId: "48365121711",
    appId: "1:48365121711:web:6c3704054787925301a45a",
    measurementId: "G-8TECQ5NG93"
  };
  try{
    firebase.initializeApp(firebaseConfig);
    EP.ready = true;
    EP.auth = firebase.auth();
    EP.db   = firebase.firestore();
    EP.stg  = firebase.storage();
    EP.googleProvider = new firebase.auth.GoogleAuthProvider();
  }catch(e){
    console.error("Firebase init error",e);
    EP.ready = false;
  }

  // constants
  EP.ADMIN_EMAIL = 'vaseemali0909@gmail.com';
  EP.ADMIN_PASS  = 'ali750571';
  EP.PREMIUM_CODE = '750571ali';
  EP.UPI_ID = 'vaseemali98@axl';
  EP.CONTACT = 'vaseemali0909@gmail.com';

  // plan limits
  EP.LIMITS = {
    free:    {thumbs:5,  logos:3, videos:2},
    premium: {thumbs:15, logos:7, videos:5}
  };

  // session helpers
  EP.setSession = uid => localStorage.setItem('ep_uid',uid);
  EP.getSession = () => localStorage.getItem('ep_uid');
  EP.clearSession = () => localStorage.removeItem('ep_uid');

  // user doc helpers
  EP.getUserDoc = async uid => {
    const snap = await EP.db.collection('users').doc(uid).get();
    return snap.exists ? snap.data() : null;
  };
  EP.saveUserDoc = async (uid,data) => {
    await EP.db.collection('users').doc(uid).set(data,{merge:true});
  };
  EP.formatDate = ts => ts ? new Date(ts).toLocaleString() : '—';
})();
