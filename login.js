const feedback=document.getElementById('auth-feedback');
const loginForm=document.getElementById('email-login-form');
const emailInput=document.getElementById('login-email');

try{
  const account=JSON.parse(localStorage.getItem('pacshield-account')||'null');
  if(account?.name&&account?.email)window.location.replace('home.html');
}catch{
  localStorage.removeItem('pacshield-account');
}

const pageNotice=sessionStorage.getItem('pacshield-notice');
if(pageNotice){feedback.textContent=pageNotice;sessionStorage.removeItem('pacshield-notice');}

loginForm.addEventListener('submit',(event)=>{
  event.preventDefault();
  const email=emailInput.value.trim().toLowerCase();
  if(!emailInput.validity.valid||!email){
    feedback.textContent='Enter a valid email address to continue.';
    feedback.classList.remove('success');
    emailInput.focus();
    return;
  }
  const account={name:email.split('@')[0].replace(/[._+-]+/g,' ').replace(/\b\w/g,(letter)=>letter.toUpperCase())||'Guest',email};
  try{
    localStorage.setItem('pacshield-account',JSON.stringify(account));
    sessionStorage.setItem('pacshield-welcome',`Welcome to the PacShield browser demo, ${account.name}. Your data stays on this device.`);
    window.location.assign('home.html');
  }catch{
    feedback.textContent='Browser storage is unavailable. Enable local storage to use this demo.';
    feedback.classList.remove('success');
  }
});
