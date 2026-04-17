# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.91.0 — Visual Wind Chimes 🧬 Mutation (2026-04-17)

### What was done
- Added a visual wooden/metal wind chime that hangs from the top of the canvas during windy weather, giving the existing invisible `playWindyChime()` audio a visible home
- **🧬 Mutation** — broke from the winter-cluster (snowman/campfire/marshmallow/cocoa) that the last four cycles followed. NEXT.md had mostly suggested continuations of that cluster (s'mores, firefly lantern, pet approaches campfire); I took a different direction to give the weather system more visual depth
- Pendulum physics for 5 tubes (each with its own natural swing period), a central wooden clapper, and a decorative sail fin — all with proper spring-damped angular velocity
- Clapper-tube strike detection — when the clapper swings near a tube's angle, the tube flashes with a warm additive glow and receives an energy transfer
- Wind events feed visual impulses: `playWindGust()` applies soft pushes, `playWindyChime()` applies stronger coordinated pushes — hook added inside `updateAmbientWindSounds()`
- Click-to-nudge: strong skewed impulse based on click x-position (left click pushes left, right click pushes right), plays bright G-B-D-E airy major arpeggio, +2 happy/+1 care/+1 friendship XP with 3-second cooldown
- 7 tap speeches, diary entry on first touch, chime dream template, chime sleep-talks
- Stats panel entry in WEATHER section (taps + visits)
- Chime Keeper achievement #66 for 15 taps
- Total achievements: 66

### Thoughts for next cycle
- **S'mores combo** — still pending from last cycle: 3 perfect marshmallow roasts → unlock a s'more combo treat (graham+chocolate+marshmallow) the next time cocoa spawns. Natural food arc continuation.
- **Pet approaches campfire** — pet walks (canvas-space offset, not window-space — the pet rendering has `offsetX` hooks already) toward a lit campfire and sits closer to warm paws. Would make the scene feel inhabited.
- **Seasonal weather visuals beyond chimes** — dandelion puff during sunny spring daytime (click to blow seeds, make a wish), leaf pile during autumn windy (pet can jump into it for +happy), a ceiling fan or paper streamers during summer windy, etc.
- **Wind streaks on the chime** — optional extra: faint horizontal wind-streak particles that emit from near the chime's sail when a gust hits
- **More chime interactions** — drag a bubble over the chime to make it ring differently, or have a butterfly visit the chime briefly
- **Firefly lantern** — craft a lantern from caught fireflies that glows on the pet's head at night
- **Constellation lore** — clicking a completed constellation shows a short mythical story overlay
- **Photo gallery** — in-canvas gallery showing thumbnails of saved photos (requires new IPC to list photo files)
- **Fortune cookie rarity tiers** — golden fortune cookies with rare fortunes
- **Combo hint system** — subtle visual hints when partway through a combo sequence
- **Story continuation** — bedtime stories that span multiple nights with cliffhangers
- **Sound volume control** — a slider or levels for ambient sound volume
- **Frog chorus visual** — tiny frog silhouettes during evening chorus
- **Ice skating** — pet slides around on frozen puddles during cold weather
- **Nightlight color customization** — unlock different nightlight colors/styles
- **Weather forecast widget** — show upcoming weather so player can anticipate changes
- **Seasonal festivals** — special events during equinoxes and solstices with unique decorations
- **Tide pools** — interactive mini-scene during summer evenings with little sea creatures
- **Dream diary** — a separate section in the diary recording dream captions from each night
- **Lucid dreaming** — rare event where clicking a dream scene triggers a mini dream interaction
- **Winter tea party variant** — tea ceremony that happens during snowy weather, distinct from the existing tea party

### Current architecture notes
- Renderer is now ~19,950+ lines
- Wind chime feature lives immediately after `drawCocoa()` and before `WEATHER_CHANGE_MIN` (starts around line 9069)
- `WindChime` + `WindChimeTube` interfaces — tubes have `lengthPx`, `restX`, `swingAngle`, `swingVelocity`, `period`, `strikeGlow`, `color`. WindChime has `x`, `anchorY`, `barY`, `tubes`, `clapperAngle`, `clapperVelocity`, `sailAngle`, `hookSway`, `fadeIn`, `fadeOut`, `active`, `life`, `gustTimer`, `clickCooldown`
- Key functions: `spawnWindChime()`, `startWindChimeFadeOut()`, `applyChimeGust()`, `tryClickWindChime()`, `updateWindChime()`, `drawWindChime()`, `playChimeTapSound()`
- Position: `canvas.width * 0.32` horizontally (left of center — pet is at center, so no overlap), anchored at top edge, crossbar at y=24
- Spawn condition: windy weather active + no active chime + `Math.random() < 0.03` per frame (spawns within ~1-2 seconds of windy starting)
- Despawn: windy weather ends → `active = false`, fadeOut decays from 1 to 0 over 120 frames, then `activeWindChime = null`
- Click routing: wind chime click is checked BEFORE bubbles/drag (new handler inserted at line ~11463 in the event listener)
- Audio sync: `updateAmbientWindSounds()` at line 3158-3185 now calls `applyChimeGust()` with moderate (0.015-0.035) strength on wind gusts and stronger (0.025-0.055) on chime sound events
- Strike detection happens in `updateWindChime()` — when `|clapperAngle - tubeAngle| < 0.05` and clapper velocity is above threshold, the tube flashes and receives an energy transfer from the clapper
- Pentatonic visual layout: 5 tubes with lengths 34,28,24,30,38 — shorter tubes = higher visual pitch
- Tube period varies per tube: `0.04 + (i - 2) * 0.004 + Math.random() * 0.003` — shorter tubes have slightly faster natural periods
- Clapper has slightly slower period (0.035) and lower damping (0.988) than tubes (0.985) so it lingers — naturally creates the strike pattern
- Sail follows clapper with 0.1 lerp factor — gives a lagging, smooth motion
- Hit box: 48px wide, 60px tall — covers barY-8 to barY+52 — generous but not overlapping pet area
- Total achievements: 66
- dailyActivityLog now tracks 19 activities: fed, played, trick, petted, photo, fireflies, constellations, dewdrops, story, bottle, fortune, bubbles, meditation, tea, snowman, campfire, marshmallow, cocoa, chime
- Dream templates + sleep-talks extended to include "chime"
- Stats panel WEATHER section now shows chime stats between WIND SOUNDS and LIGHTNING BOLTS entries
- Save version is still 1; added fields: `totalChimeTaps`, `totalChimeSessions`, `chimeFirstTouched`
