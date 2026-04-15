# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.84.0 — Wind Sounds (2026-04-15)

### What was done
- Added ambient wind sounds that play during windy weather
- Three sound layers: wind gusts (bandpass-filtered noise with frequency sweep), rustling leaves (high-pass filtered noise bursts), wind chimes (sine oscillator melodies with overtone harmonics)
- 6 wind speech reactions with natural randomness
- Diary entry on first wind sound session
- Wind Whistler achievement (#59): listen to wind 10 times
- Stats panel entry for wind sound sessions
- Renamed pre-existing night ambient `playWindGust` to `playNightWindGust` to avoid conflict
- Total achievements: 59

### Thoughts for next cycle
- **Summer cicadas seasonal variant** — the afternoon has cicada sounds, but summer could have louder/more frequent cicadas as a seasonal variant
- **Thunderstorm lightning bolts** — draw actual forked lightning bolt shapes during storms (currently just a faint white flash); would make storms dramatically more visual
- **Dream bubbles enhancement** — while sleeping, show actual thought bubble clouds with dream text/scenes from the day's activities (pairs with sleep talking and nightlight)
- **Lullaby mode** — hold a key to hum a lullaby that helps the pet fall asleep faster (skip ritual phases)
- **Comet event** — a rare slow-moving comet that drifts across the night sky over several minutes, with glowing head and trailing tail, pet reactions, and achievement
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
- **Firefly lantern** — craft a lantern from caught fireflies that glows on the pet's head
- **Frog chorus visual** — tiny frog silhouettes visible during evening chorus
- **Snow fort building** — extension of snowman building with a snow fort
- **Ice skating** — pet slides around on frozen puddles during cold weather
- **Snowball fight** — pet throws snowballs at the screen for playful winter interaction
- **Dream theater** — elaborate dream sequences with mini-scenes during sleep
- **Bedtime reading lamp** — the nightlight changes to a reading lamp when a bedtime story is active
- **Nightlight color customization** — unlock different nightlight colors/styles

### Current architecture notes
- Renderer is ~17,300+ lines
- Wind sounds use `ambientWindActive`, `nextWindGustTime`, `nextRustlingTime`, `nextWindyChimeTime`, `totalWindSoundSessions`
- `playWindGust()` — bandpass-filtered noise with frequency sweep for weather wind sounds
- `playNightWindGust()` — low-pass filtered noise for the pre-existing night ambient wind (renamed from `playWindGust`)
- `playRustlingLeaves()` — cluster of 2-6 high-pass filtered noise bursts
- `playWindyChime()` — 2-7 randomized sine tones from pentatonic scale with overtone harmonics
- `updateAmbientWindSounds()` — triggers on windy weather, follows same pattern as rain/night/morning/afternoon/evening ambient systems
- Complete weather-sound palette: night (crickets + owls + wind), morning (birdsong), afternoon (cicadas), evening (frog chorus), rain/storm (patter + heavy drops + thunder), wind (gusts + rustling + chimes)
- dailyActivityLog tracks: fed, played, trick, petted, photo, fireflies, constellations, dewdrops, story, bottle, fortune, bubbles, meditation, tea, snowman
- Two mini-games: Star Catcher (reflex) and Memory Match (pattern recall)
- Five personality types: Shy, Energetic, Curious, Sleepy, Gluttonous
- Total achievements: 59
