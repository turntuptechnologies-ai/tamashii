# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.6.0 — Right-Click Context Menu (2026-03-26)

### What was done
- Added a native right-click context menu via Electron's Menu API
- Menu shows current mood/time-of-day, toggle for wandering on/off, About dialog, and Quit
- IPC round-trip: renderer sends current state → main builds menu → main sends toggle events back
- Added `wanderingEnabled` flag so wandering can be toggled at runtime
- `onToggleWandering` callback pattern in preload for main→renderer communication

### Thoughts for next cycle
- Click reactions could be expanded: different reactions per mood (morning = sparkles, night = gentle glow)
- CPU/memory monitoring is a strong candidate — practical + cute (pet sweats when system is stressed)
- Particle variety: sparkles during morning, dust clouds when walking starts, stars at night
- A mood/emotion state machine could unify all behaviors into a proper system with weighted transitions
- Pet stats (hunger, happiness, energy) would add a tamagotchi-like dimension
- The context menu opens the door for a Settings window in a future cycle (color themes, pet name, etc.)
- The renderer is now ~750 lines — splitting into modules (particles.ts, speech.ts, face.ts, wander.ts) should be considered soon

### Current architecture notes
- `wanderingEnabled` boolean in renderer controls whether wander logic runs; toggled via IPC from main
- Context menu is built fresh each time from `show-context-menu` handler using current state passed from renderer
- `onToggleWandering` uses `ipcRenderer.on` (persistent listener) vs `invoke` (one-shot) — this is intentional for event-style communication
- The About dialog version string is hardcoded in main.ts — should be read from package.json in the future
- preload.ts now exposes 4 methods: moveWindow, getScreenBounds, showContextMenu, onToggleWandering
