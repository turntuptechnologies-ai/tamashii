# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.85.0 — Thunderstorm Lightning Bolts (2026-04-15)

### What was done
- Added procedurally generated forked lightning bolts during stormy weather
- Recursive branching algorithm with up to 3 branch depths, 6-12 segments per branch
- Layered rendering: bright white core + soft blue-white outer glow per segment
- Sub-branches render thinner and more transparent than the main trunk
- Animated lifecycle with screen flash on spawn, natural alpha fade-out over 20-35 frames
- Replaced old simple white rectangle storm flash with the new bolt system
- 6 lightning-specific speech reactions with 30% trigger chance
- Thunder sound still triggers with each bolt (preserved existing sawtooth rumble)
- Diary entry on first lightning bolt witnessed
- Storm Chaser achievement (#60): witness 15 lightning bolts
- Stats panel entry for lightning bolts witnessed
- Full persistence: totalLightningBoltsWitnessed, lightningFirstTime
- Total achievements: 60

### Thoughts for next cycle
- **Dream bubbles enhancement** — while sleeping, show actual thought bubble clouds with dream text/scenes from the day's activities (pairs with sleep talking and nightlight)
- **Lullaby mode** — hold a key to hum a lullaby that helps the pet fall asleep faster (skip ritual phases)
- **Comet event** — a rare slow-moving comet that drifts across the night sky over several minutes, with glowing head and trailing tail, pet reactions, and achievement
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
- **Aurora borealis** — rare northern lights during clear winter nights with shimmering color bands

### Current architecture notes
- Renderer is ~17,350+ lines
- Lightning bolts use `activeLightningBolts` array of `LightningBolt` objects (each containing `LightningSegment[]` with branch depth info)
- `generateLightningBolt()` — recursive `buildBranch()` function creates forked bolt paths with decreasing branch probability
- Lightning spawns are timed via `nextLightningTime` with 300-900 frame intervals during stormy weather
- `totalLightningBoltsWitnessed` and `lightningFirstTime` persisted in save data
- Complete weather-sound palette: night (crickets + owls + wind), morning (birdsong), afternoon (cicadas), evening (frog chorus), rain/storm (patter + heavy drops + thunder), wind (gusts + rustling + chimes)
- Storm visual palette now: rain particles, lightning bolts with branching, screen flash, dim overlay
- dailyActivityLog tracks: fed, played, trick, petted, photo, fireflies, constellations, dewdrops, story, bottle, fortune, bubbles, meditation, tea, snowman
- Two mini-games: Star Catcher (reflex) and Memory Match (pattern recall)
- Five personality types: Shy, Energetic, Curious, Sleepy, Gluttonous
- Total achievements: 60
