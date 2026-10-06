const byId=id=>document.getElementById(id);
function readAccount(){try{return JSON.parse(localStorage.getItem('pacshield-account')||'null')}catch{return null}}
function initials(name){return String(name||'Guest').trim().split(/\s+/).slice(0,2).map(part=>part[0]||'').join('').toUpperCase()||'GU'}
function applyAccount(account){
  const name=account?.name||'Guest demo';
  const first=account?.name?.trim().split(/\s+/)[0]||'Thulsi';
  byId('welcome-name').textContent=first;
  byId('sidebar-name').textContent=name;
  byId('sidebar-email').textContent=account?.email||'Sign in or create account';
  byId('sidebar-avatar').textContent=initials(account?.name);
  byId('top-avatar').textContent=initials(account?.name);
  byId('account-link').innerHTML=account?'Your account <span>→</span>':'Sign in <span>→</span>';
}
function showAccount(){
  const account=readAccount();
  byId('account-status').textContent=account?`Signed in to this browser demo as ${account.email}. Edit your display details below.`:'You’re viewing the PacShield guest demo. Sign in or create a demo account to personalize this dashboard.';
  byId('account-form').classList.toggle('hidden',!account);
  byId('account-signin').classList.toggle('hidden',!!account);
  byId('account-signout').classList.toggle('hidden',!account);
  if(account){byId('account-name').value=account.name||'';byId('account-email').value=account.email||'';}
  openModal('account-modal');
}
applyAccount(readAccount());
const welcome=sessionStorage.getItem('pacshield-welcome');
if(welcome){sessionStorage.removeItem('pacshield-welcome');setTimeout(()=>showToast(welcome),250)}
document.addEventListener('click',event=>{
  const control=event.target.closest('[data-action="account"],[data-action="assistant"],[data-action="assistant-close"],[data-assistant-prompt]');
  if(!control)return;
  if(control.dataset.action==='account')showAccount();
  if(control.dataset.action==='assistant'){
    const panel=byId('assistant-panel');const open=!panel.classList.contains('open');
    panel.classList.toggle('open',open);panel.setAttribute('aria-hidden',String(!open));byId('assistant-launch').setAttribute('aria-expanded',String(open));
    if(open)byId('assistant-input').focus();
  }
  if(control.dataset.action==='assistant-close'){
    byId('assistant-panel').classList.remove('open');byId('assistant-panel').setAttribute('aria-hidden','true');byId('assistant-launch').setAttribute('aria-expanded','false');
  }
  if(control.dataset.assistantPrompt)sendAssistantMessage(control.dataset.assistantPrompt);
});
byId('account-form').addEventListener('submit',event=>{
  event.preventDefault();const account={name:byId('account-name').value.trim(),email:byId('account-email').value.trim()};
  if(!account.name||!byId('account-email').checkValidity()){showToast('Please enter a name and a valid email address.');return;}
  localStorage.setItem('pacshield-account',JSON.stringify(account));applyAccount(account);closeModal('account-modal');showToast('Account details updated.');
});
byId('account-signout').addEventListener('click',()=>{localStorage.removeItem('pacshield-account');applyAccount(null);closeModal('account-modal');showToast('You’ve signed out of this demo account.');});
function assistantReply(message){
  const text=message.toLowerCase();
  if(/qr|scan|payment|payee|scam/.test(text))return 'Open “Scan a QR safely” and check a UPI code before handing off to a payment app. If anything feels rushed, stop and call someone you trust. Never share your UPI PIN.';
  if(/budget|spend|money|today/.test(text))return 'Your demo dashboard shows ₹1,940 safe to spend today and ₹13,850 left in the monthly budget. These are sample figures, not connected to a bank account.';
  return 'I’m a small demo guide, not a live AI or financial adviser. I can explain the sample dashboard or share QR safety reminders. Your private account and payment details are not sent anywhere.';
}
function appendAssistantMessage(message,kind){const node=document.createElement('div');node.className=`assistant-message ${kind==='user'?'user-message':'agent-message'}`;node.textContent=message;byId('assistant-messages').appendChild(node);byId('assistant-messages').scrollTop=byId('assistant-messages').scrollHeight;}
function sendAssistantMessage(message){const text=String(message||'').trim().slice(0,240);if(!text)return;appendAssistantMessage(text,'user');setTimeout(()=>appendAssistantMessage(assistantReply(text),'agent'),250);byId('assistant-input').value='';}
byId('assistant-form').addEventListener('submit',event=>{event.preventDefault();sendAssistantMessage(byId('assistant-input').value);});
byId('assistant-input').addEventListener('keydown',event=>{if(event.key==='Escape'){byId('assistant-panel').classList.remove('open');byId('assistant-panel').setAttribute('aria-hidden','true');byId('assistant-launch').setAttribute('aria-expanded','false');}});
