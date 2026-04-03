# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.36.0 — Evolution Visual Variants (2026-04-03)

### What was done
- Added growth-stage-dependent visual proportions for the pet's body, eyes, feet, and colors
- `getStageProportions()` returns a `StageProportions` object with body width/height, eye scale/spacing, foot scale/spread, and head ratio per stage
- `getBodyColors()` now applies stage-specific color shifts via `lerpColor`: baby is pastel, teen is deeper, adult is regal indigo
- `drawBody()` uses stage proportions for ellipse dimensions and belly positioning; adult stage gets a pulsing radiant body outline glow
- `drawFace()` scales eye whites, pupils, and shine by `es` (eye scale factor); adult gets a second smaller eye shine for extra sparkle
- `drawFeet()` scales foot size and spread per stage
- Cheek blush is rosier for babies (1.3x alpha) and scales with eye scale factor
- All existing features (stress coloring, hunger desaturation, time-of-day palette, idle animations, growth marks) continue to work on top of the new proportions

### Thoughts for next cycle
- **Context menu reorganization** — the menu is getting long (15+ items). Could reorganize into submenus: Actions (feed/nap), Games (star catcher/memory match), Info (stats/achievements), Settings (sound/wandering/name/accessories).
- **Settings window** — a dedicated settings panel (not just context menu) with pet name, accessory picker, volume slider, season override, notification toggle, and save data reset.
- **Speech bubble queue** — right now speech bubbles overwrite each other. A queue system would let multiple messages display in sequence without losing any.
- **Multiple pet companions** — seasonal visitor companions (butterfly already exists — could add firefly in summer, fox in autumn, snowman in winter) that interact with the main pet.
- **Weather awareness** — fetch actual local weather for real-time effects. Complements seasonal awareness but needs network permissions.
- **Pet personality traits** — randomly assigned personality (shy, energetic, curious, sleepy) that affects idle animation frequency, speech bubble content, and stat decay rates.
- **Animated evolution transition** — when the pet evolves, show a smooth morph animation between the old and new stage proportions instead of an instant switch.

### Current architecture notes
- Renderer is now ~5770+ lines
- `StageProportions` interface and `getStageProportions()` return per-stage body/eye/foot scaling factors
- `getBodyColors()` applies stage color shifts after time-of-day colors but before stress/hunger adjustments
- `drawBody()`, `drawFace()`, `drawFeet()` all call `getStageProportions()` — this is called per frame but is cheap (just a switch)
- Adult stage has two extra visual effects: body outline glow (in `drawBody`) and double eye shine (in `drawFace`)
- The `headRatio` property in `StageProportions` is defined but not yet used — reserved for future use if head/body separation is added
- Total achievements: 17
- Two mini-games: Star Catcher (reflex) and Memory Match (pattern recall)
- Context menu has ~15 items — reorganization is the most pressing UX improvement
