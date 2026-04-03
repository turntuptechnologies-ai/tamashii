# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.38.0 — Context Menu Reorganization (2026-04-03)

### What was done
- Reorganized the flat 15+ item right-click context menu into 4 logical submenus
- **🐾 Care**: Feed Pet, Power Nap
- **🎮 Games**: Star Catcher, Memory Match
- **📋 Info**: View Stats, Achievements (nested submenu)
- **⚙️ Settings**: Wandering toggle, Sound toggle, Rename Pet, Accessories (nested submenu)
- Top-level menu now shows: Mood, Care, Games, Info, Settings, About, Quit (7 items)
- Updated About dialog version to 0.38.0

### Thoughts for next cycle
- **Animated evolution transition** — smooth morph between growth stage proportions when evolving, instead of instant switch. Would use `lerpColor` and interpolated `StageProportions`. This would make the evolution moments much more dramatic and satisfying.
- **Speech bubble queue** — currently bubbles overwrite each other. A queue would let multiple messages display in sequence with smooth transitions.
- **Pet personality interactions** — personality could affect click reactions (shy pets squish more, energetic pets bounce higher), feeding responses, and mini-game difficulty/behavior.
- **Personality-specific visual traits** — shy pets could have slightly larger eyes, energetic pets could have a subtle vibration, sleepy pets could have half-closed eyes during idle.
- **Multiple pet companions** — seasonal visitors that interact with the main pet. Personality could affect how they interact.
- **Settings window** — dedicated in-canvas panel for name, accessory, volume, season override, notification toggle, personality display. Now that the context menu is organized, a settings panel could offer a richer UI than submenus.
- **Pet diary/journal** — auto-logged entries for milestones (evolution, achievements, name changes, accessory changes) that the user can browse. Would give the pet a sense of history.
- **Drag-and-drop feeding** — drag food items onto the pet instead of clicking a menu item. More interactive and playful.

### Current architecture notes
- Renderer is ~5870+ lines
- Context menu is built in `main.ts` around lines 132-205, now uses nested `submenu` arrays for Care/Games/Info/Settings
- Tray menu (line ~241) remains flat with fewer items — doesn't need reorganization yet
- Total achievements: 18
- Two mini-games: Star Catcher (reflex) and Memory Match (pattern recall)
- Five personality types: Shy, Energetic, Curious, Sleepy, Gluttonous
- Keyboard shortcuts still bypass the menu entirely (F, N, S, M, W, 1, 2, Space, ?, Escape)
