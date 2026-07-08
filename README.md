# 🧩 Cube Academy

A complete, self-contained web app that teaches kids (ages ~9–12) how to solve
the Rubik's Cube — from "what is an edge piece?" all the way to full CFOP
speedcubing with timed practice.

## The journey

| Level | What it teaches |
|---|---|
| 0 — Meet Your Cube | Centers/edges/corners, cube notation with an interactive tap-a-move playground |
| 1 — Solve the Cube | Full beginner method: daisy → white cross → corners → middle layer → yellow cross → last layer. After this level the kid can solve any cube. |
| 2 — Getting Faster | Finger tricks, solving the cross without the daisy, lookahead |
| 3 — CFOP Foundations | Intuitive F2L, 2-look OLL, 2-look PLL |
| 4 — Full CFOP | Complete algorithm library: 21 PLLs + all 57 OLL cases, pro F2L habits |
| 5 — Speed Training | WCA-style timer with 15s inspection, ao5/ao12 stats, training plans |

Plus:

- 👥 **Profiles** — every kid gets their own progress, streaks and badges
- 🔥 **Daily streaks** — one concept a day keeps the streak alive, with a
  "Today's Mission" card and a 7-day activity strip
- ✨ **XP & ranks** — every step, challenge, revision and timed solve earns
  XP; climb from 🐣 Cubie Rookie to 👑 Cube Legend
- 🎯 **Real-cube challenges** — hands-on practice tasks for every level;
  master all of a level's lessons *and* challenges to earn its 💎
- 🔁 **Spaced revision** — finished lessons come back for a quick review
  after 3 / 7 / 14 / 30 days so old concepts never fade
- 🏅 **30+ badges**, 📖 an animated algorithm library with a flashcard
  trainer, ⏱️ a timer with scramble generation and solve history

All progress is saved in the browser (no accounts, no backend).

## Every algorithm is machine-verified

Lesson demos are animated with [cubing.js](https://js.cubing.net/cubing/)'s
`<twisty-player>`, and every algorithm and cube-state claim in the curriculum
is checked against the cubing.js `kpuzzle` engine:

- `scripts/check-alg.mjs` — inspect what an algorithm really does
  (`top` / `effect` / `solved` commands)
- `scripts/gen-algs.mjs` — generates `src/curriculum/algData.ts`: verifies all
  21 PLLs match their canonical permutation structure and produces a verified
  solution for every one of the 57 OLL orientation classes

## Development

```bash
npm install
npm run dev     # local dev server
npm run build   # type-check + production build (static, deploy anywhere)
node scripts/gen-algs.mjs   # regenerate + re-verify the algorithm library
```

## Deployment (GitHub Pages)

The site is served at **https://parimaln.github.io/rubikcubeteacher/**

Deployment is fully automatic: every push to `main` runs the
`Deploy to GitHub Pages` workflow, which builds the app and publishes
`dist/` straight to GitHub Pages — no `gh-pages` branch, no manual deploy
step.

One-time setup:

1. Copy [`docs/github-pages-deploy.yml`](docs/github-pages-deploy.yml) to
   `.github/workflows/deploy.yml` (bot tokens can't create workflow files,
   so this one move is manual).
2. In the repo's **Settings → Pages**, set **Source** to
   **"GitHub Actions"**.

A deploy can also be triggered by hand from the Actions tab
(`workflow_dispatch`).

Tech: Vite · React 18 · TypeScript · Tailwind CSS 4 · cubing.js ·
react-router (hash routing, so it works on any static host).
