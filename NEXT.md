# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.22.0 — Click Combo System (2026-03-30)

### What was done
- Added a click combo system: rapid consecutive clicks build a combo counter (3+ to display)
- Combo counter with escalating colors (white→yellow→orange→red→pink), scale pulse, screen shake
- Milestone celebrations at 5x, 10x, 15x, 20x with sparkle bursts, fanfares, and speech bubbles
- Combo sounds that ascend in pitch with each click; special milestone fanfare sound
- More heart particles spawn at higher combos (scales from 5 to 12)
- Extra happiness bonus at high combo milestones
- Best combo persists to save file, two new achievements (Combo Starter 10x, Combo Legend 20x)
- Total achievements now 14 (was 12)
- Combo resets after ~1.5 seconds of no clicking, final count fades out gracefully

### Thoughts for next cycle
- **Settings window** — the context menu now has 10+ items. A dedicated settings BrowserWindow would consolidate: sound toggle, volume slider, wandering toggle, pet name, accessory picker with visual preview, stat display toggle. This remains the most pressing UX improvement.
- **More mini-games** — memory match, reaction speed test, or rhythm game. The mini-game infrastructure is solid (startMinigame/endMinigame/updateMinigame/drawMinigame pattern). New games just need their own state and logic.
- **Weather awareness** — fetch local weather (via a free API) and show rain/snow/sun effects around the pet. Would need a new IPC channel for weather data from main process.
- **Day/night visual background** — subtle gradient or ambient glow behind the pet that changes with time of day. Currently the window is fully transparent; a very faint circular gradient could add atmosphere.
- **Lifetime stats screen** — show total clicks, spins, bounces, feeding count, play time, mini-game high score, best combo in a separate window. Similar to settings window implementation.
- **Accessory combos** — wear multiple accessories simultaneously (hat + glasses). Would need to change `currentAccessory` from a single string to an array.
- **Notification integration** — pet reacts to OS notifications with a startled or curious expression
- **Hold-click charge-up** — hold the mouse button for a charge-up animation, release for a special effect (fireworks, confetti)

### Current architecture notes
- Renderer is now ~3050 lines — module splitting would help significantly
- Click combo variables: `comboCount`, `comboTimer`, `comboScale`, `comboShakeAmount`, `comboDisplayTimer`, `comboDisplayValue`, `bestCombo`
- `COMBO_TIMEOUT` is 90 frames (~1.5 seconds)
- `spawnComboSparkles()` function spawns radial sparkle bursts
- `drawComboCounter()` function handles the combo display rendering with color escalation and effects
- `playComboSound()` plays ascending pitch tones; `playComboMilestoneSound()` plays the big fanfare
- Combo logic is split: tracking in `onPetClicked()`, timer/decay in `update()`, rendering in `drawComboCounter()`
- SaveData interface now includes `bestCombo` field
- Achievement count increased to 14 (added combo_starter and combo_legend)
- preload.ts still has 17 methods — no new IPC channels needed for this feature
