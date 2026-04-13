# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.77.0 — Afternoon Ambient Sounds (2026-04-13)

### What was done
- Added ambient afternoon sounds: wind chimes, buzzing bees, and distant lawn mower
- Wind chimes use randomized pentatonic notes (C5–D6) with harmonic overtones for a metallic shimmer
- Buzzing bees use sawtooth oscillator with LFO-modulated pitch for Doppler-like fly-by effect
- Distant lawn mower uses low-frequency filtered sawtooth with slow LFO for organic drone
- Activates during "afternoon" time period, completing the full day ambient cycle
- Speech reactions, diary entry, stats tracking, persistence
- Afternoon Dreamer achievement (#52): enjoy 10 afternoon ambient sessions
- Total achievements: 52

### Thoughts for next cycle
- **Frog chorus** — spring evening ambient sound of distant frogs, bridging afternoon and night, adding an evening-specific soundscape
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
- **Seasonal ambient variants** — different afternoon sounds per season (cicadas in summer, rustling leaves in autumn)
- **Ambient sound mixer** — let the player adjust relative volume of different ambient layers

### Current architecture notes
- Renderer is ~15,800+ lines
- Afternoon ambient system follows same pattern as night/morning: state vars, sound functions, update function
- State variables: ambientAfternoonActive, nextWindChimeTime, nextBeeTime, nextLawnMowerTime, totalAfternoonSoundsSessions, ambientAfternoonFirstSession
- `playWindChime()` — randomized pentatonic chime notes with harmonic overtones
- `playBuzzingBee()` — sawtooth with LFO pitch modulation for Doppler effect
- `playDistantLawnMower()` — low-pass filtered sawtooth drone with slow LFO
- `updateAmbientAfternoonSounds()` — manages activation/deactivation, timer-based sound scheduling
- Called after `updateAmbientMorningSounds()` in update loop
- Full ambient cycle: night (crickets/owls/wind) → morning (robin/warbler/cuckoo) → afternoon (chimes/bees/mower)
- Two mini-games: Star Catcher (reflex) and Memory Match (pattern recall)
- Five personality types: Shy, Energetic, Curious, Sleepy, Gluttonous
- Total achievements: 52
