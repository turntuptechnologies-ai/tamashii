# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.102.0 — Snowflake Keepsake Drop (2026-04-19)

### What was done
- Added the **Snowflake Keepsake Drop** — after every Snow Moon Blessing, an oversized crystalline snowflake falls from the silver moon and lands as a collectible on the ground. Click to "treasure" it with the pet: cool silver arpeggio + sparkle/snowflake/heart particle bloom + happiness/care/XP (no hunger — it's a memory keepsake, not food). Completes the harvest-moon → mooncake ↔ snow-moon → snowflake-keepsake parity that NEXT.md's #1 suggestion flagged last cycle.
- **Falls differently from the mooncake**: real-snowflake sway (horizontal sine drift tapering as it approaches the ground), slow rotation (0.05 rad/frame), feather-light accelerating descent over 2.3s. Mooncake uses parabolic arc + hump + fast spin; keepsake uses sway + gentle drift so the two drops read as distinct physics even though they both arc down from a moon.
- **Cool glockenspiel drop chime** — E7→C7→A6→F6 triangle waves + sustained B7 sine shimmer through the whole fall. Mooncake uses G6→E6→C6→A5 warm sine glissando; keepsake is higher / cooler / triangle-sharp / with a sparkling harmonic.
- **Crystalline triangle "tink" on landing** — not a warm low-sine thump. A weightless snowflake shouldn't thud. Short C7→G6 triangle glide + high bandpass-filtered noise tail for frost texture.
- **Silvery-blue halo + persistent ambient sparkles** — keepsake emits a tiny rising sparkle from its rim every 40-75 frames while landed. First reward drop in the game with ongoing ambient emission (mooncake sits still with only a pulsing halo).
- **Color continuity** — picks a random palette from `SNOWFLAKE_HUES` (same 4 sky-snowflake hues: icy-blue 200°, pale-lavender 260°, pearl-white 0° sat 0, frosty-mint 170°). Halo, inner core glow, rim diamonds, and center hub all tint to the chosen hue so the keepsake visually reads as a bigger cousin of the sky crystals the player just caught.
- **Treasure verb, not share** — deliberately chosen to mark this as a memento action rather than a food action. Opens a new interaction category for future keepsake-style drops (fairy petal, cardinal feather, acorn hoard trinket).
- **No hunger stat grant** — just +5 happy / +2 care / +4 XP. Differentiates it from the mooncake (+20 hunger feast). Mooncake is a *harvest feast*, keepsake is a *crystal memory*.
- **Lifecycle**: ~40s on ground before fading out, fades faster if pet sleeps, 70% chance of sighting speech on spawn.
- **Persistence**: `totalSnowflakeKeepsakesTreasured`, `totalSnowflakeKeepsakesDropped`, `snowflakeKeepsakeFirstTreasured`.
- **Stats panel**: SNOWFLAKE KEEPSAKES row in WEATHER section between SNOW MOON and LIGHTNING BOLTS in soft `#D6E6FA`.
- **Achievement #77 "Snowflake Keeper"** — treasure one keepsake from a blessed snow moon (single-completion, matches Mooncake Keeper tier).
- **Diary milestone** — first treasure + ongoing "Treasured snowflake keepsake #N~!" entries.
- **Dream template + sleep-talk + contextual dream icons** all added for "snowflake_keepsake".
- **Click handler**: `tryClickSnowflakeKeepsake(clickX, clickY)` added in the mousedown handler immediately after `tryClickMooncake`.
- **Draw call**: `drawSnowflakeKeepsake()` added immediately after `drawMooncake()` in the ground layer.
- **Update call**: `updateSnowflakeKeepsake()` added immediately after `updateSnowMoonFestival()` in the main frame loop.
- **Spawn hook**: `spawnSnowflakeKeepsake(fest.moonCx, fest.moonCy)` called inside `blessSnowMoon()` after the blessing plays out.
- **Total achievements: 77.**
- Renderer grew from ~26,182 to ~26,668 lines (+~486 lines).

### Thoughts for next cycle
- **Spring night signature event** — cherry-blossom moon? Fireflies forming short-lived constellations that trace out a familiar constellation once caught? Matches autumn's harvest moon + winter's snow moon. Spring still has mostly day features and is *the* biggest remaining night gap now that winter is filled.
- **Summer night signature event** — fireworks show? Sea of fireflies over a small tide pool? Shooting-star meteor shower? Complete the four-season night vocabulary. After spring ships, this is the last remaining seasonal night event.
- **Blue moon rarity** — 1-5% chance the snow moon arrives as a true "blue moon" with a deeper indigo tint, a unique blue-tinted keepsake, and a "Blue Moon" achievement. Plays on the idiom and gives returning players a rare hook.
- **Golden harvest-moon keepsake** — rare chance the mooncake is replaced by a special lotus-stamped version with a gold yolk. Parallel for the mooncake side.
- **Aurora + snow moon cross-event** — if aurora is active during a snow moon, the sky paints both simultaneously and the blessing audio adds aurora shimmer. Would be the first cross-weather-event bloom.
- **Shooting star during snow moon** — rare chance a shooting star streaks past the snow moon during its active window, worth a tiny wish bonus if clicked.
- **Snowflake uniqueness detail** — each snowflake in a session renders with procedurally-varied arm counts (4/6/8) or branch patterns so no two flakes are identical. Currently all are 6-armed with uniform branches.
- **Snowflake keepsake gallery** — show thumbnails of every keepsake hue treasured (4 variants). Small collect-the-palette goal.
- **Snowflake collection journal** — show thumbnail of every unique snowflake color variant *caught* (different from treasured). Would need a small gallery screen.
- **Pet approaches the snow moon** — pet walks toward the moon and stretches up on tiptoe during the blessing sequence. Mirrors "pet approaches" pattern that's been listed repeatedly but never shipped.
- **Pet approaches the bunny** — when bunny pauses close to the pet, pet waddles/hops toward her for a tiny nose-touch animation. Listed prior cycle; still open.
- **Pet approaches the keepsake** — instead of clicking, the pet waddles over to the keepsake and picks it up, then looks at the player with it held in its paws. Makes the treasure action feel more earned.
- **Pet *holds* the keepsake briefly** — after treasuring, the pet visibly holds the snowflake crystal in its paws for a few seconds with a little glow before it fades, rather than the keepsake just vanishing into sparkles. Would be a "visible receipt" of the reward.
- **Keepsake shelf** — small drawable shelf in the corner showing the last 1-3 keepsakes the pet has treasured. Persistent visual reward.
- **Bunny pair / family** — rare chance 2-3 bunnies hop in together.
- **Bunny leaves a small snow-bunny sculpture** — rare persistent ground object.
- **Female cardinal variant** — 1-in-5 chance cardinal spawns as buff-brown-plumage female. Listed repeatedly; still open.
- **Cardinal pair** — rare male + female side-by-side (cardinals pair for life).
- **Cardinal on a branch** — occasional bare winter branch in the sky.
- **Chickadee / titmouse / junco** — other winter birds with distinct calls.
- **Seed feeder** — crafted/placed birdseed feeder attracting multiple bird species over time.
- **Fox visitor** — rare red fox at twilight.
- **Deer visitor** — tall graceful background-layer creature (new spatial register).
- **Owl visitor** — night-only winter bird that hoots once and leaves. Less urgent now snow moon fills winter-night, but owl is still a character visitor distinct from a sky event.
- **Cardinal feather keepsake** — rare chance cardinal drops a feather on departure. Would use the new "treasure" verb category opened by the snowflake keepsake.
- **Cardinal + bunny cross-encounter** — scripted dual-spawn moment.
- **Golden-fairy variant** — 1-in-20 gold fairy from fairy ring.
- **Multiple fairies at once** — rare chance 2 fairies per ring.
- **Fairy gift / keepsake** — rare heart-shaped petal accessory after greeting. Another "treasure" category candidate.
- **Mooncake variations** — lotus paste / red bean / salted egg yolk.
- **Mooncake box / gift wrap** — rare chance mooncake arrives wrapped.
- **Lantern release ritual** — lit harvest lanterns drift up into the sky.
- **Squirrel steals an acorn** — small chance squirrel sniffs a leftover acorn and snatches it back.
- **Acorn inventory screen** — hoard-view with basket visual.
- **Butterfly lands on squirrel's tail** — cross-feature interaction.
- **Raking animation** — rake scattered leaves back into a pile.
- **S'mores combo** — 3 perfect roasts → s'more treat next cocoa.
- **Seasonal festivals** — winter solstice / spring equinox / summer solstice.
- **Wind streaks on the chime** — faint horizontal wind-streak particles during gusts.
- **Firefly lantern** — craft a lantern from caught fireflies.
- **Constellation lore** — short mythical story overlay on completed constellation click.
- **Photo gallery** — in-canvas gallery showing thumbnails of saved photos.
- **Fortune cookie rarity tiers** — golden fortune cookies with rare fortunes.
- **Combo hint system** — subtle visual hints when partway through a combo.
- **Bedtime story continuation** — stories spanning multiple nights with cliffhangers.
- **Sound volume slider** — ambient sound volume control.
- **Frog chorus visual** — tiny frog silhouettes during evening chorus.
- **Nightlight color customization** — different nightlight colors/styles.
- **Weather forecast widget** — show upcoming weather.
- **Tide pools** — interactive mini-scene during summer evenings.
- **Dream diary** — separate section in diary recording dream captions.
- **Lucid dreaming** — rare event where clicking a dream scene triggers a mini dream interaction.
- **Winter tea party variant** — tea ceremony during snowy weather.

### Current architecture notes
- Renderer is now ~26,668 lines.
- Snowflake keepsake feature lives immediately after `drawSnowMoonCrystals()` and before `WEATHER_CHANGE_MIN` (starts around line 15140).
- Key interfaces: `SnowflakeKeepsake` (x, startX, startY, groundX, groundY, y, fallProgress, spin, swayPhase, life, fadeIn, fadeOut, landed, landBounce, active, glowPulse, sparkleTimer, hueIndex).
- Only one keepsake exists at a time (`snowflakeKeepsake: SnowflakeKeepsake | null = null`).
- Key constants: `SNOWFLAKE_KEEPSAKE_FALL_FRAMES = 140` (~2.3s), `SNOWFLAKE_KEEPSAKE_LIFE = 2400`, `SNOWFLAKE_KEEPSAKE_FADE_IN/OUT = 30/60`.
- Key functions: `spawnSnowflakeKeepsake(startX, startY)`, `tryClickSnowflakeKeepsake(x, y)`, `treasureSnowflakeKeepsake()`, `updateSnowflakeKeepsake()`, `drawSnowflakeKeepsake()`, `playSnowflakeKeepsakeDropSound()`, `playSnowflakeKeepsakeLandSound()`, `playSnowflakeKeepsakeTreasureSound()`.
- Keepsake click hitbox: circular `dx² + dy² < 100` (~10 px). Only clickable while `landed && active`. Click routed in mousedown handler immediately after `tryClickMooncake`.
- Rendering: `drawSnowflakeKeepsake()` called immediately after `drawMooncake()` in the ground layer (behind pet).
- Update call: `updateSnowflakeKeepsake()` called in the main frame loop immediately after `updateSnowMoonFestival()`.
- Spawn: triggered inside `blessSnowMoon()` as the final line before `checkAchievements()`/`saveGame()`, mirroring how `spawnMooncake()` is spawned from `blessHarvestMoon()`.
- Palette: `SNOWFLAKE_HUES[k.hueIndex]` — one of 4 sky-snowflake variants picked per spawn.
- Lifespan: ~40s on ground before fading out; fades faster if pet sleeps.
- No hunger stat grant (differentiates from mooncake +20 hunger). Grants +5 happy / +2 care / +4 XP.
- Save version still 1; added fields: `totalSnowflakeKeepsakesTreasured`, `totalSnowflakeKeepsakesDropped`, `snowflakeKeepsakeFirstTreasured`.
- Total achievements: 77 (added "snowflake_keeper" — treasure one keepsake from a blessed snow moon).
- dailyActivityLog now tracks 30 activities: fed, played, trick, petted, photo, fireflies, constellations, dewdrops, story, bottle, fortune, bubbles, meditation, tea, snowman, campfire, marshmallow, cocoa, chime, dandelion, leafpile, squirrel, mushroom, fairy, harvest_moon, mooncake, cardinal, bunny, snow_moon, snowflake_keepsake.
- `DREAM_TEMPLATES` + `SLEEP_TALK_CONTEXTUAL` extended to include "snowflake_keepsake".
- `getContextualDreamIcons()` now includes "snowflake_keepsake" (heart/star/moon bias).
- Stats panel WEATHER section now shows keepsake stats between SNOW MOON and LIGHTNING BOLTS in soft `#D6E6FA` SNOWFLAKE KEEPSAKES row.
- Diary: one milestone per player (first treasure ❄️). Subsequent treasures add ongoing "Treasured snowflake keepsake #N~!" entries (mirrors mooncake's pattern).
- The harvest moon + mooncake + snow moon + snowflake keepsake now form a matched seasonal pair of 4-stage festivals — both spawn rare, both bless on completion, both drop a gift the player collects. Future spring/summer night events should follow this 4-stage template (rare spawn → interact → bless → collectible drop).
