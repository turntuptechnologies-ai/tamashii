# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.93.0 — Autumn Leaf Pile (2026-04-17)

### What was done
- Added a **leaf pile** that gradually accumulates on the ground during autumn daytime/evening (any non-precipitating weather). Clicking the pile once it has 6+ leaves triggers a big scatter burst using existing leaf particle physics.
- Mechanically mirrors the dandelion: gradual growth → click → burst. But emotionally opposite: dandelion is airy/wistful, leaf pile is heavy/crunchy/exuberant.
- Completes the four-season weather-visual arc: **winter** (snowman/campfire cluster), **windy** (wind chime), **sunny spring/summer daytime** (dandelion), **autumn** (leaf pile).
- Windy weather speeds pile growth ~55% — creates a subtle link to the wind chime feature.
- 26-leaf capacity, 6 autumn colors, tiered pyramid layering, squash animation on jump, crunchy high-pass noise with intensity scaled by pile size.
- Achievement #68 "Leaf Jumper" for 10 jumps.
- Total achievements: 68.
- Renderer grew to ~20,935 lines (+~370 lines for the feature).

### Thoughts for next cycle
- **Pet leaps into the pile visual** — currently the pet doesn't physically animate when the leaves scatter. Could hook into the bounce/squish system so the pet does a little hop-and-land during the burst, syncing with the squash animation.
- **Mushroom ring** — tiny ring of mushrooms that sprouts in autumn/morning, click individual caps for a "poof" of spore particles. Fits the autumn theme, different micro-interaction from the pile.
- **Raking animation** — mini-game where the player swipes or clicks to rake scattered leaves back into the pile. Extends the leaf pile.
- **S'mores combo** — still pending from v0.89's marshmallow cycle: 3 perfect marshmallow roasts → unlock a s'more treat (graham+chocolate+marshmallow) the next time cocoa spawns.
- **Pet approaches campfire / leaf pile** — pet walks toward interactive objects and sits closer to them.
- **Dandelion chain reaction** — blowing one dandelion could faintly puff a nearby one with small probability.
- **Butterfly lands on dandelion or leaf pile** — existing butterfly companion could alight briefly for speech/affection boost.
- **Seasonal festivals** — harvest moon in autumn (already have autumn now, could add a glowing full moon event), winter solstice, spring equinox, summer solstice with unique decorations.
- **Wind streaks on the chime** — faint horizontal wind-streak particles from the chime's sail during gusts.
- **Firefly lantern** — craft a lantern from caught fireflies that glows on the pet's head at night.
- **Constellation lore** — clicking a completed constellation shows a short mythical story overlay.
- **Photo gallery** — in-canvas gallery showing thumbnails of saved photos (requires new IPC).
- **Fortune cookie rarity tiers** — golden fortune cookies with rare fortunes.
- **Combo hint system** — subtle visual hints when partway through a combo sequence.
- **Bedtime story continuation** — stories that span multiple nights with cliffhangers.
- **Sound volume slider** — control for ambient sound volume.
- **Frog chorus visual** — tiny frog silhouettes during evening chorus.
- **Nightlight color customization** — unlock different nightlight colors/styles.
- **Weather forecast widget** — show upcoming weather so player can anticipate changes.
- **Tide pools** — interactive mini-scene during summer evenings with little sea creatures.
- **Dream diary** — a separate section in the diary recording dream captions from each night.
- **Lucid dreaming** — rare event where clicking a dream scene triggers a mini dream interaction.
- **Winter tea party variant** — tea ceremony that happens during snowy weather.
- **Acorn collecting** — squirrel companion drops acorns that can be collected during autumn.

### Current architecture notes
- Renderer is now ~20,935 lines.
- Leaf pile feature lives immediately after the Dandelion block and before `WEATHER_CHANGE_MIN` (starts around line 9990 in the post-dandelion region).
- `LeafPile` + `LeafPileLeaf` interfaces. `LeafPile` has `x, y, leaves[], capacity, growTimer, fadeIn, fadeOut, active, jumpAnim, sway`. `LeafPileLeaf` has `offsetX, offsetY, tilt, colorIndex, size`.
- Key functions: `spawnLeafPile()`, `addLeafToPile()`, `jumpOnLeafPile(pile, clickX)`, `tryClickLeafPile(clickX, clickY)`, `updateLeafPile()`, `drawLeafPile()`, `drawLeafPileLeaf()`, `canSpawnLeafPile()`, `playLeafPileJumpSound(leafCount)`.
- Only one leaf pile exists at a time (single-instance, stored as `leafPile: LeafPile | null`).
- Spawn condition: `autumn && (morning||afternoon||evening) && (!stormy && !rainy && !snowy) && !isSleeping`. Random chance per frame while no pile exists: 0.002.
- Position: groundY = `canvas.height / 2 + 50 + rand(0-8)`. x = canvas center ± (22-30% of width), 60% biased to left side.
- Growth timer: 180-360 frames, multiplied by 0.55 during windy. Capacity = 26 leaves.
- Leaf layout: tiered (4 per tier). Tier width narrows by ~3px per tier so it forms a rough pyramid.
- Click hit box: elliptical, 22px wide, height = 6 + tierCount * 3.
- Minimum 6 leaves required to be jumpable.
- Jump scatter: every pile leaf becomes a "leaf" type particle + 6-10 bonus particles. Physics uses existing `type === "leaf"` particle handling (tumbling, gentle gravity, gusts).
- Sound: `playLeafPileJumpSound(leafCount)` — high-pass-filtered (1800Hz) noise with occasional crunch spikes, duration 0.35s + leafCount*0.02 (capped at 0.8s).
- Rendering order: leaf pile drawn **behind pet** (right after dandelions, before toy). Particles are drawn in the main particle pass (above pet).
- Click routing: inserted immediately after `tryClickDandelion` in the event handler.
- `logDailyActivity("leafpile")` called on each jump; `getContextualDreamIcons()` biases toward flower+heart+star icons when this activity is logged.
- Save version still 1; added fields: `totalLeafPileJumps`, `totalLeavesScattered`, `leafPileFirstJump`.
- Total achievements: 68.
- dailyActivityLog now tracks 21 activities: fed, played, trick, petted, photo, fireflies, constellations, dewdrops, story, bottle, fortune, bubbles, meditation, tea, snowman, campfire, marshmallow, cocoa, chime, dandelion, leafpile.
- Dream templates + sleep-talks extended to include "leafpile".
- Stats panel WEATHER section now shows leaf pile stats between DANDELIONS and LIGHTNING BOLTS entries.
