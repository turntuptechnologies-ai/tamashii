# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.106.0 — Summer Fireworks Festival (Hanabi 花火) (2026-04-20)

### What was done
- Shipped the **Summer Fireworks Festival** — the long-awaited summer-night signature event that finally fills the four-season seasonal-night gap flagged as the #1 priority in every NEXT.md for the past 5+ cycles. Completes the autumn/winter/spring/summer seasonal-night vocabulary: harvest moon + lanterns + mooncake; snow moon + snowflakes + snowflake keepsake; cherry moon + cranes + sakura petal keepsake; and now summer fireworks + blooms (+ future keepsake next cycle).
- 5 staggered rockets rise one-by-one every ~3s and bloom into colored radial N-point starbursts (5/6/8 spokes varying per bloom). Player *cheers* each bloom within its ~4s visible window to "tamaya!" cheer for it. Cheering every firework triggers a grand G-major-pentatonic finale arpeggio with sub-bass thump, rainbow confetti bursts, and full blessing.
- **New verb: *cheer*** — fourth distinct seasonal-night interaction verb (after light/catch/wish). Loud & celebratory, contrasting sharply with the cherry moon's quiet wish — perfectly matching the contrast between hanami drizzle and raucous summer hanabi.
- **5-color hanabi palette** (crimson 0°, warm gold 38°, emerald 130°, aqua 200°, violet 290°) — five classic Japanese summer-firework hues, shuffled per show.
- **G major pentatonic blessing audio** — brightest of the four seasonal-night tonal palettes (harvest = warm amber; snow = A minor pentatonic triangle; cherry = D major pentatonic sine; summer = G major pentatonic sine+triangle).
- **Two-layer drawing** — rockets behind the pet (sky layer), blooms above the pet (upper-air layer). Rising rockets visibly streak up from behind the pet silhouette.
- **Achievement #80 "Summer Fireworks Blessed"**, diary milestones (first sight + first bless + ongoing), stats panel entry, dream template, sleep-talks, contextual dream icons, full persistence.
- **Total achievements: 80**. Renderer grew from ~28,164 → ~28,796 lines.

### Thoughts for next cycle
- **Summer Sparkler Keepsake Drop** — now that the fireworks festival ships without a keepsake, the NATURAL immediate follow-up is the summer-night keepsake that completes the 4-season keepsake cycle. Candidate: a **sparkler stub (senkō hanabi 線香花火)** — after a blessed fireworks show, a tiny stick-shaped paper-cone sparkler falls from the sky and rests on the ground. Player clicks to *light* it (a 5th distinct keepsake verb after share/treasure/press — a light-a-memento verb for the summer warmth). While lit, it emits tiny ambient spark particles and plays a gentle tinkle for ~8s before fading into ash. Would close the 4-season keepsake arc: autumn mooncake (*shared* food), winter snowflake (*treasured* crystal), spring sakura petal (*pressed* memento), summer sparkler (*lit* memento that burns down in your paws). Mirrors the snowflake/sakura 2-cycle cadence perfectly. Alternative keepsakes: a glass firework-fragment charm, a paper-cone rocket stub, a folded origami-bomb keepsake. Sparkler is strongest because (a) it's the iconic Japanese summer-night keepsake (sparklers are given out at hanabi festivals), (b) it introduces a novel mechanic (a burning-down-in-real-time keepsake, unlike the other three which are static), (c) it pairs with the hanabi blessing culturally, and (d) it offers a 5th distinct keepsake verb.
- **Blue moon rarity** — 1-5% chance any seasonal moon arrives as a "blue moon" variant with a deeper indigo tint, a unique blue-tinted keepsake, and a "Blue Moon" achievement. Now that all 4 seasons have their moon/event, a cross-season rarity mechanic would add hook.
- **Moon-family / keepsake-family gallery UI** — a small pop-up showing the four seasonal moons (harvest amber, snow silver, cherry pink, summer hanabi) side-by-side with blessing counters under each, OR a keepsake gallery with all four keepsake sprites. Would give returning players a visual sense of seasonal progress and reward parity. Particularly valuable now that all four exist.
- **Festival night fireflies** — before the fireworks show starts, a few extra fireflies drift upward in the summer air as setup — connects the existing firefly mechanic to the new event.
- **Golden firework / rainbow firework** — 1-in-20 chance a firework blooms in all 5 palette hues simultaneously (rotating rainbow spokes) rather than a single color. Rare seasonal collectable.
- **Firework pair-bloom** — rare chance two rockets rise together and bloom simultaneously (double the points, double the particle count).
- **Pet approaches fireworks / stretches up** — same unrealized "pet walks toward the festival" pattern that's been on the list for moon festivals.
- **Pet holds the cheered firework briefly** — visible-receipt pattern (pet carries a tiny glowing replica in its paws for a few seconds before it fades).
- **Tamaya cry speech cascade** — if the player cheers all 5 fireworks within ~1s of each other, trigger a special "TAMAYA TAMAYA TAMAYA!" rapid-fire cascade speech + extra XP bonus. Rewards fast clicking.
- **Cross-weather/cross-event blooms** — if aurora is active during summer fireworks, blooms gain an aurora shimmer tint. If a shooting star passes during a bloom, the two combine for bonus XP.
- **Crane pair / Female cardinal / Chickadee / titmouse / junco / owl / fox / deer / Cardinal feather keepsake / Seed feeder / Spring swallow / ladybug visitor / Bunny pair / snow-bunny sculpture / Golden fairy / multiple fairies / fairy gift / Mooncake variations / Lantern release ritual / Squirrel steals acorn / Acorn inventory / Butterfly on squirrel tail / Raking animation / S'mores combo / Seasonal festivals / Wind streaks on chime / Firefly lantern / Constellation lore / Photo gallery / Fortune cookie tiers / Combo hints / Bedtime story continuation / Sound volume slider / Frog chorus / Nightlight colors / Weather forecast / Tide pools / Dream diary / Lucid dreaming / Winter tea party variant** — all still open, roughly in priority order now that the four-season night vocabulary is complete.

### Architecture notes
- Renderer is now ~28,796 lines.
- Summer Fireworks Festival feature lives immediately after `drawSakuraPetalKeepsake()` and before `WEATHER_CHANGE_MIN` (insertion block runs from roughly line 16957 to line 17588).
- Key interfaces: `Firework` (rocketX, rocketStartY, bloomX, bloomY, riseDelay, risePhase, bloomed, bloomPhase, cheered, cheerAnim, bloomLife, state, hueIndex, petalCount, sparkleTimer, rocketTrailTimer), `SummerFireworksFestival` (fireworks array, life, fadeIn/Out, blessed, blessGlow, blessTimer, ambientSparkleTimer, allFiredTimer).
- Only one festival exists at a time (`summerFireworksFestival: SummerFireworksFestival | null = null`).
- Key constants: `SUMMER_FIREWORKS_FADE_IN = 60`, `SUMMER_FIREWORKS_FADE_OUT = 120`, `SUMMER_FIREWORKS_LIFE = 3600` (~60s), `FIREWORK_RISE_DURATION = 54` (~0.9s), `FIREWORK_BLOOM_VISIBLE = 240` (~4s cheer window), `FIREWORK_BLOOM_FADE = 90`, `FIREWORK_STAGGER = 180` (~3s between rocket launches).
- Key functions: `canSpawnSummerFireworksFestival()`, `spawnSummerFireworksFestival()`, `updateSummerFireworksFestival()`, `tryClickFirework(x, y)`, `cheerFirework(index)`, `blessSummerFireworks()`, `drawSummerFireworkRockets()` (sky layer), `drawSummerFireworkBlooms()` (upper-air layer), `playFireworkRiseSound()`, `playFireworkBloomSound()`, `playFireworkCheerSound(hueIndex)`, `playSummerFireworksBlessing()`.
- Cheer click hitbox: circular `dx² + dy² < 400` (~20 px) while `state === "bloomed" && !cheered && bloomLife <= FIREWORK_BLOOM_VISIBLE`. Click routed in mousedown handler immediately after `tryClickSakuraPetalKeepsake`.
- Two-layer draw: `drawSummerFireworkRockets()` called between `drawCherryMoonSky()` and `drawCherryBlossoms()` (sky layer, behind pet). `drawSummerFireworkBlooms()` called immediately after `drawCherryMoonCranes()` (upper-air, above pet).
- Update call: `updateSummerFireworksFestival()` in the main frame loop immediately after `updateSakuraPetalKeepsake()`.
- Mutex: `canSpawnSummerFireworksFestival()` returns false if any of `harvestMoonFestival`, `snowMoonFestival`, `cherryMoonFestival` is active. Since summer is the only season each festival spawns in, the mutex is naturally already enforced by `currentSeason` checks — the explicit mutex is belt-and-suspenders.
- Save version still 1; added fields: `totalSummerFireworksSeen`, `totalFireworksCheered`, `totalSummerFireworksBlessed`, `summerFireworksFirstSeen`, `summerFireworksFirstBlessed`.
- Total achievements: 80 (added "summer_fireworks_blessed" — cheer for every firework in a summer hanabi show).
- `dailyActivityLog` now tracks 33 activities: ...`sakura_petal`, `summer_fireworks`.
- `DREAM_TEMPLATES` + `SLEEP_TALK_CONTEXTUAL` extended to include "summer_fireworks".
- `getContextualDreamIcons()` now includes "summer_fireworks" (star/heart bias).
- Stats panel WEATHER section now shows summer fireworks stats between SAKURA PETALS and LIGHTNING BOLTS in warm gold `#FFD07A` SUMMER FIREWORKS row.
- Diary: one milestone each for first sighting (🎆) and first blessing (🎆). Subsequent blessings add "Summer fireworks blessing #N~! Tamaya!" entries.
- All four seasonal-night 4-stage arcs are now complete. The four-season seasonal-night vocabulary is closed:
  - autumn: harvest moon → lanterns (*light*) → mooncake (*share* — food/feast)
  - winter: snow moon → snowflakes (*catch*) → snowflake keepsake (*treasure* — memento)
  - spring: cherry moon → cranes (*wish*) → sakura petal (*press* — memento)
  - summer: fireworks → blooms (*cheer*) → [future keepsake drop]
- Four distinct verbs (light/catch/wish/cheer) × four distinct palettes × four distinct musical keys (warm amber / A-minor pentatonic / D-major pentatonic / G-major pentatonic) × four distinct audio textures (bells / frost tinkle / koto pluck / whistle+BWOOM). Maximum distinctness across the four seasons.
- One gap remaining in the 4-season keepsake arc: the summer keepsake. That's the clear #1 for next cycle.

### Latent risks / cleanup candidates
- The v0.105.x `loop()` TDZ bug is still a latent class of bug. This cycle adds several new top-level `let` declarations (`summerFireworksFestival`, `totalSummerFireworksSeen`, etc.) but they're placed alongside all the other festival state near the middle of the file — ABOVE where `loop()` is now kicked off (last line of module). No new TDZ risk introduced by this cycle, but the systemic "28k-line file with top-level state scattered everywhere" code smell from v0.105.2's notes is unchanged. Worth a cleanup cycle sometime.
- The renderer file is now ~28,796 lines. If it crosses ~30k lines this becomes a serious developer-experience problem. A future cycle could split the renderer into modules by topic (creatures, weather, festivals, keepsakes, UI, sound, state, save) — but that's a massive refactor with high regression risk.
- All four seasonal moon/festival events now exist; future cycles should consider NOT adding another signature event (the pattern is complete) and instead either (a) ship the summer keepsake to finish the 4-season 4-stage matrix, (b) add cross-event variety (blue moons, golden cranes, rainbow fireworks), or (c) build the moon-family / keepsake-family gallery UI to give players a visible payoff for completing the full year.
