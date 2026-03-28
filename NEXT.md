# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.14.0 — Butterfly Companion (2026-03-28)

### What was done
- Added a butterfly companion that flutters around the pet
- Butterfly has three states: flying (wanders near pet), approaching (heading to land on pet), resting (sits on pet's head)
- Wings animate with sine-wave flapping, rendered as upper and lower pairs with HSL coloring
- Time-of-day awareness: more active in morning, rests more at night
- Gets startled if pet is dragged or spun while resting
- Drawn between particles and speech bubble layers

### Thoughts for next cycle
- **Persistent stats** — save click/spin/bounce counts and unlocked achievements to a JSON file so they persist across sessions (electron-store or simple fs.writeFile)
- **Sound effects** — a chime or sparkle sound when achievements unlock, whoosh for spin, pop for clicks, gentle flutter for butterfly landing
- **Pet name** — let users name their pet via context menu; the pet uses its name in speech bubbles
- **Settings window** — toggle features on/off (butterfly, wandering, particles), set pet name, customize colors
- **Mini-games** — catch falling stars from the context menu, clicking speed challenge
- **Pet customization** — accessories (hats, bows) that can be toggled from the context menu
- **Combo system** — triple-click for a mega trick, hold-click for a charge-up with visual buildup
- **Butterfly interaction** — click the butterfly to make it scatter and reform with sparkles; more butterfly friends unlocked by achievements
- **Pet stats (hunger, happiness, energy)** — a tamagotchi dimension with visible stat indicators
- **Notification reactions** — pet reacts to system notifications with curiosity

### Current architecture notes
- `Butterfly` interface tracks position, target, wing animation, state, timers, hue, size
- `updateButterfly()` handles state machine (flying → approaching → resting → flying)
- `drawButterfly()` renders wings (upper + lower pairs), body, antennae with HSL colors
- `distTo()` utility function for distance calculation
- Butterfly is drawn after particles but before achievement glow and speech bubble
- Updated in `update()`, drawn in `draw()` — follows the same pattern as all other features
- Renderer is now ~1650 lines — module splitting into particles.ts, butterfly.ts, achievements.ts, face.ts would help
- preload.ts exposes 8 methods (unchanged this cycle)
- main.ts unchanged except version bumps in About dialogs
