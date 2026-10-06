const feedback=document.getElementById('auth-feedback');

try{
  const account=JSON.parse(localStorage.getItem('pacshield-account')||'null');
  if(account?.name&&account?.email)window.location.replace('home.html');
}catch{
  localStorage.removeItem('pacshield-account');
}

const pageNotice=sessionStorage.getItem('pacshield-notice');
if(pageNotice){feedback.textContent=pageNotice;sessionStorage.removeItem('pacshield-notice');}

document.getElementById('demo-submit').addEventListener('click',()=>{
  const account={name:'Guest',email:'guest@pacshield.local'};
  localStorage.setItem('pacshield-account',JSON.stringify(account));
  sessionStorage.setItem('pacshield-welcome','Welcome to the PacShield browser demo. Your data stays on this device.');
  window.location.assign('home.html');
});
