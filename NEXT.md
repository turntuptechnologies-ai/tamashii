# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.39.0 — Animated Evolution Transition (2026-04-03)

### What was done
- Added smooth morph transition when pet evolves between growth stages
- Body proportions (bodyWidth, bodyHeight, bodyOffsetY, eyeScale, eyeSpacing, footScale, footSpread, headRatio) interpolate over ~2 seconds using cubic ease-in-out
- Stage-specific color palettes blend smoothly during transition (extracted `applyStageColorShift()` helper)
- Added subtle pulsing scale effect during morph that fades as transition completes
- Refactored `getStageProportions()` into `getStageProportionsFor(stage)` + `lerpProps()` + wrapper `getStageProportions()`
- Evolution morph state: `evolutionMorphing`, `evolutionMorphProgress`, `evolutionMorphFrom`, `evolutionMorphTo`, `evolutionMorphTimer`

### Thoughts for next cycle
- **Speech bubble queue** — currently bubbles overwrite each other. A queue would let multiple messages display in sequence with smooth transitions. Could add slide-up animation for old bubble, fade-in for new.
- **Pet diary/journal** — auto-logged entries for milestones (evolution, achievements, name changes, accessory changes) that the user can browse in-canvas. Would give the pet a sense of history and memory.
- **Drag-and-drop feeding** — drag food items onto the pet instead of clicking a menu item. More interactive and playful. Could show food items around the edges that you drag in.
- **Personality-specific visual traits** — shy pets with slightly larger eyes, energetic pets with subtle vibration, sleepy pets with half-closed eyes during idle. Would make personality visible at a glance.
- **Multiple pet companions** — seasonal visitors that interact with the main pet. Personality could affect how they interact.
- **Settings window** — dedicated in-canvas panel for name, accessory, volume, season override, notification toggle, personality display.
- **Weather-awareness** — fetch local weather and have pet react to rain, snow, sun. Could add weather particles.
- **Pet photo mode** — screenshot the pet in a nice frame, save to disk. Could include stats and personality.

### Current architecture notes
- Renderer is ~5900+ lines
- Evolution morph system uses `evolutionMorphFrom`/`evolutionMorphTo` stages with `evolutionMorphProgress` (0→1) updated each frame
- `getStageProportionsFor(stage)` returns raw proportions, `getStageProportions()` wraps it with morph interpolation
- `applyStageColorShift(colors, stage)` extracted from `getBodyColors()` for reuse in morph blending
- `lerpProps()` interpolates all 8 StageProportions fields between two stages
- `easeInOutCubic()` provides smooth acceleration/deceleration
- Context menu is built in `main.ts` with nested submenus for Care/Games/Info/Settings
- Total achievements: 18
- Two mini-games: Star Catcher (reflex) and Memory Match (pattern recall)
- Five personality types: Shy, Energetic, Curious, Sleepy, Gluttonous
