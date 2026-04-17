# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.92.0 — Dandelion Puff (2026-04-17)

### What was done
- Added dandelions that sprout during sunny (or lightly cloudy) daytime in spring/summer. Two stages: young yellow flower → fluffy white puff. Click a ripe puff to release seed particles that drift on physics-based wobble-drift.
- 25% chance per puff to trigger a granted **wish**: an ascending D5-A5-F#6 magical chime + themed wish speech + bonus happiness/friendship XP. This continues the wishing lineage started by shooting stars — daytime dandelion wishes complement the nighttime star wishes.
- Wind-aware seed flight: during windy weather, seeds inherit a strong directional bias. Also blow-direction skews away from click position for a physical feel.
- Realistic botanical detail: 14-petal radial young flower, 28-fiber radial pappus with tipped fluff dots, quadratic-bezier swaying stem with two jagged base leaves + midribs, small brown seed receptacle.
- Full metadata: 7 puff speeches + 8 wish messages, breathy "pfft" sound (bandpass noise), gentle hint text, dream template + sleep-talks, +1 dailyActivityLog activity, stats panel entry in WEATHER section, diary milestone on first puff, **Dandelion Wisher achievement #67** for 10 puffs.
- Total achievements: 67
- Renderer grew to ~20,465 lines.

### Thoughts for next cycle
- **S'mores combo** — still pending from v0.89's marshmallow cycle: 3 perfect marshmallow roasts → unlock a s'more treat (graham+chocolate+marshmallow) the next time cocoa spawns. Natural food-arc continuation.
- **Pet approaches campfire** — pet walks (via `offsetX` hooks in pet rendering) toward a lit campfire and sits closer to warm their paws. Would make the scene feel inhabited.
- **Dandelion chain reaction** — blowing one dandelion could also faintly puff a nearby one with a small probability, like wind catching sibling plants. Could lead to combo wish bonuses.
- **Butterfly lands on dandelion** — existing butterfly companion could occasionally alight on a young dandelion flower for a few seconds, briefly boosting the speech/affection value.
- **Seasonal weather visuals beyond dandelions** — **leaf pile during autumn windy** (pet can jump into it for happy boost), ceiling fan or paper streamers during summer windy, ice skating on a frozen puddle during cold weather.
- **Wind streaks on the chime** — faint horizontal wind-streak particles that emit from near the chime's sail when a gust hits.
- **Firefly lantern** — craft a lantern from caught fireflies that glows on the pet's head at night.
- **Constellation lore** — clicking a completed constellation shows a short mythical story overlay.
- **Photo gallery** — in-canvas gallery showing thumbnails of saved photos (requires new IPC to list photo files).
- **Fortune cookie rarity tiers** — golden fortune cookies with rare fortunes.
- **Combo hint system** — subtle visual hints when partway through a combo sequence.
- **Bedtime story continuation** — stories that span multiple nights with cliffhangers.
- **Sound volume slider** — control for ambient sound volume.
- **Frog chorus visual** — tiny frog silhouettes during evening chorus.
- **Nightlight color customization** — unlock different nightlight colors/styles.
- **Weather forecast widget** — show upcoming weather so player can anticipate changes.
- **Seasonal festivals** — special events during equinoxes and solstices with unique decorations.
- **Tide pools** — interactive mini-scene during summer evenings with little sea creatures.
- **Dream diary** — a separate section in the diary recording dream captions from each night.
- **Lucid dreaming** — rare event where clicking a dream scene triggers a mini dream interaction.
- **Winter tea party variant** — tea ceremony that happens during snowy weather.

### Current architecture notes
- Renderer is now ~20,465 lines.
- Dandelion feature lives immediately after the Wind Chime block and before `WEATHER_CHANGE_MIN` (starts around line 9521 in the post-chime region).
- `Dandelion` + `DandelionSeed` interfaces. `Dandelion` has `x, y, stage ("young"|"puff"|"puffed"), age, ripenAt, fadeIn, fadeOut, active, sway`. `DandelionSeed` has `x, y, vx, vy, life, maxLife, rotation, rotSpeed, wobblePhase`.
- Key functions: `spawnDandelion()`, `blowDandelion(d, clickX)`, `tryClickDandelion(clickX, clickY)`, `updateDandelions()`, `drawDandelion(d)`, `drawDandelions()`, `drawDandelionSeed(s)`, `drawDandelionSeeds()`, `canSpawnDandelion()`, `playDandelionPuffSound()`, `playDandelionWishChime()`.
- Spawn condition: `(morning||afternoon) && (sunny||cloudy) && (spring||summer) && !isSleeping`. Random chance per frame: 0.0018. Max 2 active.
- Position: groundY = `canvas.height / 2 + 48 + rand(0-10)`; x = canvas center ± (18-36% of width); overlap rejection (>28px apart required).
- Stages: young flower for 7-15s, then puff until clicked or 60s idle timeout.
- Click hit box: circular 14px radius over the puff head (only ripe "puff" stage is clickable).
- Seed physics: initial burst angles around `-π/2 ± 0.85π`, speed 0.9-2.5, slight gravity (+0.004/frame), air resistance (0.996 vy / 0.998 vx), sin-wave wobble pushes (+/-0.015/frame on vx). Seeds live 220-360 frames.
- Windy weather adds +1.8 * 0.25 directional bias to vx when the puff is blown.
- Wish chance: `Math.random() < 0.25`. Wish plays D5-A5-F#6 ascending chime via `playDandelionWishChime()` and awards +3 happy, +2 friendship XP bonus.
- Rendering order: dandelions drawn **behind pet** (near other ground objects like snowman/campfire); seeds drawn **in front of everything ground-level** (after `drawDewDrops()`).
- Click routing: inserted immediately after `tryClickWindChime` in the event handler.
- `logDailyActivity("dandelion")` called on each puff; `getContextualDreamIcons()` biases toward flower+butterfly icons when this activity is logged.
- Save version still 1; added fields: `totalDandelionsPuffed`, `totalDandelionWishes`, `dandelionFirstPuff`.
- Total achievements: 67.
- dailyActivityLog now tracks 20 activities: fed, played, trick, petted, photo, fireflies, constellations, dewdrops, story, bottle, fortune, bubbles, meditation, tea, snowman, campfire, marshmallow, cocoa, chime, dandelion.
- Dream templates + sleep-talks extended to include "dandelion".
- Stats panel WEATHER section now shows dandelion stats between WIND CHIMES and LIGHTNING BOLTS entries.
