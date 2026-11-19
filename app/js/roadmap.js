// Roadmap and missables: built from the official trophy descriptions alone.
// Stages run in order; the missables page flags the two trophies that need a
// partner before the final mission, plus the timing watchlist.
export const ROADMAP_STAGES = [
  {
    number: 1,
    title: 'Play the story',
    goal: 'Chapters 1–4 and the final mission, plus the two partner trophies — 14 trophies, including the gold for the finale.',
    advice:
      'Play the story missions in order and let the chapter and mission trophies pop as they come. Before the final mission, stop and earn the two partner trophies (Hot Together and Retail Therapy): they need your partner beside you, and the finale is the natural point of no return.',
    trophyIds: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 33, 34],
  },
  {
    number: 2,
    title: 'Strangers & side stories',
    goal: 'Every character strand and 8 stranger strands — 7 trophies, including a silver.',
    advice:
      'Work the stranger markers and character strands (Andy, Kenton, Billy, Randy, Tyrone, Bret) until each chain is finished. A strand counts only when its final mission is done, so follow each one through to the end rather than starting them all at once.',
    trophyIds: [22, 23, 24, 25, 26, 27, 29],
  },
  {
    number: 3,
    title: 'Activities & skills',
    goal: 'Races, the range, fishing, bowling, meditation and challenges — 11 trophies, including two silvers.',
    advice:
      'Sample every activity once for Master of None, then grind the counted ones: 42 Shooting Range golds, 14 drone-race wins, 20 race wins, 18 meditation spots, 50 challenges and 250 stunts. The range and the races reward patience over speed — gold the range challenges one at a time.',
    trophyIds: [15, 16, 17, 18, 19, 20, 21, 28, 32, 46, 49],
  },
  {
    number: 4,
    title: 'Collectibles & the map',
    goal: 'Cards, WAiNK spots, vehicles, areas and garages — 6 trophies, including two silvers.',
    advice:
      'Explore every corner of Leonida: 3 card sets, 100 WAiNK locations, 100 vehicles discovered, all 52 areas, 8 garages bought and 10 vehicles registered to Scooter Bros. Do this stage while exploring for the other trophies — the map fills in as you go, and the last few areas are usually small places you drove past.',
    trophyIds: [30, 31, 35, 42, 54, 55],
  },
  {
    number: 5,
    title: 'Open-world cleanup & the grind',
    goal: 'Robberies, gangs, money and the odd moments — 15 trophies, then 100% and the platinum.',
    advice:
      'Mop up the open-world trophies: 5 bank vaults, an armored truck, one illegal operation per gang, the showroom smash, the VCIA departure, the jewelry store, Combat Focus, the 500 choices, the $250,000 laundered and the $100,000 spent. When the checklist is empty except for the platinum, check the in-game stats for the last percent of 100% Completion — then the platinum pops.',
    trophyIds: [36, 37, 38, 39, 40, 41, 43, 44, 45, 47, 48, 50, 51, 52, 53, 14, 1],
  },
];

export const WATCHLIST = [
  {
    name: 'Catch Me If You Can',
    note: 'Make an unscheduled departure at VCIA.',
    when: 'Do it in one clean run — steal a plane and get airborne before airport security closes in.',
  },
  {
    name: 'Sneakthief',
    note: 'Rob a jewelry store without being detected.',
    when: 'Retryable: if you are spotted, leave and try again. Plan entry and exit before you start.',
  },
  {
    name: 'Capital Offense',
    note: 'Smash your way out of a vehicle showroom in classic style.',
    when: 'One clean exit through the glass. Pick a showroom with a big window and a fast car.',
  },
  {
    name: 'Bad Luck, I Guess',
    note: 'Second time’s the charm.',
    when: 'Fail something once, then pass it on the next attempt. Deliberately retry a short challenge if it has not popped.',
  },
  {
    name: 'The Truth Is Out There',
    note: 'What the hell just happened?',
    when: 'A strange event out in Leonida — explore the odd corners (swamps at night, the map’s far edges) and keep an eye out.',
  },
  {
    name: 'Personal Best',
    note: 'A partnership with mass appeal.',
    when: 'Play the partner content together while your partner is available — it pops during natural partner play.',
  },
];

export function renderRoadmap(container, trophies, progress, isEarned) {
  container.replaceChildren();
  const byId = new Map(trophies.map((trophy) => [trophy.id, trophy]));
  for (const stage of ROADMAP_STAGES) {
    const section = document.createElement('section');
    section.className = 'stage';
    const heading = document.createElement('h3');
    heading.innerHTML = '';
    const number = document.createElement('span');
    number.className = 'stage-num';
    number.textContent = `Stage ${stage.number} — `;
    heading.append(number, document.createTextNode(stage.title));
    const goal = document.createElement('p');
    goal.textContent = stage.goal;
    const advice = document.createElement('p');
    advice.textContent = stage.advice;
    const list = document.createElement('ul');
    let earnedInStage = 0;
    for (const id of stage.trophyIds) {
      const trophy = byId.get(id);
      if (!trophy) continue;
      const earned = isEarned(progress, id);
      if (earned) earnedInStage += 1;
      const item = document.createElement('li');
      const name = document.createElement('span');
      name.className = 't-name';
      name.textContent = `${earned ? '✓ ' : ''}${trophy.name}`;
      const detail = document.createElement('span');
      detail.textContent = ` — ${trophy.grade} · ${trophy.description}`;
      item.append(name, detail);
      list.append(item);
    }
    const progressLine = document.createElement('p');
    progressLine.className = 'stage-progress';
    progressLine.textContent = `${earnedInStage} of ${stage.trophyIds.length} earned in this stage`;
    section.append(heading, goal, advice, list, progressLine);
    container.append(section);
  }
}

export function renderMissables(container, trophies, progress, isEarned) {
  container.replaceChildren();
  const byName = new Map(trophies.map((trophy) => [trophy.name, trophy]));
  const missable = trophies.filter((trophy) => trophy.missable);
  for (const trophy of missable) {
    const card = document.createElement('article');
    card.className = 'miss-card hot';
    const heading = document.createElement('h3');
    heading.textContent = `⚠ ${trophy.name} — ${trophy.grade}`;
    const description = document.createElement('p');
    description.textContent = trophy.description;
    const guide = document.createElement('p');
    guide.textContent = trophy.guide;
    const when = document.createElement('p');
    when.className = 'when';
    when.textContent = 'Do this before the final mission, while your partner is still around.';
    const state = document.createElement('p');
    state.textContent = isEarned(progress, trophy.id) ? '✓ Earned — safe.' : 'Not earned yet.';
    card.append(heading, description, guide, when, state);
    container.append(card);
  }
  const watchHeading = document.createElement('h3');
  watchHeading.textContent = 'Timing watchlist — easy to fumble, easy to retry';
  container.append(watchHeading);
  const table = document.createElement('table');
  table.className = 'watchlist';
  const head = document.createElement('tr');
  for (const label of ['Trophy', 'What it asks', 'Timing']) {
    const cell = document.createElement('th');
    cell.textContent = label;
    head.append(cell);
  }
  table.append(head);
  for (const entry of WATCHLIST) {
    const row = document.createElement('tr');
    const trophy = byName.get(entry.name);
    const earned = trophy ? isEarned(progress, trophy.id) : false;
    const nameCell = document.createElement('td');
    nameCell.textContent = `${earned ? '✓ ' : ''}${entry.name}`;
    const noteCell = document.createElement('td');
    noteCell.textContent = entry.note;
    const whenCell = document.createElement('td');
    whenCell.textContent = entry.when;
    row.append(nameCell, noteCell, whenCell);
    table.append(row);
  }
  container.append(table);
}
