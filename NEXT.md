# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.75.0 — Puddle Splashing (2026-04-12)

### What was done
- Added puddle splashing: 2-4 water puddles appear on the ground after rain/storm weather ends
- Each puddle has ripple animation, shimmer highlights, and concentric expanding ring effects
- Puddles evaporate over ~2-3 minutes with smooth fade-out
- Click a puddle to splash: 8 raindrop particles burst upward, descending splash sound plays
- Pet reacts with 5 playful speech bubbles and happy emotes
- Each splash awards 2 care points
- First splash per session triggers diary entry
- Stats tracking: total puddle splashes (persisted)
- Puddle Jumper achievement (#50): splash in 20 puddles
- Total achievements: 50

### Thoughts for next cycle
- **Afternoon ambient sounds** — complete the full day cycle with afternoon atmosphere (distant lawn mower, wind chimes, buzzing bees)
- **Rain sounds** — ambient rain during weather events, complementing the existing weather system
- **Frog chorus** — spring evening ambient sound of distant frogs, bridging afternoon and night
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
- **Weather-specific activities** — pet plays in rain puddles, builds snowmen, chases leaves
- **Combo hint system** — subtle visual hints when you're partway through a combo sequence
- **Story continuation** — bedtime stories that span multiple nights, with cliffhangers
- **Meditation streaks** — track consecutive days with meditation, unlock special rewards
- **Tea party upgrades** — unlock new tea types, teacup designs, or snacks
- **Pet journal reflections** — pet writes its own diary entries about the day at bedtime
- **Guided stargazing** — pet points out specific stars and tells you their names during night
- **Sound volume control** — a slider or levels for ambient sound volume
- **Meteor shower event** — rare night event with many shooting stars at once
- **Firefly lantern** — craft a lantern from caught fireflies that glows on the pet's head
- **Snowman building** — during snowy weather, click to help pet build a snowman step by step

### Current architecture notes
- Renderer is ~15,400+ lines
- Puddle system defined after rainbow section, before `pickWeather()`
- `Puddle` interface: x, y, radiusX, radiusY, life, maxLife, ripplePhase, splashed
- `spawnPuddles()` creates 2-4 puddles near ground level, triggers speech
- `updatePuddles()` handles ripple animation and evaporation, called after `updateRainbow()`
- `drawPuddles()` renders water ellipse + shimmer + concentric ripple rings, drawn after footprints before toy
- `tryClickPuddle()` checks click against puddle ellipse bounds
- `splashPuddle()` creates burst particles, plays sound, triggers speech/diary/stats
- Puddles triggered in `updateWeather()` when `wasRainy && puddles.length === 0`
- State variables: puddles array, totalPuddleSplashes, puddleFirstSplash
- Save data: totalPuddleSplashes persisted
- Two mini-games: Star Catcher (reflex) and Memory Match (pattern recall)
- Five personality types: Shy, Energetic, Curious, Sleepy, Gluttonous
- Total achievements: 50
