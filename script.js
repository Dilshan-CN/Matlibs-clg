'use strict';

// Scroll focused input into view when keyboard opens (mobile fix)
document.addEventListener('focusin', (e) => {
  if (e.target.tagName === 'INPUT') {
    setTimeout(() => {
      e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 320); // wait for keyboard animation
  }
});

// ── Templates ─────────────────────────────content://com.android.externalstorage.documents/tree/primary%3Ac%2B%2B%2FReact%2FPik::primary:c++/React/Pik/script.js─────────────────────────────────
const TEMPLATES = {
  space: {
    emoji: '🚀',
    title: 'Space Adventure',
    story: (w) => `
      Captain ${w.noun} blasted off from ${w.place} in a ${w.adj} rocket ship.
      Mission control had warned them about the ${w.animal}s orbiting Jupiter,
      but nothing could have prepared them for what happened next.
      Without warning, the ship began to ${w.verb} at full speed!
      "${w.funny}!" shouted the captain, clinging to the control panel.
      The crew had to ${w.verb} their way through an asteroid field made entirely
      of giant ${w.noun}s. It was the most ${w.adj} thing any space explorer had
      ever seen. They landed safely back on Earth — heroes of the galaxy,
      smelling faintly of ${w.funny}.
    `
  },
  school: {
    emoji: '🏫',
    title: 'Crazy School Day',
    story: (w) => `
      It was an ordinary Tuesday at ${w.place} Elementary — until Mr. ${w.noun}
      burst through the classroom door riding a ${w.adj} ${w.animal}!
      "Class," he announced, "today we will ${w.verb} instead of doing math!"
      The students cheered so loudly the windows began to ${w.verb}.
      The principal rushed in, slipped on a ${w.noun}, and landed in the
      ${w.adj} aquarium. "By the power of ${w.funny}!" she cried.
      Nobody ever forgot that day. It became a school holiday called
      "${w.funny} Day," celebrated every year with cake and light ${w.verb}-ing.
    `
  },
  fantasy: {
    emoji: '🧙',
    title: 'Fantasy Quest',
    story: (w) => `
      Deep in the ${w.adj} forests of ${w.place}, a brave ${w.animal} warrior
      named ${w.noun} set out to ${w.verb} the ancient curse.
      The wizard handed them a glowing ${w.noun} and whispered: "${w.funny}."
      Armed with nothing but courage and a slightly damp ${w.noun},
      they charged into the dragon's lair. The dragon turned out to be
      surprisingly ${w.adj} and agreed to ${w.verb} peacefully.
      Together they founded the kingdom of ${w.funny}-land, where every citizen
      was required to ${w.verb} at sunrise and keep a pet ${w.animal}.
      And they lived ${w.adj}ly ever after.
    `
  }
};

// ── State ──────────────────────────────────────────────────────────────────
let currentTemplate = null;
let lastStory = null;

// ── Navigation ─────────────────────────────────────────────────────────────
function goTo(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if (id === 'screen-saved') renderSaved();
}

// ── Template pick ──────────────────────────────────────────────────────────
function pickTemplate(key) {
  currentTemplate = key;
  document.getElementById('input-title').textContent =
    TEMPLATES[key].emoji + ' ' + TEMPLATES[key].title;
  clearInputs();
  goTo('screen-input');
}

function clearInputs() {
  ['noun','verb','adj','place','animal','funny'].forEach(f => {
    const el = document.getElementById('f-' + f);
    el.value = '';
    el.classList.remove('error');
  });
  document.getElementById('input-error').classList.add('hidden');
}

// ── Generate ───────────────────────────────────────────────────────────────
function generateStory() {
  const fields = ['noun','verb','adj','place','animal','funny'];
  const vals = {};
  let valid = true;

  fields.forEach(f => {
    const el = document.getElementById('f-' + f);
    const v = el.value.trim();
    if (!v) { el.classList.add('error'); valid = false; }
    else { el.classList.remove('error'); vals[f] = v; }
  });

  if (!valid) {
    document.getElementById('input-error').classList.remove('hidden');
    return;
  }
  document.getElementById('input-error').classList.add('hidden');

  const t = TEMPLATES[currentTemplate];
  const rawStory = t.story(vals).trim().replace(/\s+/g, ' ');

  // Highlight the user words
  let highlighted = rawStory;
  Object.values(vals).forEach(v => {
    const escaped = v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    highlighted = highlighted.replace(
      new RegExp(`\\b${escaped}\\b`, 'g'),
      `<span class="highlight">${v}</span>`
    );
  });

  document.getElementById('result-emoji').textContent = t.emoji;
  document.getElementById('result-title').textContent = t.title;
  document.getElementById('result-body').innerHTML = highlighted;

  lastStory = {
    template: currentTemplate,
    emoji: t.emoji,
    title: t.title,
    body: rawStory,
    words: vals,
    date: new Date().toLocaleDateString()
  };

  goTo('screen-result');
}

// ── Save ───────────────────────────────────────────────────────────────────
function saveStory() {
  if (!lastStory) return;
  const saved = getSaved();
  saved.unshift({ ...lastStory, id: Date.now() });
  localStorage.setItem('madlibs_stories', JSON.stringify(saved.slice(0, 20)));
  showToast('Story saved! 💾');
}

function getSaved() {
  try { return JSON.parse(localStorage.getItem('madlibs_stories')) || []; }
  catch { return []; }
}

function deleteStory(id) {
  const filtered = getSaved().filter(s => s.id !== id);
  localStorage.setItem('madlibs_stories', JSON.stringify(filtered));
  renderSaved();
}

function renderSaved() {
  const list = document.getElementById('saved-list');
  const stories = getSaved();
  if (!stories.length) {
    list.innerHTML = `<div class="empty-state">
      <div class="empty-icon">📭</div>
      <p>No saved stories yet.<br>Generate one and tap 💾 to save it!</p>
    </div>`;
    return;
  }
  list.innerHTML = stories.map(s => `
    <div class="saved-item">
      <div class="saved-item-header">
        <span class="saved-item-title">${s.emoji} ${s.title}</span>
        <button class="saved-delete" onclick="deleteStory(${s.id})">🗑</button>
      </div>
      <div class="saved-item-date">${s.date}</div>
      <div class="saved-item-body">${s.body}</div>
    </div>
  `).join('');
}

// ── Share ──────────────────────────────────────────────────────────────────
async function shareStory() {
  if (!lastStory) return;
  const text = `${lastStory.emoji} ${lastStory.title}\n\n${lastStory.body}\n\nMade with Mad Libs 🎭`;
  if (navigator.share) {
    try { await navigator.share({ title: lastStory.title, text }); return; }
    catch { /* fallthrough */ }
  }
  try {
    await navigator.clipboard.writeText(text);
    showToast('Copied to clipboard! 📋');
  } catch {
    showToast('Could not copy 😕');
  }
}

// ── Toast ──────────────────────────────────────────────────────────────────
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add('hidden'), 2200);
}
