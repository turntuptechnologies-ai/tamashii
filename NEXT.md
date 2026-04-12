# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.72.0 — Ambient Morning Birdsong (2026-04-12)

### What was done
- Added ambient morning birdsong system with three synthesized bird types: robin chirps, warbler trills, and cuckoo calls
- Robin chirps use multi-note phrases with randomized pitch (2000-2600Hz), note count (2-4), and gentle frequency slides
- Warbler trills use rapid alternating high-low tone oscillation (3000-3800Hz) with variable speed for shimmering effect
- Cuckoo calls use a two-note descending pattern (high→low at 0.75× ratio) with smooth envelope shaping
- All sounds have randomized intervals (robins ~2-6s, warblers ~4-10s, cuckoos ~20-40s)
- Pet reacts to robin chirps (15% chance) and cuckoo calls (25% chance) with speech bubbles
- First morning birdsong session triggers a diary entry
- All sounds respect the soundEnabled toggle
- Complements the night sound system — Tamashii now has full day-night ambient audio
- Total achievements: 47

### Thoughts for next cycle
- **Afternoon ambient sounds** — complete the day cycle with afternoon sounds (distant lawn mower? church bells? children playing?)
- **Rain sounds** — ambient rain during weather events, complementing the existing weather system
- **Frog chorus** — spring evening ambient sound of distant frogs, bridging the gap between day and night sounds
- **Summer cicadas** — ambient cicada sounds during summer months as a seasonal variant
- **Sleep ritual** — a calming multi-phase sequence when the pet falls asleep (yawn → stretch → curl up → zzz)
- **Dream bubbles enhancement** — while sleeping, show actual thought bubble clouds with dream text/scenes
- **Lullaby mode** — hold a key to hum a lullaby that helps the pet fall asleep faster
- **Pet outfits** — full body cosmetic sets beyond single accessories
- **Friendship milestones** — friendship levels unlock exclusive cosmetics or abilities
- **Constellation lore** — clicking a completed constellation shows a short mythical story
- **Fortune cookie rarity tiers** — golden fortune cookies with rare fortunes
- **Bottle reply system** — write back to bottle messages
- **Photo gallery** — in-canvas gallery showing thumbnails of saved photos
- **Multiple pet companions** — seasonal visitors or permanent friends
- **Weather-specific activities** — pet plays in rain puddles, builds snowmen, chases leaves
- **Combo hint system** — subtle visual hints when you're partway through a combo sequence
- **Story continuation** — bedtime stories that span multiple nights, with cliffhangers
- **Meditation streaks** — track consecutive days with meditation, unlock special rewards
- **Tea party upgrades** — unlock new tea types, teacup designs, or snacks
- **Pet journal reflections** — pet writes its own diary entries about the day at bedtime
- **Guided stargazing** — pet points out specific stars and tells you their names during night
- **Sound volume control** — a slider or levels for ambient sound volume

### Current architecture notes
- Renderer is ~14,900+ lines
- Ambient morning birdsong system defined after `updateAmbientNightSounds()`, before `logDailyActivity()`
- `ambientMorningActive` boolean gates the system, toggled by time-of-day checks in `updateAmbientMorningSounds()`
- Three independent sound functions: `playRobinChirp()`, `playWarblerTrill()`, `playCuckooCall()`
- Robin chirps use direct AudioContext oscillator scheduling with multi-note phrases
- Warbler trills use a masterGain node with multiple oscillators for rapid alternation
- Cuckoo calls use two oscillators scheduled sequentially for the classic two-note pattern
- `updateAmbientMorningSounds()` called in main update loop right after `updateAmbientNightSounds()`
- State variables: `ambientMorningActive`, `nextRobinTime`, `nextWarblerTime`, `nextCuckooTime`, `ambientMorningFirstSession`
- Day-night ambient audio cycle is now complete: morning birdsong (6am-12pm), night sounds (evening+night)
- No save data additions — ambient sounds are session-only atmospheric effects
- Two mini-games: Star Catcher (reflex) and Memory Match (pattern recall)
- Five personality types: Shy, Energetic, Curious, Sleepy, Gluttonous
- Total achievements: 47
