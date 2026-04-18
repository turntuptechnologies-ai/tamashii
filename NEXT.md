# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.98.0 — Mooncake Reward Drop (2026-04-18)

### What was done
- Added the **Mooncake reward drop** — after every Harvest Moon Blessing, a traditional Chinese mooncake (月餅) now spawns at the moon's position and arcs gracefully down to the ground as a tangible harvest-night gift.
- Mooncake arcs from the moon with a parabolic fall (quadratic ease-out on x, t² on y, plus a small `sin(t*π) * -8` hump), rotational spin during the drop (+0.08 rad/frame), and lands with a 6-particle dust puff + warm low-sine landing thump (160→90Hz).
- Descending chime on drop: G6→E6→C6→A5 sine twinkle-glissando, 0.08s spacing, ~0.32s per tone.
- Traditional mooncake sprite ~14×8 px: golden-brown pastry body + lighter top surface (dual radial gradients), 4-petal lotus imprint traced as quadratic Béziers from center, amber-yolk stamped center dot, 8 cream-colored fluted-edge rim dots, upper-left specular highlight.
- Warm pulsing amber halo (`rgba(255, 200, 110, 0.4)` → transparent, 10-13px pulse) while landed + active; inviting "share 🥮" hint blinking above until first share.
- Click (~9px circular hitbox) to share: ascending warm E5-G5-C6 triangle arpeggio + low A3 body sustain, 14 sparkle particles + 3 golden hearts floating up, +6 happy / +20 hunger / +2 care / +4 friendship XP, contextual share speech (6 variants).
- Mooncake spawns with 70% chance of a sighting speech (4 variants) and lingers ~40s on ground before fading out (60f); fades out faster if pet sleeps.
- Achievement #73 "Mooncake Keeper" — share a mooncake from a blessed harvest moon.
- Diary milestone on first share; subsequent shares add shorter "Shared mooncake #N~!" entries.
- "mooncake" added to DREAM_TEMPLATES + SLEEP_TALK_CONTEXTUAL (3 sleep-talks); also finally added the missing "harvest_moon" bias to `getContextualDreamIcons()` (moon/star/heart) that was noted in last cycle's NEXT.md but never actually implemented.
- Stats panel entry in WEATHER section between HARVEST MOON and LIGHTNING BOLTS in warm `#E8B880` MOONCAKES row showing shared + dropped counts.
- Full persistence (totalMooncakesShared, totalMooncakesDropped, mooncakeFirstShared).
- Total achievements: 73.
- Renderer grew to ~23,830 lines (+~320 lines).

### Thoughts for next cycle
- **Golden-fairy variant** — 1-in-20 chance of a gold fairy emerging from a fairy ring with bigger rewards + unique speech + possibly its own achievement.
- **Multiple fairies at once** — rare chance of 2 fairies per ring completion, orbiting opposite phases of the same figure-8.
- **Fairy gift / keepsake** — after greeting, small chance fairy drops a heart-shaped petal the pet carries (persistent accessory unlock).
- **Hedgehog / snow bunny visitor for winter** — second small visitor paralleling the squirrel; snow bunny (yukiusagi) would fit Japanese winter tradition nicely; hedgehog is also cute but hibernates so less authentic. Winter has NO creature visitors currently — big gap.
- **Winter cardinal / redbird** — a bright red bird that lands on the ground or a tree branch during snowy/winter weather, nibbles at seeds, chirps, and flies away. Iconic winter creature.
- **Winter night signature event** — a snow moon analog to harvest moon? Ice lanterns? Paper snowflakes drifting from the sky you can pop? Winter nights lack a signature big event.
- **Spring night signature event** — cherry-blossom moon? Fireflies that form short-lived constellations?
- **Mooncake variations** — lotus paste, red bean, salted egg yolk — different mooncakes with different small rewards, chosen randomly each drop (would add collecting variety to what is currently a single mooncake reward).
- **Mooncake box / gift wrap** — rare chance the mooncake arrives wrapped in a little gift box that must be opened first.
- **Harvest moon lantern persistence** — rare chance a lit lantern stays in the sky the next few nights as a keepsake.
- **Lantern release ritual** — lit lanterns drift up into the sky and disappear as wish-release (Chinese sky lantern festival).
- **Squirrel steals an acorn** — small chance squirrel sniffs a leftover acorn and snatches it back.
- **Acorn inventory screen** — a hoard-view showing total acorn count with a basket visual.
- **Pet approaches interactive objects** — pet walks toward the mushroom ring / campfire / leaf pile / squirrel / lanterns / mooncake (short wander-behavior override). This would pair beautifully with the mooncake: pet could walk to the mooncake and "nibble" it instead of just poofing away on click.
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
- Renderer is now ~23,830 lines.
- Mooncake feature lives immediately after the Harvest Moon Festival block and before `WEATHER_CHANGE_MIN` (starts around line 12677 post-harvest-moon-block).
- Key interface: `Mooncake` (x, startX, startY, groundX, groundY, y, arcProgress, bounce, bouncePhase, spin, life, fadeIn, fadeOut, landed, active, sway, glowPulse).
- Only one mooncake exists at a time (`mooncake: Mooncake | null = null`). Spawn is triggered exclusively by `blessHarvestMoon()` — there is no random per-frame spawn check. So mooncakes are gated on harvest moon blessings, which are gated on `canSpawnHarvestMoonFestival()` + `Math.random() < 0.00012` per frame (~1 per autumn night session).
- Key functions: `spawnMooncake(startX, startY)` (called from `blessHarvestMoon()`), `tryClickMooncake(x, y)`, `shareMooncake()`, `updateMooncake()`, `drawMooncake()`, `playMooncakeDropSound()`, `playMooncakeLandSound()`, `playMooncakeShareSound()`.
- Mooncake click hitbox: circular `dx² + dy² < 81` (~9px radius). Click routed in mousedown handler AFTER fairy + harvest-lantern checks, BEFORE mushroom ring check.
- Rendering: `drawMooncake()` called in the ground layer after `drawMushroomRing()` — the mooncake renders behind the pet when landed, but during the falling arc phase its y-coordinate is in the upper canvas (near the moon) so it naturally appears to be in the sky/midair during flight. Draw call order matters for the landed state.
- Lifecycle: arc phase uses `arcProgress` 0→1 over 90 frames (~1.5s), with `eased = 1 - (1-t)²` for x and `t²` for y plus `sin(t*π) * -8` hump. After `arcProgress >= 1`, `landed = true`, plays landing sound, 6-particle dust puff, begins `bouncePhase` 1→0 squash-bounce animation at -0.04/frame.
- Save version still 1; added fields: `totalMooncakesShared`, `totalMooncakesDropped`, `mooncakeFirstShared`.
- Total achievements: 73 (added "mooncake_keeper" — share a mooncake from a blessed harvest moon, single completion).
- dailyActivityLog now tracks 26 activities: fed, played, trick, petted, photo, fireflies, constellations, dewdrops, story, bottle, fortune, bubbles, meditation, tea, snowman, campfire, marshmallow, cocoa, chime, dandelion, leafpile, squirrel, mushroom, fairy, harvest_moon, mooncake.
- DREAM_TEMPLATES + SLEEP_TALK_CONTEXTUAL extended to include "mooncake".
- `getContextualDreamIcons()` finally includes "harvest_moon" (moon/star/heart) + "mooncake" (food/moon/heart) — fixed missing harvest_moon entry while adding mooncake.
- Stats panel WEATHER section now shows mooncake stats between HARVEST MOON and LIGHTNING BOLTS in a warm `#E8B880` MOONCAKES row.
- Diary: two milestones per player: first share (🥮) and ongoing "Shared mooncake #N~!" entries.
