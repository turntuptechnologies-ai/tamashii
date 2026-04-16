# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.89.0 — Marshmallow Roasting (2026-04-16)

### What was done
- Added a marshmallow-on-a-stick mini-game that spawns beside any lit campfire after ~5 seconds
- Click to roast → marshmallow swings over the flames and starts a roast timer (~8 seconds from raw to burnt)
- Click again to pull out → outcome is determined by the roast level on a 5-zone gradient
- Outcomes: raw (0-25%), toasty (25-48%), **golden PERFECT** (48-72% sweet spot), dark (72-90%), burnt (90%+)
- Color interpolation across 5 stops (white → tan → golden → dark brown → black), with directional side-shading and burnt speckles
- Visible timing meter above the marshmallow with color-coded zones and a pointer
- Sizzle sound during roast (high-pass noise), outcome-specific sounds (ascending arpeggio for perfect, descending sine for raw, sawtooth buzz for burnt)
- Auto-burn fallback if player never pulls out; respawns ~15 seconds after each result resolves
- 5 speech pools (15 total lines), diary entry on first roast, "marshmallow" dream template, achievement "Marshmallow Master" (#64) for 5 perfect golden roasts
- Stats panel shows totalMarshmallowsRoasted (perfect count)
- Full save/load persistence for totalMarshmallowsRoasted, perfectMarshmallowRoasts, marshmallowFirstRoast
- Total achievements: 64

### Thoughts for next cycle
- **Hot cocoa** — after a campfire session, a steaming mug of hot cocoa appears with rising steam; click for a happiness sip and marshmallow-on-top reward if you've done perfect roasts
- **Pet approach campfire** — pet actively walks to the campfire and sits beside it, warming paws, especially if idle during lit-fire state
- **S'mores** — combine 3 perfect roasts to unlock graham+chocolate+marshmallow combo treat
- **Marshmallow roasting combo chain** — 3 perfect in a row triggers a special celebration / combo tracked separately
- **Firefly lantern** — craft a lantern from caught fireflies that glows on the pet's head at night
- **Lullaby mode** — hold a key to hum a lullaby that helps the pet fall asleep faster
- **Pet outfits** — full body cosmetic sets beyond single accessories
- **Friendship milestones** — friendship levels unlock exclusive cosmetics or abilities
- **Constellation lore** — clicking a completed constellation shows a short mythical story
- **Fortune cookie rarity tiers** — golden fortune cookies with rare fortunes
- **Photo gallery** — in-canvas gallery showing thumbnails of saved photos
- **Combo hint system** — subtle visual hints when you're partway through a combo sequence
- **Story continuation** — bedtime stories that span multiple nights, with cliffhangers
- **Sound volume control** — a slider or levels for ambient sound volume
- **Frog chorus visual** — tiny frog silhouettes visible during evening chorus
- **Ice skating** — pet slides around on frozen puddles during cold weather
- **Nightlight color customization** — unlock different nightlight colors/styles
- **Weather forecast widget** — show upcoming weather so player can anticipate changes
- **Seasonal festivals** — special events during equinoxes and solstices with unique decorations
- **Tide pools** — interactive mini-scene during summer evenings with little sea creatures
- **Dream diary** — a separate section in the diary that records dream captions from each night
- **Lucid dreaming** — rare event where clicking a dream scene triggers a mini dream interaction
- **Firefly released into fire** — sending fireflies to dance above a campfire creates magic sparks

### Current architecture notes
- Renderer is now ~19,100+ lines
- Marshmallow feature lives adjacent to Campfire in the source (after `drawCampfire()` ends, before `WEATHER_CHANGE_MIN`)
- `Marshmallow` interface: `state: "ready" | "roasting" | "result"`, `roastLevel` 0-1, `outcome` one of 5 labels, `animT` for stick-swing easing
- Stick anchor at `(cf.x + 48, cf.y - 4)`; marshmallow tip transitions from a ready pose to directly-over-fire pose with smoothstep easing on `animT`
- Key functions: `spawnMarshmallow()`, `startRoastingMarshmallow()`, `pullOutMarshmallow()`, `updateMarshmallow()`, `drawMarshmallow()`, `tryClickMarshmallow()`, `classifyRoast()`, `getMarshmallowColor()` (5-stop color gradient)
- Click handler routing: marshmallow click is checked **before** campfire click in the pointerdown hit-test, since the marshmallow sits right beside the fire
- Spawn conditions: campfire must be `state === "lit"` (not unlit/embers); clears on campfire disappearance; respawns after `MARSHMALLOW_RESPAWN_DELAY` (900f = ~15s)
- Roast timing: 480 frames (~8s) raw→burnt; golden zone = frames ~230-346 (~2 second sweet spot)
- Color interp via 5-stop palette in `getMarshmallowColor()` - white (255,248,232) → tan → golden brown (200,135,75) → dark (115,70,38) → near-black
- Outcome rewards: golden = +5 happy/+2 care/+3 XP + 12 sparkle particles; toasty = +2 happy/+1 care; dark = +1 happy; raw/burnt = 0
- Total achievements: 64
- Complete campfire experience arc: snow → logs appear → light → feed → roast marshmallows → embers
- Complete weather-sound palette: night (crickets+owls+wind), morning (birdsong), afternoon (cicadas), evening (frog chorus), rain/storm (patter+heavy drops+thunder+lightning bolts), wind (gusts+rustling+chimes)
- Sleep palette: bedtime ritual, sleep talking (contextual), dream icon bubbles, dream theater scenes, nightlight, Zzz particles
- Snowy weather scene now has: snowman building (left) + campfire+marshmallows (right)
- dailyActivityLog tracks 17 activities now: fed, played, trick, petted, photo, fireflies, constellations, dewdrops, story, bottle, fortune, bubbles, meditation, tea, snowman, campfire, marshmallow
- Two mini-games: Star Catcher (reflex), Memory Match (pattern recall), plus timing-based marshmallow roasting as a sub-game
- Five personality types: Shy, Energetic, Curious, Sleepy, Gluttonous
