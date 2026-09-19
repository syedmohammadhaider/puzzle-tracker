# Puzzle Streaks — Design System

## What this app actually is

A personal ritual tracker for the small set of daily puzzles someone does every
morning — Wordle, Travle, Worldle, whatever they've added. It is not a metrics
dashboard, not a productivity tool, and it has no urgency. It should feel like
a paper streak calendar taped next to a coffee machine, not like Linear or
Vercel's dashboard. One tap, done, see you tomorrow.

The emotional core is the **streak** — the small satisfaction of "I didn't
break the chain" — and the **tactile "one tap"** interaction the tagline
already promises but the current build doesn't deliver visually (everything
looks like it needs to be read and evaluated, not tapped).

---

## Color

Puzzle grids (Wordle's green/yellow/grey, crosswords, grid paper) are the
actual visual vernacular here — lean into graph-paper / notebook tones rather
than app-chrome dark mode.

| Token | Hex | Role |
|---|---|---|
| `--paper` | `#F7F5F0` | Base background — warm off-white, not pure white |
| `--ink` | `#1F1D1A` | Primary text, near-black but warm, never `#000`/`#0B0B0B` |
| `--rule` | `#DDD8CC` | Hairline borders, grid lines, dividers |
| `--solved` | `#4A7C59` | Muted forest green — "solved" state, echoes Wordle green without copying it |
| `--tried` | `#C97A2E` | Ochre/amber — "tried" state |
| `--skip` | `#8B8578` | Warm grey — "skipped/rest" state, deliberately quiet |
| `--flame` | `#B5482C` | One accent, reserved for the streak counter only |

No gradients. No purple. Dark mode (if you build one) inverts to a warm
charcoal (`#181614`) — not pure black — with the same accent roles.

## Type

- **Display / streak numbers:** a slab serif or humanist serif with real
  character — e.g. **Fraunces** or **Source Serif 4**. The streak count is the
  one place to let type be a visual element, not just data.
- **UI / body:** a plain grotesk — e.g. **Inter** or **IBM Plex Sans** — for
  everything else: labels, buttons, URLs, timestamps.
- No tracked-out ALL CAPS labels anywhere. Sentence case throughout.
- No monospace for stat numbers — that's dashboard vernacular, not notebook
  vernacular.

## Layout

Think **index cards on a corkboard**, not **cards in a SaaS grid**.

```
┌─────────────────────────────────────┐
│  Puzzle Streaks          [account]   │
│  keep the fire alive                 │
├─────────────────────────────────────┤
│                                       │
│   Good morning                       │
│   Sat, Sep 19 — 3 puzzles today      │
│                                       │
│   [ + add a puzzle ]                 │
│                                       │
│   ───────────────────────────────    │
│   Wordle                    🔥7      │
│   ●●●●●●●○○○  last 10 days           │
│   [ solved ]  [ tried ]  [ skip ]    │
│   ───────────────────────────────    │
│   Travle                    🔥1      │
│   ●○○○○○○○○○                          │
│   [ solved ]  [ tried ]  [ skip ]    │
│   ───────────────────────────────    │
│                                       │
└─────────────────────────────────────┘
```

- Left-aligned, single column, generous line-length constraint (~640px max
  content width). This is a personal tool, not a landing page — no
  centered-hero treatment needed.
- Replace the disconnected pill badges (🔥1 ★1) with an inline **streak dot
  row** per puzzle — a literal visualization of the last 10 days, filled vs.
  empty. This does the "did I keep the streak" job at a glance, which numbers
  in pills don't.
- Puzzles are separated by hairline rules, not individually-shadowed rounded
  cards. One card-like container for the whole day is enough structure;
  repeating the same rounded-rectangle-plus-shadow per item is the generic
  tell.
- Status buttons stay three-way (solved/tried/skip) — that part of the
  interaction model is genuinely good, keep it. Just restyle: outlined,
  sentence case, fill solid only on the selected state, using `--solved` /
  `--tried` / `--skip` rather than green/orange/grey-as-decoration.

## Motion

One moment of motion, earned: when a status is tapped, that puzzle's streak
dot row gets a single new dot with a brief fill-in animation (~200ms). Nothing
else animates — no hover-lift on every row, no fade-up on load.

## Principles

1. **Paper, not glass.** Warm, matte, slightly textured — never a dark
   glassmorphism dashboard.
2. **The streak is the hero**, not the puzzle metadata. Every other decision
   should make the streak more visible, not compete with it.
3. **One tap should look like one tap.** Buttons are the most confident
   element on the page, not stat pills.
4. **No decoration without a job.** Every color maps to a real state (solved/
   tried/skip/streak). No gradient, shadow, or badge exists just to look like
   an app.
5. **Sentence case, plain words.** "Keep the fire alive" survives as the one
   bit of voice; nothing else needs a tagline or eyebrow label.
