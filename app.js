/**
 * Pandas Wok Perchtoldsdorf
 * Opening status, navigation, reservation drawer, scroll reveals.
 */

// --- Data -----------------------------------------------------------------

// Opening hours as [from, to] in decimal hours. Sunday = 0.
const HOURS = {
  weekday: [[11.5, 15], [17.5, 22]],
  weekend: [[12, 22]]
};

const DAY_SHORT = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
const LAST_SEATING_BEFORE_CLOSE = 1.5; // hours
const DRAWER_CLOSE_MS = 350;           // slightly longer than the 0.3s panel transition

const slotsForDay = day => (day === 0 || day === 6 ? HOURS.weekend : HOURS.weekday);
const fmtHour = h => `${String(Math.floor(h)).padStart(2, '0')}:${String(Math.round((h % 1) * 60)).padStart(2, '0')}`;
const toISODate = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// --- Init -----------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initStatus();
  initHoursTable();
  initReservation();
  initReveal();

  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
});

// --- Header & navigation --------------------------------------------------

function initHeader() {
  const header = document.getElementById('siteHeader');
  const nav = document.getElementById('mainNav');
  const toggle = document.getElementById('menuToggle');
  if (!header) return;

  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (!nav || !toggle) return;

  const setMenu = open => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };

  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setMenu(false);
      toggle.focus();
    }
  });
  window.matchMedia('(min-width: 1081px)').addEventListener('change', e => { if (e.matches) setMenu(false); });
}

// --- Opening status -------------------------------------------------------

function getStatus(now = new Date()) {
  const day = now.getDay();
  const t = now.getHours() + now.getMinutes() / 60;
  const today = slotsForDay(day);

  const current = today.find(([from, to]) => t >= from && t < to);
  if (current) return { open: true, text: `Geöffnet · bis ${fmtHour(current[1])}` };

  const laterToday = today.find(([from]) => t < from);
  if (laterToday) return { open: false, text: `Geschlossen · ab ${fmtHour(laterToday[0])}` };

  const tomorrow = (day + 1) % 7;
  return { open: false, text: `Geschlossen · ${DAY_SHORT[tomorrow]} ab ${fmtHour(slotsForDay(tomorrow)[0][0])}` };
}

function initStatus() {
  const targets = document.querySelectorAll('[data-status]');
  if (!targets.length) return;

  const render = () => {
    const status = getStatus();
    targets.forEach(el => {
      el.classList.toggle('is-open', status.open);
      const text = el.querySelector('[data-status-text]');
      if (text) text.textContent = status.text;
    });
  };
  render();
  setInterval(render, 60 * 1000);
}

function initHoursTable() {
  const today = String(new Date().getDay());
  document.querySelectorAll('.hours tr[data-days]').forEach(row => {
    row.classList.toggle('is-today', row.dataset.days.split(',').includes(today));
  });
}

// --- Reservation drawer ---------------------------------------------------

const drawer = {
  el: null,
  lastFocus: null,
  closeTimer: null
};

function initReservation() {
  drawer.el = document.getElementById('reservation');
  const form = document.getElementById('resForm');
  const dateInput = document.getElementById('resDate');
  const guestsSelect = document.getElementById('resGuests');
  if (!drawer.el || !form || !dateInput || !guestsSelect) return;

  document.querySelectorAll('[data-open-reservation]').forEach(btn => {
    btn.addEventListener('click', openReservation);
  });
  drawer.el.querySelectorAll('[data-close-reservation]').forEach(btn => {
    btn.addEventListener('click', closeReservation);
  });

  document.addEventListener('keydown', e => {
    if (drawer.el.hidden) return;
    if (e.key === 'Escape') closeReservation();
    if (e.key === 'Tab') trapFocus(e);
  });

  const today = new Date();
  dateInput.min = toISODate(today);
  dateInput.value = toISODate(today);
  renderTimeSlots();
  dateInput.addEventListener('change', renderTimeSlots);

  guestsSelect.addEventListener('change', () => {
    document.getElementById('groupHint').hidden = guestsSelect.value !== '10';
  });

  form.addEventListener('input', e => {
    const field = e.target.closest('.field');
    if (field && field.classList.contains('has-error')) setFieldError(e.target, false);
  });

  form.addEventListener('submit', submitReservation);
}

function renderTimeSlots() {
  const dateInput = document.getElementById('resDate');
  const select = document.getElementById('resTime');
  const previous = select.value;

  let date = dateInput.value ? new Date(`${dateInput.value}T00:00`) : new Date();
  let slots = buildSlots(date);

  // Today might already be over – jump to tomorrow instead of showing an empty list
  if (!slots.length) {
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    dateInput.value = toISODate(date);
    slots = buildSlots(date);
  }

  select.innerHTML = '';
  const groups = slotsForDay(date.getDay()).length > 1
    ? [['Mittag', h => h < 16], ['Abend', h => h >= 16]]
    : [['Ganztägig', () => true]];

  groups.forEach(([label, test]) => {
    const inGroup = slots.filter(test);
    if (!inGroup.length) return;
    const group = document.createElement('optgroup');
    group.label = label;
    inGroup.forEach(h => group.append(new Option(`${fmtHour(h)} Uhr`, fmtHour(h))));
    select.append(group);
  });

  const values = slots.map(fmtHour);
  if (values.includes(previous)) {
    select.value = previous;
  } else {
    const evening = slots.find(h => h >= 18);
    select.value = evening !== undefined ? fmtHour(evening) : values[0];
  }
}

function buildSlots(date) {
  const now = new Date();
  const isToday = toISODate(date) === toISODate(now);
  const earliest = isToday ? now.getHours() + now.getMinutes() / 60 + 0.5 : 0;

  const slots = [];
  slotsForDay(date.getDay()).forEach(([from, to]) => {
    for (let h = from; h <= to - LAST_SEATING_BEFORE_CLOSE; h += 0.5) {
      if (h >= earliest) slots.push(h);
    }
  });
  return slots;
}

function openReservation() {
  clearTimeout(drawer.closeTimer);
  drawer.lastFocus = document.activeElement;

  renderTimeSlots();

  drawer.el.hidden = false;
  document.documentElement.classList.add('drawer-open');
  document.body.classList.add('drawer-open');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => drawer.el.classList.add('is-open'));
  });

  setTimeout(() => {
    const first = drawer.el.querySelector('#resForm:not([hidden]) input, #resSuccess:not([hidden]) button');
    if (first) first.focus({ preventScroll: true });
  }, 80);
}

function closeReservation() {
  if (drawer.el.hidden) return;
  drawer.el.classList.remove('is-open');
  document.documentElement.classList.remove('drawer-open');
  document.body.classList.remove('drawer-open');

  drawer.closeTimer = setTimeout(() => {
    drawer.el.hidden = true;
    const form = document.getElementById('resForm');
    const success = document.getElementById('resSuccess');
    if (form.hidden) {
      form.reset();
      form.hidden = false;
      success.hidden = true;
      document.getElementById('resDate').value = toISODate(new Date());
      document.getElementById('groupHint').hidden = true;
      renderTimeSlots();
    }
  }, DRAWER_CLOSE_MS);

  if (drawer.lastFocus && document.contains(drawer.lastFocus)) drawer.lastFocus.focus();
}

function trapFocus(e) {
  const focusable = [...drawer.el.querySelectorAll('button, input, select, textarea, a[href]')]
    .filter(el => !el.disabled && el.offsetParent !== null);
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

// Error text is only linked while visible, so screen readers don't announce it for valid fields
function setFieldError(input, hasError) {
  input.closest('.field').classList.toggle('has-error', hasError);
  input.setAttribute('aria-invalid', String(hasError));
  if (hasError) input.setAttribute('aria-describedby', `${input.id}Error`);
  else input.removeAttribute('aria-describedby');
}

function submitReservation(e) {
  e.preventDefault();
  const form = e.target;

  const checks = [
    ['resDate', v => !!v && v >= toISODate(new Date())],
    ['resName', v => v.trim().length >= 2],
    ['resPhone', v => v.replace(/\D/g, '').length >= 6],
    ['resEmail', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())]
  ];

  let firstInvalid = null;
  checks.forEach(([id, isValid]) => {
    const input = document.getElementById(id);
    const ok = isValid(input.value);
    setFieldError(input, !ok);
    if (!ok && !firstInvalid) firstInvalid = input;
  });

  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }

  const data = Object.fromEntries(new FormData(form));
  // Offener Punkt (Kundeninput ausstehend): Es gibt noch kein Backend – die Anfrage wird nicht übermittelt.

  const guestsLabel = data.guests === '10' ? '10 oder mehr Personen' : `${data.guests} ${data.guests === '1' ? 'Person' : 'Personen'}`;
  const dateLabel = new Date(`${data.date}T00:00`).toLocaleDateString('de-AT', {
    weekday: 'long', day: 'numeric', month: 'long'
  });

  document.getElementById('resSuccessName').textContent = data.name.trim().split(' ')[0];
  document.getElementById('resSuccessText').textContent =
    `Deine Anfrage für ${guestsLabel} am ${dateLabel} um ${data.time} Uhr ist bei uns angekommen.`;

  form.hidden = true;
  const success = document.getElementById('resSuccess');
  success.hidden = false;
  success.querySelector('button').focus();
}

// --- Scroll reveal --------------------------------------------------------

function initReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('is-in'));
    return;
  }

  // Blocks that enter together get an 80ms step, capped so nothing lags noticeably
  items.forEach(el => {
    const siblings = [...el.parentElement.children].filter(c => c.hasAttribute('data-reveal'));
    const index = siblings.indexOf(el);
    if (index > 0) el.style.transitionDelay = `${Math.min(index, 2) * 80}ms`;
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });

  items.forEach(el => observer.observe(el));
}
