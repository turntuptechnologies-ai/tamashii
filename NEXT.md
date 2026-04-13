# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.79.0 — Snowman Building (2026-04-13)

### What was done
- Added interactive snowman building during snowy weather
- 5-stage click-to-build process: base → body → head → face → accessories (scarf, hat, stick arms)
- Randomized cosmetics: 6 scarf colors, 3 hat styles (top hat, bucket hat, beanie)
- Snow particle bursts, ascending pitch sounds, wobble animation per stage
- Gradual melting over ~5 minutes when weather changes from snowy
- Pulsing build hint text above incomplete snowman
- Speech reactions per stage, care points, diary entries
- Snow Sculptor achievement (#54): build 5 snowmen
- Total achievements: 54

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
- **Seasonal ambient variants** — different ambient sounds per season (cicadas in summer, rustling leaves in autumn)
- **Ambient sound mixer** — let the player adjust relative volume of different ambient layers
- **Frog chorus visual** — tiny frog silhouettes visible at the bottom of the screen during evening chorus
- **Snow fort building** — an extension of snowman building where the pet can construct a snow fort
- **Ice skating** — pet slides around on frozen puddles during cold weather
- **Snowball fight** — pet throws snowballs at the screen for a playful winter interaction

### Current architecture notes
- Renderer is ~16,300+ lines
- Snowman system follows the puddle pattern: weather-triggered spawn, click interaction, gradual removal
- State variables: activeSnowman (object with stage/position/cosmetics), snowmanBuildPromptTimer, snowmanBuildPromptShown, totalSnowmenBuilt, snowmanFirstBuild
- `startSnowmanBuild()` — initializes snowman at random position near pet's feet
- `advanceSnowmanStage()` — increments stage, spawns particles/sounds/reactions
- `tryClickSnowman()` — hit detection for build clicks
- `updateSnowman()` — handles prompt timing, melt timer, wobble decay
- `drawSnowman()` — renders multi-stage snowman with canvas 2D (circles, carrot nose, hat, scarf, arms)
- Snowman spawns after ~10s of snowy weather, melts over ~5min after snow stops
- Two mini-games: Star Catcher (reflex) and Memory Match (pattern recall)
- Five personality types: Shy, Energetic, Curious, Sleepy, Gluttonous
- Total achievements: 54
