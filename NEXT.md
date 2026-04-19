# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.101.0 — Snow Moon Festival (2026-04-19)

### What was done
- Added the **Snow Moon Festival** — a rare winter-night signature event where an oversized pale silvery-blue full moon rises into the sky alongside 4-6 paper snowflakes drifting in the upper air. Player catches every snowflake → Snow Moon Blessing (cool pentatonic arpeggio + silver sparkle fountain + wind-whisper noise). Mirror of v0.97 Harvest Moon Festival, but winter-themed: cool silver palette, drifting (not tethered) snowflakes, A-minor pentatonic chime, spatially left-biased.
- **Fills the long-standing "winter has NO night signature event" gap** that every prior NEXT.md cycle kept flagging as the biggest remaining winter gap. Winter now has: cardinal (sky, daytime), bunny (ground, daytime), **snow moon (sky, night)**. Autumn night parity achieved.
- **Pale silvery-blue moon** (radius 22-26 px) with radial gradient `#F2F8FF → #4A6890`, 3 cool-toned craters, upper-left specular highlight, silvery breathing halo pulsing at `sin(frame * 0.018)` (slightly slower than harvest moon's 0.02 so the snow moon reads as cooler/more contemplative). Cubic ease-out rise from 50 px below resting position over 10 seconds.
- **Paper snowflakes** — 4-6 scattered across upper air, each a 6-armed radial paper snowflake with two pairs of perpendicular branches at 40%/70% along each arm + tiny diamond tips + hexagonal center hub. Independent `bobPhase/bobSpeed` for drift + `rotation/rotSpeed` for slow rotation (0.003-0.008 rad/frame, random direction). 4 color variants: icy-blue / pale-lavender / pearl-white / frosty-mint.
- **Click to catch** (~10 px circular hitbox): E6+B6 triangle-wave frost-chime + B7 shimmer, 10 sparkle particles, the flake "freezes" from muted paper-grey to full glowing color over ~25 frames. +1 happy / +1 XP, 50% speech.
- **Snow Moon Blessing** (catch all flakes): A-minor pentatonic arpeggio (A5-C6-E6-A6-C7-E7) + B7 shimmer + high-filtered noise *wind whisper* (this is the single most distinctive audio beat — it turns the blessing from "a bell rang" into "the winter sky exhaled"). 32 sparkle + 10 snowflake particles fountain from moon, silver halo pulse ~12s, +5 happy / +3 care / +5 XP, special speech.
- **Lifecycle**: 2-min natural life, fades in/out 3s each, early-exit on inappropriate weather/time/season/sleep before blessing (blessed festivals finish undisturbed).
- **Spawn**: `canSpawnSnowMoonFestival()` requires no existing snow moon, not sleeping, winter, night, not stormy/rainy (allows clear/cloudy/snowy — snow falling alongside the snow moon is part of the magic). Per-frame `Math.random() < 0.00012` (same rarity as harvest moon).
- **Persistence**: `totalSnowMoonsSeen`, `totalSnowflakesCaught`, `totalSnowMoonsBlessed`, `snowMoonFirstSeen`, `snowMoonFirstBlessed`.
- **Stats panel**: SNOW MOON row in WEATHER section between SNOW BUNNIES and LIGHTNING BOLTS in cool `#BCD4F0`.
- **Achievement #76 "Snow Moon Blessed"** — catch every snowflake under a snow moon (single-completion, scaled to Moon Blessed).
- **Two diary milestones**: first sighting 🌕 + first blessing 🌕.
- **Dream template + sleep-talk + contextual dream icons** all added for "snow_moon" (moon/star/heart bias).
- **Click handler**: `tryClickSnowflake(clickX, clickY)` added in the mousedown handler between `tryClickHarvestLantern` and `tryClickMooncake`.
- **Draw calls**: `drawSnowMoonSky()` added near `drawHarvestMoonSky()` in the sky layer (before pet); `drawSnowMoonCrystals()` added near `drawHarvestLanterns()` in the upper-air layer (above pet).
- **Total achievements: 76.**
- Renderer grew to ~26,070 lines (+~610 lines).

### Thoughts for next cycle
- **Snowflake keepsake drop** — after the blessing, a snowflake-crystal keepsake arcs down from the moon (like mooncake from harvest moon) and lands as a persistent collectible the pet can nibble or carry. This completes the parity — harvest-moon → mooncake, so snow-moon → snowflake keepsake. Feels like the most natural immediate follow-up.
- **Spring night signature event** — cherry-blossom moon? Fireflies forming short-lived constellations? Matches autumn's harvest moon + winter's (now-shipped) snow moon. Spring still has mostly day features and is missing a memorable night moment.
- **Summer night signature event** — fireworks show? Sea of fireflies over a small tide pool? Complete the four-season night vocabulary.
- **Blue moon rarity** — very rare (1%) variant where the snow moon arrives as a true "blue moon" with a deeper indigo tint + unique reward. Plays on the idiom and gives returning players a collect-the-rare hook.
- **Aurora + snow moon cross-event** — if aurora is active during a snow moon, the sky paints both simultaneously and the blessing audio adds aurora shimmer. Currently nothing cross-triggers; this would be the first cross-weather-event bloom.
- **Shooting star during snow moon** — rare chance a shooting star streaks past the snow moon during its active window, worth a tiny wish bonus if clicked.
- **Snowflake uniqueness detail** — each snowflake in a session renders with procedurally-varied arm counts (4/6/8) or branch patterns so no two flakes are identical. Currently all are 6-armed with uniform branches.
- **Snowflake collection journal** — show thumbnail of every unique snowflake color variant caught, like fortune cookies / cloud shapes / constellations. Would need a small gallery screen.
- **Pet approaches the snow moon** — pet walks toward the moon and stretches up on tiptoe during the blessing sequence. Mirrors "pet approaches" pattern across moon/bunny/cardinal.
- **Pet approaches the bunny** — when bunny pauses close to the pet, pet waddles/hops toward her for a tiny nose-touch animation. Listed prior cycle; still open.
- **Bunny pair / family** — rare chance 2-3 bunnies hop in together.
- **Bunny leaves a small snow-bunny sculpture** — rare persistent ground object.
- **Female cardinal variant** — 1-in-5 chance cardinal spawns as buff-brown-plumage female (real-cardinal sexual dimorphism). Prior NEXT.md entry, still open.
- **Cardinal pair** — rare male + female side-by-side (cardinals pair for life).
- **Cardinal on a branch** — occasional bare winter branch in the sky.
- **Chickadee / titmouse / junco** — other winter birds with distinct calls.
- **Seed feeder** — crafted/placed birdseed feeder attracting multiple bird species over time.
- **Fox visitor** — rare red fox at twilight.
- **Deer visitor** — tall graceful background-layer creature (new spatial register).
- **Owl visitor** — night-only winter bird that hoots once and leaves. Now less urgent since snow moon fills winter-night, but owl is still a character visitor distinct from a sky event.
- **Cardinal feather keepsake** — rare chance cardinal drops a feather.
- **Cardinal + bunny cross-encounter** — scripted dual-spawn moment.
- **Golden-fairy variant** — 1-in-20 gold fairy from fairy ring.
- **Multiple fairies at once** — rare chance 2 fairies per ring.
- **Fairy gift / keepsake** — rare heart-shaped petal accessory after greeting.
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
- Renderer is now ~26,070 lines.
- Snow moon feature lives immediately after the snow bunny block and before `WEATHER_CHANGE_MIN` (starts around line 14476, right after the old bunny code ends).
- Key interfaces: `SnowflakeCrystal` (x, y, bobPhase, bobSpeed, rotation, rotSpeed, caught, catchAnim, hue, sparkleTimer), `SnowMoonFestival` (moonCx, moonCy, moonRadius, riseProgress, life, fadeIn, fadeOut, crystals, blessed, blessGlow, blessTimer, ambientSparkleTimer).
- Only one snow moon festival exists at a time (`snowMoonFestival: SnowMoonFestival | null = null`).
- Key constants: `SNOW_MOON_FADE_IN/OUT = 180`, `SNOW_MOON_LIFE = 7200`, `SNOW_MOON_RISE_DURATION = 600`.
- Key palette: `SNOWFLAKE_HUES` with 4 variants (icy-blue 200°, pale-lavender 260°, pearl-white 0° sat 0, frosty-mint 170°).
- Key functions: `canSpawnSnowMoonFestival()`, `spawnSnowMoonFestival()`, `getSnowflakeX/Y(c)`, `tryClickSnowflake(x,y)`, `catchSnowflake(i)`, `blessSnowMoon()`, `updateSnowMoonFestival()`, `drawSnowMoonSky()`, `drawSnowflakeCrystal()`, `drawSnowMoonCrystals()`, `playSnowflakeCatchSound()`, `playSnowMoonBlessing()`.
- Snowflake click hitbox: circular `dx² + dy² < 100` (~10 px radius). Only clickable while not caught and festival not blessed and fadeIn >= 0.4. Click routed in mousedown handler between `tryClickHarvestLantern` and `tryClickMooncake`.
- Rendering: `drawSnowMoonSky()` called near `drawHarvestMoonSky()` in the sky layer (behind pet); `drawSnowMoonCrystals()` called near `drawHarvestLanterns()` in the upper-air layer (above pet). Both are after their harvest-moon counterparts.
- Bless flow: all snowflakes caught → `blessSnowMoon()` fires pentatonic arpeggio + shimmer + noise wind-whisper, 32 sparkle + 10 snowflake particles fountain, sets `blessed=true / blessGlow=1 / blessTimer=0`, decays over ~120 frames of ambient continuous sparkles/snowflakes from the moon.
- Weather allowed: clear/cloudy/snowy (rejects stormy + rainy). Season: winter only. Time: night only.
- Save version still 1; added fields: `totalSnowMoonsSeen`, `totalSnowflakesCaught`, `totalSnowMoonsBlessed`, `snowMoonFirstSeen`, `snowMoonFirstBlessed`.
- Total achievements: 76 (added "snow_moon_blessed" — catch every snowflake under a snow moon).
- dailyActivityLog now tracks 29 activities: fed, played, trick, petted, photo, fireflies, constellations, dewdrops, story, bottle, fortune, bubbles, meditation, tea, snowman, campfire, marshmallow, cocoa, chime, dandelion, leafpile, squirrel, mushroom, fairy, harvest_moon, mooncake, cardinal, bunny, snow_moon.
- DREAM_TEMPLATES + SLEEP_TALK_CONTEXTUAL extended to include "snow_moon".
- `getContextualDreamIcons()` now includes "snow_moon" (moon/star/heart bias).
- Stats panel WEATHER section now shows snow moon stats between SNOW BUNNIES and LIGHTNING BOLTS in cool `#BCD4F0` SNOW MOON row.
- Diary: two milestones per player: first sighting 🌕 and first blessing 🌕. Subsequent blessings add ongoing "Snow moon blessing #N~!" entries (matches harvest moon's pattern).
- The harvest moon + snow moon now form a matched seasonal pair — both ~0.00012/frame spawn rate, both 2-min lifespan, both click-N-objects-to-bless pattern, both yield moon-themed dreams. Future spring/summer night events should follow this same template to complete a 4-season night signature event set.
