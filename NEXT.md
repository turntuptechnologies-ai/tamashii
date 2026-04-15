# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.86.0 — Comet Event (2026-04-15)

### What was done
- Added rare slow-moving comet event during nighttime
- Comets drift across the sky over 60-120 seconds with glowing head and particle tail
- Dual color palette (warm amber or cool cyan) with natural hue variation in tail particles
- Layered head rendering: outer glow, mid-glow, white-hot core
- Up to 80 tail particles with alpha decay, size shrinkage, and position jitter
- Smooth fade-in/fade-out lifecycle over 60 frames each end
- Rare spawn: checked every ~90 seconds, 2.5% chance during nighttime
- 6 comet speech reactions with immediate trigger
- Ethereal ascending tone sound on spawn
- Diary entry on first comet witnessed
- Comet Gazer achievement (#61): witness 3 comets
- Stats panel entry for comets witnessed
- Full persistence: totalCometsWitnessed, cometFirstSeen
- Total achievements: 61

### Thoughts for next cycle
- **Dream bubbles enhancement** — while sleeping, show actual thought bubble clouds with dream text/scenes from the day's activities (pairs with sleep talking and nightlight)
- **Lullaby mode** — hold a key to hum a lullaby that helps the pet fall asleep faster (skip ritual phases)
- **Pet outfits** — full body cosmetic sets beyond single accessories
- **Friendship milestones** — friendship levels unlock exclusive cosmetics or abilities
- **Constellation lore** — clicking a completed constellation shows a short mythical story
- **Fortune cookie rarity tiers** — golden fortune cookies with rare fortunes
- **Photo gallery** — in-canvas gallery showing thumbnails of saved photos
- **Combo hint system** — subtle visual hints when you're partway through a combo sequence
- **Story continuation** — bedtime stories that span multiple nights, with cliffhangers
- **Sound volume control** — a slider or levels for ambient sound volume
- **Firefly lantern** — craft a lantern from caught fireflies that glows on the pet's head
- **Frog chorus visual** — tiny frog silhouettes visible during evening chorus
- **Ice skating** — pet slides around on frozen puddles during cold weather
- **Dream theater** — elaborate dream sequences with mini-scenes during sleep
- **Nightlight color customization** — unlock different nightlight colors/styles
- **Weather forecast widget** — show upcoming weather so player can anticipate changes
- **Seasonal festivals** — special events during equinoxes and solstices with unique decorations
- **Tide pools** — interactive mini-scene during summer evenings with little sea creatures
- **Campfire** — build a campfire that the pet warms up next to during cold weather

### Current architecture notes
- Renderer is ~17,500+ lines
- Comet uses `activeComet: Comet | null` with `CometTailParticle[]` for the trailing tail
- `spawnComet()` calculates velocity to traverse the full canvas width over its lifetime
- `updateComet()` manages spawn checks (nighttime only), position updates, tail particle generation, and lifecycle
- `drawComet()` renders tail particles back-to-front then layered head glow
- `totalCometsWitnessed` and `cometFirstSeen` persisted in save data
- Complete night sky palette: stars, constellations, shooting stars, meteor showers, aurora borealis, comets
- Complete weather-sound palette: night (crickets + owls + wind), morning (birdsong), afternoon (cicadas), evening (frog chorus), rain/storm (patter + heavy drops + thunder), wind (gusts + rustling + chimes)
- dailyActivityLog tracks: fed, played, trick, petted, photo, fireflies, constellations, dewdrops, story, bottle, fortune, bubbles, meditation, tea, snowman
- Two mini-games: Star Catcher (reflex) and Memory Match (pattern recall)
- Five personality types: Shy, Energetic, Curious, Sleepy, Gluttonous
- Total achievements: 61
