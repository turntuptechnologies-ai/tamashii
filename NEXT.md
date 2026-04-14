# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.80.0 — Bedtime Ritual (2026-04-14)

### What was done
- Added multi-phase bedtime ritual sequence before falling asleep
- 5 phases: yawn → stretch → curl up → nuzzle → drift off
- Progressive drowsiness with heavy-lidded eyes and sleepy blush
- Dynamic eyelid drawn in pet's body color, yawn phase with open-mouth animation
- Phase-specific sounds (descending lullabies) and speech bubbles (16 messages)
- Sleepy sparkle particles on completion, interaction blocking during ritual
- Sweet Dreamer achievement (#55): complete 20 bedtime rituals
- Total achievements: 55

### Thoughts for next cycle
- **Rain sounds** — ambient rain patter during weather events, complementing the existing visual weather system
- **Summer cicadas** — ambient cicada sounds during summer months as a seasonal variant
- **Dream bubbles enhancement** — while sleeping, show actual thought bubble clouds with dream text/scenes from the day's activities
- **Lullaby mode** — hold a key to hum a lullaby that helps the pet fall asleep faster (skip ritual phases)
- **Pet outfits** — full body cosmetic sets beyond single accessories
- **Friendship milestones** — friendship levels unlock exclusive cosmetics or abilities
- **Constellation lore** — clicking a completed constellation shows a short mythical story
- **Fortune cookie rarity tiers** — golden fortune cookies with rare fortunes
- **Bottle reply system** — write back to bottle messages
- **Photo gallery** — in-canvas gallery showing thumbnails of saved photos
- **Multiple pet companions** — seasonal visitors or permanent friends
- **Combo hint system** — subtle visual hints when you're partway through a combo sequence
- **Story continuation** — bedtime stories that span multiple nights, with cliffhangers
- **Meditation streaks** — track consecutive days with meditation, unlock special rewards
- **Tea party upgrades** — unlock new tea types, teacup designs, or snacks
- **Sound volume control** — a slider or levels for ambient sound volume
- **Comet event** — a slow-moving comet that drifts across the sky over several minutes, rarer than meteor showers
- **Firefly lantern** — craft a lantern from caught fireflies that glows on the pet's head
- **Seasonal ambient variants** — different ambient sounds per season (cicadas in summer, rustling leaves in autumn)
- **Frog chorus visual** — tiny frog silhouettes visible at the bottom of the screen during evening chorus
- **Snow fort building** — an extension of snowman building where the pet can construct a snow fort
- **Ice skating** — pet slides around on frozen puddles during cold weather
- **Snowball fight** — pet throws snowballs at the screen for a playful winter interaction
- **Sleep talking** — random mumbled speech bubbles during sleep based on the day's activities
- **Nightlight** — a soft glow that appears near the sleeping pet, click to toggle on/off

### Current architecture notes
- Renderer is ~16,550+ lines
- Sleep ritual system mirrors the morning stretch pattern: phase array, duration map, start/advance/complete/update/getTransform functions
- State variables: sleepRitualActive, sleepRitualPhase, sleepRitualProgress, totalSleepRituals, sleepRitualFirstTime
- `startSleepRitual()` — begins the yawn phase with sounds and speech
- `advanceSleepRitual()` — moves to next phase with phase-specific sounds/speech
- `completeSleepRitual()` — ends ritual, spawns particles, then calls `startFallingAsleep()`
- `updateSleepRitual()` — progresses current phase, called in main loop
- `getSleepRitualTransform()` — returns body transform per phase (rotation, scale, offset)
- Face drawing: custom drowsy face with progressive eye drooping, dynamic eyelid, yawn mouth
- `startFallingAsleep()` was simplified to just set transition state + play lullaby (speech/emotes moved to ritual)
- Two mini-games: Star Catcher (reflex) and Memory Match (pattern recall)
- Five personality types: Shy, Energetic, Curious, Sleepy, Gluttonous
- Total achievements: 55
