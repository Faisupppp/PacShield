const form=document.getElementById('auth-form');
const feedback=document.getElementById('auth-feedback');
let mode='login';

function setMode(next){
  mode=next;
  const registering=mode==='register';
  document.getElementById('login-tab').classList.toggle('active',!registering);
  document.getElementById('register-tab').classList.toggle('active',registering);
  document.getElementById('login-tab').setAttribute('aria-selected',String(!registering));
  document.getElementById('register-tab').setAttribute('aria-selected',String(registering));
  document.getElementById('form-title').textContent=registering?'Create your account.':'Good to see you again.';
  document.getElementById('form-subtitle').textContent=registering?'A few details, then you’re ready to feel more in control.':'Sign in to your account to pick up right where you left off.';
  document.getElementById('name-label').classList.toggle('hidden',!registering);
  document.getElementById('name-wrap').classList.toggle('hidden',!registering);
  document.getElementById('remember-row').classList.toggle('hidden',registering);
  document.getElementById('forgot-link').classList.toggle('hidden',registering);
  document.getElementById('password').setAttribute('autocomplete',registering?'new-password':'current-password');
  document.getElementById('submit-label').textContent=registering?'Create my account':'Sign in securely';
  feedback.textContent='';feedback.classList.remove('success');
}

document.querySelectorAll('.auth-tab').forEach(button=>button.addEventListener('click',()=>setMode(button.dataset.mode)));
document.getElementById('password-toggle').addEventListener('click',event=>{
  const input=document.getElementById('password');
  const show=input.type==='password';input.type=show?'text':'password';
  event.currentTarget.textContent=show?'Hide':'Show';event.currentTarget.setAttribute('aria-label',show?'Hide password':'Show password');
});
document.getElementById('forgot-link').addEventListener('click',event=>{
  event.preventDefault();feedback.textContent='Password reset is not connected in this front-end demo yet.';feedback.classList.remove('success');
});
form.addEventListener('submit',event=>{
  event.preventDefault();feedback.classList.remove('success');
  const name=document.getElementById('full-name').value.trim();
  const email=document.getElementById('email');
  const password=document.getElementById('password');
  if(mode==='register'&&!name){document.getElementById('full-name').focus();feedback.textContent='Please enter your name to continue.';return;}
  if(!email.checkValidity()){email.focus();feedback.textContent='Enter a valid email address to continue.';return;}
  if(password.value.length<8){password.focus();feedback.textContent='Use at least 8 characters for your password.';return;}
  const fallbackName=email.value.split('@')[0].replace(/[._-]+/g,' ').replace(/\b\w/g,c=>c.toUpperCase())||'PacShield member';
  const account={name:mode==='register'?name:fallbackName,email:email.value.trim()};
  localStorage.setItem('pacshield-account',JSON.stringify(account));
  sessionStorage.setItem('pacshield-welcome',`${mode==='register'?'Welcome to PacShield':'Welcome back'}, ${account.name}. This is a demo account.`);
  password.value='';
  window.location.assign('index.html');
});
