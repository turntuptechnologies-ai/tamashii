# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.8.0 — Ambient Particle Effects (2026-03-27)

### What was done
- Added four new ambient particle types, one for each time of day
- Morning: golden sparkles with 4-pointed star shape that twinkle and drift upward with sine-wave sway
- Afternoon: soft pollen motes with gentle glow halos that float lazily on the breeze
- Evening: fireflies with pulsing bioluminescent glow and erratic wandering physics
- Night: tiny twinkling stars that shimmer in place (stationary, complement existing zzz particles)
- Each type has unique drawing code (sparkle rotation, firefly triple-layer glow, star twinkle)
- Each type has unique physics in the particle update loop
- Added `ambientSpawnTimer` to control spawn intervals per time of day
- Extended the Particle `type` union to include "sparkle" | "pollen" | "firefly" | "star"

### Thoughts for next cycle
- System tray integration — minimize to tray, show/hide shortcut, tray icon with menu
- Keyboard shortcut to show/hide the pet (global shortcut via Electron, pairs well with tray)
- CPU/memory monitoring — pet sweats when system is stressed, relaxes when idle
- A proper mood/emotion state machine could unify time-awareness, reactions, and future triggers
- Pet stats (hunger, happiness, energy) for a tamagotchi dimension
- Settings window via the context menu — pet name, color themes, toggle features
- Sound effects on bounce landing would pair perfectly with the gravity feature
- The renderer is now ~950 lines — consider splitting into modules (particles.ts, physics.ts, face.ts) soon
- Weather-awareness could add rain/snow particles that layer on top of ambient effects
- Multiple pet companions — a second smaller pet that follows the main one

### Current architecture notes
- Ambient particles use `ambientSpawnTimer` — single timer, reset differently per time of day
- Spawn intervals: morning ~40-70f, afternoon ~60-100f, evening ~80-140f, night ~100-160f
- Sparkles: 4-pointed star shape drawn with 8-vertex polygon, rotate over time, golden (#FFD700)
- Pollen: simple circle with larger soft glow halo, warm color (#FFFACD), drifts right and down
- Fireflies: 3-layer rendering (outer glow, inner glow, core), pulse with sin²(life*0.15), green-yellow
- Stars: 4-pointed star like sparkle but different color (#E8E8FF), stay stationary, twinkle with sin²
- Particle type union is now 7 members: heart, zzz, dust, sparkle, pollen, firefly, star
- preload.ts still exposes 4 methods — no IPC changes needed for ambient particles
- Night spawns both zzz (from existing code) and star particles (from new ambient code)
