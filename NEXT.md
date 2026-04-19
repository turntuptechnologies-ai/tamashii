# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.100.0 — Snow Bunny (Yukiusagi) Visitor (2026-04-19)

### What was done
- Added the **Snow Bunny** — a fluffy white rabbit that hops into the canvas during winter daytime/evening (any non-stormy weather), hops along the ground, pauses to sniff the snow with wiggling nose + twitching ears, nibbles at snow-grass tufts 2-4 times with tiny snow-puff particles, then hops off to the nearest edge. Ground-visitor counterpart to the winter cardinal (sky visitor), mirroring the autumn squirrel + fairy pair.
- **Click to greet** (~11 px hitbox while sniffing/nibbling, non-greeted): "eeep!" squeak → carrot appears → bunny munches carrot down to nothing → hops off. 12 sparkle + 3 heart particles, +4 happy / +2 care / +3 friendship XP, contextual greet speech (6 variants).
- **Art:** round fluffy body (radial gradient light→mid→shadow, ~5.6×4.6 px), fluffy white tail puff, tucked back leg + two tucked front paws, head with slight lean, **two long rounded ears with pink inner layer and independent twitch**, single beady eye + white glint, tiny pink wiggling triangle nose, mouth line + whiskers, squish-on-landing (1.15×/0.85×). 3 body-color variants: 75% white / 18% cream / 7% grey.
- **Hop physics:** `hopPhase` advances per frame through `sin`, body rises and falls each cycle, `x` advances with air-boost (fast at peak, slow at landing) so hopping feels bunny-like instead of sliding. Landing plays low-sine thump + high-filtered snow-crunch noise and drops a paw print.
- **Paw print trail:** each landing emits a tiny grey paw-print (main pad + 3 toe dots, jittered left/right) that fades over ~4.3s. Paw prints live in a separate `pawPrints` array so they persist past the bunny's position. First ambient-trace pattern in the game.
- **Audio:** hop thump (150→70 Hz sine + high-filtered noise "crunch"), sniff (2× quick bandpass-3200 Hz noise puffs), nibble (4× quick triangle wave ticks at 1400-1800 Hz), greet squeak (1800→2600→1600 Hz sine "eeep!" + nibble trail).
- **Carrot (eating_carrot state):** tiny orange carrot with green leafy top pops in over 16f, shrinks from both axes over ~60f as `carrotEaten` rises — the first interactive object visibly consumed in real-time.
- **4-state FSM:** hopping_in → sniffing → nibbling → hopping_out (with eating_carrot branch triggered by greet).
- **Spawn:** `canSpawnBunny()` requires no existing bunny, **no existing cardinal** (the two never overlap), not sleeping, winter, daytimeish, non-stormy. Per-frame roll `Math.random() < 0.0004` (slightly rarer than cardinal).
- **Weather/season/sleep transitions:** flip to `hopping_out` if pet sleeps / season changes / weather turns stormy.
- **Persistence:** `totalBunniesSeen`, `totalBunniesGreeted`, `bunnyFirstSeen`, `bunnyFirstGreeted`.
- **Stats panel:** new SNOW BUNNIES row in the WEATHER section between CARDINALS and LIGHTNING BOLTS in soft `#F0E0F0`.
- **Achievement #75 "Snow Bunny Friend"** — greet 3 snow bunnies.
- **Two diary milestones:** first sighting 🐰 + first greet 🐰.
- **Dream template + sleep-talk + contextual dream icons** all added for "bunny" (heart/flower/star bias).
- **Click handler:** `tryClickBunny(clickX, clickY)` added in the mousedown handler after `tryClickCardinal` and before `tryClickMushroomRing`.
- **Draw calls:** `drawPawPrints()` + `drawBunny()` called in the ground/body layer after `drawCardinal()` — bunny renders behind the pet when grounded.
- **Total achievements: 75.**
- Renderer grew to ~25,460 lines (+~810 lines).

### Thoughts for next cycle
- **Winter night signature event** — **still completely empty**. This is the biggest remaining winter gap (listed repeatedly in prior NEXT.md cycles). Options: snow moon analog to the harvest moon (huge pale-blue full moon rising over the snow), ice lanterns frozen in the snow that you melt/light, paper snowflakes drifting from the sky that you catch/pop for rewards. This feels like the most impactful next step — winter has a daytime cardinal, daytime bunny, but zero night ambience.
- **Spring night signature event** — cherry-blossom moon? Fireflies forming short-lived constellations? Matches autumn's harvest moon + winter's (future) snow-moon. Spring has mostly day features and is missing a memorable night moment.
- **Summer night signature event** — fireworks show? Sea of fireflies over a small tide pool? Mirror the autumn/winter/spring pattern.
- **Pet approaches the bunny** — when bunny pauses close to the pet, pet waddles/hops toward her for a tiny nose-touch animation. Builds toward a general "pet walks to interactive objects" system.
- **Bunny pair / family** — rare chance 2-3 bunnies hop in together (real rabbits are social; a family trio would be adorable).
- **Bunny leaves a small snow-bunny sculpture** — rare chance bunny stops and shapes a tiny pile of snow into a snow-bunny silhouette with leaf-ears that persists for a while (like leaf pile / mushroom ring).
- **Winter yuki-daruma (snowman) link** — if the pet has built a snowman recently, the bunny might hop around it, stop to sniff its carrot nose, and get a small unique interaction.
- **Female cardinal variant** — 1-in-5 chance cardinal spawns as the buff-brown-plumage female (strong real-cardinal sexual dimorphism). Variety for repeat sightings; currently listed from v0.99 NEXT.md.
- **Cardinal pair** — rare chance male + female spawn side-by-side (cardinals pair for life).
- **Cardinal on a branch** — occasional bare winter branch in the sky that the cardinal lands on instead of the ground.
- **Chickadee / titmouse / junco** — other winter bird species with distinct calls (chickadee's "chick-a-dee-dee-dee" is iconic).
- **Seed feeder** — crafted or placed birdseed feeder hanging off a pole; attracts multiple bird species over time.
- **Fox visitor** — a rare red fox that pads through the snow at twilight, ears perked, tail curled. One-animal-at-a-time visitor slot for winter twilight/evening that sits between cardinal/bunny (daytime) and the still-empty night.
- **Deer visitor** — tall graceful character that walks across the far background during snowy/foggy weather with slow steps. A *background-layer* creature — would be a new spatial register since everything right now is foreground.
- **Owl visitor** — night-only winter bird that silently lands on a bare branch, blinks big yellow eyes, hoots once, flies away. Fills the winter-night creature gap in a different way from a moon event.
- **Cardinal feather keepsake** — rare chance cardinal drops a single red feather when flying away that the pet can collect (persistent accessory unlock).
- **Cardinal + bunny cross-encounter** — if both somehow appeared at the same time (currently blocked) they could share a tiny scripted moment (bunny sniffs seeds, cardinal hops back startled). Would require lifting the mutual-exclusion lock briefly or a scripted dual-spawn.
- **Golden-fairy variant** — 1-in-20 gold fairy from fairy ring, bigger rewards + own achievement.
- **Multiple fairies at once** — rare chance 2 fairies per ring, orbiting opposite phases of the same figure-8.
- **Fairy gift / keepsake** — after greeting, rare heart-shaped petal the pet carries as a persistent accessory.
- **Mooncake variations** — lotus paste, red bean, salted egg yolk — different mooncakes with different small rewards.
- **Mooncake box / gift wrap** — rare chance mooncake arrives wrapped; open it first.
- **Lantern release ritual** — lit harvest lanterns drift up into the sky (Chinese sky-lantern festival).
- **Squirrel steals an acorn** — small chance squirrel sniffs a leftover acorn and snatches it back.
- **Acorn inventory screen** — hoard-view showing total acorn count with a basket visual.
- **Butterfly lands on squirrel's tail** — cross-feature interaction during the pause phase.
- **Raking animation** — rake scattered leaves back into a pile.
- **S'mores combo** — 3 perfect roasts → unlock s'more treat next cocoa.
- **Seasonal festivals** — winter solstice / spring equinox / summer solstice with unique decorations.
- **Wind streaks on the chime** — faint horizontal wind-streak particles during gusts.
- **Firefly lantern** — craft a lantern from caught fireflies that glows on pet's head at night.
- **Constellation lore** — clicking a completed constellation shows a short mythical story overlay.
- **Photo gallery** — in-canvas gallery showing thumbnails of saved photos (requires new IPC).
- **Fortune cookie rarity tiers** — golden fortune cookies with rare fortunes.
- **Combo hint system** — subtle visual hints when partway through a combo.
- **Bedtime story continuation** — stories that span multiple nights with cliffhangers.
- **Sound volume slider** — control for ambient sound volume.
- **Frog chorus visual** — tiny frog silhouettes during evening chorus.
- **Nightlight color customization** — unlock different nightlight colors/styles.
- **Weather forecast widget** — show upcoming weather so player can anticipate.
- **Tide pools** — interactive mini-scene during summer evenings with sea creatures.
- **Dream diary** — separate section in diary recording dream captions from each night.
- **Lucid dreaming** — rare event where clicking a dream scene triggers a mini dream interaction.
- **Winter tea party variant** — tea ceremony during snowy weather.

### Current architecture notes
- Renderer is now ~25,460 lines.
- Snow bunny feature lives immediately after the Cardinal block and before `WEATHER_CHANGE_MIN` (starts around line 13719).
- Key interface: `Bunny` (x, y, groundY, dir, state, stateTimer, hopPhase, hopSpeed, earTwitch, earTwitchTimer, nosePhase, noseFast, sniffBobs, sniffCountdown, nibblesLeft, nibbleCountdown, fadeIn, fadeOut, greeted, carrotAppearAnim, carrotEaten, bodyColor, lastPawPrintX).
- Separate `PawPrint` interface (x, y, life, maxLife, side) and `pawPrints: PawPrint[]` array — paw prints live independently of the bunny so the trail persists past her position.
- Only one bunny exists at a time (`bunny: Bunny | null = null`).
- **Mutual exclusion:** `canSpawnBunny()` returns `false` if `cardinal` is already active, and `canSpawnCardinal()` was *not* modified — so a bunny will not spawn while a cardinal exists, but a cardinal could technically spawn while a bunny exists. If that behavior matters either way, also guard cardinal spawn next cycle. In practice the per-frame rolls are rare enough (0.0004 vs 0.0005) that double-spawns basically never happen.
- Key functions: `canSpawnBunny()`, `spawnBunny()`, `tryClickBunny(x, y)`, `greetBunny()`, `updateBunny()`, `drawBunny()`, `drawPawPrints()`, `playBunnyHop()`, `playBunnySniff()`, `playBunnyNibble()`, `playBunnyGreetSqueak()`.
- Bunny click hitbox: circular `dx² + dy² < 121` (~11 px radius, slightly bigger than cardinal's 10). Only clickable while `sniffing` or `nibbling` and not yet greeted. Click routed in mousedown handler AFTER cardinal check, BEFORE mushroom ring check.
- Rendering: `drawPawPrints()` called before `drawBunny()` in the ground layer so prints render under her body. Both are called AFTER `drawCardinal()` in the same rendering chunk.
- Hop cycle: `hopPhase` increments `(2π / BUNNY_HOP_SPEED)` per frame (hopSpeed=22f), body y = `groundY - max(0, sin(hopPhase) * 5.5)`, forward x advances with air-boost factor `max(0, sin(hopPhase))*0.8 + 0.4`. When `prevPhase < 2π && hopPhase >= 2π`, we've landed — play thump, drop paw print, wrap `hopPhase -= 2π`.
- Transition to sniffing: during `hopping_in`, after entering past 20%/80% of canvas width, each completed hop has a 4% chance to stop and sniff. So average time to first pause ≈ 25 hops ≈ 10 seconds of hopping.
- After sniffing → nibbling → sniffing → chance to hop further OR `hopping_out` (40% chance to leave each cycle).
- Greet flow: `state = "eating_carrot"`, `stateTimer = 220f`, `carrotAppearAnim` rises 0→1 over ~16f, then `carrotEaten` rises 0→1 over ~60f. When `stateTimer <= 0`, flips to `hopping_out` toward nearest edge.
- Save version still 1; added fields: `totalBunniesSeen`, `totalBunniesGreeted`, `bunnyFirstSeen`, `bunnyFirstGreeted`.
- Total achievements: 75 (added "bunny_friend" — greet 3 snow bunnies with carrots).
- dailyActivityLog now tracks 28 activities: fed, played, trick, petted, photo, fireflies, constellations, dewdrops, story, bottle, fortune, bubbles, meditation, tea, snowman, campfire, marshmallow, cocoa, chime, dandelion, leafpile, squirrel, mushroom, fairy, harvest_moon, mooncake, cardinal, bunny.
- DREAM_TEMPLATES + SLEEP_TALK_CONTEXTUAL extended to include "bunny".
- `getContextualDreamIcons()` now includes "bunny" (heart/flower/star).
- Stats panel WEATHER section now shows bunny stats between CARDINALS and LIGHTNING BOLTS in soft `#F0E0F0` SNOW BUNNIES row.
- Diary: two milestones per player: first sighting 🐰 and first greet 🐰. No ongoing per-greet diary entries (achievement tracks progress).
