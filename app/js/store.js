// Progress store: earned trophies and per-trophy counters, saved in localStorage.
// Nothing leaves the browser; export writes a JSON file, import reads one back.
const STORAGE_KEY = 'leonida-platinum-progress-v1';

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { earned: {}, counts: {} };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return { earned: {}, counts: {} };
    return {
      earned: parsed.earned && typeof parsed.earned === 'object' ? parsed.earned : {},
      counts: parsed.counts && typeof parsed.counts === 'object' ? parsed.counts : {},
    };
  } catch {
    return { earned: {}, counts: {} };
  }
}

export function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Storage full or unavailable: progress still lives in memory for this visit.
  }
}

export function isEarned(progress, trophyId) {
  return progress.earned[String(trophyId)] === true;
}

export function setEarned(progress, trophyId, earned) {
  if (earned) progress.earned[String(trophyId)] = true;
  else delete progress.earned[String(trophyId)];
  saveProgress(progress);
}

export function getCount(progress, trophyId) {
  const value = progress.counts[String(trophyId)];
  return typeof value === 'number' && value >= 0 ? value : 0;
}

export function setCount(progress, trophyId, count, target) {
  const capped = target ? Math.max(0, Math.min(target, count)) : Math.max(0, count);
  progress.counts[String(trophyId)] = capped;
  saveProgress(progress);
  return capped;
}

export function earnedTotal(progress) {
  return Object.keys(progress.earned).length;
}

export function exportProgress(progress) {
  const blob = new Blob([JSON.stringify({ app: 'leonida-platinum', version: 1, ...progress }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'gta6-trophy-progress.json';
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function importProgressFile(file) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  const progress = {
    earned: parsed.earned && typeof parsed.earned === 'object' ? parsed.earned : {},
    counts: parsed.counts && typeof parsed.counts === 'object' ? parsed.counts : {},
  };
  // Keep only sane values: earned flags are booleans, counts are non-negative numbers.
  for (const key of Object.keys(progress.earned)) {
    if (progress.earned[key] !== true) delete progress.earned[key];
  }
  for (const key of Object.keys(progress.counts)) {
    if (typeof progress.counts[key] !== 'number' || progress.counts[key] < 0) delete progress.counts[key];
  }
  saveProgress(progress);
  return progress;
}

export function resetProgress() {
  const fresh = { earned: {}, counts: {} };
  saveProgress(fresh);
  return fresh;
}
