/* ─────────────────────────────────────────────
   Plate · a tiny protein-first meal planner
   pure JS, localStorage-backed, no build step
   ───────────────────────────────────────────── */

(() => {

  // ─── storage ───
  const STORE_KEY = 'plate.v1';
  const DEFAULT_STATE = {
    meals: [],     // {id, ymd, slot, name, desc, protein, cal, carbs, fat, image}
    ideas: [],     // {id, name, recipe, tag, protein, cal, createdAt}
    target: 120,
  };
  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return structuredClone(DEFAULT_STATE);
      const parsed = JSON.parse(raw);
      return { ...structuredClone(DEFAULT_STATE), ...parsed };
    } catch {
      return structuredClone(DEFAULT_STATE);
    }
  }
  function save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch (e) {
      toast('Storage is full — try removing meal images.');
    }
  }

  // ─── helpers ───
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const uid = () => Math.random().toString(36).slice(2, 10);

  const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const SLOT_ORDER = { breakfast: 0, lunch: 1, dinner: 2, snack: 3 };

  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function ymd(d) {
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }
  function parseYmd(s) {
    const [y, m, d] = s.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  function startOfWeek(d) {
    // Monday-start week
    const x = new Date(d);
    const dow = x.getDay(); // 0 Sun .. 6 Sat
    const diff = (dow + 6) % 7;
    x.setDate(x.getDate() - diff);
    x.setHours(0,0,0,0);
    return x;
  }
  function addDays(d, n) {
    const x = new Date(d);
    x.setDate(x.getDate() + n);
    return x;
  }
  function todayYmd() { return ymd(new Date()); }

  function num(v) {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
  }

  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { el.hidden = true; }, 2400);
  }

  // ─── state ───
  let viewWeekStart = startOfWeek(new Date());

  // ─── targets ───
  function renderToday() {
    const today = todayYmd();
    const meals = state.meals.filter(m => m.ymd === today);
    const totals = meals.reduce((acc, m) => ({
      cal: acc.cal + num(m.cal),
      protein: acc.protein + num(m.protein),
      carbs: acc.carbs + num(m.carbs),
      fat: acc.fat + num(m.fat),
    }), { cal: 0, protein: 0, carbs: 0, fat: 0 });

    const d = new Date();
    $('#today-date').textContent =
      DAY_NAMES[d.getDay()] + ', ' + MONTH_NAMES[d.getMonth()] + ' ' + d.getDate();

    $('#today-protein').textContent = Math.round(totals.protein);
    $('#today-target').textContent = state.target;
    $('#today-cal').textContent = Math.round(totals.cal);
    $('#today-carbs').innerHTML = Math.round(totals.carbs) + '<span class="macro-g">g</span>';
    $('#today-fat').innerHTML = Math.round(totals.fat) + '<span class="macro-g">g</span>';

    const remaining = Math.max(0, state.target - totals.protein);
    $('#today-remaining').innerHTML = Math.round(remaining) + '<span class="macro-g">g</span>';

    const pct = Math.min(100, (totals.protein / state.target) * 100);
    const fill = $('#today-progress');
    fill.style.width = pct + '%';
    fill.classList.toggle('complete', totals.protein >= state.target);

    $('#target-chip').textContent = state.target + 'g';
  }

  // ─── week view ───
  function renderWeek() {
    const grid = $('#week-grid');
    grid.innerHTML = '';
    const today = todayYmd();
    const days = Array.from({ length: 7 }, (_, i) => addDays(viewWeekStart, i));

    const first = days[0], last = days[6];
    const sameMonth = first.getMonth() === last.getMonth();
    const lbl = sameMonth
      ? `${MONTH_NAMES[first.getMonth()]} ${first.getDate()} – ${last.getDate()}`
      : `${MONTH_NAMES[first.getMonth()]} ${first.getDate()} – ${MONTH_NAMES[last.getMonth()]} ${last.getDate()}`;
    $('#week-label').textContent = lbl;

    for (const d of days) {
      const dYmd = ymd(d);
      const dayMeals = state.meals
        .filter(m => m.ymd === dYmd)
        .sort((a, b) => (SLOT_ORDER[a.slot] ?? 9) - (SLOT_ORDER[b.slot] ?? 9));
      const protein = dayMeals.reduce((s, m) => s + num(m.protein), 0);

      const el = document.createElement('div');
      el.className = 'day' + (dYmd === today ? ' is-today' : '');
      el.dataset.ymd = dYmd;

      const pct = Math.min(100, (protein / state.target) * 100);
      const complete = protein >= state.target;

      el.innerHTML = `
        <div class="day-head">
          <span class="day-name">${DAY_NAMES[d.getDay()]}</span>
          <span class="day-date">${MONTH_NAMES[d.getMonth()]} ${d.getDate()}</span>
        </div>
        <div class="day-protein">
          <span class="day-protein-num">${Math.round(protein)}</span>
          <span class="day-protein-g">g</span>
          <span class="day-protein-of">of ${state.target}g</span>
        </div>
        <div class="day-protein-bar">
          <div class="day-protein-bar-fill ${complete ? 'complete' : ''}" style="width:${pct}%"></div>
        </div>
        <div class="day-meals"></div>
        <button class="day-add" data-add="${dYmd}">＋ add meal</button>
      `;

      const mealsEl = $('.day-meals', el);
      for (const m of dayMeals) {
        const card = document.createElement('button');
        card.className = 'meal-card' + (m.image ? ' has-image' : '');
        card.dataset.id = m.id;
        card.innerHTML = `
          ${m.image ? `<img class="meal-card-thumb" src="${m.image}" alt=""/>` : ''}
          <div class="meal-card-slot">${m.slot}</div>
          <div class="meal-card-name">${escapeHtml(m.name || 'Untitled meal')}</div>
          <span class="meal-card-protein">
            ${Math.round(num(m.protein))}<span class="meal-card-protein-g">g protein</span>
          </span>
        `;
        card.addEventListener('click', () => openMealModal(m));
        mealsEl.appendChild(card);
      }

      // drop target for ideas
      el.addEventListener('dragover', (e) => {
        if (!e.dataTransfer.types.includes('text/plate-idea')) return;
        e.preventDefault();
        el.classList.add('drop-target');
      });
      el.addEventListener('dragleave', () => el.classList.remove('drop-target'));
      el.addEventListener('drop', (e) => {
        e.preventDefault();
        el.classList.remove('drop-target');
        const ideaId = e.dataTransfer.getData('text/plate-idea');
        if (ideaId) addIdeaToDay(ideaId, dYmd, 'lunch');
      });

      $('.day-add', el).addEventListener('click', (e) => {
        e.stopPropagation();
        openMealModal(null, { ymd: dYmd });
      });

      grid.appendChild(el);
    }
  }

  function escapeHtml(s) {
    return String(s ?? '').replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  // ─── ideas view ───
  function renderIdeas() {
    const grid = $('#ideas-grid');
    grid.innerHTML = '';

    if (state.ideas.length === 0) {
      grid.innerHTML = `
        <div class="idea-empty">
          <h4>No ideas yet.</h4>
          <p>Paste a recipe or jot down a meal you want to try. Then drag it onto a day to plan it.</p>
        </div>`;
      return;
    }

    const sorted = state.ideas.slice().sort((a, b) => b.createdAt - a.createdAt);
    for (const idea of sorted) {
      const el = document.createElement('div');
      el.className = 'idea-card';
      el.draggable = true;
      el.dataset.id = idea.id;
      const proteinHtml = idea.protein
        ? `<span class="idea-card-protein">${idea.protein}<span class="meal-card-protein-g">g</span></span>`
        : `<span class="idea-card-protein idea-card-protein-empty">no protein set</span>`;
      el.innerHTML = `
        <div class="idea-card-head">
          <h3 class="idea-card-name">${escapeHtml(idea.name)}</h3>
          ${proteinHtml}
        </div>
        <div class="idea-card-recipe">${escapeHtml(idea.recipe || '')}</div>
        <div class="idea-card-foot">
          <span class="idea-card-tag">${escapeHtml(idea.tag || '')}</span>
          <div class="idea-card-actions">
            <button class="btn btn-ghost btn-sm" data-plan="${idea.id}">Plan it</button>
            <button class="btn btn-ghost btn-sm" data-edit-idea="${idea.id}">Edit</button>
          </div>
        </div>
      `;
      el.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plate-idea', idea.id);
        e.dataTransfer.effectAllowed = 'copy';
        el.classList.add('dragging');
      });
      el.addEventListener('dragend', () => el.classList.remove('dragging'));
      grid.appendChild(el);
    }

    $$('#ideas-grid [data-plan]').forEach(b => b.addEventListener('click', (e) => {
      e.stopPropagation();
      openPlanModal(b.dataset.plan);
    }));
    $$('#ideas-grid [data-edit-idea]').forEach(b => b.addEventListener('click', (e) => {
      e.stopPropagation();
      const idea = state.ideas.find(i => i.id === b.dataset.editIdea);
      if (idea) openIdeaModal(idea);
    }));
  }

  // ─── meal modal ───
  let currentMealId = null;
  let currentImage = null;

  function openMealModal(meal, defaults = {}) {
    currentMealId = meal?.id ?? null;
    currentImage = meal?.image ?? null;

    $('#meal-modal-title').textContent = meal ? 'Edit meal' : 'Log a meal';
    $('#delete-meal-btn').hidden = !meal;

    $('#f-name').value = meal?.name ?? '';
    $('#f-desc').value = meal?.desc ?? '';
    $('#f-protein').value = meal?.protein ?? '';
    $('#f-cal').value = meal?.cal ?? '';
    $('#f-carbs').value = meal?.carbs ?? '';
    $('#f-fat').value = meal?.fat ?? '';
    $('#f-date').value = meal?.ymd ?? defaults.ymd ?? todayYmd();
    $('#f-slot').value = meal?.slot ?? defaults.slot ?? 'lunch';

    if (currentImage) {
      $('#dropzone-empty').hidden = true;
      $('#dropzone-preview').hidden = false;
      $('#dropzone-img').src = currentImage;
    } else {
      $('#dropzone-empty').hidden = false;
      $('#dropzone-preview').hidden = true;
      $('#dropzone-img').removeAttribute('src');
    }
    $('#ocr-status').hidden = true;

    openModal('#meal-modal');
    setTimeout(() => $('#f-name').focus(), 50);
  }

  function saveMealFromModal() {
    const name = $('#f-name').value.trim();
    const protein = num($('#f-protein').value);
    if (!name && !protein) {
      toast('Add at least a name or protein amount.');
      return;
    }

    const m = {
      id: currentMealId || uid(),
      ymd: $('#f-date').value || todayYmd(),
      slot: $('#f-slot').value || 'lunch',
      name: name || 'Untitled meal',
      desc: $('#f-desc').value.trim(),
      protein: num($('#f-protein').value),
      cal: num($('#f-cal').value),
      carbs: num($('#f-carbs').value),
      fat: num($('#f-fat').value),
      image: currentImage || null,
    };

    if (currentMealId) {
      state.meals = state.meals.map(x => x.id === currentMealId ? m : x);
      toast('Meal updated');
    } else {
      state.meals.push(m);
      toast('Meal logged');
    }
    save();
    closeModal('#meal-modal');
    renderAll();
  }

  function deleteCurrentMeal() {
    if (!currentMealId) return;
    if (!confirm('Delete this meal?')) return;
    state.meals = state.meals.filter(x => x.id !== currentMealId);
    save();
    closeModal('#meal-modal');
    renderAll();
    toast('Meal deleted');
  }

  // ─── OCR ───
  async function runOCR(imageData) {
    if (typeof Tesseract === 'undefined') {
      toast('OCR engine not loaded — fill the macros manually.');
      return;
    }
    const status = $('#ocr-status');
    status.hidden = false;
    try {
      const { data } = await Tesseract.recognize(imageData, 'eng');
      const text = data.text || '';
      const parsed = parseMacros(text);

      if (parsed.name && !$('#f-name').value) $('#f-name').value = parsed.name;
      if (parsed.desc && !$('#f-desc').value) $('#f-desc').value = parsed.desc;
      if (parsed.protein && !$('#f-protein').value) $('#f-protein').value = parsed.protein;
      if (parsed.cal && !$('#f-cal').value) $('#f-cal').value = parsed.cal;
      if (parsed.carbs && !$('#f-carbs').value) $('#f-carbs').value = parsed.carbs;
      if (parsed.fat && !$('#f-fat').value) $('#f-fat').value = parsed.fat;

      const found = ['name','protein','cal','carbs','fat'].filter(k => parsed[k]).length;
      if (found > 0) toast(`Read ${found} field${found === 1 ? '' : 's'} from screenshot.`);
      else toast('Couldn\'t read macros — fill them in manually.');
    } catch (e) {
      console.error(e);
      toast('OCR failed — fill the macros manually.');
    } finally {
      status.hidden = true;
    }
  }

  function parseMacros(text) {
    const out = { name: '', desc: '', protein: 0, cal: 0, carbs: 0, fat: 0 };
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

    // numeric extracts — search across the whole text, case-insensitive
    const numNearLabel = (labelRegex) => {
      // try number-then-label
      const m1 = text.match(new RegExp(`(\\d+(?:\\.\\d+)?)\\s*g?\\s*(?:${labelRegex})`, 'i'));
      if (m1) return parseFloat(m1[1]);
      // try label-then-number
      const m2 = text.match(new RegExp(`(?:${labelRegex})\\s*[:\\-]?\\s*(\\d+(?:\\.\\d+)?)`, 'i'));
      if (m2) return parseFloat(m2[1]);
      return 0;
    };

    out.protein = numNearLabel('protein');
    out.carbs   = numNearLabel('carbs|carbohydrates');
    out.fat     = numNearLabel('fat');
    // cal: avoid matching "calcium" etc.
    const calMatch = text.match(/(\d{2,4})\s*(?:cal|kcal|calories)\b/i)
                  || text.match(/\b(?:cal|kcal|calories)\b\s*[:\-]?\s*(\d{2,4})/i);
    if (calMatch) out.cal = parseFloat(calMatch[1]);

    // name + desc: find a likely meal title line.
    // Skip noise lines (delivery, arriving, addresses, times, macro labels, button labels)
    const noise = /^(delivery|arriving|skip delivery|edit order|monday|tuesday|wednesday|thursday|friday|saturday|sunday|shoplocale\.com|cal|protein|carbs|fat)/i;
    const isAddress = /\d{4,5}|street|st\.?\s|ave|blvd|94\d{3}/i;
    const isTime = /\b\d{1,2}(:\d{2})?\s*[ap]m\b/i;

    const candidates = lines
      .filter(l => l.length >= 4 && l.length <= 80)
      .filter(l => !noise.test(l))
      .filter(l => !isAddress.test(l))
      .filter(l => !isTime.test(l))
      .filter(l => !/^\d+\s*g?$/.test(l))
      .filter(l => !/^[\d\s\W]+$/.test(l));

    // prefer a line that doesn't start with "with " — that's usually the title
    const title = candidates.find(l => !/^with\s/i.test(l));
    const withLine = candidates.find(l => /^with\s/i.test(l));
    if (title) out.name = title.replace(/[‘'`]/g, "'").trim();
    if (withLine) out.desc = withLine.trim();

    return out;
  }

  // ─── image handling ───
  function handleImageFile(file) {
    if (!file || !file.type.startsWith('image/')) {
      toast('That doesn\'t look like an image.');
      return;
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = await downscaleImage(e.target.result, 900);
      currentImage = dataUrl;
      $('#dropzone-empty').hidden = true;
      $('#dropzone-preview').hidden = false;
      $('#dropzone-img').src = dataUrl;
      runOCR(dataUrl);
    };
    reader.readAsDataURL(file);
  }

  function downscaleImage(dataUrl, maxDim) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const ratio = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.round(img.width * ratio);
        const h = Math.round(img.height * ratio);
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  }

  // ─── idea modal ───
  let currentIdeaId = null;
  function openIdeaModal(idea) {
    currentIdeaId = idea?.id ?? null;
    $('#idea-modal-title').textContent = idea ? 'Edit meal idea' : 'New meal idea';
    $('#delete-idea-btn').hidden = !idea;
    $('#i-name').value = idea?.name ?? '';
    $('#i-recipe').value = idea?.recipe ?? '';
    $('#i-tag').value = idea?.tag ?? '';
    $('#i-protein').value = idea?.protein ?? '';
    $('#i-cal').value = idea?.cal ?? '';
    openModal('#idea-modal');
    setTimeout(() => $('#i-name').focus(), 50);
  }
  function saveIdeaFromModal() {
    const name = $('#i-name').value.trim();
    if (!name) { toast('Give your idea a name.'); return; }
    const idea = {
      id: currentIdeaId || uid(),
      name,
      recipe: $('#i-recipe').value,
      tag: $('#i-tag').value.trim(),
      protein: num($('#i-protein').value) || null,
      cal: num($('#i-cal').value) || null,
      createdAt: currentIdeaId
        ? (state.ideas.find(i => i.id === currentIdeaId)?.createdAt ?? Date.now())
        : Date.now(),
    };
    if (currentIdeaId) {
      state.ideas = state.ideas.map(x => x.id === currentIdeaId ? idea : x);
      toast('Idea updated');
    } else {
      state.ideas.push(idea);
      toast('Idea saved');
    }
    save();
    closeModal('#idea-modal');
    renderIdeas();
  }
  function deleteCurrentIdea() {
    if (!currentIdeaId) return;
    if (!confirm('Delete this idea?')) return;
    state.ideas = state.ideas.filter(x => x.id !== currentIdeaId);
    save();
    closeModal('#idea-modal');
    renderIdeas();
    toast('Idea deleted');
  }

  // ─── plan-idea modal ───
  let planningIdeaId = null;
  function openPlanModal(ideaId) {
    const idea = state.ideas.find(i => i.id === ideaId);
    if (!idea) return;
    planningIdeaId = ideaId;
    $('#plan-modal-lede').innerHTML =
      `Pick a day for <strong>${escapeHtml(idea.name)}</strong>` +
      (idea.protein ? ` <span style="color:var(--maroon)">· ${idea.protein}g protein</span>` : '');
    $('#p-date').value = todayYmd();
    $('#p-slot').value = 'lunch';
    openModal('#plan-modal');
  }
  function confirmPlan() {
    if (!planningIdeaId) return;
    addIdeaToDay(planningIdeaId, $('#p-date').value, $('#p-slot').value);
    closeModal('#plan-modal');
  }
  function addIdeaToDay(ideaId, dYmd, slot) {
    const idea = state.ideas.find(i => i.id === ideaId);
    if (!idea) return;
    state.meals.push({
      id: uid(),
      ymd: dYmd,
      slot: slot || 'lunch',
      name: idea.name,
      desc: '',
      protein: num(idea.protein),
      cal: num(idea.cal),
      carbs: 0,
      fat: 0,
      image: null,
    });
    save();
    renderAll();
    const d = parseYmd(dYmd);
    toast(`Added to ${DAY_NAMES[d.getDay()]} ${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`);
  }

  // ─── target modal ───
  function openTargetModal() {
    $('#target-input').value = state.target;
    openModal('#target-modal');
    setTimeout(() => $('#target-input').focus(), 50);
  }
  function saveTarget() {
    const v = parseInt($('#target-input').value, 10);
    if (!v || v < 1) { toast('Pick a positive number.'); return; }
    state.target = v;
    save();
    closeModal('#target-modal');
    renderAll();
    toast(`Target set to ${v}g`);
  }

  // ─── modal helpers ───
  function openModal(sel) {
    const el = $(sel);
    el.hidden = false;
    el.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(sel) {
    const el = $(sel);
    el.hidden = true;
    el.setAttribute('aria-hidden', 'true');
    if ($$('.modal:not([hidden])').length === 0) {
      document.body.style.overflow = '';
    }
  }

  // ─── wiring ───
  function renderAll() {
    renderToday();
    renderWeek();
    renderIdeas();
  }

  function bind() {
    // header
    $('#add-meal-btn').addEventListener('click', () => openMealModal(null));
    $('#add-idea-btn').addEventListener('click', () => openIdeaModal(null));
    $('#add-idea-btn-2').addEventListener('click', () => openIdeaModal(null));
    $('#open-target-btn').addEventListener('click', openTargetModal);

    // week nav
    $('#prev-week').addEventListener('click', () => { viewWeekStart = addDays(viewWeekStart, -7); renderWeek(); });
    $('#next-week').addEventListener('click', () => { viewWeekStart = addDays(viewWeekStart, 7); renderWeek(); });
    $('#today-btn').addEventListener('click', () => { viewWeekStart = startOfWeek(new Date()); renderWeek(); });

    // modal close
    $$('[data-close]').forEach(el => el.addEventListener('click', () => {
      const modal = el.closest('.modal');
      if (modal) closeModal('#' + modal.id);
    }));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const open = $('.modal:not([hidden])');
        if (open) closeModal('#' + open.id);
      }
      if ((e.key === 'm' || e.key === 'M') && !isTyping(e.target)) {
        openMealModal(null);
      }
    });

    // meal modal
    $('#save-meal-btn').addEventListener('click', saveMealFromModal);
    $('#delete-meal-btn').addEventListener('click', deleteCurrentMeal);

    // dropzone
    const dz = $('#dropzone');
    const fileInput = $('#meal-image-input');
    dz.addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      fileInput.click();
    });
    dz.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); }
    });
    fileInput.addEventListener('change', (e) => {
      const f = e.target.files?.[0];
      if (f) handleImageFile(f);
      fileInput.value = '';
    });
    ['dragenter','dragover'].forEach(evt => dz.addEventListener(evt, (e) => {
      e.preventDefault(); dz.classList.add('is-drag');
    }));
    ['dragleave','drop'].forEach(evt => dz.addEventListener(evt, () => {
      dz.classList.remove('is-drag');
    }));
    dz.addEventListener('drop', (e) => {
      e.preventDefault();
      const f = e.dataTransfer.files?.[0];
      if (f) handleImageFile(f);
    });

    // also accept paste of image in the meal modal
    $('#meal-modal').addEventListener('paste', (e) => {
      const items = e.clipboardData?.items || [];
      for (const it of items) {
        if (it.type.startsWith('image/')) {
          const f = it.getAsFile();
          if (f) { handleImageFile(f); e.preventDefault(); break; }
        }
      }
    });

    $('#clear-image-btn').addEventListener('click', () => {
      currentImage = null;
      $('#dropzone-empty').hidden = false;
      $('#dropzone-preview').hidden = true;
      $('#dropzone-img').removeAttribute('src');
    });
    $('#rescan-btn').addEventListener('click', () => {
      if (currentImage) runOCR(currentImage);
    });

    // idea modal
    $('#save-idea-btn').addEventListener('click', saveIdeaFromModal);
    $('#delete-idea-btn').addEventListener('click', deleteCurrentIdea);

    // plan modal
    $('#confirm-plan-btn').addEventListener('click', confirmPlan);

    // target modal
    $('#save-target-btn').addEventListener('click', saveTarget);
    $('#target-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') saveTarget();
    });
  }

  function isTyping(el) {
    if (!el) return false;
    const tag = el.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
  }

  // ─── seed first-run sample ideas ───
  function seedIfEmpty() {
    if (state.ideas.length > 0 || state.meals.length > 0) return;
    state.ideas = [
      {
        id: uid(),
        name: 'Greek yogurt parfait',
        recipe: '1 cup full-fat Greek yogurt\n2 tbsp whey or collagen\n1/2 cup berries\n2 tbsp granola or chopped almonds\nDrizzle of honey',
        tag: 'breakfast · quick',
        protein: 32,
        cal: 380,
        createdAt: Date.now() - 3000,
      },
      {
        id: uid(),
        name: 'Sheet-pan chicken & broccolini',
        recipe: '6 oz chicken thighs · olive oil · garlic\nBroccolini, lemon, chili flakes\n425°F · 22 min\nServe with a spoon of tahini yogurt.',
        tag: 'dinner · meal-prep',
        protein: 45,
        cal: 520,
        createdAt: Date.now() - 2000,
      },
      {
        id: uid(),
        name: 'Cottage cheese + smoked salmon toast',
        recipe: 'Sourdough toast\n1/2 cup cottage cheese\n2 oz smoked salmon\nCucumber, dill, lemon, cracked pepper',
        tag: 'lunch · 5 min',
        protein: 36,
        cal: 410,
        createdAt: Date.now() - 1000,
      },
    ];
    save();
  }

  // ─── init ───
  document.addEventListener('DOMContentLoaded', () => {
    bind();
    seedIfEmpty();
    renderAll();
  });

})();
