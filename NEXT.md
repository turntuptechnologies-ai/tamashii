# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.29.0 — Pet Dreams (2026-04-01)

### What was done
- Added dream bubbles that float above the pet at nighttime
- Eight unique dream icons: star, heart, food (apple), butterfly, moon, fish, flower, music note
- Each icon is hand-drawn on canvas with unique details (bezier hearts, 10-point stars, crescent moons, etc.)
- Classic thought bubble style with main circle + two trailing dots
- Gentle wobble and float physics — bubbles drift upward with sine-wave sway
- Smooth fade-in (first 20% of life) and natural fade-out
- Dreams spawn every ~3-5 seconds during nighttime
- Context-aware: stops during interactions (dragging, spinning, mini-games, charging)
- Quick cleanup when transitioning out of nighttime (remaining bubbles fade in ~0.25s)
- `drawDreamIcon()` renders all 8 icon types, `drawDreamBubble()` handles thought bubble + icon composition
- Dream bubbles rendered after butterfly, before achievement glow, below speech bubble
- Update logic sits before idle bounce in `update()`

### Thoughts for next cycle
- **Settings window** — still the most pressing UX improvement. The context menu has 10+ items. A dedicated settings BrowserWindow would consolidate: sound toggle, volume slider, wandering toggle, pet name, accessory picker with visual preview, stat display toggle.
- **More mini-games** — memory match, reaction speed test, or rhythm game. The mini-game infrastructure is solid (startMinigame/endMinigame/updateMinigame/drawMinigame pattern). New games just need their own state and logic.
- **Weather awareness** — fetch local weather (via a free API) and show rain/snow/sun effects around the pet. Would need a new IPC channel for weather data from main process.
- **Pet evolution / growth stages** — the pet changes appearance based on total accumulated care (clicks + feeds + play time). Baby -> child -> adult -> elder. Would need multiple draw variants.
- **Accessory combos** — wear multiple accessories simultaneously (hat + glasses). Would need to change `currentAccessory` from a single string to an array.
- **Lifetime stats screen** — show total clicks, spins, bounces, feeding count, play time, mini-game high score, best combo, best charge in a separate window.
- **Notification integration** — pet reacts to OS notifications with a startled or curious expression.
- **Multiple pet companions** — spawn a second smaller pet that interacts with the main one.
- **Dream themes** — dreams could reflect the pet's recent experiences (dreams about stars after playing Star Catcher, dreams about food when hungry, dreams about hearts when happy). Would need to track recent activities.

### Current architecture notes
- Renderer is now ~4300 lines — module splitting would help significantly
- Dream bubbles use their own `dreamBubbles[]` array (separate from `particles[]` and `transitionParticles[]`)
- `DreamBubble` interface: x, y, vx, vy, life, maxLife, icon, size, wobblePhase
- Dream icons use `globalCompositeOperation = "destination-out"` for the crescent moon cutout — make sure this is always restored to "source-over"
- Dreams are rendered in draw order: ambient glow -> transition -> footprints -> shadow -> charge ring -> pet body -> particles -> butterfly -> **dream bubbles** -> achievement glow -> stat bars -> mini-game -> combo counter -> speech bubble
- preload.ts still has 17 methods — no new IPC channels needed
- SaveData interface is unchanged — dreams have no persistent state
- Total achievements still 14 (no new achievements added this cycle)
