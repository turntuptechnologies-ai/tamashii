# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.74.0 — Rainbow After Rain (2026-04-12)

### What was done
- Added rainbow after rain: a 7-band ROYGBIV rainbow arc appears when weather transitions from rainy/stormy to sunny/cloudy
- Each color band has oscillating opacity and gentle radius shimmer for a breathing glow effect
- Soft radial glow backdrop behind the arc for ethereal atmosphere
- Smooth fade in/out over ~45-90 second duration
- Previous weather tracking added to detect rain→clear transitions
- Pet reacts with 5 wonder speech bubbles, ascending 7-note arpeggio sound plays
- First rainbow each session triggers diary entry
- Stats tracking: total rainbows seen (persisted)
- Rainbow Chaser achievement (#49): see 10 rainbows
- Total achievements: 49

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
- **Puddle splashing** — after rain, small puddles appear that the pet can splash in

### Current architecture notes
- Renderer is ~15,250+ lines
- Rainbow system defined after weather state variables, before `pickWeather()`
- `RAINBOW_COLORS` array: 7 ROYGBIV color strings with ALPHA placeholder replaced at draw time
- `spawnRainbow()` creates the event, increments counter, triggers speech/sound/diary
- `updateRainbow()` handles fade in/out timing, called in main update loop after `updateAurora()`
- `drawRainbow()` renders 7 arc bands with shimmer + glow, called in draw() after weather overlay, before aurora
- Rainbow triggered in `updateWeather()` when `wasRainy && isClearNow && !rainbowActive`
- `previousWeather` variable tracks the weather before each transition
- State variables: rainbowActive, rainbowFade, rainbowDuration, rainbowPhase, rainbowFirstSeen, totalRainbowsSeen
- Save data: totalRainbowsSeen persisted
- Two mini-games: Star Catcher (reflex) and Memory Match (pattern recall)
- Five personality types: Shy, Energetic, Curious, Sleepy, Gluttonous
- Total achievements: 49
