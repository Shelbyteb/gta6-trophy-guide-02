# Leonida Platinum — GTA VI Trophy Guide & Tracker

[![make.fun bounty](https://make.fun/badge/gta6-trophy-guide-02.svg)](https://make.fun/bounty/gta6-trophy-guide-02)
[![rank](https://make.fun/badge/gta6-trophy-guide-02/Shelbyteb/gta6-trophy-guide-02/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-02)
[![reward](https://make.fun/badge/gta6-trophy-guide-02/Shelbyteb/gta6-trophy-guide-02/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-02)

An offline guide and tracker for all **55 PlayStation 5 trophies of Grand Theft Auto VI** — built for the [make.fun bounty](https://make.fun/bounty/gta6-trophy-guide-02) "Build the best GTA 6 trophy guide and post it on X" ($250, 50 paid places).

## What it is

- **Tracker** — every trophy with its official name, description and grade, as PlayStation publishes them. Tick one off and it stays ticked (saved in your browser, `localStorage`); counters track counted trophies (42 Shooting Range golds, 14 drone-race wins, 100 WAiNK locations, …). Export your progress to a JSON file and import it back.
- **Filters & search** — by kind (story, missable, side missions, collectibles, activities, open world), by grade, by text, and hide-earned.
- **Spoiler setting** — hides the names and descriptions of story trophies until you have earned them.
- **Roadmap to platinum** — five stages in order, built from the official trophy descriptions: story, stranger strands, activities, collectibles, then open-world cleanup and 100%.
- **Missables** — the two trophies that can be missed outright (both need your partner before the final mission), plus a timing watchlist of the ones that are easy to fumble but retryable.
- **A guide to each trophy, in our own words, that cites its sources** — what to do, where and how, and when it can be missed. Official names, descriptions and grades come from the PlayStation list via Exophase and PSNProfiles; the counts PSN tracks come from PSNProfiles; the how-to is our own advice built from the official description, and it says so where a step is not pinned down by it. Nothing here has been verified by playing the game yet.

## Run it offline

Static files only — no build step, no network at run time.

```sh
node serve.ts
# open http://localhost:8080
```

Or serve `app/` with any static file server. `app/index.html` opens in desktop Chrome with the network off.

## Layout

- `app/index.html`, `app/style.css` — the guide shell and its Vice-sunset look
- `app/js/main.js` — boot, tabs, filters, progress header
- `app/js/store.js` — saved progress, export / import / reset
- `app/js/views.js` — the checklist and the trophy detail pane
- `app/js/roadmap.js` — the roadmap stages and the missables page
- `app/data/trophies.json` — the official 55 trophies with our guides
- `screenshots/` — renders of the guide in a browser
- `main.ts` — hands the guide in: copies `app/` and `screenshots/` to `/output` and writes `dossier.json` with the vendored make.fun library. It never deletes the output directory itself (the grader mounts it) — it clears only the directory's contents, one entry at a time.
- `POST.json` — the address of the public X post about this guide (filled in once the post is up)

## The post on X

The entry carries a public post on X about this guide: a screenshot of it, `make.fun` and/or a tag of `@makefunai`, and the entrant's play code. Its address goes in `POST.json` before submitting.

## License

MIT. Unofficial and fan-made — not affiliated with Rockstar Games, Take-Two Interactive or PlayStation, and it uses no Rockstar logo, artwork or game screenshots.
