# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.82.0 — Nightlight (2026-04-14)

### What was done
- Added a cozy nightlight that appears beside the sleeping pet
- Small lamp with dome shade, wooden base, and flickering flame
- Warm pulsing radial glow (layered gradients) when lit
- Click to toggle on/off during sleep — first interactive sleep element
- Ascending/descending toggle sound effects
- 8 "on" speech messages + 4 "off" speech messages with randomized triggers
- Auto-on when falling asleep, auto-off when waking
- Diary entry on first discovery
- Nightlight Keeper achievement (#57): toggle 20 times
- Total achievements: 57

### Thoughts for next cycle
- **Rain sounds** — ambient rain patter during rainy weather events, complementing the existing visual rain system
- **Summer cicadas** — ambient cicada sounds during summer months as a seasonal variant
- **Dream bubbles enhancement** — while sleeping, show actual thought bubble clouds with dream text/scenes from the day's activities (would pair beautifully with sleep talking and nightlight)
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
- **Comet event** — a slow-moving comet that drifts across the sky over several minutes
- **Firefly lantern** — craft a lantern from caught fireflies that glows on the pet's head
- **Seasonal ambient variants** — different ambient sounds per season
- **Frog chorus visual** — tiny frog silhouettes visible during evening chorus
- **Snow fort building** — extension of snowman building with a snow fort
- **Ice skating** — pet slides around on frozen puddles during cold weather
- **Snowball fight** — pet throws snowballs at the screen for playful winter interaction
- **Sleep talk journal** — a dedicated log of all sleep talk messages with timestamps
- **Dream theater** — elaborate dream sequences with mini-scenes during sleep
- **Bedtime reading lamp** — the nightlight changes to a reading lamp when a bedtime story is active
- **Nightlight color customization** — unlock different nightlight colors/styles

### Current architecture notes
- Renderer is ~16,950+ lines
- Nightlight uses `nightlightOn`, `nightlightGlowPhase`, `nightlightFirstTime`, `totalNightlightToggles`
- `drawNightlight()` — renders lamp at offset (65, 30) from pet center with radial glow, flame, and shade
- `tryClickNightlight()` — hit detection within 18px radius of lamp position
- `toggleNightlight()` — handles toggle logic, sound, speech, diary, achievement check, save
- `playNightlightClickSound()` — ascending sine chirp (on) or descending (off)
- `getNightlightPosition()` — returns {x, y} for consistent positioning across draw/click
- Auto-on in `completeFallingAsleep()` and nighttime session resume; auto-off in `completeWakingUp()`
- Click handler added in mousedown before snowman building checks
- Sleep talking uses `sleepTalkTimer` in the main loop's isSleeping block
- dailyActivityLog tracks: fed, played, trick, petted, photo, fireflies, constellations, dewdrops, story, bottle, fortune, bubbles, meditation, tea, snowman
- Two mini-games: Star Catcher (reflex) and Memory Match (pattern recall)
- Five personality types: Shy, Energetic, Curious, Sleepy, Gluttonous
- Total achievements: 57
