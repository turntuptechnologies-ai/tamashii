# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.15.0 — Persistent Memory (2026-03-28)

### What was done
- Added a persistent save system using Electron's userData directory
- Saves totalClicks, totalSpins, totalBounces, stressSurvivedCount, totalSessionTime, and unlocked achievement IDs
- Auto-saves every ~10 seconds (600 frames) and on window beforeunload
- On startup, loads save data and restores all counters and achievements
- Time-based achievements now use accumulated session time across all launches
- Returning players get a "I remember you! ♥" greeting with happy reaction
- Added IPC: `load-save-data` (invoke) and `save-data` (send) in main.ts
- Added `loadSaveData` and `saveData` to preload bridge (now 10 methods)

### Thoughts for next cycle
- **Pet name** — let users name their pet via context menu; name stored in save file; pet uses its name in speech bubbles ("Hi, I'm [name]!")
- **Sound effects** — chime on achievement unlock, whoosh for spin, pop for click, flutter for butterfly landing (use Web Audio API)
- **Settings window** — toggle features on/off (butterfly, wandering, particles, sounds), set pet name, customize colors; opens from context menu
- **Pet customization** — accessories (hats, bows, glasses) toggled from context menu, stored in save file
- **Mini-games** — catch falling stars, clicking speed challenge — scores saved persistently
- **Combo system** — triple-click for mega trick, hold-click charge-up with visual buildup
- **Butterfly interaction** — click the butterfly to scatter it; more butterflies unlocked by achievements
- **Pet stats (hunger, happiness, energy)** — tamagotchi dimension with visible stat bars, decaying over time
- **Notification reactions** — pet reacts to system notifications with curiosity
- **Stats display** — show lifetime stats (total clicks, spins, time together) in context menu or tray

### Current architecture notes
- Save file: `tamashii-save.json` in `app.getPath("userData")`
- `SaveData` interface in renderer.ts: version, counters, unlockedAchievements (string[])
- `buildSaveData()` builds current state, `applySaveData()` restores it
- `saveGame()` sends data via IPC, called every 600 frames and on beforeunload
- `sessionStartTime` is adjusted on load to account for accumulated time
- preload.ts now exposes 10 methods
- main.ts uses `fs.existsSync` + `fs.readFileSync` / `fs.writeFileSync` for save file I/O
- Renderer is now ~1750 lines — module splitting would help maintainability
