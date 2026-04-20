# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.104.0 — Sakura Petal Keepsake Drop (2026-04-20)

### What was done
- Added the **Sakura Petal Keepsake Drop** — after every Cherry Moon Blessing, the pink moon now drops a single oversized 5-petal cherry blossom keepsake that tumbles down to the ground as a persistent collectible. Click it to *press* the petal (like pressing flowers in a book — a third distinct keepsake verb alongside mooncake's *share* and snowflake's *treasure*). Completes the three-of-four seasonal-keepsake parity pattern (harvest→mooncake, snow→snowflake keepsake, cherry→sakura petal). Fills NEXT.md's #1 suggestion from last cycle — the natural immediate follow-up to the Cherry Moon Festival.
- **Vocabulary inverted point-for-point from snowflake keepsake** so they feel distinct rather than reskins: crystalline 6-armed snowflake → 5-petal cherry blossom with cream pollen center; side-to-side sway → wider flutter + faster continuous rotation (0.08 vs 0.05); bright triangle-wave glockenspiel drop chime → warm sine-wave descending cascade one octave lower; crystalline triangle tink + high bandpass frost-noise landing → soft sine sigh + low-pass paper-rustle landing; cool C-E-G-C triangle-wave silver press arpeggio → warm F#-A-C#-F# sine-wave press arpeggio; cool silvery-blue halo → warm pink blush halo; pure sparkle ambient emission → petal-biased ambient emission (55% petals, 45% sparkles).
- **Verb: *press*** — introduces a third distinct keepsake-interaction category. Mooncake is *shared* (food), snowflake is *treasured* (preserve), sakura petal is *pressed* (preserve between pages). Mirrors hanami tradition.
- **5-petal sakura silhouette** with subtle tip-notches, warm cream-yellow pollen center with 6 darker stamen dots, and bright inner core. Petal body rendered in one of 4 cherry-moon crane palette hues (soft pink 340°, warm peach 15°, paper white 0° sat 0, deeper rose 330°) so the keepsake reads as a color-continuous sibling of the cranes the player just wished on.
- **Tumble physics** — wider flutter (8 px vs snowflake's 6 px, tapering to zero as it lands) + faster continuous rotation (0.08/frame) makes the petal visibly tumble end-over-end through the air, genuinely reading as a real falling petal rather than a drifting crystal. Slower fall (~3s, longer than snowflake's 2.3s and mooncake's 1.5s) because petals flutter down slowest of all.
- **Sound design** — warm sine palette vs snowflake's triangle-wave crystalline palette. Drop cascade D6→A5→F#5→D5 is a full octave lower and softer. Landing is a paper sigh with low-pass noise rather than a crystalline tink. Press arpeggio is F#-A-C#-F# sine (F# major, mirroring the cherry moon blessing's D-major palette) vs snowflake's cool C-E-G-C triangle.
- **Achievement #79 "Sakura Petal Keeper"** — press a sakura petal keepsake from a blessed cherry moon (single-completion, scaled to match Snowflake Keeper tier).
- **Diary milestones** — first press + ongoing "Pressed sakura petal keepsake #N~!" entries.
- **"sakura_petal" dream template + sleep-talks + contextual dream icons** added.
- **Stats panel** — SAKURA PETALS row in WEATHER section between CHERRY MOON and LIGHTNING BOLTS in soft `#FFD6E0`.
- **Full persistence** (`totalSakuraPetalKeepsakesPressed`, `totalSakuraPetalKeepsakesDropped`, `sakuraPetalKeepsakeFirstPressed`).
- **Total achievements: 79.**
- Renderer grew from ~27,554 to ~28,128 lines (+~574 lines).

### Thoughts for next cycle
- **Summer night signature event** — the *last* remaining seasonal night gap now that autumn/winter/spring all have their signature moons + keepsakes. Highest-impact next step. Options: (a) **fireworks show** — rising rockets that bloom into colored radial sparkles, click each bloom before it fades to "catch the finale" (4-stage arc: rise → bloom → catch → blessing); (b) **sea of fireflies over a tide pool** — denser than existing firefly feature, forming a slow drift that culminates in a firefly-cloud blessing; (c) **shooting-star meteor shower** — scale up the existing meteor feature into a signature event; (d) **paper lanterns on a summer river** — drift downstream, click to light each one, all lit triggers a river blessing. Option (a) or (d) follows the 4-stage template most directly. Completing summer-night would finish the four-season night vocabulary — this is the single most thematically important remaining feature.
- **Summer keepsake drop** — whatever summer-night event ships should also drop a keepsake following the proven 4-stage arc (rise → interact → bless → drop). Candidates: a small glass firework-fragment charm, a preserved firefly in a paper jar, a single meteor-glass stone, or a folded paper-boat from the lantern river. Would finally complete the full four-season 4-stage keepsake cycle.
- **Moon-family / keepsake-family gallery UI** — a small pop-up showing the four seasonal moons (harvest amber, snow silver, cherry pink, future summer) side-by-side with blessing counters under each, OR a keepsake gallery with the three keepsake sprites (mooncake, snowflake, sakura petal) and press/share/treasure counters. Would give returning players a visual sense of seasonal progress and reward parity.
- **Blue moon rarity** — 1-5% chance any seasonal moon arrives as a "blue moon" variant with a deeper indigo tint, a unique blue-tinted keepsake, and a "Blue Moon" achievement. Plays on the idiom and gives returning players a rare hook across all four seasons.
- **Golden harvest-moon keepsake / rose-gold cherry-moon keepsake / platinum snowflake keepsake** — rare gilded versions of each keepsake with their own rare-drop speech. Adds collection depth without requiring new mechanics.
- **Cherry moon + hanami dango** — after blessing, a 3-color dango stick (pink/white/green) appears as a shareable spring treat. Parallel to mooncake for the harvest moon but specifically *food* rather than a second *memento*.
- **Cherry moon + paper lantern rise** — small floating sky lanterns released after blessing drift up into the sky (would cross-over with the long-listed "lantern release ritual" feature).
- **Aurora + any moon cross-event** — if aurora is active during a seasonal moon, the sky paints both simultaneously and the blessing audio adds aurora shimmer. First cross-weather-event bloom in the game.
- **Shooting star during cherry moon / snow moon** — rare chance a shooting star streaks past during the festival window, worth a tiny wish bonus if clicked.
- **Crane pair** — rare chance 2 cranes spawn side-by-side (cranes pair for life).
- **Golden crane variant** — 1-in-20 crane is gilded gold for a rare spawn.
- **Cranes fly off after blessing** — wished cranes drift slowly off-screen rather than fading out, reinforcing the "wishes taking flight" metaphor visually.
- **Pet approaches the cherry moon / snow moon / harvest moon** — pet walks toward the moon and stretches up during the blessing. Pattern listed repeatedly but never shipped across multiple cycles.
- **Pet *holds* the sakura petal / snowflake keepsake / mooncake briefly** — visible receipt pattern where the pet carries the collected keepsake in its paws for a few seconds with a gentle glow before it fades. Visible reward beat, still unshipped.
- **Keepsake shelf** — small drawable shelf in the corner showing the last 1-3 keepsakes the pet has collected across all three (now four) keepsake types. Persistent visual reward UI.
- **Snowflake / petal / crane uniqueness detail** — procedurally-varied arm counts (4/6/8 snowflakes), branch patterns, petal counts (4/5/6 petals), or crane fold patterns so no two instances are identical.
- **Keepsake journal** — thumbnail gallery of every unique color variant collected.
- **Bunny pair / family** — rare chance 2-3 bunnies hop in together.
- **Bunny leaves a snow-bunny sculpture** — rare persistent ground object.
- **Female cardinal variant** — 1-in-5 chance cardinal spawns as buff-brown female.
- **Cardinal pair** — rare male + female side-by-side.
- **Cardinal on a branch** — occasional bare winter branch in the sky.
- **Chickadee / titmouse / junco / owl / fox / deer** — other creature visitors.
- **Seed feeder** — crafted/placed birdseed feeder attracting multiple bird species.
- **Spring swallow / ladybug visitor** — spring counterpart creatures to winter cardinal/bunny and autumn squirrel/fairy.
- **Cardinal feather keepsake** — rare chance cardinal drops a feather on departure (would fit the keepsake-drop pattern).
- **Golden-fairy variant / multiple fairies at once / fairy gift** — fairy ring expansions.
- **Mooncake variations** — lotus paste / red bean / salted egg yolk. Mooncake box / gift wrap.
- **Lantern release ritual** — lit harvest lanterns drift up (overlap with "cherry moon + paper lantern rise").
- **Squirrel steals an acorn / Acorn inventory screen / Butterfly on squirrel's tail / Raking animation**.
- **S'mores combo** — 3 perfect roasts → s'more treat next cocoa.
- **Seasonal festivals** — winter solstice / spring equinox / summer solstice.
- **Wind streaks on the chime / Firefly lantern / Constellation lore / Photo gallery / Fortune cookie tiers / Combo hints / Bedtime story continuation / Sound volume slider / Frog chorus / Nightlight colors / Weather forecast / Tide pools / Dream diary / Lucid dreaming / Winter tea party variant**.

### Current architecture notes
- Renderer is now ~28,128 lines.
- Sakura petal keepsake feature lives immediately after `drawCherryMoonCranes()` and before `WEATHER_CHANGE_MIN` (starts around line 16408).
- Key interface: `SakuraPetalKeepsake` (x, startX, startY, groundX, groundY, y, fallProgress, spin, flutterPhase, life, fadeIn, fadeOut, landed, landBounce, active, glowPulse, petalTimer, hueIndex).
- Only one sakura petal keepsake exists at a time (`sakuraPetalKeepsake: SakuraPetalKeepsake | null = null`).
- Key constants: `SAKURA_PETAL_KEEPSAKE_FALL_FRAMES = 180` (~3s), `SAKURA_PETAL_KEEPSAKE_LIFE = 2400` (~40s), fade-in 30f / fade-out 60f.
- Key functions: `spawnSakuraPetalKeepsake(startX, startY)`, `tryClickSakuraPetalKeepsake(x, y)`, `pressSakuraPetalKeepsake()`, `updateSakuraPetalKeepsake()`, `drawSakuraPetalKeepsake()`, `playSakuraPetalKeepsakeDropSound()`, `playSakuraPetalKeepsakeLandSound()`, `playSakuraPetalKeepsakePressSound()`.
- Keepsake click hitbox: circular `dx² + dy² < 110` (~10.5 px) while `landed && active`. Click routed in mousedown handler immediately after `tryClickSnowflakeKeepsake`.
- Rendering: `drawSakuraPetalKeepsake()` in ground layer immediately after `drawSnowflakeKeepsake()`.
- Update call: `updateSakuraPetalKeepsake()` in the main frame loop immediately after `updateCherryMoonFestival()`.
- Palette: `CHERRY_HUES[k.hueIndex]` — reuses the 4 cherry-moon crane color variants (soft pink 340°, warm peach 15°, paper white 0° sat 0, deeper rose 330°). Pollen center always warm cream-yellow `hsl(48, 85%, 82%)` regardless of petal hue for a unified sakura feel.
- Spawned from `blessCherryMoon()` at the moon's position immediately after the diary milestone entry is added.
- Save version still 1; added fields: `totalSakuraPetalKeepsakesPressed`, `totalSakuraPetalKeepsakesDropped`, `sakuraPetalKeepsakeFirstPressed`.
- Total achievements: 79 (added "sakura_petal_keeper" — press a sakura petal keepsake from a blessed cherry moon).
- `dailyActivityLog` now tracks 32 activities: ...`cherry_moon`, `sakura_petal`.
- `DREAM_TEMPLATES` + `SLEEP_TALK_CONTEXTUAL` extended to include "sakura_petal".
- `getContextualDreamIcons()` now includes "sakura_petal" (flower/heart/moon bias).
- Stats panel WEATHER section now shows sakura petal stats between CHERRY MOON and LIGHTNING BOLTS in soft `#FFD6E0` SAKURA PETALS row.
- Diary: one milestone per player (first press 🌸). Subsequent presses add "Pressed sakura petal keepsake #N~!" entries.
- Three of four seasonal-night 4-stage arcs are now complete: autumn (harvest moon → lanterns → mooncake), winter (snow moon → snowflakes → snowflake keepsake), spring (cherry moon → cranes → sakura petal keepsake). Summer-night remains the only major seasonal gap. Once summer-night ships a signature event + its keepsake drop, the game will have a full four-season seasonal-moon vocabulary with matched daytime-night parity and a keepsake payoff per season.
- The snowflake keepsake lands with a *left-bias* (w*0.2 + w*0.4 → 0.2-0.6) to echo the snow moon's left-bias; the sakura petal lands with a *right-bias* (w*0.4 + w*0.4 → 0.4-0.8) to echo the cherry moon's right-bias. Across a multi-season session, the two keepsakes visibly rest on opposite sides of the canvas.
