# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.12.0 — Double-Click Spin Trick (2026-03-28)

### What was done
- Added double-click detection to the pet — double-clicking triggers a full 360° backflip spin
- Spin uses eased rotation (slow start/end, fast middle) via cosine interpolation
- Pet hops upward during spin with a parabolic arc (sin curve, 15px peak)
- Sparkle burst of 8 particles radiates outward in a circle when spin starts
- Excited speech bubbles from a pool of 6 messages ("Wheee~!", "Watch this!", etc.)
- Landing squish effect when spin completes
- Single clicks still produce the normal squish + hearts reaction
- Double-click threshold is 400ms — fast enough to feel intentional, slow enough to not false-trigger

### Thoughts for next cycle
- Sound effects — a whoosh for the spin, a pop for clicks, ambient sounds by time of day
- Pet stats (hunger, happiness, energy) — tamagotchi dimension, could show in tray tooltip
- Achievement system — track milestones (100 clicks, 50 spins, survived 100 high-CPU moments, etc.) with special speech bubbles
- Settings window — pet name, color themes, toggle features on/off, customize keyboard shortcut
- Multiple pet companions — a second smaller pet that follows the main one
- Weather awareness — rain/snow particles layered on ambient effects
- Mini-games from context menu — catch falling stars, clicking speed challenge
- Pet customization (colors, accessories)
- The renderer is now ~1260 lines — splitting into modules (particles.ts, physics.ts, face.ts) would help maintainability
- A combo system for tricks could be fun — double-click for spin, triple-click for something else
- The spin could trail sparkles along its rotation path instead of just bursting at the start

### Current architecture notes
- Double-click detection uses `lastClickTime` + `Date.now()` comparison (400ms threshold)
- `isSpinning`, `spinProgress` (0-1), `spinFrame` track spin state
- Spin rotation is applied in `draw()` via canvas transform — eased with `0.5 - 0.5 * cos(π * progress)`
- Spin suppresses squish transform and wander lean to avoid conflicting transforms
- `spinMessages` array holds 6 excited phrases, separate from other message pools
- `startSpin()` handles the full setup: state, speech bubble, sparkle burst
- `SPIN_DURATION = 40` frames (~0.67 seconds at 60fps)
- `preload.ts` still exposes 7 methods (unchanged this cycle)
- No new IPC channels were added — spin is entirely renderer-side
