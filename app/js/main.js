// Leonida Platinum — boot, tabs, filters and the progress header.
// Reads app/data/trophies.json (same origin, works offline) and renders the tracker.
import { earnedTotal, exportProgress, importProgressFile, isEarned, loadProgress, resetProgress, setEarned } from './store.js';
import { renderChecklist, renderDetail } from './views.js';
import { renderMissables, renderRoadmap } from './roadmap.js';

const params = new URLSearchParams(location.search);
const DEMO_EARNED = [2, 3, 4, 5, 8, 9, 10, 15, 20, 21, 28, 35, 44];
const DEMO_SPOILER_EARNED = [2, 20, 21, 35, 44];
const DEMO_COUNTS = { 15: 87, 17: 12, 18: 4, 31: 23, 35: 41, 42: 19 };

let progress = loadProgress();
if (params.get('demo') === '1') {
  // Preview mode for screenshots: a mid-hunt save, so the tracker shows real progress.
  progress = { earned: {}, counts: {} };
  for (const id of DEMO_EARNED) progress.earned[String(id)] = true;
  for (const [id, count] of Object.entries(DEMO_COUNTS)) progress.counts[id] = count;
} else if (params.get('demo') === 'spoiler') {
  // Preview mode for the spoiler screenshot: barely into the story, so most
  // story trophies are hidden behind the spoiler setting.
  progress = { earned: {}, counts: {} };
  for (const id of DEMO_SPOILER_EARNED) progress.earned[String(id)] = true;
}

const filters = {
  kind: 'all',
  grade: 'all',
  search: '',
  hideEarned: false,
  spoiler: params.get('spoiler') === '1',
};
let selectedId = null;
const requestedTrophy = Number(params.get('trophy') ?? '');
if (Number.isInteger(requestedTrophy) && requestedTrophy >= 1 && requestedTrophy <= 55) {
  selectedId = requestedTrophy;
}

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;

const listEl = document.getElementById('trophy-list');
const emptyEl = document.getElementById('empty-note');
const showingEl = document.getElementById('showing');
const detailEl = document.getElementById('detail');
const roadmapEl = document.getElementById('roadmap');
const missablesEl = document.getElementById('missables');

function renderProgressHeader() {
  const total = trophies.length;
  const earned = earnedTotal(progress);
  document.getElementById('earned-count').textContent = String(earned);
  const fill = document.getElementById('progress-fill');
  fill.style.width = `${Math.round((earned / total) * 100)}%`;
  document.getElementById('progress-bar').setAttribute('aria-valuenow', String(earned));
  const remaining = total - earned;
  document.getElementById('progress-sub').textContent =
    earned === total
      ? 'Platinum earned — Leonida Legend.'
      : remaining === 1
        ? 'One trophy left — then the platinum pops.'
        : `Platinum is ${remaining} trophies away.`;
  const byGrade = {};
  for (const trophy of trophies) {
    if (isEarned(progress, trophy.id)) byGrade[trophy.grade] = (byGrade[trophy.grade] ?? 0) + 1;
  }
  const totals = {};
  for (const trophy of trophies) totals[trophy.grade] = (totals[trophy.grade] ?? 0) + 1;
  document.getElementById('grade-line').textContent =
    ['platinum', 'gold', 'silver', 'bronze']
      .map((grade) => `${byGrade[grade] ?? 0}/${totals[grade] ?? 0} ${grade}`)
      .join(' · ');
}

function renderAll() {
  renderProgressHeader();
  renderChecklist(listEl, emptyEl, showingEl, trophies, progress, filters, selectedId, (id, options) => {
    selectedId = id;
    if (options.rerender) renderAll();
    else renderDetailForSelected();
  });
  renderDetailForSelected();
  renderRoadmap(roadmapEl, trophies, progress, isEarned);
  renderMissables(missablesEl, trophies, progress, isEarned);
}

function renderDetailForSelected() {
  const trophy = trophies.find((item) => item.id === selectedId) ?? null;
  renderDetail(detailEl, trophy, progress, (id) => {
    setEarned(progress, id, !isEarned(progress, id));
    renderAll();
  });
}

function showTab(name) {
  for (const button of document.querySelectorAll('.tab')) {
    button.classList.toggle('active', button.dataset.tab === name);
  }
  for (const view of document.querySelectorAll('.view')) {
    view.classList.toggle('active', view.id === `view-${name}`);
  }
  if (location.hash !== `#${name}`) history.replaceState(null, '', `#${name}`);
}

for (const button of document.querySelectorAll('.tab')) {
  button.addEventListener('click', () => showTab(button.dataset.tab));
}

for (const chip of document.querySelectorAll('#kind-chips .chip')) {
  chip.addEventListener('click', () => {
    for (const other of document.querySelectorAll('#kind-chips .chip')) other.classList.remove('active');
    chip.classList.add('active');
    filters.kind = chip.dataset.kind;
    showTab('tracker');
    renderAll();
  });
}

document.getElementById('grade-filter').addEventListener('change', (event) => {
  filters.grade = event.target.value;
  renderAll();
});
document.getElementById('search').addEventListener('input', (event) => {
  filters.search = event.target.value.trim();
  renderAll();
});
document.getElementById('hide-earned').addEventListener('change', (event) => {
  filters.hideEarned = event.target.checked;
  renderAll();
});
const spoilerBox = document.getElementById('spoiler');
spoilerBox.checked = filters.spoiler;
spoilerBox.addEventListener('change', (event) => {
  filters.spoiler = event.target.checked;
  renderAll();
});

document.getElementById('export-btn').addEventListener('click', () => exportProgress(progress));
document.getElementById('import-file').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    progress = await importProgressFile(file);
    renderAll();
  } catch {
    alert('That file could not be imported — it is not a progress export from this guide.');
  }
  event.target.value = '';
});
document.getElementById('reset-btn').addEventListener('click', () => {
  if (confirm('Reset all progress? This clears every earned trophy and counter.')) {
    progress = resetProgress();
    selectedId = null;
    renderAll();
  }
});

const initialTab = params.get('tab') || location.hash.replace('#', '') || 'tracker';
const knownTabs = ['tracker', 'roadmap', 'missables', 'sources'];
showTab(knownTabs.includes(initialTab) ? initialTab : 'tracker');
renderAll();
