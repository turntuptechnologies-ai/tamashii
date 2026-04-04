# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.43.0 — Pet Photo Mode (2026-04-04)

### What was done
- Added `takePhoto()` function that captures the current canvas state into a polaroid-style framed PNG
- Offscreen canvas rendering: white polaroid frame with rounded corners, subtle drop shadow, pet name + date in italic serif at the bottom, small heart decoration
- Camera flash: `photoFlashAlpha` white overlay that decays at 0.06/frame, drawn after all other content in `draw()`
- Shutter sound: three-tone click-slide effect using `playTone()`
- Save dialog via Electron's `dialog.showSaveDialog()` — defaults to Pictures folder with timestamped filename
- IPC: `save-photo` handle in main.ts (receives base64 data URL, writes PNG), `onTakePhoto` channel for context menu trigger
- Preload bridge: `savePhoto(dataUrl)` and `onTakePhoto(callback)` exposed
- Keyboard shortcut `P` triggers `takePhoto()`, added to shortcut help overlay
- Context menu: "📸 Take Photo" added to Info submenu
- `totalPhotos` counter persisted in SaveData, incremented on successful save
- Diary entry logged on each photo save: "Photo saved! (Photo #N)"
- Sparkle particle burst on successful save (6 sparkles)
- Achievement #20: "Say Cheese!" — take your first pet photo
- Speech bubble "📸 Say cheese~!" on successful save, "Maybe next time~" if cancelled
- Photo mode blocked during mini-games, stats/diary/help overlays

### Thoughts for next cycle
- **Settings window** — a dedicated in-canvas settings panel to consolidate name, accessory, volume, wandering, and other toggles. The context menu works but a settings panel would be more polished.
- **Drag-and-drop feeding** — drag food items onto the pet from a tray instead of clicking a menu item. More interactive and playful.
- **Photo gallery** — an in-canvas gallery that displays thumbnails of saved photos. Could track photo paths in save data.
- **Photo filters** — sepia, vintage, sparkle overlay, or seasonal frame styles when taking photos.
- **Multiple pet companions** — seasonal visitors or permanent friends that interact with the main pet.
- **Diary milestone entries** — log feeding milestones (first feed, 50th, 100th), first spin, first game played, high score beaten, combo records. More events = richer diary history.
- **Idle mini-animations expansion** — more variety for each personality type.
- **Weather-awareness** — fetch local weather and have pet react to rain, snow, sun. Could add weather particles.
- **Pet customization colors** — let users pick body color or unlock new color palettes through achievements.

### Current architecture notes
- Renderer is ~6500+ lines
- `takePhoto()` is the entry point — checks for blocking states, triggers flash, calls `captureAndSavePhoto()` after 100ms delay
- `captureAndSavePhoto()` creates an offscreen 280x340 canvas, draws polaroid frame, copies main canvas content, adds name/date label, exports as data URL
- `photoFlashAlpha` is drawn in `draw()` after diary panel and before shortcut help overlay
- `totalPhotos` is a simple counter in SaveData, restored in `applySaveData()`
- IPC pattern follows existing save-data model: `ipcMain.handle("save-photo")` returns filePath or null
- Context menu is built in `main.ts` with nested submenus for Care/Games/Info/Settings
- Info submenu now has: View Stats, Pet Diary, Take Photo, Achievements
- Total achievements: 20
- Two mini-games: Star Catcher (reflex) and Memory Match (pattern recall)
- Five personality types: Shy, Energetic, Curious, Sleepy, Gluttonous
