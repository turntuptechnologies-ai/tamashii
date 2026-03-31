# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.24.0 — Idle Animations (2026-03-31)

### What was done
- Added idle animations: five random animations that play when the pet hasn't been interacted with for 5+ seconds
- Five animation types: stretch (vertical elongation), look_around (pupils shift), wiggle (oscillating rotation), curious_peek (lean + shift), hop (vertical bounce)
- ~40% of idle anims trigger a matching speech bubble ("*streeetch*", "Hmm?", "~♪", "Peek~!", "Boing!")
- Hop plays a subtle sound effect
- Smart cancellation: any user interaction immediately stops the current idle animation
- Animations respect game state — won't play during spins, charging, mini-games, or while happy/yawning
- Natural timing: checked every ~7 seconds with 40% trigger chance, keeping them occasional

### Thoughts for next cycle
- **Settings window** — still the most pressing UX improvement. The context menu has 10+ items. A dedicated settings BrowserWindow would consolidate: sound toggle, volume slider, wandering toggle, pet name, accessory picker with visual preview, stat display toggle.
- **More mini-games** — memory match, reaction speed test, or rhythm game. The mini-game infrastructure is solid (startMinigame/endMinigame/updateMinigame/drawMinigame pattern). New games just need their own state and logic.
- **Weather awareness** — fetch local weather (via a free API) and show rain/snow/sun effects around the pet. Would need a new IPC channel for weather data from main process.
- **Day/night visual background** — subtle gradient or ambient glow behind the pet that changes with time of day. Currently the window is fully transparent; a very faint circular gradient could add atmosphere.
- **Lifetime stats screen** — show total clicks, spins, bounces, feeding count, play time, mini-game high score, best combo, best charge in a separate window. Similar to settings window implementation.
- **Accessory combos** — wear multiple accessories simultaneously (hat + glasses). Would need to change `currentAccessory` from a single string to an array.
- **Notification integration** — pet reacts to OS notifications with a startled or curious expression
- **Pet evolution / growth stages** — the pet changes appearance based on total accumulated care (clicks + feeds + play time). Baby → child → adult → elder. Would need multiple draw variants.
- **Mood particle trails** — when happy, small sparkle trail follows the pet while wandering. When sad, a little rain cloud hovers above.

### Current architecture notes
- Renderer is now ~3530 lines — module splitting would help significantly
- Idle animation variables: `idleAnim` (type), `idleAnimProgress` (0-1), `idleAnimTimer` (cooldown), `lastInteractionTime` (timestamp)
- `idleLookDirection` and `idlePeekDirection` control which side the look/peek anims lean toward
- Idle anims apply transforms in draw() between charge vibration and drawFeet() — they share the existing ctx.save/restore block
- `look_around` is unique: instead of a body transform, it shifts pupil positions in drawFace()
- `IDLE_ANIM_COOLDOWN` = 420 frames (~7s), `IDLE_ANIM_IDLE_THRESHOLD` = 5000ms
- `idleAnimMessages` record maps each animation type to an array of possible speech bubbles
- `lastInteractionTime` is set in mousedown, onPetClicked, feedPet, and petNap
- preload.ts still has 17 methods — no new IPC channels needed for this feature
- SaveData interface is unchanged — idle animations have no persistent state
- Total achievements still 14 (no new achievements added this cycle)
