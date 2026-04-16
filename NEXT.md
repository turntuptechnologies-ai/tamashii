# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.90.0 — Hot Cocoa (2026-04-16)

### What was done
- Added a warm mug of hot cocoa that appears ~30s after any lit campfire, positioned on the LEFT of the fire (opposite the marshmallow which is on the right)
- Steam particles continuously rise from the cocoa surface with gentle S-curve wobble
- Click to sip → mug tilts with a soft sipping animation, plays a low-pass burble + tiny ceramic clink
- 3 sips per mug with visible sip-remaining dots on the mug; final sip plays an ascending C-E-G major triad and spawns a 6-heart particle burst
- If the player has achieved any perfect golden marshmallow roasts, a tiny floating marshmallow bobs on top of the cocoa as a garnish (nice narrative link between features)
- Idle timeout after ~60s if untouched; mug fades out gracefully; respawns ~90s later while fire is still lit
- Rewards: +2 happy/+1 care per sip, +2 friendship XP on mug completion
- 7 sip speeches + 5 finish speeches, diary entry on first sip, cocoa dream template, cocoa sleep-talk contextual phrases
- Achievement: Cocoa Connoisseur (#65) — finish 10 mugs
- Stats panel entry in SLEEP section; full save/load persistence
- Total achievements: 65

### Thoughts for next cycle
- **S'mores** — combine 3 perfect roasts to unlock graham+chocolate+marshmallow combo treat (natural continuation of the fire/food arc)
- **Pet approach campfire** — pet actively walks toward a lit fire and sits beside it, warming paws. Would make the scene feel inhabited rather than just decorative
- **Marshmallow combo chain** — 3 perfect golden roasts in a row triggers a celebratory combo with a special speech and sparkle burst
- **Firefly lantern** — craft a lantern from caught fireflies that glows on the pet's head at night
- **Lullaby mode** — hold a key to hum a lullaby that helps the pet fall asleep faster (note: 'l' is already used for constellation mode, pick another)
- **Pet outfits** — full body cosmetic sets beyond single accessories
- **Friendship milestones** — friendship levels unlock exclusive cosmetics or abilities
- **Constellation lore** — clicking a completed constellation shows a short mythical story
- **Fortune cookie rarity tiers** — golden fortune cookies with rare fortunes
- **Photo gallery** — in-canvas gallery showing thumbnails of saved photos
- **Combo hint system** — subtle visual hints when partway through a combo sequence
- **Story continuation** — bedtime stories that span multiple nights with cliffhangers
- **Sound volume control** — a slider or levels for ambient sound volume
- **Frog chorus visual** — tiny frog silhouettes during evening chorus
- **Ice skating** — pet slides around on frozen puddles during cold weather
- **Nightlight color customization** — unlock different nightlight colors/styles
- **Weather forecast widget** — show upcoming weather so player can anticipate changes
- **Seasonal festivals** — special events during equinoxes and solstices with unique decorations
- **Tide pools** — interactive mini-scene during summer evenings with little sea creatures
- **Dream diary** — a separate section in the diary recording dream captions from each night
- **Lucid dreaming** — rare event where clicking a dream scene triggers a mini dream interaction
- **Firefly released into fire** — sending fireflies to dance above a campfire creates magic sparks
- **Winter tea party variant** — tea ceremony that happens during snowy weather, distinct from the existing tea party

### Current architecture notes
- Renderer is now ~19,500+ lines
- Cocoa feature lives immediately after `drawMarshmallow()` and before `WEATHER_CHANGE_MIN`
- `HotCocoa` interface: `sipsRemaining`, `idleTimer`, `fadeIn`, `fadeOut`, `steamPhase`, `bob`, `sipAnim`, `hasFloatingMallow`, `finished`, `life`
- Key functions: `spawnCocoa()`, `sipCocoa()`, `updateCocoa()`, `drawCocoa()`, `tryClickCocoa()`, `playCocoaSip()`, `playCocoaFinish()`
- Mug position: `cf.x - 30, cf.y + 2` (left of campfire, on the ground). Marshmallow is at `cf.x + 34` so they don't overlap
- Click handler routing: cocoa click is checked AFTER marshmallow but BEFORE campfire, since the mug sits on a different side than the marshmallow
- Spawn conditions: campfire must be `state === "lit"`; initial spawn delay ~30s (1800f), respawn delay ~90s (5400f)
- Idle timeout: 60s (3600f) untouched → mug finishes and fades out
- Fade-in: 45f, fade-out: 60f
- Sip rewards: +2 happiness, +1 care per sip; +2 friendship XP on completion
- Heart particle burst on final sip (6 particles)
- Floating marshmallow garnish only appears if `perfectMarshmallowRoasts > 0` — creates a nice link between the two campfire features
- Total achievements: 65
- Full snowy scene now: snowman (left of screen) + campfire + marshmallow (right of fire) + hot cocoa (left of fire) — a complete winter evening vignette
- dailyActivityLog tracks 18 activities now: fed, played, trick, petted, photo, fireflies, constellations, dewdrops, story, bottle, fortune, bubbles, meditation, tea, snowman, campfire, marshmallow, cocoa
- Complete sleep-talk contextual set now includes cocoa alongside snowman, tea, etc.
