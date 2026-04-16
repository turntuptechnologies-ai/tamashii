# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.87.0 — Dream Theater (2026-04-16)

### What was done
- Added vivid dream scene clouds that appear during sleep
- Cloud-shaped thought bubbles with multiple icons and italic dream captions
- 11 activity-specific dream templates (fed, played, trick, petted, music, photo, fireflies, story, constellations, meditation, tea) plus generic fallbacks
- Overlapping ellipse cloud rendering with trailing thought dots
- Gentle fade-in/out lifecycle over ~5-7 seconds, one scene at a time
- Soft ascending C-E-G chime sound on spawn
- Sweet Dreamer achievement (#62): have 10 vivid dream scenes
- Stats panel entry, diary entry, full persistence
- Total achievements: 62

### Thoughts for next cycle
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
- **Nightlight color customization** — unlock different nightlight colors/styles
- **Weather forecast widget** — show upcoming weather so player can anticipate changes
- **Seasonal festivals** — special events during equinoxes and solstices with unique decorations
- **Tide pools** — interactive mini-scene during summer evenings with little sea creatures
- **Campfire** — build a campfire that the pet warms up next to during cold weather
- **Dream diary** — a separate section in the diary that records dream captions from each night
- **Lucid dreaming** — rare event where clicking a dream scene triggers a mini dream interaction

### Current architecture notes
- Renderer is ~17,700+ lines
- Dream Theater uses `DreamScene` interface with `icons: string[]`, `caption: string`, and cloud rendering via overlapping ellipses
- `dreamScenes: DreamScene[]` array, max 1 active at a time, spawned every ~25-45 seconds during sleep
- `getDreamScene()` selects from activity-matched `DREAM_TEMPLATES` (70% chance) or `DREAM_GENERIC_SCENES` fallback
- `drawDreamScene()` renders cloud body (4 overlapping ellipses), trailing dots, 3 icons via existing `drawDreamIcon()`, and italic caption
- `playDreamChimeSound()` plays gentle C5-E5-G5 arpeggio
- `totalDreamScenes` and `dreamSceneFirstTime` persisted in save data
- Complete night sky palette: stars, constellations, shooting stars, meteor showers, aurora borealis, comets
- Complete weather-sound palette: night (crickets + owls + wind), morning (birdsong), afternoon (cicadas), evening (frog chorus), rain/storm (patter + heavy drops + thunder), wind (gusts + rustling + chimes)
- Sleep palette: bedtime ritual, sleep talking (contextual), dream icon bubbles, dream theater scenes, nightlight, Zzz particles
- dailyActivityLog tracks: fed, played, trick, petted, photo, fireflies, constellations, dewdrops, story, bottle, fortune, bubbles, meditation, tea, snowman
- Two mini-games: Star Catcher (reflex) and Memory Match (pattern recall)
- Five personality types: Shy, Energetic, Curious, Sleepy, Gluttonous
- Total achievements: 62
