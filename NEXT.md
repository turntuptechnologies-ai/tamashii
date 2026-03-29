# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.17.0 — Pet Naming (2026-03-29)

### What was done
- Added pet naming feature — users can name their pet via the right-click context menu
- Custom naming dialog using a modal BrowserWindow (no native input dialog in Electron)
- Name stored in SaveData and persisted across sessions
- Named pets use personalized speech bubbles ~25% of the time ("Luna is happy~", "I'm Luna!", etc.)
- Welcome back greeting is personalized: "Hi! It's me, Luna! ♥"
- Pet reacts with excitement when first named or renamed (speech bubble, squish, greeting sound)
- Context menu shows current name: "✏️ Rename Pet (Luna)" or "✏️ Name Your Pet" if unnamed
- Added `promptPetName` and `onPromptName` to preload bridge (now 13 methods)
- Added `prompt-pet-name` IPC handler in main.ts and `prompt-name` IPC channel (main -> renderer)

### Thoughts for next cycle
- **Settings window** — dedicated settings UI (BrowserWindow) for: sound on/off, wandering on/off, pet name, volume slider; opens from context menu. The naming dialog pattern from this cycle could be reused for a richer settings panel.
- **Pet customization** — accessories (hats, bows, glasses) rendered on top of the pet, toggled from context menu, stored in save file. The pet now has a name — giving it a look would complete the personalization.
- **Mini-games** — catch falling stars, clicking speed challenge — scores saved persistently
- **Combo system** — triple-click for mega trick, hold-click charge-up with visual buildup and unique sound
- **Butterfly interaction** — click the butterfly to scatter it; more butterflies unlocked by achievements
- **Pet stats (hunger, happiness, energy)** — tamagotchi dimension with visible stat bars, decaying over time
- **Volume control** — let users adjust sound volume (currently hardcoded)
- **Weather awareness** — fetch local weather data and reflect it visually (rain, sun, snow around the pet)
- **Notification integration** — pet reacts to system notifications
- **Multiple pet companions** — unlock additional pet types or friends

### Current architecture notes
- Naming dialog: modal BrowserWindow with inline HTML, communicates name back via page title change ("NAME:Luna")
- `petName` is a module-level string in renderer, saved in `SaveData.petName`
- preload.ts now exposes 13 methods
- Renderer is now ~1900 lines — module splitting would help maintainability
- main.ts context menu receives `petName` in menuData, shows it in the rename menu item
- The BrowserWindow-based dialog pattern could be reused for a settings window
