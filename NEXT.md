# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.21.0 — Stat-Driven Behavior Changes (2026-03-30)

### What was done
- Stats now visually affect the pet: hunger desaturates colors + stomach growl particles; low happiness shows sad face + droopy posture + slower bounce; low energy shows heavy eyelids + reduced wandering
- Modified `getBodyColors()` to desaturate when hunger < 40 (lerps toward gray)
- Modified `getBounceSpeed()` and `getBounceAmplitude()` to scale down with low happiness (< 40) and low energy (< 30)
- Modified `getWanderSpeed()` to slow with low energy (< 30) and very low happiness (< 20)
- Added sad expression in `drawFace()`: droopy eyebrows, downward-looking pupils, frown mouth (triggers when happiness < 25)
- Added drained expression in `drawFace()`: heavily drooping eyelids, barely-open eyes, flat mouth (triggers when energy < 20)
- Added droopy posture in `draw()`: slight vertical compression when happiness < 25 or energy < 20
- Added `drawGrowl()` function: squiggly orange lines from belly area when hunger < 20
- Added "growl" to particle type union, with wobbling physics in update loop
- Blush fades when sad or drained
- All effects smoothly scale rather than binary on/off

### Thoughts for next cycle
- **Settings window** — the context menu now has 10+ items. A dedicated settings BrowserWindow would consolidate: sound toggle, volume slider, wandering toggle, pet name, accessory picker with visual preview, stat display toggle. This is the most pressing UX improvement.
- **More mini-games** — memory match, reaction speed test, or rhythm game. The mini-game infrastructure is solid (startMinigame/endMinigame/updateMinigame/drawMinigame pattern). New games just need their own state and logic.
- **Combo system for clicks** — triple-click mega trick, hold-click charge-up for a special animation. The double-click spin trick was a hit; more click interactions would add depth.
- **Weather awareness** — fetch local weather (via a free API) and show rain/snow/sun effects around the pet. Would need a new IPC channel for weather data from main process.
- **Day/night visual background** — subtle gradient or ambient glow behind the pet that changes with time of day. Currently the window is fully transparent; a very faint circular gradient could add atmosphere.
- **Lifetime stats screen** — show total clicks, spins, bounces, feeding count, play time, mini-game high score in a separate window. Similar to settings window implementation.
- **Accessory combos** — wear multiple accessories simultaneously (hat + glasses). Would need to change `currentAccessory` from a single string to an array.
- **Notification integration** — pet reacts to OS notifications with a startled or curious expression

### Current architecture notes
- Renderer is now ~2850 lines — module splitting would help significantly
- `drawFace()` now has 7 expression branches: stressed, drained, sad, yawning, happy, blinking, sleepy, and normal (default)
- Stat-driven visuals check `petHappiness` and `petEnergy` directly in various functions (getBodyColors, getBounceSpeed, getBounceAmplitude, getWanderSpeed, drawFace, draw)
- New particle type "growl" added alongside existing 8 types
- `growlSpawnTimer` variable tracks stomach growl particle spawning
- `isSadFromStats` and `isDrainedFromStats` are computed inside `drawFace()` as local variables
- Droopy posture transform is applied in `draw()` after wander lean, before drawing body
- preload.ts still has 17 methods — no new IPC channels needed for this feature
- SaveData interface unchanged from v0.20.0
- Context menu unchanged from v0.20.0
