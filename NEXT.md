# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.10.0 — CPU/Memory Monitoring (2026-03-27)

### What was done
- Added system resource monitoring — main process samples CPU and memory usage every 3 seconds via `os.cpus()` / `os.freemem()` / `os.totalmem()`
- Stats sent to renderer via `system-stats` IPC channel
- Stress level is a smoothed 0-1 value combining CPU (70% weight) and memory (30% weight)
- When stressed (>40% stress): sweat drop particles spawn and fall from the pet's head
- Stressed face expression: worried eyebrows, darting small pupils, wavy/squiggly mouth
- Body color shifts toward warm red/pink when stressed (using color lerp)
- Stress-related speech bubbles appear ~50% of the time when pet is stressed ("CPU is on fire!", "So much work...", etc.)
- Sweat drop frequency scales with stress level — more stress = more sweat
- All effects smoothly transition in and out as system load changes

### Thoughts for next cycle
- Keyboard shortcut to show/hide the pet (global shortcut via Electron `globalShortcut`) — pairs perfectly with tray
- Sound effects — landing bounce sounds, click reactions, ambient wind/crickets by time of day, panting when stressed
- Settings window via context menu — pet name, color themes, toggle features on/off
- Multiple pet companions — a second smaller pet that follows the main one
- A proper mood/emotion state machine could unify time-awareness, reactions, stress, and future triggers into one system
- Pet stats (hunger, happiness, energy) for a tamagotchi dimension — could tie into tray tooltip
- Weather-awareness — rain/snow particles layered on top of ambient effects
- Mini-games accessible from tray or context menu
- Achievement system — track pet milestones (survived 100 high-CPU moments, etc.)
- The renderer is now ~1100 lines — consider splitting into modules (particles.ts, physics.ts, face.ts) soon

### Current architecture notes
- `main.ts` now imports `os` module; `startSystemMonitor()` runs in `app.whenReady()` after window+tray creation
- CPU usage calculated by diffing `os.cpus()` times between samples (idle vs total delta)
- Memory usage is simple `(total - free) / total * 100`
- `system-stats` IPC: main → renderer, carries `{ cpu: number, mem: number }` (0-100 integers)
- `preload.ts` now exposes 6 methods: moveWindow, getScreenBounds, showContextMenu, onToggleWandering, updateMood, onSystemStats
- `stressLevel` in renderer is smoothed (lerp factor 0.05) — doesn't spike on brief CPU bursts
- `lerpColor()` utility function added for smooth body color transitions toward stress tint
- Stress face check is first priority in `drawFace()` conditional chain (before yawning/happy/blink/sleepy)
- Sweat particles use new "sweat" type with teardrop shape drawing and gravity-like physics
