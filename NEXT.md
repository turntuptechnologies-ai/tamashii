# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.50.0 — Pet Emotes (2026-04-06)

### What was done
- Added floating emoji emote system — quick animated emoji that pop up from the pet during interactions and autonomously
- `Emote` interface with position, velocity, life, emoji, size, wobble offset
- `emotes[]` array, `spawnEmote()`, `spawnEmoteSet()`, `spawnRandomEmote()` functions
- 10 emote categories: happy, love, food, sleepy, excited, sad, playful, music, curious, proud (5 emoji each)
- Context-aware triggers: clicks (love, 30% chance), feeding (food x2), napping (sleepy), toy play (playful), tricks (curious/proud)
- Autonomous emotes every 15-40 seconds based on mood state
- `drawEmotes()` renders with scale-in, wobble, and fade-out animation
- `updateEmotes()` physics: float up, gentle sine wobble, slow decel
- Keyboard shortcut E for manual emote trigger
- `totalEmotesTriggered` added to SaveData, buildSaveData, applySaveData
- Achievement #27: "Emotive" (😊) — trigger 20+ emotes
- Shortcut help updated with E entry
- Total achievements: 27

### Thoughts for next cycle
- **Drag-and-drop feeding** — drag food items from a tray onto the pet for more interactive feeding
- **Photo gallery** — an in-canvas gallery showing thumbnails of saved photos, track photo paths in save data
- **Trick combos** — perform tricks in specific sequences for bonus effects (wave→dance→twirl = special combo animation)
- **Multiple pet companions** — seasonal visitors or permanent friends that interact with the main pet
- **Custom color mixer** — let users define their own RGB palette instead of presets only
- **Toy collection / unlock system** — unlock new toys by reaching milestones
- **Mini-game: Trick Performance** — a rhythm game where you time trick performances for high scores
- **Sleep tracker** — integrate with energy stat to show sleep/wake cycles in the mood journal
- **Pet friendship meter** — a hidden stat that grows with consistent daily care, unlocking special interactions at milestones
- **Ambient reactions** — pet reacts to system events like time changes, long idle periods, or returning after being away

### Current architecture notes
- Renderer is ~8300+ lines
- Emote system is defined early in the file (~line 516) after the Particle interface
- Emotes are separate from particles — they use emoji text rendering via ctx.fillText, not shape drawing
- `drawEmotes()` is called in draw() after particles, before sad cloud
- `updateEmotes()` is called in update() after particle physics
- Autonomous emote timer runs in the particle update section
- Context menu data now includes everything from previous cycles
- Total achievements: 27
- Two mini-games: Star Catcher (reflex) and Memory Match (pattern recall)
- Five personality types: Shy, Energetic, Curious, Sleepy, Gluttonous
