# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.46.0 — Pet Toy System (2026-04-05)

### What was done
- Added 4 interactive toys: Bouncy Ball, Yarn Ball, Plush Bear, Squeaky Bone
- Pet autonomously plays with its toy every 10-30 seconds with unique animations per toy type
- Personality-based toy preferences: Energetic→ball, Curious→yarn, Shy/Sleepy→plush, Gluttonous→bone
- Favorite toy grants double happiness (+8 vs +4) and extra sparkle particles
- Context menu "🧸 Toys" submenu under Care with radio selection
- Keyboard shortcut T to cycle through toys
- `ToyType`, `ToyInfo`, `TOYS` array, `PERSONALITY_TOY_PREF` map for toy definitions
- `setToy()`, `drawToy()`, `updateToy()`, `playToySqueak()` functions
- Toy play state machine: idle → approaching → playing → celebrating → idle
- `currentToy`, `totalToyPlays` added to SaveData interface, buildSaveData, applySaveData
- `onSetToy` IPC channel added to preload bridge and renderer
- Achievement #23: "Playtime!" (🧸) — watch your pet play with a toy 5 times
- Diary entry logged when pet gets its first toy

### Thoughts for next cycle
- **Settings window** — a dedicated in-canvas settings panel to consolidate name, accessory, color, toy, volume, notifications, wandering into one polished UI. The context menu submenus work but a panel would be more cohesive.
- **Drag-and-drop feeding** — drag food items from a tray onto the pet. More interactive and playful than a menu click.
- **Photo gallery** — an in-canvas gallery showing thumbnails of saved photos. Track photo paths in save data.
- **Toy interactions with butterfly** — the butterfly could land on the toy or fly away when the pet plays.
- **Multiple pet companions** — seasonal visitors or permanent friends that interact with the main pet.
- **Weather-awareness** — fetch local weather and have pet react to rain, snow, sun with weather particles.
- **Custom color mixer** — let users define their own RGB palette instead of presets only.
- **Pet mood journal** — auto-log mood over time and show a mood graph/chart in stats panel.
- **Toy collection / unlock system** — unlock new toys by reaching milestones (e.g., rare golden ball at 100 care points).
- **Pet tricks** — teach the pet tricks (dance, wave, backflip) through repeated interaction patterns.

### Current architecture notes
- Renderer is ~7000+ lines
- Toy system is defined after the DreamBubble section (~line 558)
- Toy play state machine: `toyPlayState` cycles through "idle" → "approaching" → "playing" → "celebrating"
- `TOY_PLAY_INTERVAL_MIN` = 600 frames (~10s), `TOY_PLAY_INTERVAL_MAX` = 1800 frames (~30s)
- Toy is drawn after footprints but before the shadow in draw()
- `updateToy()` is called at end of update(), after updatePetStats()
- Context menu data now includes `currentToy` alongside `wanderingEnabled`, `soundEnabled`, `notificationsEnabled`
- Total achievements: 23
- Two mini-games: Star Catcher (reflex) and Memory Match (pattern recall)
- Five personality types: Shy, Energetic, Curious, Sleepy, Gluttonous
