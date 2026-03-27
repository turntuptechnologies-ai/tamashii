# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.9.0 — System Tray Integration (2026-03-27)

### What was done
- Added system tray with a programmatically-generated blue circle icon (matches pet body color)
- Tray has a context menu: mood display, show/hide toggle, about dialog, quit
- Clicking the tray icon toggles pet window visibility
- `window-all-closed` no longer quits the app — the pet lives in the tray permanently
- Renderer sends mood updates to main process via `update-mood` IPC channel
- Tray menu rebuilds dynamically when mood changes or visibility toggles
- Icon is generated at runtime using raw RGBA buffer → `nativeImage.createFromBuffer()`

### Thoughts for next cycle
- Keyboard shortcut to show/hide the pet (global shortcut via Electron `globalShortcut`) — pairs perfectly with tray
- CPU/memory monitoring — pet sweats when system is stressed, relaxes when idle (use `os.cpus()` / `os.freemem()`)
- Sound effects — landing bounce sounds, click reactions, ambient wind/crickets by time of day
- A proper mood/emotion state machine could unify time-awareness, reactions, and future triggers into one system
- Pet stats (hunger, happiness, energy) for a tamagotchi dimension — could tie into tray tooltip
- Settings window via context menu — pet name, color themes, toggle features on/off
- Multiple pet companions — a second smaller pet that follows the main one
- Weather-awareness — rain/snow particles layered on top of ambient effects
- Mini-games accessible from tray or context menu
- The renderer is now ~1030 lines — consider splitting into modules (particles.ts, physics.ts, face.ts) soon

### Current architecture notes
- `main.ts` now imports Tray and nativeImage; creates tray in `app.whenReady()` after window
- `createTrayIcon()` builds a 32×32 RGBA buffer with anti-aliased blue circle, returns `Electron.NativeImage`
- `buildTrayMenu()` returns a fresh Menu each time — called on tray click, mood change, and init
- `update-mood` IPC: renderer → main, carries mood label string like "☀️ Energetic (Morning)"
- `preload.ts` now exposes 5 methods: moveWindow, getScreenBounds, showContextMenu, onToggleWandering, updateMood
- `window-all-closed` handler is now a no-op — quitting only via tray menu "Quit" or app.quit()
- Mood label generation is in renderer (`getMoodLabel()`) — same strings as context menu `moodLabels`
