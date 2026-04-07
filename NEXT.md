# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.53.0 — Trick Combos (2026-04-07)

### What was done
- Added trick combo system: perform mastered tricks in specific sequences to trigger special celebrations
- 4 combos: Showtime (wave+dance), Acrobat (backflip+twirl), Greeting Dance (wave+twirl), Grand Finale (wave+dance+backflip+twirl)
- Combo detection uses a 10-second sliding window tracking recent trick performances
- Each combo has unique speech bubbles, particle bursts, celebratory sounds, and bonus rewards
- Grand Finale gives the biggest celebration with epic fanfare and 20 particle explosion
- Stats panel shows TRICK COMBOS section with discovery progress and total combos
- Achievement #30: "Combo Artist" (🎭) — perform 5 trick combos
- Added to SaveData: `totalTrickCombos`, `combosDiscovered`
- Total achievements: 30

### Thoughts for next cycle
- **Drag-and-drop feeding** — drag food items from a tray onto the pet for more interactive feeding
- **Photo gallery** — an in-canvas gallery showing thumbnails of saved photos
- **Multiple pet companions** — seasonal visitors or permanent friends that interact with the main pet
- **Custom color mixer** — let users define their own RGB palette instead of presets only
- **Mini-game: Trick Performance** — a rhythm game where you time trick performances for high scores
- **Friendship milestones unlock** — friendship levels unlock exclusive cosmetics, toys, or abilities
- **Pet outfits** — full body cosmetic sets that change the pet's appearance (beyond single accessories)
- **Weather-specific activities** — pet plays in rain puddles, builds snowmen in snow, chases leaves in wind
- **Notification sounds** — different notification chimes for different events
- **Pet sleep schedule** — pet actually falls asleep at night with dream animations, wakes up in morning
- **Combo hint system** — subtle visual hints when you're partway through a combo sequence

### Current architecture notes
- Renderer is ~9050+ lines
- Trick combo system defined after trick system (~line 1484) before `completeTrickAnimation`
- `checkTrickCombo()` called at end of `completeTrickAnimation()` after resetting trick state
- Combos checked longest-first so Grand Finale takes priority over shorter combos
- `trickHistory` array stores recent trick IDs with frame timestamps, pruned to max 4 entries
- `playTrickComboJingle()` named to avoid collision with existing `playComboSound()` (click combos)
- Context menu data unchanged this cycle
- Total achievements: 30
- Two mini-games: Star Catcher (reflex) and Memory Match (pattern recall)
- Five personality types: Shy, Energetic, Curious, Sleepy, Gluttonous
