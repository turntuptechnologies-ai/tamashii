# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.99.0 — Winter Cardinal Visitor (2026-04-19)

### What was done
- Added the **Winter Cardinal** — a bright red male northern cardinal that flies into the canvas during winter daytime (morning/afternoon/evening, any non-stormy weather including snow), descends from the upper sky in a gentle fluttering arc, perches on the ground chirping its signature "cheer-cheer-cheer" descending 3-tone call, pecks for seeds 2-4 times with tiny snow puff particles, then flaps upward and flies away.
- **Click to greet** (~10 px radius while perched, non-greeted): bright 8-note musical trill "what-cheer what-cheer birdie-birdie-birdie" (2600–3800 Hz ascending-wavering pattern), 14 red sparkle + 3 heart particles, crest raises to full height, small 2 px bow-lean animation eases back over ~40 frames, +4 happy / +2 care / +3 friendship XP, contextual greet speech (6 variants).
- **Art:** rounded bright-red body (radial gradient `#ff5060 → #e81828 → #9a0c18`, ~5.4×4.6 px), prominent pointed crest spike (+1.2 px lift when alert/greeted), black face mask around eye + throat base, thick orange-yellow conical beak with dividing line, beady black eye + white glint, back-pointing layered dark-red tail feathers, two wing layers (back + front) that flap at 0.5 rad amplitude when flying and near-still when perched, tiny dark feet with spread toes when perched. Sprite mirrors based on `dir: 1 | -1`.
- **Audio:** chirp plays a 3-tone sine descending call with quick rising slides per-note (0.04s rise, 0.14s fall) over 0.36s total; greet trill plays 8 tones over ~0.8s ascending then wavering; flutter is a bandpass-filtered (~900 Hz Q 0.8) noise burst on wingbeats while flying.
- **Spawn:** `canSpawnCardinal()` returns true when no cardinal active + not sleeping + winter + daytimeish + non-stormy. Per-frame roll `Math.random() < 0.0005`.
- **4-state FSM:** flying_in (enters from off-screen edge at upper sky, descends in arc toward targetX) → perched (4.7–7.7s, chirps every 1.2–2.7s) → pecking (2-4 pecks with 50–80f gaps, head-dip animation, snow puffs) → flying_out (flaps up with vy -1.1 accelerating -0.03/frame, fades out after leaving canvas). If greeted during perched/pecking, transitions back to perched with extended stateTimer.
- **Weather/season/sleep transitions:** immediately flip to flying_out with flutter sound if isSleeping / season !== winter / weather === stormy.
- **Persistence:** totalCardinalsSeen, totalCardinalsGreeted, cardinalFirstSeen, cardinalFirstGreeted.
- **Stats panel:** new CARDINALS row in the WEATHER section between MOONCAKES and LIGHTNING BOLTS in bright `#E82838`.
- **Achievement #74 "Cardinal Friend"** — greet 3 cardinals.
- **Two diary milestones:** first sighting 🐦 + first greet 🐦; subsequent greets don't add diary entries (greet-focused achievement already tracks progress).
- **Dream template + sleep-talk + contextual dream icons** all added for "cardinal". Also restored the missing "mooncake" entry in `getContextualDreamIcons()` while I was in there.
- **Click handler:** `tryClickCardinal(clickX, clickY)` added in the mousedown handler after `tryClickMooncake` and before `tryClickMushroomRing`, so clicks on cardinals are routed before bubbles/drag logic.
- **Draw call:** `drawCardinal()` is called in the ground/body layer after `drawMooncake()` so the cardinal renders behind the pet when grounded.
- **Total achievements: 74.**
- Renderer grew to ~24,400 lines (+~450 lines).

### Thoughts for next cycle
- **Female cardinal (buff-brown plumage)** — 1-in-5 chance cardinal spawns as the less-flashy female (muted tan body, still red crest tip, orange-tan wings) — pairs nicely with how real cardinals have strong sexual dimorphism. Adds variety to repeated sightings.
- **Cardinal pair** — rare chance both male and female spawn together side-by-side on the same visit (real cardinals pair for life).
- **Cardinal leaves a feather** — rare chance cardinal drops a single red feather when it flies away that pet can collect (permanent keepsake + small stat bonus).
- **Cardinal on a branch** — during winter, have an occasional bare branch visible in the sky that the cardinal lands on instead of the ground; broader spatial use of the canvas.
- **Snow bunny (yukiusagi) visitor** — second winter character (listed in v0.98 NEXT.md); white fluffy rabbit hops across ground, complements cardinal (one sky, one ground).
- **Winter night signature event** — still completely empty. Snow moon analog to harvest moon? Ice lanterns frozen in snow? Paper snowflakes drifting from the sky that you can pop for tiny rewards?
- **Spring night signature event** — cherry-blossom moon? Fireflies that form short-lived constellations? Matches autumn's harvest moon.
- **Pet approaches the cardinal** — when cardinal perches close enough, pet briefly waddles/hops toward it for a tiny nose-touch animation. Builds toward a wider "pet walks to interactive objects" system (listed last cycle too).
- **Seed feeder** — craft or place a birdseed feeder hanging off a pole that, when placed, attracts multiple birds (cardinals, chickadees, finches) over time.
- **Chickadee / titmouse / junco** — other winter bird species; rare spawn rate each, each with distinct calls (chickadee's "chick-a-dee-dee-dee" is another iconic winter vocalization).
- **Golden-fairy variant** — 1-in-20 chance of a gold fairy emerging from a fairy ring with bigger rewards + unique speech + its own achievement.
- **Multiple fairies at once** — rare chance of 2 fairies per ring completion, orbiting opposite phases of the same figure-8.
- **Fairy gift / keepsake** — after greeting, small chance fairy drops a heart-shaped petal the pet carries (persistent accessory unlock).
- **Mooncake variations** — lotus paste, red bean, salted egg yolk — different mooncakes with different small rewards, chosen randomly each drop.
- **Mooncake box / gift wrap** — rare chance the mooncake arrives wrapped in a gift box that must be opened first.
- **Lantern release ritual** — lit lanterns drift up into the sky (Chinese sky lantern festival).
- **Squirrel steals an acorn** — small chance squirrel sniffs a leftover acorn and snatches it back.
- **Acorn inventory screen** — hoard-view showing total acorn count with a basket visual.
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

### Current architecture notes
- Renderer is now ~24,400 lines.
- Cardinal feature lives immediately after the Mooncake block and before `WEATHER_CHANGE_MIN` (starts around line 13106 post-mooncake-block).
- Key interface: `Cardinal` (x, y, vx, vy, dir, state, stateTimer, groundY, targetX, wingPhase, hopPhase, chirpTimer, peckCountdown, pecksLeft, crestLift, bowPhase, fadeIn, fadeOut, greeted).
- Only one cardinal exists at a time (`cardinal: Cardinal | null = null`).
- Key functions: `canSpawnCardinal()`, `spawnCardinal()`, `tryClickCardinal(x, y)`, `greetCardinal()`, `updateCardinal()`, `drawCardinal()`, `playCardinalChirp()`, `playCardinalGreetTrill()`, `playCardinalFlutter()`.
- Cardinal click hitbox: circular `dx² + dy² < 100` (~10 px radius). Only clickable while perched or pecking and not yet greeted. Click routed in mousedown handler AFTER mooncake check, BEFORE mushroom ring check.
- Rendering: `drawCardinal()` called in the ground layer after `drawMooncake()` — the cardinal renders behind the pet when perched on the ground. During flying phases y-coordinate is in the upper canvas so it naturally appears to be in the sky during flight.
- Lifecycle: flying_in uses a gentle descent based on horizontal distance remaining (`desiredY = groundY - remaining/width*0.6 * totalDrop * 0.6`) lerped at 0.08 until close, then 0.25 for landing. Once arrived at targetX, state → perched, stateTimer 280–460 frames, chirp timer resets.
- Save version still 1; added fields: `totalCardinalsSeen`, `totalCardinalsGreeted`, `cardinalFirstSeen`, `cardinalFirstGreeted`.
- Total achievements: 74 (added "cardinal_friend" — greet 3 winter cardinals with seeds).
- dailyActivityLog now tracks 27 activities: fed, played, trick, petted, photo, fireflies, constellations, dewdrops, story, bottle, fortune, bubbles, meditation, tea, snowman, campfire, marshmallow, cocoa, chime, dandelion, leafpile, squirrel, mushroom, fairy, harvest_moon, mooncake, cardinal.
- DREAM_TEMPLATES + SLEEP_TALK_CONTEXTUAL extended to include "cardinal".
- `getContextualDreamIcons()` now includes "cardinal" (heart/star/flower); also restored the missing "mooncake" entry while adding cardinal.
- Stats panel WEATHER section now shows cardinal stats between MOONCAKES and LIGHTNING BOLTS in a bright `#E82838` CARDINALS row.
- Diary: two milestones per player: first sighting 🐦 and first greet 🐦. No ongoing per-greet diary entries (achievement tracks progress).
