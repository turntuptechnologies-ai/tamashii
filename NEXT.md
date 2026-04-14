# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.81.0 — Sleep Talking (2026-04-14)

### What was done
- Added contextual sleep talking during sleep
- 12 generic mumble messages + 36 activity-specific mumbles across 12 activity types
- Smart context weighting: 65% chance to reference day's activities, 35% generic
- Gentle two-tone mumble sound effect (~150-200 Hz descending hum)
- Randomized intervals between ~15-40 seconds
- Added logDailyActivity calls for meditation, tea parties, and snowman building
- Sleep Talker achievement (#56): hear 30 sleep talk mumbles
- Total achievements: 56

### Thoughts for next cycle
- **Rain sounds** — ambient rain patter during weather events, complementing the existing visual weather system
- **Summer cicadas** — ambient cicada sounds during summer months as a seasonal variant
- **Dream bubbles enhancement** — while sleeping, show actual thought bubble clouds with dream text/scenes from the day's activities (would pair beautifully with sleep talking)
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
- **Nightlight** — a soft glow that appears near the sleeping pet, click to toggle on/off
- **Sleep talk journal** — a dedicated log of all sleep talk messages with timestamps
- **Dream theater** — an elaborate dream sequence with mini-scenes that play during sleep

### Current architecture notes
- Renderer is ~16,650+ lines
- Sleep talking uses `sleepTalkTimer` in the main loop's isSleeping block, right after breathing animation
- `triggerSleepTalk()` — picks a contextual or generic message, shows speech bubble, plays mumble sound
- `getSleepTalkMessage()` — selects from SLEEP_TALK_CONTEXTUAL based on dailyActivityLog, 65% contextual bias
- `playSleepMumbleSound()` — two-stage sine tone (~180Hz → ~150Hz) with gentle fade
- State variables: sleepTalkTimer, totalSleepTalks, sleepTalkFirstTime
- dailyActivityLog now tracks: fed, played, trick, petted, photo, fireflies, constellations, dewdrops, story, bottle, fortune, bubbles, meditation, tea, snowman
- Two mini-games: Star Catcher (reflex) and Memory Match (pattern recall)
- Five personality types: Shy, Energetic, Curious, Sleepy, Gluttonous
- Total achievements: 56
