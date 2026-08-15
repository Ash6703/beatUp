# Rhythm Café — POC Spec (Stage 1)

## What this is

A mobile rhythm game. The player is a drummer who "cooks" by playing beats.
Customers sit at tables in a café, order food (which is really a drum
pattern), and the player must play that pattern correctly on a 4-tom
drumkit to serve them.

Visual/tone reference: **Papa's Freezeria** (clean, chunky, cartoony,
juicy pop-in animations, warm flat-shaded art). Level structure reference:
**Penguin Diner** (worlds → levels, difficulty ramps per world).

This document describes **only the Stage 1 POC** — one hardcoded level,
one customer, three orders. No menus, no world select, no meta systems.
Get this feeling fun before anything else gets built.

---

## Platform & orientation

- **Target: mobile, landscape orientation only.** Lock orientation.
- Stack: **Expo / React Native.**
- **How timing actually works here (read before building):** this game
  does *not* have the hard "sync gameplay to a recorded song" problem
  that most rhythm games have. The backing track is a fixed-tempo click
  (TICK tick tick tick, one bar of 4/4 at 80 BPM) — not charted music —
  so the entire beat grid can be **computed from a timestamp, not read
  off audio playback position**:

  ```
  beat_n_time = session_start_time + n * (60 / bpm)
  ```

  Do a one-time calibration/clock-anchor when the level starts, then
  every future beat time is just math from that anchor. This is simpler
  and more reliable than trying to read "where the song currently is."

- **What actually needs to be accurate is input timestamps, not SFX
  playback.** Judging a hit only needs: *when did the tap happen* vs.
  *when was it expected*. Capture tap timestamps via
  `react-native-gesture-handler` (worklet-based) rather than plain
  `onPress`/`Touchable`, to keep the timestamp as close to the native
  touch event as possible, avoiding JS-bridge round-trip delay in the
  timestamp itself. This is the part that determines whether hits are
  scored correctly.
- **The tom hit *sound effect* playing back a few ms late is a feel/polish
  concern, not a correctness concern** — it doesn't affect scoring, only
  how snappy hits feel. Don't over-engineer this for the POC; revisit if
  it feels dull once the core loop is working.
- **Click track looping:** don't trust a naive single-sample `loop: true`
  over many bars — small gaps/drift can creep in at the loop boundary.
  Since the beat grid is already computed independently (see above),
  schedule/resync the click sound against that same computed timeline
  rather than relying on the audio player's own loop staying phase-locked
  indefinitely.
- **Input for POC testing:** support both touch (on-screen tom regions)
  and laptop keyboard keys **1, 2, 3, 4** mapped to toms 1–4, so the
  rhythm feel can be tested quickly on desktop during development.
  Route both input sources through the same internal "tom hit" event
  (with timestamp) so touch and keyboard behave identically to the
  judgment system.

---

## Screen layout

Full landscape screen, divided into two zones:

1. **Stage (bottom ~1/5 of screen)**
   - The drummer sits at a drumkit, viewed from behind (back to camera,
     facing into the café).
   - Drumkit has exactly **4 toms, all equal size**, arranged in a gentle
     curve like a real kit. Label them **1, 2, 3, 4 from bottom-left to
     bottom-right** (this numbering is internal/dev-facing, not shown to
     the player).
   - Each tom is an independent touch target. Tapping a tom's screen
     region triggers that tom's hit sound + hit animation.
   - No crash/ride/hi-hat — toms only for this POC.

2. **Café (remaining ~4/5 of screen, above the stage)**
   - Multiple tables and chairs are visible (art can be placeholder boxes
     for now — layout and function matter more than final art at this
     stage).
   - Customers enter from the **right edge** of the screen and walk to an
     open seat.
   - For this POC only **one customer** ever appears, and they can sit at
     any one of the visible tables (pick the first/nearest one — doesn't
     need smart pathing yet).

---

## Core loop (this POC)

1. Customer walks in from the right, sits down.
2. A **speech bubble** appears above their head showing the current order
   (for now, a placeholder icon/letter is fine — "A", "B", or "C". Final
   art will be food icons later, not needed now).
3. The bubble's order defines a **beat pattern** the player must play.
4. Background metronome/track is playing continuously at **80 BPM, 4/4**,
   one bar loops.
5. Player taps toms 1–4 in time with the beat to match the pattern within
   that bar (or across however many bars is comfortable to react in —
   see "Timing" below).
6. On correct completion, show a clear success beat (checkmark / happy
   customer reaction / food pop-in — placeholder ok), then the bubble
   updates to the **next** order.
7. Sequence for this POC: **Order A → Order B → Order C**, in that fixed
   order. After C is successfully served, the customer is happy, gets up,
   and **leaves out the right edge** the same way they came in.
8. Demo ends there. No new customer spawns after.

No fail/game-over state needs designing yet — if the player misses, just
let them keep trying the same order until they get it (a "miss" reaction
animation is a nice-to-have, not required for POC).

---

## Beat patterns (Stage 1 content)

All patterns are **one bar of 4/4 at 80 BPM**, quarter notes only (no
eighths/syncopation yet — that's later-world difficulty). Numbers refer to
tom index (1 = bottom-left … 4 = bottom-right).

| Order | Pattern (beats 1-2-3-4) |
|-------|--------------------------|
| A     | 1 → 2 → 3 → 4            |
| B     | 4 → 3 → 2 → 1            |
| C     | 2 → 3 → 2 → 3            |

Each order = exactly 4 hits, one per beat, one bar long.

---

## Order bubble & patience indicator

The speech bubble above the customer's head isn't just static — it
communicates patience over time via color:

- **Green** when the order first appears (customer just sat down / just
  got their previous order).
- Gradually shifts **green → yellow → red** the longer the current order
  goes unserved.
- For this POC, since there's no fail state, red doesn't need to trigger
  anything mechanical (no walkout, no penalty) — it's purely a **visual
  tension cue**. The color loop can simply hold at red until the player
  completes the pattern.
- Keep the transition on a simple timer per order (e.g. green for the
  first third of some patience window, yellow for the middle third, red
  after that) — exact timings are a feel/balance decision to make during
  build, not something to lock in now.
- This same bubble is also where the order pattern (icon/letter A/B/C)
  is displayed, so the bubble is doing double duty: showing *what* to
  play and *how urgently*.

This patience system is the seed of what will later drive scoring/fail
states once those exist, but for Stage 1 it only needs to be visual.

---

## Timing / judgment (minimum viable)

- One continuous metronome/backing track loop at 80 BPM plays throughout
  the level from the moment the order appears.
- The pattern should be **visually indicated to the player somehow**
  (this is a design decision to make during build — e.g. a simple
  falling-note lane, or the toms themselves pulsing in sequence like a
  Simon Says cue). Pick the simplest version that works for POC; it can
  be replaced with something more polished later.
- Judge each tap against the computed beat grid (see Platform &
  orientation) using a basic hit window (e.g. ±100–150ms around the
  expected beat time). Keep it forgiving for the POC — tightening it is
  a balance pass, not a POC concern.
- All scheduling — click track and judgment — must be driven off that
  same computed timeline, not `setTimeout`/frame time, so timing doesn't
  drift.

---

## Explicitly out of scope for this stage

- No home screen / main menu — **load directly into the level.**
- No world select, no level select.
- No multiple customers or multi-table juggling.
- No scoring, tips, stars, or currency.
- No difficulty progression, no additional patterns beyond A/B/C.
- No save/progress system.
- No real food art — icons/letters/placeholders are fine.
- No MIDI input (keyboard 1/2/3/4 is in scope for desktop testing, see
  Platform & orientation).

The goal of this stage is purely: **does tapping toms in time to serve a
customer feel good on a phone screen, in landscape, with real audio
timing.** Everything else gets layered on in later stages once this feel
is validated.

---

## Suggested build order within this stage

Even within this single POC, build incrementally and get each piece
running before adding the next:

1. Landscape scene with static drumkit art (4 tap-able toms, plus 1/2/3/4
   keyboard mapping for desktop testing) + hit sound per tom, no music
   yet. Wire tap/keypress capture through gesture-handler so each hit
   produces a clean timestamp — confirm this feels responsive before
   writing anything else.
2. Add the 80 BPM / 4/4 click track, scheduled against a computed beat
   grid anchored to a session start timestamp (not relying on raw audio
   playback position).
3. Hardcode pattern A, add whatever visual cue you choose, and get basic
   hit-window judgment working for a single pattern.
4. Add the speech bubble + order display above a static customer sprite
   already seated at a table.
5. Add the green → yellow → red patience timer to that bubble.
6. Chain A → B → C with success transition between them (bubble resets to
   green each time a new order starts).
7. Add customer walk-in from the right → sit → (after C) walk-out to the
   right.
8. Polish pass: hit/miss feedback juice (Papa's-Freezeria-style pop and
   bounce), not before steps 1–7 all work.

Each step should be independently testable/playable before moving to the
next.
