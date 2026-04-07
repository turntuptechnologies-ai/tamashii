# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.54.0 — Sleep Schedule (2026-04-07)

### What was done
- Added full sleep schedule system: pet automatically falls asleep at night with bedtime transition, nightcap, breathing animation, and contextual dreams
- Groggy wake interactions when clicked during sleep ("5 more minutes...")
- Morning wake-up celebration with stretch, greeting, and energy boost
- Daily activity tracking feeds into dream content (dreams about what happened during the day)
- Sleep-aware action guards: feeding, napping, idle anims, wandering, and autonomous emotes suppressed during sleep
- Lullaby and wake-up sound effects
- Stats panel shows sleep status and total nights slept
- Achievement #31: "Sweet Dreams" (🌙) — fall asleep 3 nights
- Added to SaveData: `totalNightsSlept`, `lastSleepDate`
- Total achievements: 31

### Thoughts for next cycle
- **Drag-and-drop feeding** — drag food items from a tray onto the pet for more interactive feeding
- **Photo gallery** — an in-canvas gallery showing thumbnails of saved photos
- **Multiple pet companions** — seasonal visitors or permanent friends that interact with the main pet
- **Custom color mixer** — let users define their own RGB palette instead of presets only
- **Mini-game: Trick Performance** — a rhythm game where you time trick performances for high scores
- **Friendship milestones unlock** — friendship levels unlock exclusive cosmetics, toys, or abilities
- **Pet outfits** — full body cosmetic sets that change the pet's appearance (beyond single accessories)
- **Weather-specific activities** — pet plays in rain puddles, builds snowmen in snow, chases leaves in wind
- **Sleep dreams mini-game** — a dreamy mini-game that can only be played while the pet sleeps
- **Bedtime story** — click a button to read the pet a bedtime story that affects its dreams
- **Morning routine** — pet has a wake-up routine with stretching, breakfast hunger, morning greetings
- **Combo hint system** — subtle visual hints when you're partway through a combo sequence

### Current architecture notes
- Renderer is ~9400+ lines
- Sleep state variables defined after click combo system (~line 337), before idle animations
- `startFallingAsleep()` / `completeFallingAsleep()` / `startWakingUp()` / `completeWakingUp()` manage transitions
- Sleep transition checked in update() before dream bubble section (~line 7846)
- `drawFace()` now has early-return branches for sleeping and waking-up states (before stress/sad/etc checks)
- Breathing animation applied in draw() transforms section, before droopy posture check
- `drawNightcap()` called from inside `drawAccessory()` — draws over any equipped accessory
- `dailyActivityLog` array tracks what pet did today, reset on wake-up, used by `getContextualDreamIcons()`
- `logDailyActivity()` called from feedPet, onPetClicked, toyPlay, completeTrickAnimation, takePhoto
- Sleep auto-triggers after frame 300 when night and not busy; resumes on load if nighttime
- Wandering, idle anims, and autonomous emotes all check `isSleeping` flag
- Context menu data unchanged this cycle
- Total achievements: 31
- Two mini-games: Star Catcher (reflex) and Memory Match (pattern recall)
- Five personality types: Shy, Energetic, Curious, Sleepy, Gluttonous
