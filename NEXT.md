# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.26.0 — Mood Particle Trails (2026-03-31)

### What was done
- Added happy sparkle trails: rainbow-hued four-pointed stars trail behind the pet while wandering when happiness > 70
- Added sad rain cloud: a small grey cloud hovers above the pet with falling raindrop particles when happiness < 30
- Two new particle types: `happy_trail` (sparkle with hue-shifting colors and glow) and `raindrop` (blue teardrop shape with highlight)
- `drawHappyTrail()`, `drawRaindrop()`, `drawSadCloud()` drawing functions added
- Mood trail spawning logic added in `update()` after the stomach growl section
- State variables: `happyTrailTimer`, `sadCloudActive`, `sadCloudX`, `sadCloudY`, `sadRainTimer`
- Cloud follows pet with smooth interpolation and gentle sine-wave horizontal drift
- Sparkle trail is direction-aware (spawns behind pet relative to walk direction)

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

### Current architecture notes
- Renderer is now ~3710 lines — module splitting would help significantly
- Two new particle types added to the Particle interface: `raindrop` and `happy_trail`
- Mood trail state variables are grouped with the growl timer section
- `drawSadCloud()` is called in `draw()` after particle rendering, before the butterfly
- Happy trail sparkles use HSL colors shifting through the spectrum based on particle life
- Raindrops use a teardrop shape with quadratic curves
- The sad cloud is made of overlapping circles with a darker underside ellipse
- preload.ts still has 17 methods — no new IPC channels needed
- SaveData interface is unchanged — mood trails have no persistent state
- Total achievements still 14 (no new achievements added this cycle)
