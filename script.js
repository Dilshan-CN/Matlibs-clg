'use strict';

// Scroll focused input into view when keyboard opens (mobile fix)
document.addEventListener('focusin', (e) => {
  if (e.target.tagName === 'INPUT') {
    setTimeout(() => {
      e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 320); // wait for keyboard animation
  }
});

// ── Templates ──────────────────────────────────────────────────────────────
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
  },
  pirate: {
    emoji: '🏴‍☠️',
    title: 'Pirate Voyage',
    story: (w) => `
      Captain ${w.noun} of the ship "${w.funny}" sailed the ${w.adj} seas
      in search of the legendary treasure of ${w.place}.
      The crew — mostly ${w.animal}s in tiny hats — refused to ${w.verb}
      unless they were paid in ${w.noun}s.
      A rival pirate appeared out of nowhere screaming "${w.funny}!"
      and throwing ${w.adj} ${w.noun}s at the deck.
      Just as all hope was lost, the ship's pet ${w.animal} began to ${w.verb}
      so magnificently that the enemy surrendered on the spot.
      The treasure turned out to be a single, very ${w.adj} ${w.noun}. Worth it.
    `
  },
  superhero: {
    emoji: '🦸',
    title: 'Superhero Chaos',
    story: (w) => `
      The city of ${w.place} was in danger! Villain Doctor ${w.funny}
      had stolen every ${w.noun} in town and replaced them with ${w.adj} ${w.animal}s.
      Enter: ${w.adj} Man — hero with the power to ${w.verb} at supersonic speed.
      "Your ${w.noun} ends here!" shouted the hero, landing with a ${w.adj} thud.
      The villain launched a giant ${w.noun} cannon, but ${w.adj} Man simply
      began to ${w.verb} — confusing everyone long enough to save the day.
      The mayor awarded them the Golden ${w.noun} for bravery.
      Doctor ${w.funny} vowed revenge, but mostly just went home for a nap.
    `
  },
  chef: {
    emoji: '👨‍🍳',
    title: 'Cooking Disaster',
    story: (w) => `
      Chef ${w.noun} had one hour to cook a ${w.adj} meal for the king of ${w.place}.
      The recipe called for three cups of ${w.funny}, a ${w.adj} ${w.animal},
      and exactly one ${w.noun} — lightly toasted.
      Everything went wrong when the oven began to ${w.verb} uncontrollably.
      The sous-chef tripped and spilled ${w.funny} all over the dessert.
      In a panic, Chef ${w.noun} decided to ${w.verb} the entire dish
      and serve it as a deconstructed masterpiece.
      The king took one bite, whispered "${w.funny}," and immediately
      awarded the restaurant five ${w.adj} stars.
    `
  },
  detective: {
    emoji: '🕵️',
    title: 'Mystery at Midnight',
    story: (w) => `
      Detective ${w.noun} arrived at ${w.place} to investigate
      the mysterious disappearance of a ${w.adj} ${w.animal}.
      The only clue: a sticky note reading "${w.funny}" left on a ${w.noun}.
      The prime suspect was a ${w.adj} butler who could only ${w.verb}
      when questioned — never speak.
      After hours of intense ${w.verb}-ing, the detective discovered
      the ${w.animal} had simply wandered into a nearby ${w.noun} factory.
      "Elementary," said Detective ${w.noun}, adjusting their ${w.adj} hat.
      The case was closed. The ${w.funny} was never explained.
    `
  },
  timetravel: {
    emoji: '⏰',
    title: 'Time Travel Trouble',
    story: (w) => `
      ${w.noun} accidentally built a time machine out of a ${w.adj} ${w.animal}
      and a broken ${w.noun} from ${w.place}.
      The first jump landed them in ancient times, where everyone expected
      them to ${w.verb} for the emperor's entertainment.
      They accidentally introduced "${w.funny}" to history —
      historians are still confused about this.
      Jumping to the future, they found a ${w.adj} civilisation that worshipped
      a giant golden ${w.noun} and communicated entirely by ${w.verb}-ing.
      To get home, they traded their last ${w.funny} to a time cop named ${w.noun}.
      Totally worth it.
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
