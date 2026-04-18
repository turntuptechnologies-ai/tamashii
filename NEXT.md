# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.96.0 — Fairy Visitor (2026-04-18)

### What was done
- Added a **tiny fairy sprite** that rises out of a completed fairy ring and dances above it as the magical reward payoff — directly extending last cycle's mushroom ring completion event.
- Figure-8 dance orbit (ampX 14, ampY 6, phase 0.035 rad/frame), dual pairs of fluttering translucent wings, pulsing radial halo, 4 color variants (pink/cyan/mint/gold), continuous sparkle trail, ambient high-sine twinkle every ~70-160 frames.
- **Click to greet** — ~10 px hitbox around fairy; greeting plays bright ascending D6-F#6-A6-D7 bell arpeggio + high shimmer, 16-sparkle burst, +3 happy / +2 care / +3 XP, and fairy zooms up and away with a dense sparkle trail.
- If not greeted, fairy drifts politely upward after 12s. Retreats immediately if pet goes to sleep.
- Achievement #71 "Fairy Friend" — greet 3 fairies.
- Two diary milestones (first sighting 🧚, first greeting 🧚), dream template "fairy", 3 fairy sleep-talks, contextual dream icons (heart/star/butterfly), stats entry in WEATHER section between FAIRY RINGS and LIGHTNING BOLTS.
- Full persistence (totalFairiesSeen, totalFairiesGreeted, fairyFirstSeen, fairyFirstGreeted).
- Total achievements: 71.
- Renderer grew to ~22,700 lines (+~420 lines).

### Thoughts for next cycle
- **Multiple fairies at once** — rare chance of 2 fairies per completion (they orbit opposite phases of the same figure-8).
- **Fairy trails follow pet** — after greeting, fairy briefly orbits the pet before flying off.
- **Rare golden fairy** — 1-in-20 chance of a special gold fairy that gives bigger rewards + special speech.
- **Fairy lands on a mushroom cap** — pre-greet, the fairy might pause and rest on a cap for a second.
- **Hedgehog visitor for winter** — second small visitor paralleling the squirrel; rolls up/unrolls, leaves tiny pinecones.
- **Harvest moon festival** — special autumn-night event with oversized orange moon, lantern glows, unique mooncake item.
- **Squirrel steals an acorn** — small chance squirrel sniffs a leftover acorn and snatches it back.
- **Acorn inventory screen** — a hoard-view showing total acorn count with a basket visual.
- **Pet approaches interactive objects** — pet walks toward the mushroom ring / campfire / leaf pile / squirrel (short wander-behavior override).
- **Butterfly lands on squirrel's tail** — cross-feature interaction during the pause phase.
- **Raking animation** — rake scattered leaves back into a pile.
- **S'mores combo** — 3 perfect roasts → unlock a s'more treat next time cocoa spawns.
- **Seasonal festivals** — winter solstice, spring equinox, summer solstice with unique decorations.
- **Wind streaks on the chime** — faint horizontal wind-streak particles from chime's sail during gusts.
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
- **Tide pools** — interactive mini-scene during summer evenings with sea creatures.
- **Dream diary** — separate section in diary recording dream captions from each night.
- **Lucid dreaming** — rare event where clicking a dream scene triggers a mini dream interaction.
- **Winter tea party variant** — tea ceremony that happens during snowy weather.
- **Fairy gift** — rare chance a greeted fairy drops a small magical keepsake (heart-shaped petal?) that the pet carries.

### Current architecture notes
- Renderer is now ~22,700 lines.
- Fairy feature lives immediately after the mushroom ring block and before `WEATHER_CHANGE_MIN` (starts around line 11622, just after `drawMushroomRing()`).
- `Fairy` interface. Fields: `x, y, cx, cy, phase, wingPhase, bodyHue (0-3), life, fadeIn, fadeOut, greeted, flyAway, flyAwayVx, flyAwayVy, trailTimer, twinkleTimer, facing, hintShown`.
- Only one fairy exists at a time (`fairy: Fairy | null = null`). Spawn is NOT random-per-frame — it's triggered from `updateMushroomRing()` when `ring.completed && !ring.fairySpawned && ring.completionTimer === FAIRY_SPAWN_DELAY (30)`.
- Key functions: `spawnFairy(ringCx, ringCy)`, `tryClickFairy(clickX, clickY)`, `greetFairy()`, `updateFairy()`, `drawFairy()`, `playFairyTwinkle()`, `playFairyBlessing()`.
- Fairy lifecycle: fade-in (60f) → dance (720f = 12s) → natural flyAway (upward drift) → fade-out (90f). Click triggers instant flyAway.
- Click hit-box: circular `10 px` radius around fairy center. Click routed in mousedown handler BEFORE the mushroom ring check (since fairy hovers above the ring) to prevent clicks falling through to poof a mushroom that shouldn't be poofable on a completed ring.
- Rendering: `drawFairy()` is called after `drawButterfly()` and before `drawDreamBubble()` — so fairy renders above particles/butterfly but below speech bubbles.
- MushroomRing interface gained one new field: `fairySpawned: boolean`. Initialized to `false` in `spawnMushroomRing()`.
- Save version still 1; added fields: `totalFairiesSeen`, `totalFairiesGreeted`, `fairyFirstSeen`, `fairyFirstGreeted`.
- Total achievements: 71 (added "fairy_friend" — greet 3 fairies).
- dailyActivityLog now tracks 24 activities: fed, played, trick, petted, photo, fireflies, constellations, dewdrops, story, bottle, fortune, bubbles, meditation, tea, snowman, campfire, marshmallow, cocoa, chime, dandelion, leafpile, squirrel, mushroom, fairy.
- DREAM_TEMPLATES + SLEEP_TALK_CONTEXTUAL extended to include "fairy".
- Stats panel WEATHER section now shows fairy stats between FAIRY RINGS and LIGHTNING BOLTS in a pink-tinted FAIRIES row.
- Two diary milestones per player: first fairy sighting (🧚) and first fairy greeting (🧚).
