# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.11.0 — Global Keyboard Shortcut (2026-03-27)

### What was done
- Added global keyboard shortcut `CmdOrCtrl+Shift+T` to toggle pet visibility from anywhere
- Uses Electron's `globalShortcut` module — registered on app ready, unregistered on will-quit
- When the pet is summoned via shortcut, the renderer receives a `shortcut-toggled` IPC event
- Pet reacts to being summoned: happy face, squish animation, floating hearts, and a greeting speech bubble
- Six greeting messages rotate randomly: "I'm back!", "You called?", "Miss me? ♥", "Here I am!", "Ta-da~!", "Reporting in!"
- Tray menu now shows the accelerator hint next to the Show/Hide option
- Unified toggle logic — tray click, tray menu, and keyboard shortcut all use the same `togglePetVisibility()` function

### Thoughts for next cycle
- Sound effects — landing bounce sounds, click reactions, ambient wind/crickets by time of day, a little "pop" sound when summoned via shortcut
- Settings window via context menu — pet name, color themes, toggle features on/off, customize the keyboard shortcut
- Multiple pet companions — a second smaller pet that follows the main one around
- A proper mood/emotion state machine could unify time-awareness, reactions, stress, and shortcut greetings into one clean system
- Pet stats (hunger, happiness, energy) for a tamagotchi dimension — could tie into tray tooltip
- Weather-awareness — rain/snow particles layered on top of ambient effects
- Mini-games accessible from tray or context menu (catch falling stars, pet clicking counter)
- Achievement system — track pet milestones (survived 100 high-CPU moments, summoned 50 times, etc.)
- Pet customization (colors, accessories) — could be a settings window feature
- The renderer is now ~1200 lines — splitting into modules (particles.ts, physics.ts, face.ts) is becoming more important

### Current architecture notes
- `main.ts` now imports `globalShortcut` from Electron
- `togglePetVisibility()` is a shared function used by tray click, tray menu, and global shortcut
- `registerGlobalShortcut()` called in `app.whenReady()`, `globalShortcut.unregisterAll()` in `app.on("will-quit")`
- `shortcut-toggled` IPC: main → renderer, carries a boolean (true = shown)
- `preload.ts` now exposes 7 methods: moveWindow, getScreenBounds, showContextMenu, onToggleWandering, updateMood, onSystemStats, onShortcutToggled
- Shortcut greeting messages are separate from time-of-day messages and stress messages
- The shortcut handler in renderer triggers both visual effects (squish, hearts) and a speech bubble simultaneously
