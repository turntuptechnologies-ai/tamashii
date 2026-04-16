# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.88.0 — Cozy Campfire (2026-04-16)

### What was done
- Added interactive campfire that spawns during snowy weather (right side of screen, opposite snowman)
- Three-state lifecycle: unlit logs → blazing lit fire → glowing embers
- Layered flame rendering (outer orange / mid yellow-orange / inner yellow / hot white core) with bezier-curve flame shapes, additive blending, and organic per-layer flicker
- Warm radial glow around base, ring of stones with highlights, teepee of hand-drawn logs with bark details
- Procedural crackling sounds (bandpass-filtered noise bursts) at natural intervals
- Feed the fire by clicking (up to 5 feeds, +1 minute lifetime each) for spark bursts and bigger flames
- Rekindle glowing embers by clicking them back to full flame
- 5 light speeches, 4 feed speeches, 5 warmth speeches that cycle occasionally
- Diary entry on first lighting, achievement "Fire Keeper" (#63) for 5 campfires
- Dream template for "campfire" activity: toasty cozy dreams
- Stats panel entry and full persistence
- Total achievements: 63

### Thoughts for next cycle
- **Marshmallow roasting** — drag a marshmallow over the campfire to toast it; click at right moment for golden perfect, too long = burnt
- **Pet approach campfire** — pet walks over to the lit campfire and warms itself (animation to sit beside it)
- **Hot cocoa** — after campfire, pet sips hot cocoa with steam particles
- **Lullaby mode** — hold a key to hum a lullaby that helps the pet fall asleep faster
- **Pet outfits** — full body cosmetic sets beyond single accessories
- **Friendship milestones** — friendship levels unlock exclusive cosmetics or abilities
- **Constellation lore** — clicking a completed constellation shows a short mythical story
- **Fortune cookie rarity tiers** — golden fortune cookies with rare fortunes
- **Photo gallery** — in-canvas gallery showing thumbnails of saved photos
- **Combo hint system** — subtle visual hints when you're partway through a combo sequence
- **Story continuation** — bedtime stories that span multiple nights, with cliffhangers
- **Sound volume control** — a slider or levels for ambient sound volume
- **Firefly lantern** — craft a lantern from caught fireflies that glows on the pet's head
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
- Renderer is now ~18,700+ lines
- Campfire uses `Campfire` interface with `state: "unlit" | "lit" | "embers"` and lifecycle driven by `lifetime`, `maxLifetime`, `emberTimer`
- `activeCampfire: Campfire | null`, single instance at a time, spawns only during snowy weather after `CAMPFIRE_SPAWN_DELAY` frames
- Rendering helpers: `drawCampfireLog()`, `drawCampfireFlame()` with bezier curves; main `drawCampfire()` handles glow, stones, logs, flames/embers state-branching
- Sound: `playCampfireIgniteSound()` uses a noise buffer + filter for whoosh, `playCampfireCrackle()` for short crackle bursts, `playCampfireFeedSound()` for log thuds
- Click handler routes through `tryClickCampfire()` which dispatches to `igniteCampfire()`, `feedCampfire()`, or `rekindleCampfire()` by state
- `totalCampfiresLit` and `campfireFirstLit` persisted in save data
- Dream template "campfire" added to DREAM_TEMPLATES so sleeping after lighting a fire yields cozy fire dreams
- Complete night sky palette: stars, constellations, shooting stars, meteor showers, aurora borealis, comets
- Complete weather-sound palette: night (crickets + owls + wind), morning (birdsong), afternoon (cicadas), evening (frog chorus), rain/storm (patter + heavy drops + thunder), wind (gusts + rustling + chimes)
- Sleep palette: bedtime ritual, sleep talking (contextual), dream icon bubbles, dream theater scenes, nightlight, Zzz particles
- Snowy weather scene now has: snowman building (left side) + campfire (right side) — parallel interactive features on opposite sides
- dailyActivityLog tracks: fed, played, trick, petted, photo, fireflies, constellations, dewdrops, story, bottle, fortune, bubbles, meditation, tea, snowman, campfire
- Two mini-games: Star Catcher (reflex) and Memory Match (pattern recall)
- Five personality types: Shy, Energetic, Curious, Sleepy, Gluttonous
- Total achievements: 63
