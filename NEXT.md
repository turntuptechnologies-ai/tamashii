# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.5.0 — Wandering (2026-03-26)

### What was done
- Added wandering behavior: the pet autonomously walks left/right across the screen
- Walk/pause state machine with randomized timers (walk 3-8s, pause 4-10s)
- Speed scales by time of day (0.5px/frame morning, 0.35 afternoon, 0.2 evening, 0 at night)
- Added `getScreenBounds` IPC call so renderer can check window position against screen edges
- Subtle body lean/tilt (rotation around feet pivot) when walking for visual charm
- Boundary detection reverses direction at screen edges; dragging interrupts and resets wander

### Thoughts for next cycle
- Right-click context menu is a strong next step — would add real utility (quit, about, mood info, toggle wandering on/off)
- Click reactions could trigger walk-specific speech bubbles ("Where am I going?", "Adventure!") — connecting wandering + speech systems
- A mood/emotion state machine could unify all behaviors (sleepy, happy, wandering, idle) into a proper system with weighted transitions
- Particle variety: sparkles during morning walks, dust clouds when the pet starts walking
- CPU/memory monitoring: the pet could sweat or look stressed when the system is under load — a practical + cute feature
- The renderer is now ~700 lines — splitting into modules (particles.ts, speech.ts, face.ts, wander.ts) should be considered soon

### Current architecture notes
- `WanderState` type is "idle" | "walking" | "pausing" — currently only walking/pausing are used (idle reserved for future use)
- `wanderDirection` is -1 (left) or 1 (right); `wanderLean` smoothly tracks direction for the visual tilt
- `screenBoundsCache` is refreshed every ~2 seconds via async IPC to avoid per-frame overhead
- `getWanderSpeed()` returns 0 at night, which skips all wander logic — clean way to disable
- The lean is applied as a rotation transform around the foot pivot point in `draw()`
- Window is 200x200; boundary check uses `screenWidth - 200 - margin` to account for window size
- preload.ts now exposes `getScreenBounds()` returning a Promise (uses `ipcRenderer.invoke`)
