# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.95.0 — Mushroom Ring / Fairy Ring (2026-04-18)

### What was done
- Added an **autumn fairy ring of toadstools** — 5-7 classic red-cap mushrooms arranged in an ellipse on the ground, spawning occasionally during autumn daytime/evening.
- **Click-to-poof interaction** — each mushroom caps spore-poofs on click (+1 happy, +1 XP), cap tilts and shrinks over 30 frames, greenish-white sparkle particles rise upward.
- **Fairy ring completion event** — once every mushroom in the ring is poofed, a magical payoff triggers: ascending C-E-G-C-E triangle arpeggio + high shimmer, 24-sparkle fountain, **expanding rainbow hue-rotating ellipse** on the ground, soft golden-rainbow radial glow, +5 happy / +3 care / +5 XP. Ring then glows for ~5s before fading out.
- Introduced a third autumn interaction pattern (*collect-all puzzle*) complementing leaf pile (burst) and squirrel (drop-and-collect).
- Achievement #70 "Fairy Ring Keeper" — complete 5 fairy rings.
- Total achievements: 70.
- Renderer grew to ~22,070 lines (+~560 lines).

### Thoughts for next cycle
- **Firefly-mushroom combo** — mushroom caps could glow very faintly at night (if a ring happens to survive into evening transition), creating a bioluminescent detail. Maybe fireflies pulse slightly brighter over a completed ring.
- **Fairy visitor** — *after* a fairy ring is completed, a tiny fairy sprite could briefly dance above the ring (similar arc to the squirrel — fleeting character).
- **Pet approaches the ring** — pet walks toward the mushroom ring and sits inside the ring after completion (short burst of wander-behavior override, similar suggestion carried over from squirrel cycle).
- **Hedgehog visitor for winter** — a second small visitor paralleling the squirrel; rolls up/unrolls, leaves tiny pinecones.
- **Harvest moon festival** — special autumn-night event with oversized orange moon, lantern glows, and a unique mooncake item.
- **Squirrel steals an acorn** — small chance squirrel sniffs a leftover acorn and snatches it back (cross-feature friendly rivalry).
- **Acorn inventory screen** — a hoard-view showing total acorn count with a basket visual, accessed from stats panel.
- **Pet chases the squirrel** — walks/scampers toward it (short wander override); squirrel reacts to pet proximity (flinch / dart).
- **Butterfly lands on squirrel's tail** — cross-feature interaction during the pause phase.
- **Raking animation / clean-up** — extends leaf pile concept; a way to rake scattered leaves back into a pile.
- **S'mores combo** — 3 perfect roasts → unlock a s'more treat next time cocoa spawns.
- **Pet approaches campfire / leaf pile / squirrel / ring** — pet walks toward interactive objects and sits closer to them.
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
- Renderer is now ~22,070 lines.
- Mushroom ring feature lives immediately after the squirrel/acorn block and before `WEATHER_CHANGE_MIN` (starts around line 11034, just after `drawAcorns()`).
- `Mushroom` and `MushroomRing` interfaces. `Mushroom` has `offsetX, offsetY, scale, capHue (0/1/2), spots[], poofed, poofAnim, wobble`. `MushroomRing` has `cx, cy, radiusX, radiusY, mushrooms[], life, fadeIn, fadeOut, completed, completionGlow, completionTimer, sparkleRingRadius`.
- Only one ring exists at a time (`mushroomRing: MushroomRing | null = null`). Spawn condition mirrors squirrel/leafpile: `autumn && daytimeish && not stormy/rainy/snowy && !isSleeping`. Spawn chance per frame: 0.00035 (rarer than squirrel at 0.0008).
- Key functions: `canSpawnMushroomRing()`, `spawnMushroomRing()`, `tryClickMushroomRing(clickX, clickY)`, `poofMushroom(index)`, `completeFairyRing()`, `updateMushroomRing()`, `drawMushroom(ring, m, alpha)`, `drawMushroomRing()`, `playMushroomPoofSound()`, `playFairyRingChime()`.
- Ring lifecycle: fade-in (90f) → life (~5400f = 90s) → fade-out (120f) when uncompleted, OR fade-out starts MUSHROOM_RING_COMPLETION_HOLD (300f = 5s) after completion.
- Click hit-box per mushroom: circular `6 * m.scale` radius centered ~4 px above ground line. Completed rings reject clicks (enjoy-the-magic lock).
- Click routing: inserted immediately after `tryClickAcorn` in the mousedown handler.
- Rendering order: `drawAcorns()` → `drawSquirrel()` → `drawMushroomRing()` → `drawToy(cx, cy)`. Drawn behind pet.
- Mushrooms sorted by `offsetY` back-to-front each frame so front mushrooms visually overlap back ones.
- Completion visual uses `hsla(hue, 80%, 75%)` with `hue = (completionTimer * 4) % 360` for a subtle rainbow shift on the expanding sparkle-ring stroke.
- `logDailyActivity("mushroom")` called on each poof; `getContextualDreamIcons()` biases toward flower/butterfly/star after mushroom activity.
- Save version still 1; added fields: `totalMushroomsPoofed`, `totalFairyRingsCompleted`, `mushroomRingFirstSeen`, `fairyRingFirstCompleted`.
- Total achievements: 70.
- dailyActivityLog now tracks 23 activities: fed, played, trick, petted, photo, fireflies, constellations, dewdrops, story, bottle, fortune, bubbles, meditation, tea, snowman, campfire, marshmallow, cocoa, chime, dandelion, leafpile, squirrel, mushroom.
- Dream templates + sleep-talks extended to include "mushroom".
- Stats panel WEATHER section now shows fairy ring stats between ACORNS and LIGHTNING BOLTS.
- Two diary milestones per player: first mushroom-ring sighting (🍄) and first fairy-ring completion (🧚). Subsequent completions add shorter "Fairy ring #N~!" entries.
