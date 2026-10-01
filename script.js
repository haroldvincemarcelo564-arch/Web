const SUPABASE_URL = "https://zidnupzpmxighfcmhnco.supabase.co";
const SUPABASE_KEY = "sb_publishable_2cxIQ0Evo9NNiWXGDAkg1w_gZjYiuT9";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);

setTimeout(()=>{$('#loader').style.opacity='0';$('#loader').style.transition='.7s';setTimeout(()=>{$('#loader').remove();$('#gate').classList.remove('hidden')},700)},2800);

function showTab(id){
  $$('.page').forEach(x=>x.classList.remove('active-page'));
  const p=$('#'+id); if(p)p.classList.add('active-page');
  $$('#nav button').forEach(x=>x.classList.toggle('active',x.dataset.tab===id));
  $('#nav').classList.remove('open'); window.scrollTo({top:0,behavior:'smooth'});
}
$('#enterBtn').onclick=()=>{$('#gate').style.opacity='0';$('#gate').style.transition='.6s';setTimeout(()=>{$('#gate').remove();$('#app').classList.remove('hidden')},600)};
$$('[data-tab]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();showTab(b.dataset.tab)}));
$('#menu').onclick=()=>$('#nav').classList.toggle('open');

const names=['Vex','Nova','Ruin','Astra','Ghost','Nox','Kairo','Hex','Zero','Morrow','Nyx','Raze'];
$('#memberGrid').innerHTML=names.map((n,i)=>`<div class="member"><div class="avatar">${n[0]}</div><div><b>${n}</b><br><small>● online · soul ${100+i}</small></div></div>`).join('');

const highlights=[
 ['','VOID RUN','Vex','A clean clip from the Underworld.'],
 ['◈','MIDNIGHT DROP','Nova','New community visual drop.'],
 ['✦','SOUL MOMENT','Nox','A moment worth remembering.'],
 ['◉','NIGHT SHIFT','Kairo','After-hours Underworld activity.'],
 ['∆','BLUE HOUR','Ruin','Another one for the archive.'],
 ['✹','THE DESCENT','Astra','Featured community highlight.']
];
function renderHighlights(){
 $('#highlightGrid').innerHTML=highlights.map(h=>`<article class="highlight"><div class="highlight-media">${h[0]}</div><div class="highlight-body"><small>${h[2]}</small><h3>${h[1]}</h3><p>${h[3]}</p></div></article>`).join('');
}
renderHighlights();

let chat=[['ARCHON','Welcome to the Underworld.'],['VEX','Keep it clean, souls.'],['NOVA','The new highlights are live.']];
function renderChat(){ $('#messages').innerHTML=chat.map(m=>`<div class="msg"><div class="avatar">${m[0][0]}</div><div class="bubble"><b>${m[0]}</b><p>${escapeHtml(m[1])}</p></div></div>`).join(''); $('#messages').scrollTop=99999}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
renderChat();

let lastSent=0, cooldownTimer=null;
$('#sendBtn').onclick=sendChat;
$('#chatInput').addEventListener('keydown',e=>{if(e.key==='Enter')sendChat()});
function sendChat(){
 const name=$('#chatName').value.trim()||'Anonymous Soul', msg=$('#chatInput').value.trim(), now=Date.now();
 if(!msg)return;
 if(now-lastSent<5000){startCooldown(5000-(now-lastSent));return}
 lastSent=now; chat.push([name,msg]); $('#chatInput').value=''; renderChat(); startCooldown(5000);
 // Safe architecture: production version should POST to your backend, which owns the Discord webhook.
}
function startCooldown(ms){
 clearInterval(cooldownTimer); const end=Date.now()+ms; $('#sendBtn').disabled=true;
 const tick=()=>{let left=Math.max(0,end-Date.now());$('#cooldown').textContent=left?`SLOW MODE — ${Math.ceil(left/1000)}s remaining`:'READY';if(!left){clearInterval(cooldownTimer);$('#sendBtn').disabled=false}};
 tick();cooldownTimer=setInterval(tick,100);
}

$('#postBtn').onclick=()=>$('#postPanel').classList.remove('hidden');
$('#closePost').onclick=()=>$('#postPanel').classList.add('hidden');
$('#publishPost').onclick=()=>{
 const n=$('#postName').value.trim()||'Unknown Soul',t=$('#postTitle').value.trim()||'New Highlight',url=$('#postMedia').value.trim();
 highlights.unshift(['✦',t,n,'Community submission'+(url?' · media attached':'')]);renderHighlights();$('#postPanel').classList.add('hidden');
 $('#postName').value=$('#postTitle').value=$('#postMedia').value='';
};
