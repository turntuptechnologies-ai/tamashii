# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.49.0 — Settings Panel (2026-04-06)

### What was done
- Added an in-canvas settings panel consolidating all customization options into one polished UI
- `settingsPanelOpen`, `settingsPanelFade`, `settingsScrollOffset`, `settingsPanelOpenCount` state variables
- `toggleSettingsPanel()` function with panel mutual exclusion and sound feedback
- `drawSettingsPanel()` — full-featured overlay with warm purple gradient background
- Interactive toggle switches for Sound, Notifications, Wandering (green on/gray off)
- Color palette grid showing 8 color swatches with actual body color preview
- Accessory picker grid with 9 icon tiles (including None)
- Toy selector row with 5 clickable tiles
- Pet name display with tap-to-edit and pencil icon
- `SettingsClickArea` interface with hit-testing on mousedown
- Mouse wheel scrolling for settings content
- Context menu entry "⚙️ Settings Panel" at top of Settings submenu
- `onViewSettings` IPC channel added to preload bridge and renderer
- Keyboard shortcut G to toggle settings panel
- `settingsPanelOpenCount` added to SaveData interface, buildSaveData, applySaveData
- Achievement #26: "Configurator" (⚙️) — open settings panel 5+ times
- Panel guards: settings panel blocks toy play, trick start, photo mode while open
- Mutual exclusion with stats panel, diary panel, mood journal
- Right-click and Escape close the settings panel
- Shortcut help overlay updated with G entry
- Total achievements: 26

### Thoughts for next cycle
- **Drag-and-drop feeding** — drag food items from a tray onto the pet for more interactive feeding
- **Photo gallery** — an in-canvas gallery showing thumbnails of saved photos, track photo paths in save data
- **Trick combos** — perform tricks in specific sequences for bonus effects (wave→dance→twirl = special combo animation)
- **Multiple pet companions** — seasonal visitors or permanent friends that interact with the main pet
- **Custom color mixer** — let users define their own RGB palette instead of presets only
- **Mood alerts** — use mood journal data to detect patterns and warn when the pet's mood is trending down
- **Toy collection / unlock system** — unlock new toys by reaching milestones
- **Mini-game: Trick Performance** — a rhythm game where you time trick performances for high scores
- **Sleep tracker** — integrate with energy stat to show sleep/wake cycles in the mood journal
- **Pet emotes** — quick emoji reactions the pet can display (separate from speech bubbles), triggered by specific interactions

### Current architecture notes
- Renderer is ~8000+ lines
- Settings panel system is defined after the Mood Journal section (~line 1276)
- `drawSettingsPanel()` draws after `drawMoodJournal()` in the draw() function
- Settings panel uses `SettingsClickArea[]` array rebuilt each draw frame for hit testing
- Click interception happens at the top of the mousedown handler (before drag logic)
- Settings panel content uses `settingsScrollOffset` for vertical scrolling via mouse wheel
- Context menu data now includes everything from previous cycles
- Total achievements: 26
- Two mini-games: Star Catcher (reflex) and Memory Match (pattern recall)
- Five personality types: Shy, Energetic, Curious, Sleepy, Gluttonous
