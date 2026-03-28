# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.13.0 — Achievement System (2026-03-28)

### What was done
- Added a 12-achievement system tracking clicks, spins, gravity bounces, stress survival, and session time
- Each achievement has an id, name, icon, description, unlock message, and a condition function
- Unlocking triggers a celebration: golden glow ring, 12 sparkles radiating outward, 5 hearts, happy reaction, and a unique speech bubble
- Achievement progress is reported to the main process via IPC (`update-achievements`) for display in menus
- Right-click context menu now has a "🏆 Achievements (X/12)" submenu listing all unlocked achievements with icons and descriptions
- Tray menu also shows achievement progress and a compact list of unlocked ones
- Stats tracked: `totalClicks`, `totalSpins`, `totalBounces`, `stressSurvivedCount`, `sessionStartTime`
- High-stress survival counts when stress goes above 0.7 then drops below 0.3
- Achievements checked every 30 frames (~0.5s) for performance
- Version bumped in About dialogs to 0.13.0

### Thoughts for next cycle
- **Persistent stats** — save click/spin/bounce counts and unlocked achievements to a JSON file so they persist across sessions (electron-store or simple fs.writeFile)
- **Pet stats (hunger, happiness, energy)** — a tamagotchi dimension with visible stat bars or indicators; happiness could tie into the achievement celebration
- **Sound effects** — a chime or sparkle sound when achievements unlock, whoosh for spin, pop for clicks
- **Settings window** — toggle features on/off, set pet name, customize colors, view full achievement details
- **Mini-games** — catch falling stars from the context menu, clicking speed challenge
- **Pet customization** — accessories (hats, bows) unlocked by achievements
- **Weather awareness** — rain/snow particles based on actual weather (would need an API + user consent)
- **Multiple pet companions** — a smaller pet friend that follows the main one
- **Achievement notifications** — a small toast/banner that slides in showing the achievement name and icon, separate from the speech bubble
- **Combo system** — triple-click for a mega trick, hold-click for a charge-up attack

### Current architecture notes
- `Achievement` interface has: id, name, description, icon, unlockMessage, condition (function), unlocked (boolean)
- `achievements` array holds all 12 achievements — conditions reference global counters
- `checkAchievements()` iterates the array, calls `celebrateAchievement()` on first unlock
- `reportAchievements()` sends progress + unlocked list to main process via `window.tamashii.updateAchievements()`
- New IPC channel: `update-achievements` (renderer → main) carries `{ progress, unlocked }` payload
- `achievementData` in main.ts stores the latest achievement state for menu building
- Both `buildTrayMenu()` and the context menu handler build achievement submenus from `achievementData`
- Stats are session-only — no persistence yet
- `preload.ts` now exposes 8 methods (added `updateAchievements`)
- Renderer is now ~1450 lines — module splitting would help (particles.ts, achievements.ts, face.ts)
