// Checklist and detail pane: the tracker view of the 55 trophies.
import { getCount, isEarned, setCount, setEarned } from './store.js';

export const KIND_LABELS = {
  platinum: 'Platinum',
  story: 'Story',
  side: 'Side mission',
  collectibles: 'Collectibles',
  activities: 'Activities',
  'open-world': 'Open world',
  completion: 'Completion',
};

const GRADE_LETTER = { platinum: 'P', gold: 'G', silver: 'S', bronze: 'B' };

function medalDot(grade) {
  const dot = document.createElement('span');
  dot.className = `medal ${grade}`;
  dot.title = grade;
  dot.textContent = GRADE_LETTER[grade] ?? '?';
  return dot;
}

export function trophyMatches(trophy, filters, progress) {
  if (filters.kind === 'missable') {
    if (!trophy.missable) return false;
  } else if (filters.kind !== 'all' && trophy.kind !== filters.kind) {
    return false;
  }
  if (filters.grade !== 'all' && trophy.grade !== filters.grade) return false;
  if (filters.hideEarned && isEarned(progress, trophy.id)) return false;
  if (filters.search) {
    const haystack = `${trophy.name} ${trophy.description} ${trophy.guide} ${KIND_LABELS[trophy.kind] ?? ''}`.toLowerCase();
    if (!haystack.includes(filters.search.toLowerCase())) return false;
  }
  return true;
}

function isStorySpoiler(trophy) {
  return trophy.kind === 'story';
}

export function renderChecklist(listEl, emptyEl, showingEl, trophies, progress, filters, selectedId, onSelect) {
  listEl.replaceChildren();
  let shown = 0;
  for (const trophy of trophies) {
    if (!trophyMatches(trophy, filters, progress)) continue;
    shown += 1;
    const earned = isEarned(progress, trophy.id);
    const item = document.createElement('li');
    if (earned) item.classList.add('earned');
    if (trophy.id === selectedId) item.classList.add('selected');
    const spoilerHidden = filters.spoiler && isStorySpoiler(trophy) && !earned;
    if (spoilerHidden) item.classList.add('hidden-trophy');

    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned;
    box.setAttribute('aria-label', `Mark ${spoilerHidden ? 'hidden story trophy' : trophy.name} as earned`);
    box.addEventListener('change', () => {
      setEarned(progress, trophy.id, box.checked);
      onSelect(trophy.id, { rerender: true });
    });
    box.addEventListener('click', (event) => event.stopPropagation());

    const body = document.createElement('div');
    const name = document.createElement('div');
    name.className = 't-name';
    name.textContent = spoilerHidden ? 'Hidden story trophy — earn it to reveal' : trophy.name;
    const description = document.createElement('div');
    description.className = 't-desc';
    description.textContent = spoilerHidden ? 'Spoiler hidden. The official description is hidden until this trophy is earned.' : trophy.description;
    body.append(name, description);

    const meta = document.createElement('div');
    meta.className = 't-meta';
    const kindTag = document.createElement('span');
    kindTag.className = `tag kind-${trophy.kind}`;
    kindTag.textContent = KIND_LABELS[trophy.kind] ?? trophy.kind;
    meta.append(kindTag);
    if (trophy.missable) {
      const missTag = document.createElement('span');
      missTag.className = 'tag missable';
      missTag.textContent = '⚠ Missable';
      meta.append(missTag);
    }
    if (trophy.target) {
      const countTag = document.createElement('span');
      countTag.className = 'tag';
      const count = getCount(progress, trophy.id);
      countTag.textContent = trophy.target >= 1000 ? `Target $${trophy.target.toLocaleString('en-US')}` : `Target ${trophy.target}`;
      meta.append(countTag);
    }
    body.append(meta);

    if (trophy.target) {
      const counter = document.createElement('div');
      counter.className = 'counter';
      const minus = document.createElement('button');
      minus.type = 'button';
      minus.textContent = '−';
      minus.setAttribute('aria-label', `Decrease count for ${trophy.name}`);
      const value = document.createElement('span');
      value.className = 'count';
      const count = getCount(progress, trophy.id);
      value.textContent = trophy.target >= 1000
        ? `$${count.toLocaleString('en-US')} / $${trophy.target.toLocaleString('en-US')}`
        : `${count} / ${trophy.target}`;
      if (count >= trophy.target) value.classList.add('done');
      const plus = document.createElement('button');
      plus.type = 'button';
      plus.textContent = '+';
      plus.setAttribute('aria-label', `Increase count for ${trophy.name}`);
      minus.addEventListener('click', (event) => {
        event.stopPropagation();
        setCount(progress, trophy.id, getCount(progress, trophy.id) - 1, trophy.target);
        onSelect(trophy.id, { rerender: true });
      });
      plus.addEventListener('click', (event) => {
        event.stopPropagation();
        setCount(progress, trophy.id, getCount(progress, trophy.id) + 1, trophy.target);
        onSelect(trophy.id, { rerender: true });
      });
      counter.append(minus, value, plus);
      body.append(counter);
    }

    const grade = document.createElement('div');
    grade.className = 't-grade';
    grade.append(medalDot(trophy.grade));
    const gradeWord = document.createElement('span');
    gradeWord.className = 'grade-word';
    gradeWord.textContent = trophy.grade;
    grade.append(gradeWord);

    item.append(box, body, grade);
    item.addEventListener('click', () => onSelect(trophy.id, { rerender: false }));
    listEl.append(item);
  }
  emptyEl.hidden = shown !== 0;
  showingEl.textContent = `Showing ${shown} of ${trophies.length} trophies` +
    (filters.spoiler ? ' · spoiler-free on' : '');
}

export function renderDetail(detailEl, trophy, progress, onToggleEarned) {
  detailEl.replaceChildren();
  if (!trophy) {
    const hint = document.createElement('p');
    hint.className = 'detail-hint';
    hint.textContent = 'Select a trophy to read its guide, sources and missable note.';
    detailEl.append(hint);
    return;
  }
  const heading = document.createElement('h3');
  heading.textContent = trophy.name;
  const description = document.createElement('p');
  description.className = 't-desc';
  description.textContent = trophy.description;
  const meta = document.createElement('div');
  meta.className = 't-meta';
  const gradeTag = document.createElement('span');
  gradeTag.className = 'tag';
  gradeTag.textContent = trophy.grade;
  const kindTag = document.createElement('span');
  kindTag.className = `tag kind-${trophy.kind}`;
  kindTag.textContent = KIND_LABELS[trophy.kind] ?? trophy.kind;
  meta.append(gradeTag, kindTag);
  if (trophy.missable) {
    const missTag = document.createElement('span');
    missTag.className = 'tag missable';
    missTag.textContent = '⚠ Missable';
    meta.append(missTag);
  }

  const guideLabel = document.createElement('p');
  guideLabel.className = 'label';
  guideLabel.textContent = 'Guide';
  const guide = document.createElement('p');
  guide.className = 'guide-text';
  guide.textContent = trophy.guide;

  const noteLabel = document.createElement('p');
  noteLabel.className = 'label';
  noteLabel.textContent = 'When it can be missed';
  const note = document.createElement('p');
  note.textContent = trophy.note;

  const sourcesLabel = document.createElement('p');
  sourcesLabel.className = 'label';
  sourcesLabel.textContent = 'Sources';
  const sources = document.createElement('p');
  sources.className = 'sources';
  sources.textContent = trophy.sources;

  detailEl.append(heading, description, meta, guideLabel, guide, noteLabel, note);
  if (trophy.missable) {
    const warn = document.createElement('p');
    warn.className = 'missable-note';
    warn.textContent = '⚠ Missable — do this before the final mission, while your partner is still around.';
    detailEl.append(warn);
  }
  detailEl.append(sourcesLabel, sources);

  const state = document.createElement('div');
  state.className = 'earned-state';
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = isEarned(progress, trophy.id) ? '' : 'primary';
  toggle.textContent = isEarned(progress, trophy.id) ? '✓ Earned — mark as not earned' : 'Mark as earned';
  toggle.addEventListener('click', () => onToggleEarned(trophy.id));
  state.append(toggle);
  detailEl.append(state);
}
