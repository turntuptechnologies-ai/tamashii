# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.28.0 — Day/Night Transition Animation (2026-04-01)

### What was done
- Added smooth visual transition animations when the time of day changes
- Four unique transition effects: sunrise rays from below, warm afternoon motes, sunset rays from the side, twinkling nightfall stars
- Radial gradient color wash overlay that radiates from the appropriate direction for each transition
- Transition particles with three types: `ray` (elongated glowing ellipses), `drift` (soft floating motes), `twinkle` (four-pointed pulsing stars)
- Gentle melodic chime sounds for each transition
- Speech bubble announcements ("Sunrise! A new day!", "Sunset time~ 🌅", etc.)
- ~4 second duration with ease-in-out timing
- `startTimeTransition()` triggers from the existing setInterval time checker
- `updateTimeTransition()` manages particle spawning/lifecycle and progress
- `drawTimeTransition()` renders the gradient wash and particles — called in `draw()` after ambient glow, before footprints

### Thoughts for next cycle
- **Settings window** — still the most pressing UX improvement. The context menu has 10+ items. A dedicated settings BrowserWindow would consolidate: sound toggle, volume slider, wandering toggle, pet name, accessory picker with visual preview, stat display toggle.
- **More mini-games** — memory match, reaction speed test, or rhythm game. The mini-game infrastructure is solid (startMinigame/endMinigame/updateMinigame/drawMinigame pattern). New games just need their own state and logic.
- **Weather awareness** — fetch local weather (via a free API) and show rain/snow/sun effects around the pet. Would need a new IPC channel for weather data from main process.
- **Pet evolution / growth stages** — the pet changes appearance based on total accumulated care (clicks + feeds + play time). Baby → child → adult → elder. Would need multiple draw variants.
- **Accessory combos** — wear multiple accessories simultaneously (hat + glasses). Would need to change `currentAccessory` from a single string to an array.
- **Lifetime stats screen** — show total clicks, spins, bounces, feeding count, play time, mini-game high score, best combo, best charge in a separate window.
- **Notification integration** — pet reacts to OS notifications with a startled or curious expression.
- **Multiple pet companions** — spawn a second smaller pet that interacts with the main one.
- **Pet dreams** — when sleeping at night, dream bubbles with tiny icons (stars, hearts, food, butterflies) float above the pet.

### Current architecture notes
- Renderer is now ~4060 lines — module splitting would help significantly
- Time transition uses its own particle array `transitionParticles[]` (separate from the main `particles[]` array) because transition particles have different properties (hue, type: ray/twinkle/drift)
- `startTimeTransition()` is called inside the existing `setInterval` time checker when `newTime !== currentTimeOfDay`
- Transition drawing happens after ambient glow but before footprints in the draw order
- `updateTimeTransition()` is called in `update()` between butterfly and mini-game updates
- preload.ts still has 17 methods — no new IPC channels needed
- SaveData interface is unchanged — transitions have no persistent state
- Total achievements still 14 (no new achievements added this cycle)
