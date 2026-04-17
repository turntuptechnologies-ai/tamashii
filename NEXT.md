# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.94.0 — Autumn Squirrel Visitor + Acorns (2026-04-17)

### What was done
- Added a **visiting squirrel character** that scampers in from one side of the canvas during autumn daytime/evening, pauses to swish its tail, drops 2-4 acorns, then scampers back off the way it came.
- Added **collectable acorns** — each dropped acorn sits on the ground for ~36 seconds. Click to pick it up for +2 happy / +1 care / +1 XP, with sparkle particles and a cute ascending bloop sound. Every 10th acorn triggers a bigger milestone reward: +5 happy / +2 care / +3 XP, a special E-G-B chime, extra sparkles, and a diary milestone.
- This is the **first new character** since the butterfly companion — a fleeting visitor, distinct from the static leaf pile. Autumn now has two complementary interactions.
- Achievement #69 "Acorn Collector" for 15 acorns.
- Total achievements: 69.
- Renderer grew to ~21,488 lines (+~550 lines).

### Thoughts for next cycle
- **Pet chases the squirrel** — when the squirrel appears, the pet could walk/scamper toward it (a short burst of wander-behavior override) and the squirrel could react to pet proximity (flinch / dart further).
- **Squirrel steals/retrieves an acorn** — small chance the squirrel briefly sniffs a leftover acorn and snatches it back, creating friendly rivalry.
- **Butterfly lands on squirrel's tail** — cross-feature interaction — briefly, the butterfly rests on the squirrel's tail while it pauses.
- **Acorn inventory screen** — a little hoard view showing the total acorn count with a basket visual, maybe accessed from the stats panel.
- **Hedgehog visitor for winter** — a second small visitor in winter season, paralleling the squirrel. Rolls up/unrolls, leaves tiny pinecones.
- **Mushroom ring** — from previous NEXT.md, still pending. Autumn/morning feature, click caps for a spore poof.
- **Raking animation / clean-up** — extends the leaf pile concept with a way to rake scattered leaves back.
- **S'mores combo** — still pending from the marshmallow cycle: 3 perfect roasts → unlock a s'more treat the next time cocoa spawns.
- **Pet approaches campfire / leaf pile / squirrel** — pet walks toward interactive objects and sits closer to them.
- **Harvest moon festival** — special autumn-night event: oversized orange moon, lantern glows around the edges, unique mooncake item.
- **Seasonal festivals** — winter solstice, spring equinox, summer solstice with unique decorations.
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

### Current architecture notes
- Renderer is now ~21,488 lines.
- Squirrel + acorn feature lives immediately after the Leaf Pile block and before `WEATHER_CHANGE_MIN` (starts around line 10371, just after the `drawLeafPile()` closing brace).
- `Squirrel` + `Acorn` interfaces. `Squirrel` has `x, y, vx, dir, state, stateTimer, targetX, runPhase, tailSway, dropCountdown, acornsToDrop, fadeIn, fadeOut, visible`. `Acorn` has `x, y, groundY, vy, bounce, spin, life, fadeIn, fadeOut, active, sway`.
- Only one squirrel exists at a time (single-instance, `squirrel: Squirrel | null = null`). Up to 10 acorns on the ground at once.
- Spawn condition: `autumn && (morning||afternoon||evening) && (not stormy/rainy/snowy) && !isSleeping && acorns.length < 10 && !squirrel`. Random chance per frame: 0.0008 (less frequent than leafpile).
- Key functions: `spawnSquirrel()`, `dropAcornFromSquirrel(sq)`, `tryClickAcorn(clickX, clickY)`, `collectAcorn(index)`, `updateSquirrel()` (handles both squirrel AND acorn updates), `drawSquirrel()`, `drawAcorn(a)`, `drawAcorns()`, `canSpawnSquirrel()`, `playAcornDropSound()`, `playAcornCollectSound()`, `playAcornBonusChime()`, `playSquirrelScamperTick()`.
- Squirrel states: `entering` → `pausing` → `dropping` → `leaving`. Dropping handles one acorn at a time with a countdown timer between drops.
- Scamper speed: 1.6 px/frame. Pause duration: 120-220 frames (2-3.7s).
- Acorn drop spawns slightly behind the squirrel's facing direction. Falls with gravity (0.18/frame²), bounces once if impact velocity is high.
- Acorn lifecycle: fadeIn (20f) → 2200 frames life → fadeOut (60f) when uncollected, or immediate removal on click with sparkle particle burst.
- Click hit box on acorn: 6px-radius circular (dx² + dy² < 36).
- Click routing: inserted immediately after `tryClickLeafPile` in the event handler.
- Rendering order: `drawLeafPile()` → `drawAcorns()` → `drawSquirrel()` → `drawToy(cx, cy)`. Both squirrel and acorns drawn **behind pet**.
- `logDailyActivity("squirrel")` called on each acorn collect; `getContextualDreamIcons()` biases toward food/heart/flower icons when this activity is logged.
- Save version still 1; added fields: `totalAcornsCollected`, `totalSquirrelVisits`, `squirrelFirstSeen`, `acornFirstCollected`.
- Total achievements: 69.
- dailyActivityLog now tracks 22 activities: fed, played, trick, petted, photo, fireflies, constellations, dewdrops, story, bottle, fortune, bubbles, meditation, tea, snowman, campfire, marshmallow, cocoa, chime, dandelion, leafpile, squirrel.
- Dream templates + sleep-talks extended to include "squirrel".
- Stats panel WEATHER section now shows acorn stats between LEAF PILES and LIGHTNING BOLTS entries.
- Two diary milestones per player: first squirrel visit (🐿️) and first acorn collected (🌰).
