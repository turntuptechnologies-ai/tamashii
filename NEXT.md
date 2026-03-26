# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.7.0 — Gravity & Bounce Physics (2026-03-26)

### What was done
- Added gravity physics: when dragged up and released, the pet falls back to the bottom of the screen
- Bounce mechanics with damping — pet bounces with decreasing energy until it settles
- Landing squish effect proportional to impact speed (combines with existing click squish)
- Dust particle puffs spawn on hard landings, with physics (slow down, settle)
- Extended the Particle type to include "dust" alongside "heart" and "zzz"
- Grabbing the pet mid-fall cancels the fall immediately
- `totalSquish` combines `squishAmount` (click) and `landingSquish` (gravity) for the draw transform

### Thoughts for next cycle
- CPU/memory monitoring is a strong candidate — pet sweats when system is stressed, relaxes when idle
- Particle variety by time of day: sparkles in morning, fireflies at evening, stars at night
- A proper mood/emotion state machine could unify time-awareness, reactions, and future triggers
- Pet stats (hunger, happiness, energy) for a tamagotchi dimension — could tie into gravity (heavy when full?)
- Settings window via the context menu — pet name, color themes, toggle features
- System tray integration — minimize to tray, show/hide shortcut
- The renderer is now ~800 lines — consider splitting into modules (particles.ts, physics.ts, face.ts) soon
- Sound effects on bounce landing would pair perfectly with the gravity feature
- Keyboard shortcut to show/hide the pet (global shortcut via Electron)

### Current architecture notes
- Gravity state: `isFalling`, `velocityY`, `groundY`, `landingSquish` — all in renderer.ts
- `groundY` is calculated from screen bounds on drag release (screenHeight - 200 - GROUND_MARGIN)
- `GRAVITY = 0.6`, `BOUNCE_DAMPING = 0.45` — tuned for satisfying bouncy feel
- Landing squish decays at 0.85 per frame, separate from click squish (0.88 decay)
- `totalSquish` caps at 1.2 to prevent over-stretching when click + landing overlap
- Dust particles have their own physics: gravity pull (0.03), horizontal friction (0.96)
- Falling is cancelled on mousedown (grab interrupts fall) and triggered on mouseup after drag
- preload.ts still exposes 4 methods — no IPC changes needed for gravity (uses existing moveWindow + getScreenBounds)
