const SUPABASE_URL = "https://zidnupzpmxighfcmhnco.supabase.co";
const SUPABASE_KEY = "sb_publishable_2cxIQ0Evo9NNiWXGDAkg1w_gZjYiuT9";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);


/* =========================
   LOADER
========================= */

setTimeout(() => {
  const loader = $('#loader');

  if (!loader) return;

  loader.style.opacity = '0';
  loader.style.transition = '.7s';

  setTimeout(() => {
    loader.remove();

    const gate = $('#gate');

    if (gate) {
      gate.classList.remove('hidden');
    }
  }, 700);

}, 2800);


/* =========================
   NAVIGATION
========================= */

function showTab(id) {

  $$('.page').forEach(x =>
    x.classList.remove('active-page')
  );

  const page = $('#' + id);

  if (page) {
    page.classList.add('active-page');
  }

  $$('#nav button').forEach(button => {
    button.classList.toggle(
      'active',
      button.dataset.tab === id
    );
  });

  const nav = $('#nav');

  if (nav) {
    nav.classList.remove('open');
  }

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}


const enterBtn = $('#enterBtn');

if (enterBtn) {

  enterBtn.onclick = () => {

    const gate = $('#gate');

    if (!gate) return;

    gate.style.opacity = '0';
    gate.style.transition = '.6s';

    setTimeout(() => {

      gate.remove();

      const app = $('#app');

      if (app) {
        app.classList.remove('hidden');
      }

    }, 600);

  };

}


$$('[data-tab]').forEach(button => {

  button.addEventListener(
    'click',
    event => {

      event.preventDefault();

      showTab(
        button.dataset.tab
      );

    }
  );

});


const menu = $('#menu');

if (menu) {

  menu.onclick = () => {

    const nav = $('#nav');

    if (nav) {
      nav.classList.toggle('open');
    }

  };

}


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

const memberGrid =
  $('#memberGrid');

if (memberGrid) {

  memberGrid.innerHTML =
    names.map((name, index) => `

      <div class="member">

        <div class="avatar">
          ${name[0]}
        </div>

        <div>

          <b>${escapeHtml(name)}</b>

          <br>

          <small>
            ● online · soul ${100 + index}
          </small>

        </div>

      </div>

    `).join('');

}


/* =========================
   ESCAPE HTML
========================= */

function escapeHtml(value) {

  return String(value).replace(
    /[&<>"']/g,
    character => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[character])
  );

}


/* =========================
   HIGHLIGHTS
========================= */

let highlights = [

  [
    '',
    'VOID RUN',
    'Vex',
    'A clean clip from the Underworld.'
  ],

  [
    '◈',
    'MIDNIGHT DROP',
    'Nova',
    'New community visual drop.'
  ],

  [
    '✦',
    'SOUL MOMENT',
    'Nox',
    'A moment worth remembering.'
  ],

  [
    '◉',
    'NIGHT SHIFT',
    'Kairo',
    'After-hours Underworld activity.'
  ],

  [
    '∆',
    'BLUE HOUR',
    'Ruin',
    'Another one for the archive.'
  ],

  [
    '✹',
    'THE DESCENT',
    'Astra',
    'Featured community highlight.'
  ]

];


function renderHighlights() {

  const grid =
    $('#highlightGrid');

  if (!grid) return;

  grid.innerHTML =
    highlights.map(item => `

      <article class="highlight">

        <div class="highlight-media">

          ${item[0]}

        </div>

        <div class="highlight-body">

          <small>
            ${escapeHtml(item[2])}
          </small>

          <h3>
            ${escapeHtml(item[1])}
          </h3>

          <p>
            ${escapeHtml(item[3])}
          </p>

        </div>

      </article>

    `).join('');

}


/* =========================
   GLOBAL CHAT
========================= */

let lastSent = 0;
let cooldownTimer = null;


function addChatMessage(
  username,
  message
) {

  const messages =
    $('#messages');

  if (!messages) return;

  const element =
    document.createElement('div');

  element.className =
    'msg';

  element.innerHTML = `

    <div class="avatar">

      ${escapeHtml(
        String(username)
          .charAt(0)
          .toUpperCase()
      )}

    </div>

    <div class="bubble">

      <b>
        ${escapeHtml(username)}
      </b>

      <p>
        ${escapeHtml(message)}
      </p>

    </div>

  `;

  messages.appendChild(
    element
  );

  messages.scrollTop =
    messages.scrollHeight;

}


/* =========================
   LOAD CHAT HISTORY
========================= */

async function loadChat() {

  const messages =
    $('#messages');

  if (!messages) return;

  const {
    data,
    error
  } = await supabaseClient

    .from('messages')

    .select('*')

    .order(
      'created_at',
      {
        ascending: true
      }
    );


  if (error) {

    console.error(
      'Chat loading error:',
      error
    );

    return;
  }


  messages.innerHTML = '';


  data.forEach(message => {

    addChatMessage(
      message.username,
      message.message
    );

  });

}


/* =========================
   SEND CHAT
========================= */

async function sendChat() {

  const nameInput =
    $('#chatName');

  const messageInput =
    $('#chatInput');

  if (!messageInput) return;


  const username =
    nameInput?.value.trim() ||
    'Anonymous Soul';


  const message =
    messageInput.value.trim();


  const now =
    Date.now();


  if (!message) return;


  /* 5 SECOND SLOW MODE */

  if (
    now - lastSent < 5000
  ) {

    startCooldown(
      5000 -
      (now - lastSent)
    );

    return;

  }


  /* SAVE TO SUPABASE */

  const {
    error
  } = await supabaseClient

    .from('messages')

    .insert({

      username: username,

      message: message

    });


  if (error) {

    console.error(
      'Supabase chat error:',
      error
    );

    alert(
      'Failed to send message.'
    );

    return;

  }


  /* SEND TO DISCORD */

  const {
    error: discordError
  } =
    await supabaseClient.functions.invoke(
      'discord-webhook',
      {
        body: {
          username: username,
          message: message
        }
      }
    );


  if (discordError) {

    console.error(
      'Discord error:',
      discordError
    );

    console.warn(
      'Message was saved, but Discord delivery failed.'
    );

  }


  messageInput.value = '';

  lastSent =
    now;

  startCooldown(
    5000
  );

}


/* =========================
   SEND BUTTON
========================= */

const sendButton =
  $('#sendBtn');

if (sendButton) {

  sendButton.onclick =
    sendChat;

}


/* =========================
   ENTER TO SEND
========================= */

const chatInput =
  $('#chatInput');

if (chatInput) {

  chatInput.addEventListener(
    'keydown',
    event => {

      if (
        event.key === 'Enter'
      ) {

        event.preventDefault();

        sendChat();

      }

    }
  );

}


/* =========================
   SLOW MODE
========================= */

function startCooldown(ms) {

  clearInterval(
    cooldownTimer
  );

  const end =
    Date.now() + ms;


  if (sendButton) {

    sendButton.disabled =
      true;

  }


  const update =
    () => {

      const remaining =
        Math.max(
          0,
          end - Date.now()
        );


      const cooldown =
        $('#cooldown');


      if (cooldown) {

        cooldown.textContent =
          remaining

            ? `SLOW MODE — ${Math.ceil(
                remaining / 1000
              )}s remaining`

            : 'READY';

      }


      if (
        remaining <= 0
      ) {

        clearInterval(
          cooldownTimer
        );

        if (sendButton) {

          sendButton.disabled =
            false;

        }

      }

    };


  update();


  cooldownTimer =
    setInterval(
      update,
      100
    );

}


/* =========================
   REALTIME CHAT
========================= */

supabaseClient

  .channel(
    'global-chat'
  )

  .on(

    'postgres_changes',

    {

      event: 'INSERT',

      schema: 'public',

      table: 'messages'

    },

    payload => {

      const message =
        payload.new;

      addChatMessage(
        message.username,
        message.message
      );

    }

  )

  .subscribe();


loadChat();


/* =========================
   POST PANEL
========================= */

const postButton =
  $('#postBtn');

if (postButton) {

  postButton.onclick = () => {

    const panel =
      $('#postPanel');

    if (panel) {

      panel.classList.remove(
        'hidden'
      );

    }

  };

}


const closePost =
  $('#closePost');

if (closePost) {

  closePost.onclick = () => {

    const panel =
      $('#postPanel');

    if (panel) {

      panel.classList.add(
        'hidden'
      );

    }

  };

}


/* =========================
   REAL HIGHLIGHT UPLOAD
========================= */

const publishButton =
  $('#publishPost');

if (publishButton) {

  publishButton.onclick =
    async () => {

      const name =
        $('#postName')
          ?.value
          .trim() ||
        'Unknown Soul';


      const title =
        $('#postTitle')
          ?.value
          .trim() ||
        'New Highlight';


      const file =
        $('#postFile')
          ?.files[0];


      if (!file) {

        alert(
          'Choose an image or video first.'
        );

        return;

      }


      const isImage =
        file.type.startsWith(
          'image/'
        );


      const isVideo =
        file.type.startsWith(
          'video/'
        );


      if (
        !isImage &&
        !isVideo
      ) {

        alert(
          'Only images and videos are allowed.'
        );

        return;

      }


      /* 50 MB LIMIT */

      const maxSize =
        50 * 1024 * 1024;


      if (
        file.size > maxSize
      ) {

        alert(
          'File must be 50MB or smaller.'
        );

        return;

      }


      const extension =
        file.name
          .split('.')
          .pop();


      const fileName =
        Date.now() +
        '-' +
        Math.random()
          .toString(36)
          .slice(2) +
        '.' +
        extension;


      const filePath =
        'uploads/' +
        fileName;


      publishButton.disabled =
        true;

      publishButton.textContent =
        'UPLOADING...';


      /* UPLOAD */

      const {
        error: uploadError
      } =
        await supabaseClient

          .storage

          .from('highlights')

          .upload(
            filePath,
            file
          );


      if (uploadError) {

        console.error(
          uploadError
        );

        alert(
          'Upload failed.'
        );

        publishButton.disabled =
          false;

        publishButton.textContent =
          'PUBLISH';

        return;

      }


      /* PUBLIC URL */

      const {
        data: publicData
      } =
        supabaseClient

          .storage

          .from('highlights')

          .getPublicUrl(
            filePath
          );


      const mediaUrl =
        publicData.publicUrl;


      const mediaType =
        isVideo
          ? 'video'
          : 'image';


      /* DATABASE RECORD */

      const {
        error: databaseError
      } =
        await supabaseClient

          .from('highlights')

          .insert({

            username: name,

            title: title,

            media_url: mediaUrl,

            media_type: mediaType

          });


      if (databaseError) {

        console.error(
          databaseError
        );

        alert(
          'Highlight database save failed.'
        );

        publishButton.disabled =
          false;

        publishButton.textContent =
          'PUBLISH';

        return;

      }


      alert(
        '🔥 Highlight posted!'
      );


      const panel =
        $('#postPanel');

      if (panel) {

        panel.classList.add(
          'hidden'
        );

      }


      $('#postName').value =
        '';

      $('#postTitle').value =
        '';

      $('#postMedia').value =
        '';

      $('#postFile').value =
        '';


      publishButton.disabled =
        false;

      publishButton.textContent =
        'PUBLISH';

    };

}


/* =========================
   START
========================= */

renderHighlights();
https://zidnupzpmxighfcmhnco.supabase.co
