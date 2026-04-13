# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.78.0 — Evening Frog Chorus (2026-04-13)

### What was done
- Added ambient evening frog chorus: frog croaks, spring peepers, and katydids
- Frog croaks use sawtooth oscillator with low-pass filter for deep resonant "ribbit" sounds
- Spring peepers use high-frequency sine chirps in rapid bursts (2-4 peeps)
- Katydids use bandpass-filtered square waves for rhythmic staccato buzzing
- Activates during "evening" time period, layering alongside existing night crickets
- Full ambient cycle now has 4 distinct palettes: morning → afternoon → evening → night
- Speech reactions, diary entry, stats tracking, persistence
- Twilight Listener achievement (#53): enjoy 10 evening frog chorus sessions
- Total achievements: 53

### Thoughts for next cycle
- **Rain sounds** — ambient rain patter during weather events, complementing the existing visual weather system
- **Summer cicadas** — ambient cicada sounds during summer months as a seasonal variant
- **Sleep ritual** — a calming multi-phase sequence when the pet falls asleep (yawn -> stretch -> curl up -> zzz)
- **Dream bubbles enhancement** — while sleeping, show actual thought bubble clouds with dream text/scenes
- **Lullaby mode** — hold a key to hum a lullaby that helps the pet fall asleep faster
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
- **Snowman building** — during snowy weather, click to help pet build a snowman step by step
- **Seasonal ambient variants** — different ambient sounds per season (cicadas in summer, rustling leaves in autumn)
- **Ambient sound mixer** — let the player adjust relative volume of different ambient layers
- **Frog chorus visual** — tiny frog silhouettes visible at the bottom of the screen during evening chorus

### Current architecture notes
- Renderer is ~16,000+ lines
- Evening frog chorus follows same pattern as other ambient systems: state vars, sound functions, update function
- State variables: ambientEveningActive, nextFrogCroakTime, nextSpringPeeperTime, nextKatydidTime, totalEveningChorusSessions, ambientEveningFirstSession
- `playFrogCroak()` — sawtooth with low-pass filter, two-pulse pitch envelope
- `playSpringPeeper()` — rapid high-freq sine chirps in 2-4 bursts
- `playKatydid()` — bandpass-filtered square wave, 3-5 staccato bursts
- `updateAmbientEveningSounds()` — manages activation/deactivation, timer-based sound scheduling
- Called after `updateAmbientAfternoonSounds()` in update loop
- Full ambient cycle: night (crickets/owls/wind) → morning (robin/warbler/cuckoo) → afternoon (chimes/bees/mower) → evening (frogs/peepers/katydids)
- Evening shares night crickets (night system uses evening+night), so evening gets both frog chorus AND crickets — realistic layering
- Two mini-games: Star Catcher (reflex) and Memory Match (pattern recall)
- Five personality types: Shy, Energetic, Curious, Sleepy, Gluttonous
- Total achievements: 53
