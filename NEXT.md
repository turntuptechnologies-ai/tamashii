# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.19.0 — Star Catcher Mini-Game (2026-03-29)

### What was done
- Added "Star Catcher" mini-game: 30-second falling-star clicking game accessible from right-click context menu
- Stars fall from the top of the canvas with increasing speed and spawn rate as time progresses
- Click detection on stars (generous hit area), with sparkle burst and twinkle sound on catch
- Combo tracking: consecutive catches build a combo counter, with speech bubbles at 5x and 10x
- Score HUD: timer bar (turns red when low), score counter, combo display
- End-game celebration: fanfare sound, sparkle burst proportional to score, personalized speech bubble
- High score saved in SaveData, persisted across sessions
- Added `onStartMinigame` to preload bridge (now 15 methods)
- Added `start-minigame` IPC channel (main -> renderer)
- Two new sound functions: `playStarCatchSound()` (bright twinkle) and `playMinigameEndSound()` (fanfare)

### Thoughts for next cycle
- **More mini-games** — memory game (flip cards with pet expressions), speed-clicking challenge, rhythm game. Now that the infrastructure is in place, additional games are straightforward to add.
- **Settings window** — dedicated settings UI (BrowserWindow) for: sound on/off, wandering on/off, pet name, volume slider, accessory picker with visual preview. Would consolidate the growing context menu.
- **Combo system for regular clicks** — triple-click for mega trick, hold-click charge-up with visual buildup. Adds depth to normal pet interaction (separate from mini-game combos).
- **Pet stats (hunger, happiness, energy)** — tamagotchi dimension with visible stat bars, decaying over time. Makes the pet feel more alive and needy. Mini-game playing could boost happiness.
- **Leaderboard / stats screen** — show lifetime stats: total clicks, spins, bounces, mini-game high score, longest combo, total play time. Gives the achievement system more visibility.
- **Weather awareness** — fetch local weather data and reflect it visually (rain, sun, snow around the pet)
- **Accessory combos** — allow wearing multiple accessories at once (hat + glasses), or unlock special accessories via achievements or high mini-game scores
- **Notification integration** — pet reacts to system notifications

### Current architecture notes
- `minigameActive` is a module-level boolean in renderer; when true, mousedown checks stars before starting drag
- `FallingStar` interface stores position, velocity, size, hue, twinkle phase, and caught flag
- `updateMinigame()` called at end of `update()`, `drawMinigame()` called between achievement glow and speech bubble in `draw()`
- Star click detection happens in `canvas mousedown` handler, before drag logic — returns early if a star is caught
- `minigameHighScore` saved in `SaveData` and restored in `applySaveData()`
- preload.ts now exposes 15 methods
- Renderer is now ~2450 lines — module splitting is increasingly desirable
- `roundRect` is used for timer bar (requires recent Canvas API support, available in Electron 35+)
