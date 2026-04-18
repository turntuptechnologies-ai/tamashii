# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.97.0 — Harvest Moon Festival (2026-04-18)

### What was done
- Added the **Harvest Moon Festival** — a rare autumn-night event combining an oversized golden-orange moon with 3-5 paper lanterns the player can light.
- Moon spawns at `(w * 0.65-0.80, h * 0.18)` with radius 22-26 px; radial gradient warm amber → deep orange; three crater spots; upper-left specular highlight; breathing outer halo; cubic ease-out rise animation (starts 50 px below resting position, rises over 600 frames / 10 s).
- 3-5 lanterns hang from the top of the canvas with invisible strings, each with independent sway phase + speed (0.020-0.035 rad/frame); 4 color variants (red/orange/gold/warm-cream hsla); unlit are muted brown; lit bloom with colored paper + inner core glow + outer halo via `litAnim` 0→1 at +0.04/frame.
- Click an unlit lantern (elliptical hitbox `7 × 10 px`) to light: A5+E6 temple-bell chime + A4 fundamental, 8-particle sparkle bloom, +1 happy / +1 XP.
- Light *every* lantern → **Harvest Moon Blessing**: C5-E5-G5-C6-E6-G6 golden pentatonic arpeggio + G7 shimmer, 28-particle fountain from the moon, bright golden halo pulse ~12s, +5 happy / +3 care / +5 XP, celebration speech.
- Natural 2-minute lifespan; fades in/out over 180 frames each; exits early if time/season/weather turns unfavorable or pet sleeps (unless blessing already triggered — those finish undisturbed).
- Hint text "light 🏮" above first unlit lantern until player's first full blessing.
- Achievement #72 "Moon Blessed" — light every lantern under a harvest moon.
- Two diary milestones (first sighting 🌕, first blessing 🌕), dream template "harvest_moon", 3 contextual sleep-talks, contextual dream-icon biasing (moon/star/heart), stats entry in WEATHER section between FAIRIES and LIGHTNING BOLTS.
- Full persistence (totalHarvestMoonsSeen, totalHarvestLanternsLit, totalHarvestMoonsBlessed, harvestMoonFirstSeen, harvestMoonFirstBlessed).
- Total achievements: 72.
- Renderer grew to ~23,300 lines (+~440 lines).

### Thoughts for next cycle
- **Mooncake reward drop** — rare chance that after a harvest moon blessing, a small mooncake appears on the ground for the pet to walk to and nibble (small stamina bonus + unique speech). Listed alongside harvest moon originally; this cycle only delivered the core moon + lanterns.
- **Golden-fairy variant** — 1-in-20 chance of a gold fairy emerging from a fairy ring with bigger rewards + unique speech + possibly its own achievement.
- **Multiple fairies at once** — rare chance of 2 fairies per ring completion, orbiting opposite phases of the same figure-8.
- **Fairy gift / keepsake** — after greeting, small chance fairy drops a heart-shaped petal the pet carries (persistent accessory unlock).
- **Hedgehog visitor for winter** — second small visitor paralleling the squirrel; rolls up/unrolls, leaves tiny pinecones.
- **Winter night signature event** — a snow moon analog to harvest moon? Ice lanterns? Something to give winter nights their own festival rhythm.
- **Spring night signature event** — cherry-blossom moon? Fireflies that form short-lived constellations?
- **Squirrel steals an acorn** — small chance squirrel sniffs a leftover acorn and snatches it back.
- **Acorn inventory screen** — a hoard-view showing total acorn count with a basket visual.
- **Pet approaches interactive objects** — pet walks toward the mushroom ring / campfire / leaf pile / squirrel / lanterns (short wander-behavior override).
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
- **Harvest moon lantern persistence** — rare chance a lit lantern stays in the sky the next few nights as a keepsake.
- **Lantern release** — a wish-release ritual where lit lanterns drift up into the sky and disappear (like sky lanterns during Chinese festivals).

### Current architecture notes
- Renderer is now ~23,300 lines.
- Harvest Moon Festival feature lives immediately after the fairy block and before `WEATHER_CHANGE_MIN` (starts around line 12080, just after the fairy hint text block).
- Key interfaces: `HarvestLantern` (x, y, swayPhase, swaySpeed, lit, litAnim, hue, sparkleTimer), `HarvestMoonFestival` (moonCx, moonCy, moonRadius, riseProgress, life, fadeIn, fadeOut, lanterns, blessed, blessGlow, blessTimer, ambientSparkleTimer).
- Only one festival exists at a time (`harvestMoonFestival: HarvestMoonFestival | null = null`). Spawn is random-per-frame gated by `canSpawnHarvestMoonFestival()` which checks: no existing festival, not sleeping, season=autumn, time=night, weather not storm/rain/snow. Spawn probability: `Math.random() < 0.00012` per frame (~1 per 140 seconds on average during allowed conditions, so maybe 1 per autumn night session).
- Key functions: `canSpawnHarvestMoonFestival()`, `spawnHarvestMoonFestival()`, `getLanternSwayX(l)`, `tryClickHarvestLantern(x, y)`, `lightHarvestLantern(i)`, `blessHarvestMoon()`, `updateHarvestMoonFestival()`, `drawHarvestMoonSky()`, `drawHarvestLantern(l, alpha)`, `drawHarvestLanterns()`, `playLanternLitSound()`, `playHarvestMoonBlessing()`.
- Lantern click hitbox: elliptical `dx²/49 + dy²/100 < 1`. Click routed in mousedown handler AFTER fairy check, BEFORE mushroom ring check.
- Rendering split into two calls: `drawHarvestMoonSky()` in the sky layer (after `drawComet()` and before `drawCherryBlossoms()`), and `drawHarvestLanterns()` in the upper-foreground layer (after `drawFairy()` and before `drawNightlight()`). This keeps the moon behind everything (true sky) and the lanterns above particles but below speech bubbles.
- Lantern visual size: body ellipse `radiusX=4.5, radiusY=6` centered at `(sx, sy+5)`; total height ~14 px including top cap + tassel. Paper-lantern style with wooden top cap, rounded oval paper body, dark bands at top/bottom, vertical ribs, gold tassel.
- Moon visual: radius 22-26 px; three crater details at relative offsets (-0.35, -0.15), (0.2, 0.3), (0.35, -0.3); specular highlight at (-0.3, -0.35) size 0.25x; breathing halo at 2.2x radius.
- Save version still 1; added fields: `totalHarvestMoonsSeen`, `totalHarvestLanternsLit`, `totalHarvestMoonsBlessed`, `harvestMoonFirstSeen`, `harvestMoonFirstBlessed`.
- Total achievements: 72 (added "moon_blessed" — light every lantern under a harvest moon, single completion).
- dailyActivityLog now tracks 25 activities: fed, played, trick, petted, photo, fireflies, constellations, dewdrops, story, bottle, fortune, bubbles, meditation, tea, snowman, campfire, marshmallow, cocoa, chime, dandelion, leafpile, squirrel, mushroom, fairy, harvest_moon.
- DREAM_TEMPLATES + SLEEP_TALK_CONTEXTUAL extended to include "harvest_moon".
- Stats panel WEATHER section now shows harvest moon stats between FAIRIES and LIGHTNING BOLTS in an amber `#F2B060` HARVEST MOON row.
- Two diary milestones per player: first sighting (🌕) and first blessing (🌕). Additional blessings after first record as "Harvest moon blessing #N~!".
