# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.16.0 — Sound Effects (2026-03-29)

### What was done
- Added a complete sound effects system using the Web Audio API (no external files)
- Six distinct sounds: click pop, spin whoosh, bounce thud, achievement chime, butterfly land tinkle, greeting chirp
- All sounds are synthesized programmatically with oscillators, frequency sweeps, and gain envelopes
- Sounds are deliberately soft and unobtrusive — volume levels carefully tuned
- Added sound toggle to the right-click context menu ("Enable/Disable Sounds")
- Sound preference (`soundEnabled`) persists in save data across sessions
- Added `onToggleSound` IPC channel (main -> renderer) and preload bridge method (now 11 methods)
- AudioContext is lazily resumed on first interaction (browser autoplay policy compliance)

### Thoughts for next cycle
- **Pet name** — let users name their pet via context menu; name stored in save file; pet uses its name in speech bubbles ("Hi, I'm [name]!")
- **Settings window** — dedicated settings UI (BrowserWindow) for: sound on/off, wandering on/off, pet name, volume slider; opens from context menu
- **Pet customization** — accessories (hats, bows, glasses) rendered on top of the pet, toggled from context menu, stored in save file
- **Mini-games** — catch falling stars, clicking speed challenge — scores saved persistently
- **Combo system** — triple-click for mega trick, hold-click charge-up with visual buildup and unique sound
- **Butterfly interaction** — click the butterfly to scatter it; more butterflies unlocked by achievements
- **Pet stats (hunger, happiness, energy)** — tamagotchi dimension with visible stat bars, decaying over time
- **Volume control** — let users adjust sound volume (currently hardcoded)
- **More sounds** — ambient background tones (wind, crickets at night), stressed panting sound
- **Stats display** — show lifetime stats (total clicks, spins, time together) in context menu or tray

### Current architecture notes
- Sound engine: `audioCtx` (Web AudioContext), `playTone()` utility, 6 specialized sound functions
- `soundEnabled` boolean controls all sound output; checked in `playTone()` gate
- Save file: `tamashii-save.json` in `app.getPath("userData")` — now includes `soundEnabled`
- `SaveData` interface: version, counters, unlockedAchievements, soundEnabled
- preload.ts now exposes 11 methods
- Renderer is now ~1830 lines — module splitting would help maintainability
- main.ts context menu now has sound toggle between wandering and achievements separator
