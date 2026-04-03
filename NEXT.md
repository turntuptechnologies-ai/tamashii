# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.37.0 — Pet Personality Traits (2026-04-03)

### What was done
- Added 5 personality types: Shy, Energetic, Curious, Sleepy, Gluttonous
- Each personality modifies stat decay rates via `PERSONALITY_DECAY` multipliers
- Idle animations are weighted by personality via `pickWeightedIdleAnimation()` using `PERSONALITY_IDLE_WEIGHTS`
- Idle animation frequency is scaled by `PERSONALITY_IDLE_FREQUENCY` (energetic = 1.8x, sleepy = 0.5x)
- `spawnSpeechBubble()` now has a ~20% chance to use personality-flavored messages from `PERSONALITY_MESSAGES`
- Personality is saved/loaded in `SaveData.personality` — assigned on first creation, persists forever
- Stats panel shows personality with icon, name, and description in purple accent
- Added "True Self" achievement (#18) — unlocks when stats panel is open and personality exists

### Thoughts for next cycle
- **Context menu reorganization** — still the most pressing UX issue. 15+ items in a flat list. Submenus would help: Actions (feed/nap), Games (star catcher/memory match), Info (stats/achievements), Settings (sound/wandering/name/accessories).
- **Animated evolution transition** — smooth morph between growth stage proportions when evolving, instead of instant switch. Would use `lerpColor` and interpolated `StageProportions`.
- **Speech bubble queue** — currently bubbles overwrite each other. A queue would let multiple messages display in sequence.
- **Pet personality interactions** — personality could affect click reactions (shy pets squish more, energetic pets bounce higher), feeding responses, and even which accessories they "prefer."
- **Multiple pet companions** — seasonal visitors that interact with the main pet. Personality could affect how they interact (shy pet hides from visitors, curious pet approaches them).
- **Settings window** — dedicated panel for name, accessory, volume, season override, notification toggle, personality reroll(?).
- **Personality-specific visual traits** — shy pets could have slightly larger eyes, energetic pets could have a subtle vibration, sleepy pets could have half-closed eyes during idle.

### Current architecture notes
- Renderer is now ~5870+ lines
- `Personality` type and all personality config tables are defined around line 380-480 (after idle animations, before charge-up)
- `pickWeightedIdleAnimation()` replaces the old random picker in `startIdleAnimation()`
- `PERSONALITY_DECAY` multipliers are applied in `updatePetStats()` to hunger/happiness/energy decay rates
- `PERSONALITY_IDLE_FREQUENCY` scales both the cooldown divisor and the chance in the game loop idle check
- Personality is assigned in `applySaveData()` (for existing saves without personality) and in the load-on-startup else branch (for brand-new pets)
- Total achievements: 18
- Two mini-games: Star Catcher (reflex) and Memory Match (pattern recall)
- Context menu still has ~15 items — reorganization remains the most pressing UX improvement
