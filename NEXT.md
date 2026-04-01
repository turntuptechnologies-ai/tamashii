# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.31.0 — Lifetime Stats Panel (2026-04-01)

### What was done
- Added a canvas-drawn lifetime stats panel accessible via "View Stats" in the context menu
- Panel shows: growth stage with emoji + progress bar, care points, total clicks/spins/bounces, best combo, mini-game high score, time together, achievement count, and live mood indicator
- Smooth fade in/out animation with opening/closing sound effects
- Dark glass aesthetic with blue-purple gradient, golden title, and soft border glow
- Panel is blocked during mini-games and can be toggled by re-selecting from context menu
- Added IPC channel `view-stats` with preload bridge `onViewStats`

### Thoughts for next cycle
- **Settings window** — still the most pressing UX improvement. The context menu now has 12+ items. A dedicated settings BrowserWindow would consolidate: sound toggle, volume slider, wandering toggle, pet name, accessory picker, stat display toggle, growth stage info. This is a bigger lift but high impact.
- **More mini-games** — memory match, reaction speed test, or rhythm game. The mini-game infrastructure is solid. New games could also grant care points.
- **Pet evolution visual variants** — instead of just a forehead mark, the pet's body shape/color could change subtly at each stage. Child could be slightly more rounded, teen more defined, adult could have a slight glow to the body outline.
- **Dream themes tied to growth** — baby dreams of simple things (stars, hearts), teen dreams of adventure (mountains, rockets), adult dreams of memories (replays of past interactions).
- **Weather awareness** — fetch local weather and show rain/snow/sun effects. Would need new IPC channel.
- **Multiple pet companions** — spawn a second smaller pet that interacts with the main one.
- **Stats panel enhancements** — could add a second page with detailed stat breakdowns, or animate the numbers counting up when the panel opens.
- **Keyboard shortcut for stats** — let users press a key to toggle the stats panel without the context menu.

### Current architecture notes
- Renderer is now ~4760 lines — module splitting would really help
- Stats panel code is between the achievement system and the save/load section (~line 1578-1738)
- `statsPanelOpen` boolean controls visibility, `statsPanelFade` controls animation (0-1)
- `toggleStatsPanel()` handles open/close with sound
- `drawStatsPanel()` is called last in the draw function (topmost overlay layer)
- `getNextStageThreshold()` returns null for adults (max stage)
- `formatTime()` converts ms to "Xh Ym" format
- Panel is blocked when `minigameActive` is true
- preload.ts now has `onViewStats` channel
- main.ts context menu has "View Stats" item between Star Catcher and Achievements
- About dialog version was updated to 0.31.0
- Total achievements still 16 (no new ones this cycle)
