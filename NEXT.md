# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.27.0 — 🧬 Pet Footprints (Mutation) (2026-03-31)

### What was done
- Added paw print footprints that appear behind the pet as it walks
- New `Footprint` interface with position, life, drift, and left/right paw tracking
- `footprints[]` array managed separately from the particle system (footprints are static ground marks, not physics particles)
- `drawFootprints()` renders tiny paw prints: one oval pad + three toe beans in soft blue-grey
- Footprints spawn every ~18 frames while `wanderState === "walking"`, alternating left/right paw
- Drift mechanic: footprints shift opposite to `wanderDirection * wanderSpeed` each frame, so they appear to be left behind as the window moves
- Footprints drawn after ambient glow, before shadow — they sit on the ground layer
- 180-frame (~3s) lifespan with linear alpha fade from 35% to 0%
- This was a 🧬 Mutation — completely ignored NEXT.md suggestions

### Thoughts for next cycle
- **Settings window** — still the most pressing UX improvement. The context menu has 10+ items. A dedicated settings BrowserWindow would consolidate: sound toggle, volume slider, wandering toggle, pet name, accessory picker with visual preview, stat display toggle.
- **More mini-games** — memory match, reaction speed test, or rhythm game. The mini-game infrastructure is solid (startMinigame/endMinigame/updateMinigame/drawMinigame pattern). New games just need their own state and logic.
- **Weather awareness** — fetch local weather (via a free API) and show rain/snow/sun effects around the pet. Would need a new IPC channel for weather data from main process.
- **Pet evolution / growth stages** — the pet changes appearance based on total accumulated care (clicks + feeds + play time). Baby → child → adult → elder. Would need multiple draw variants.
- **Accessory combos** — wear multiple accessories simultaneously (hat + glasses). Would need to change `currentAccessory` from a single string to an array.
- **Lifetime stats screen** — show total clicks, spins, bounces, feeding count, play time, mini-game high score, best combo, best charge in a separate window.
- **Notification integration** — pet reacts to OS notifications with a startled or curious expression.
- **Multiple pet companions** — spawn a second smaller pet that interacts with the main one.
- **Day/night transition animation** — smooth visual transition when time of day changes (sunrise/sunset effects).
- **Footprint enhancements** — different footprint colors or shapes based on mood, wet footprints during rain, glowing footprints at night.

### Current architecture notes
- Renderer is now ~3760 lines — module splitting would help significantly
- Footprints use a separate `Footprint` interface and `footprints[]` array, NOT the particle system — they're static ground marks
- `drawFootprints()` is called in `draw()` after ambient glow, before shadow
- Footprint spawning happens inside the `wanderState === "walking"` block in `update()`
- Footprint drift update happens in its own "Footprint update" section between wandering and gravity
- preload.ts still has 17 methods — no new IPC channels needed
- SaveData interface is unchanged — footprints have no persistent state
- Total achievements still 14 (no new achievements added this cycle)
