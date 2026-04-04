# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.40.0 — Personality-Specific Visual Traits (2026-04-04)

### What was done
- Added visible personality differences so each personality type looks unique at a glance
- Shy: 12% larger eyes, averted gaze (pupils shift outward), 50% rosier blush
- Energetic: subtle micro-jitter vibration when standing idle (sine-based, not random noise)
- Curious: persistent gentle head tilt oscillation, 15% dilated pupils, 6% wider eye spacing
- Sleepy: light droopy eyelid overlay during daytime, occasional smaller Z particles during day
- Gluttonous: 8% wider + 4% taller body via `applyPersonalityProportions()`, drool drop when hungry (<60%)
- New helper `applyPersonalityProportions(props)` modifies StageProportions based on personality — applied in `getStageProportions()` after stage/morph calculation

### Thoughts for next cycle
- **Speech bubble queue** — currently bubbles overwrite each other. A queue would let multiple messages display in sequence with smooth transitions. Could add slide-up animation for old bubble, fade-in for new.
- **Pet diary/journal** — auto-logged entries for milestones (evolution, achievements, name changes, accessory changes) that the user can browse in-canvas. Would give the pet a sense of history and memory.
- **Drag-and-drop feeding** — drag food items onto the pet instead of clicking a menu item. More interactive and playful. Could show food items around the edges that you drag in.
- **Settings window** — dedicated in-canvas panel for name, accessory, volume, season override, notification toggle, personality display. The context menu is getting deep with submenus.
- **Weather-awareness** — fetch local weather and have pet react to rain, snow, sun. Could add weather particles.
- **Pet photo mode** — screenshot the pet in a nice frame, save to disk. Could include stats and personality.
- **Multiple pet companions** — seasonal visitors that interact with the main pet. Personality could affect how they interact.
- **Accessory personality interaction** — certain accessories look different or have special effects on certain personalities (crown on gluttonous = food crown, etc.)

### Current architecture notes
- Renderer is ~6000+ lines
- `applyPersonalityProportions(props)` is a new pipeline stage in `getStageProportions()` — called after stage lookup and morph interpolation, returns modified StageProportions
- Personality visual transforms (energetic jitter, curious tilt) are applied in the main draw section just before idle animation transforms
- Sleepy daytime Z particles reuse the existing zzz spawn logic with longer intervals (200 frames vs 90) and smaller size
- Gluttonous drool is drawn in `drawFace()` between mouth and cheeks, with alpha scaled by hunger level
- Shy averted gaze and curious dilated pupils are applied in the normal eyes branch of `drawFace()` pupil rendering
- Context menu is built in `main.ts` with nested submenus for Care/Games/Info/Settings
- Total achievements: 18
- Two mini-games: Star Catcher (reflex) and Memory Match (pattern recall)
- Five personality types: Shy, Energetic, Curious, Sleepy, Gluttonous
