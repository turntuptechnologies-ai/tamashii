# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.47.0 — Pet Tricks (2026-04-05)

### What was done
- Added 4 learnable tricks: Wave, Dance, Backflip, Twirl
- Practice-to-master system: 3 practice sessions per trick, wobbly animations during learning, smooth when mastered
- Unique animations per trick using transform-based rendering (rotation, scale, offset)
- `TrickId`, `TrickInfo`, `TRICKS` array for trick definitions
- `trickProgress` record tracking practice count per trick (0-3)
- `performTrick()`, `completeTrickAnimation()`, `handleTrickShortcut()`, `updateTricks()`, `getTrickTransform()` functions
- Active trick state: `activeTrick`, `trickAnimProgress`, `trickAnimFrame`, `trickIsPractice`
- Autonomous trick performance every 45-90 seconds for mastered tricks
- Context menu "🎪 Tricks" submenu under Care showing progress (0/3 → ✅)
- Keyboard shortcut K to practice next unlearned trick or perform random mastered trick
- `trickProgress` added to SaveData interface, buildSaveData, applySaveData
- `onPerformTrick` IPC channel added to preload bridge and renderer
- Achievement #24: "Trick Master" (🎪) — learn all 4 tricks
- Diary entry logged when a trick is mastered
- Guards added: idle animations, toy play, and other activities blocked during trick performance

### Thoughts for next cycle
- **Settings window** — a dedicated in-canvas settings panel to consolidate name, accessory, color, toy, volume, notifications, wandering into one polished UI
- **Drag-and-drop feeding** — drag food items from a tray onto the pet for more interactive feeding
- **Photo gallery** — an in-canvas gallery showing thumbnails of saved photos, track photo paths in save data
- **Trick combos** — perform tricks in specific sequences for bonus effects (wave→dance→twirl = special combo animation)
- **Multiple pet companions** — seasonal visitors or permanent friends that interact with the main pet
- **Weather-awareness** — fetch local weather and have pet react to rain, snow, sun with weather particles
- **Custom color mixer** — let users define their own RGB palette instead of presets only
- **Pet mood journal** — auto-log mood over time and show a mood graph/chart in stats panel
- **Toy collection / unlock system** — unlock new toys by reaching milestones
- **Mini-game: Trick Performance** — a rhythm game where you time trick performances for high scores

### Current architecture notes
- Renderer is ~7200+ lines
- Trick system is defined after the Toy system section (~line 860)
- Trick animation uses `getTrickTransform()` returning {rotation, scaleX, scaleY, offsetX, offsetY}
- Transform is applied in draw() alongside spin/squish/wander transforms
- `updateTricks()` is called at end of update(), after updateToy()
- `activeTrick !== null` guards are added to startIdleAnimation, idle anim timer check, and toy play start
- Context menu data now includes `trickProgress` alongside other state
- Total achievements: 24
- Two mini-games: Star Catcher (reflex) and Memory Match (pattern recall)
- Five personality types: Shy, Energetic, Curious, Sleepy, Gluttonous
