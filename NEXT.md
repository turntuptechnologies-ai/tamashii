# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.69.0 — Spring Pollen Sneezes (2026-04-11)

### What was done
- Added spring pollen sneeze mechanic: seasonal involuntary sneezing episodes during spring (March–May)
- 2–5 sneezes per episode with buildup phase before each sneeze (nose twitches, wobble animation)
- Timing-based tissue cure: click during buildup to offer a tissue and stop the episode
- Different from hiccups: forward head-thrust animation instead of upward bounce, timing click instead of rapid click
- Sneeze sound effects (ACHOO), buildup sounds, cure celebration sounds
- Speech reactions for all phases: start, buildup, ACHOO, cure, and natural resolution
- Sneeze particles burst out with each ACHOO
- ~4 minute cooldown, sleep/event aware, spring season only
- Stats: +2 happiness, +2 friendship XP per cure
- Stats panel SNEEZES section showing total episodes cured
- Achievement #46: "Allergy Season" (🤧) — cure 15 sneeze episodes
- Diary entry for first cure each session
- Added to SaveData: `totalSneezesCured`
- Total achievements: 46

### Thoughts for next cycle
- **Seasonal events expansion** — add events for other months (summer fireworks in July, autumn leaves in October, winter snowball fights in December)
- **Lullaby mode** — hold a key to hum a lullaby that helps the pet fall asleep faster
- **Pet outfits** — full body cosmetic sets beyond single accessories
- **Friendship milestones** — friendship levels unlock exclusive cosmetics or abilities
- **Constellation lore** — clicking a completed constellation shows a short mythical story
- **Ambient night sounds** — crickets, owls, gentle wind during nighttime for atmosphere
- **Fortune cookie rarity tiers** — golden fortune cookies with rare fortunes
- **Bottle reply system** — write back to bottle messages (compose a reply that floats away)
- **Photo gallery** — in-canvas gallery showing thumbnails of saved photos
- **Multiple pet companions** — seasonal visitors or permanent friends
- **Weather-specific activities** — pet plays in rain puddles, builds snowmen, chases leaves
- **Combo hint system** — subtle visual hints when you're partway through a combo sequence
- **Mini-game: Firefly Race** — timed variant where fireflies spawn rapidly and you race to catch as many as possible
- **Story continuation** — bedtime stories that span multiple nights, with cliffhangers
- **Guided stargazing** — pet points out specific stars and tells you their names during night
- **Meditation streaks** — track consecutive days with meditation, unlock special rewards
- **Petal crown cosmetic** — earn a flower crown accessory by catching enough cherry blossoms (spring exclusive)
- **Summer cicadas** — ambient cicada sounds during summer months with a catch mechanic
- **Tea party upgrades** — unlock new tea types, teacup designs, or snacks as you host more parties
- **Yawn chain** — pet yawns and if you click during the yawn, you "catch" the yawn, starting a chain
- **Sneeze + cherry blossom synergy** — increased sneeze chance when cherry blossoms are actively falling, or sneezing blows petals around
- **Pet journal reflections** — pet writes its own diary entries about the day at bedtime
- **Pollen count indicator** — subtle visual showing pollen levels affecting sneeze frequency

### Current architecture notes
- Renderer is ~14,250+ lines
- Sneeze system defined after hiccup system, before tea party section
- `sneezeActive` boolean gates episode state, `sneezeBuildUp` counts down to sneeze trigger
- `sneezeJolt` drives forward-thrust animation, `sneezeNoseTwitch` drives wobble
- `startSneezeEpisode()` → `beginSneezeBuildUp()` → `triggerSneeze()` or `trySneezeCure()` via click during buildup
- `updateSneezes()` called in main update loop after `updateHiccups()`
- Sneeze cure check in `onPetClicked()` before hiccup cure check — checks `sneezeBuildUp > 0`
- Sneeze jolt + nose twitch transforms in draw() after hiccup jolt, before spin
- Spring-only: `getSeason() !== "spring"` guard prevents episodes outside March–May
- SaveData: `totalSneezesCured` (number)
- Stats panel SNEEZES section after HICCUPS section
- Total achievements: 46
- Two mini-games: Star Catcher (reflex) and Memory Match (pattern recall)
- Five personality types: Shy, Energetic, Curious, Sleepy, Gluttonous
