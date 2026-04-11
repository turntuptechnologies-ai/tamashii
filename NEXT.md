# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.71.0 — Ambient Night Sounds (2026-04-11)

### What was done
- Added ambient night sound system with three synthesized sound types: cricket chirps, owl hoots, and wind gusts
- Cricket chirps use rapid high-frequency sine tones (4200-5000Hz) with randomized trill patterns and optional double-chirp
- Owl hoots use two-part low-frequency sine waves (340→300Hz, 320→280Hz) with envelope shaping for a natural "hoo... hooo"
- Wind gusts use AudioBuffer noise filtered through a dynamic low-pass filter for realistic whooshing
- All sounds have randomized intervals to avoid repetition (crickets ~1.5-5s, owls ~30-60s, wind ~15-30s)
- Owls hoot only during deep night; crickets and wind play during both evening and night
- Pet reacts to owl hoots with speech bubbles (30% chance when awake)
- First ambient night session triggers a diary entry
- All sounds respect the soundEnabled toggle
- Total achievements: 47

### Thoughts for next cycle
- **Summer cicadas** — ambient cicada sounds during summer months, building on the ambient sound system as a seasonal variant
- **Sleep ritual** — a calming multi-phase sequence when the pet falls asleep (yawn → stretch → curl up → zzz) instead of the current simple transition
- **Dream bubbles enhancement** — while sleeping, show actual thought bubble clouds with dream text/scenes, not just floating icons
- **Lullaby mode** — hold a key to hum a lullaby that helps the pet fall asleep faster
- **Ambient morning sounds** — birdsong at dawn to complement the night sounds
- **Pet outfits** — full body cosmetic sets beyond single accessories
- **Friendship milestones** — friendship levels unlock exclusive cosmetics or abilities
- **Constellation lore** — clicking a completed constellation shows a short mythical story
- **Fortune cookie rarity tiers** — golden fortune cookies with rare fortunes
- **Bottle reply system** — write back to bottle messages (compose a reply that floats away)
- **Photo gallery** — in-canvas gallery showing thumbnails of saved photos
- **Multiple pet companions** — seasonal visitors or permanent friends
- **Weather-specific activities** — pet plays in rain puddles, builds snowmen, chases leaves
- **Combo hint system** — subtle visual hints when you're partway through a combo sequence
- **Story continuation** — bedtime stories that span multiple nights, with cliffhangers
- **Meditation streaks** — track consecutive days with meditation, unlock special rewards
- **Tea party upgrades** — unlock new tea types, teacup designs, or snacks as you host more parties
- **Pet journal reflections** — pet writes its own diary entries about the day at bedtime
- **Guided stargazing** — pet points out specific stars and tells you their names during night
- **Yawn chain leaderboard** — show personal best prominently, encourage beating it
- **Sneeze + cherry blossom synergy** — increased sneeze chance when cherry blossoms are actively falling
- **Pollen count indicator** — subtle visual showing pollen levels affecting sneeze frequency
- **Rain sounds** — ambient rain during rainy weather, complementing the existing weather system
- **Frog chorus** — spring evening ambient sound of distant frogs near water

### Current architecture notes
- Renderer is ~14,700+ lines
- Ambient night sound system defined after playWakeUpSound(), before logDailyActivity()
- `ambientNightActive` boolean gates the system, toggled by time-of-day checks in `updateAmbientNightSounds()`
- Three independent sound functions: `playCricketChirp()`, `playOwlHoot()`, `playWindGust()`
- Cricket chirps use `playTone()` with setTimeout for rapid trill patterns
- Owl hoots use direct AudioContext oscillator scheduling for precise two-part timing
- Wind gusts use AudioBuffer noise → BiquadFilter (lowpass) → GainNode for filtered noise effect
- `updateAmbientNightSounds()` called in main update loop after sleep breathing, before dream bubbles
- State variables: `ambientNightActive`, `nextCricketTime`, `nextOwlTime`, `nextWindTime`, `ambientNightFirstSession`
- No save data additions — ambient sounds are session-only atmospheric effects
- Two mini-games: Star Catcher (reflex) and Memory Match (pattern recall)
- Five personality types: Shy, Energetic, Curious, Sleepy, Gluttonous
- Total achievements: 47
