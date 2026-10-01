const SUPABASE_URL = "https://zidnupzpmxighfcmhnco.supabase.co";
const SUPABASE_KEY = "sb_publishable_2cxIQ0Evo9NNiWXGDAkg1w_gZjYiuT9";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

setTimeout(() => {
  $('#loader').style.opacity = '0';
  $('#loader').style.transition = '.7s';

  setTimeout(() => {
    $('#loader').remove();
    $('#gate').classList.remove('hidden');
  }, 700);
}, 2800);

function showTab(id) {
  $$('.page').forEach(x => x.classList.remove('active-page'));

  const p = $('#' + id);
  if (p) p.classList.add('active-page');

  $$('#nav button').forEach(x =>
    x.classList.toggle('active', x.dataset.tab === id)
  );

  $('#nav').classList.remove('open');

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

$('#enterBtn').onclick = () => {
  $('#gate').style.opacity = '0';
  $('#gate').style.transition = '.6s';

  setTimeout(() => {
    $('#gate').remove();
    $('#app').classList.remove('hidden');
  }, 600);
};

$$('[data-tab]').forEach(b =>
  b.addEventListener('click', e => {
    e.preventDefault();
    showTab(b.dataset.tab);
  })
);

$('#menu').onclick = () =>
  $('#nav').classList.toggle('open');


/* =========================
   MEMBERS
========================= */

const names = [
  'Vex',
  'Nova',
  'Ruin',
  'Astra',
  'Ghost',
  'Nox',
  'Kairo',
  'Hex',
  'Zero',
  'Morrow',
  'Nyx',
  'Raze'
];

$('#memberGrid').innerHTML = names.map((n, i) => `
  <div class="member">
    <div class="avatar">${n[0]}</div>
    <div>
      <b>${n}</b><br>
      <small>● online · soul ${100 + i}</small>
    </div>
  </div>
`).join('');


/* =========================
   HIGHLIGHTS
========================= */

const highlights = [
  ['', 'VOID RUN', 'Vex', 'A clean clip from the Underworld.'],
  ['◈', 'MIDNIGHT DROP', 'Nova', 'New community visual drop.'],
  ['✦', 'SOUL MOMENT', 'Nox', 'A moment worth remembering.'],
  ['◉', 'NIGHT SHIFT', 'Kairo', 'After-hours Underworld activity.'],
  ['∆', 'BLUE HOUR', 'Ruin', 'Another one for the archive.'],
  ['✹', 'THE DESCENT', 'Astra', 'Featured community highlight.']
];

function renderHighlights() {
  $('#highlightGrid').innerHTML = highlights.map(h => `
    <article class="highlight">
      <div class="highlight-media">${h[0]}</div>

      <div class="highlight-body">
        <small>${h[2]}</small>
        <h3>${h[1]}</h3>
        <p>${h[3]}</p>
      </div>
    </article>
  `).join('');
}

renderHighlights();


/* =========================
   GLOBAL CHAT
========================= */

let lastSent = 0;
let cooldownTimer = null;

function escapeHtml(s) {
  return s.replace(
    /[&<>"']/g,
    c => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[c])
  );
}

function addChatMessage(name, message) {
  const div = document.createElement('div');

  div.className = 'msg';

  div.innerHTML = `
    <div class="avatar">${escapeHtml(name.charAt(0).toUpperCase())}</div>

    <div class="bubble">
      <b>${escapeHtml(name)}</b>
      <p>${escapeHtml(message)}</p>
    </div>
  `;

  $('#messages').appendChild(div);
  $('#messages').scrollTop = $('#messages').scrollHeight;
}


/* LOAD OLD MESSAGES */

async function loadChat() {

  const { data, error } = await supabaseClient
    .from('messages')
    .select('*')
    .order('created_at', {
      ascending: true
    });

  if (error) {
    console.error('Chat loading error:', error);
    return;
  }

  $('#messages').innerHTML = '';

  data.forEach(msg => {
    addChatMessage(
      msg.username,
      msg.message
    );
  });
}


/* SEND MESSAGE */

async function sendChat() {

  const name =
    $('#chatName').value.trim() ||
    'Anonymous Soul';

  const msg =
    $('#chatInput').value.trim();

  const now = Date.now();

  if (!msg) return;


  /* 5 SECOND SLOW MODE */

  if (now - lastSent < 5000) {
    startCooldown(
      5000 - (now - lastSent)
    );

    return;
  }


  /* SEND TO SUPABASE */

  const { error } = await supabaseClient
    .from('messages')
    .insert({
      username: name,
      message: msg
    });


  if (error) {

    console.error(
      'Message sending error:',
      error
    );

    alert('Failed to send message.');

    return;
  }


  $('#chatInput').value = '';

  lastSent = now;

  startCooldown(5000);
}


/* SEND BUTTON */

$('#sendBtn').onclick = sendChat;


/* ENTER KEY */

$('#chatInput').addEventListener(
  'keydown',
  e => {

    if (e.key === 'Enter') {
      sendChat();
    }

  }
);


/* SLOW MODE */

function startCooldown(ms) {

  clearInterval(cooldownTimer);

  const end = Date.now() + ms;

  $('#sendBtn').disabled = true;

  const tick = () => {

    const left =
      Math.max(
        0,
        end - Date.now()
      );

    $('#cooldown').textContent =
      left
        ? `SLOW MODE — ${Math.ceil(left / 1000)}s remaining`
        : 'READY';


    if (!left) {

      clearInterval(
        cooldownTimer
      );

      $('#sendBtn').disabled = false;

    }

  };

  tick();

  cooldownTimer =
    setInterval(tick, 100);
}


/* =========================
   REALTIME CHAT
========================= */

supabaseClient
  .channel('global-chat')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'messages'
    },
    payload => {

      const msg = payload.new;

      addChatMessage(
        msg.username,
        msg.message
      );

    }
  )
  .subscribe();


loadChat();


/* =========================
   HIGHLIGHT POST PANEL
========================= */

$('#postBtn').onclick = () =>
  $('#postPanel').classList.remove('hidden');

$('#closePost').onclick = () =>
  $('#postPanel').classList.add('hidden');

$('#publishPost').onclick = () => {

  const n =
    $('#postName').value.trim() ||
    'Unknown Soul';

  const t =
    $('#postTitle').value.trim() ||
    'New Highlight';

  const url =
    $('#postMedia').value.trim();

  highlights.unshift([
    '✦',
    t,
    n,
    'Community submission' +
    (url ? ' · media attached' : '')
  ]);

  renderHighlights();

  $('#postPanel').classList.add('hidden');

  $('#postName').value = '';
  $('#postTitle').value = '';
  $('#postMedia').value = '';
};
