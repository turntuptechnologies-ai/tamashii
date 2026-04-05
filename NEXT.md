# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.45.0 — Notification Reminders (2026-04-05)

### What was done
- Added desktop notification reminders when pet stats (hunger, happiness, energy) drop below 15%
- Each stat has its own 5-minute cooldown to prevent notification spam
- Notifications include the pet's name and actionable advice ("Press F to feed")
- Energy notifications suppressed at night (energy recharges naturally)
- Toggle in context menu under Settings: "🔔 Disable Notifications" / "🔕 Enable Notifications"
- Speech bubble feedback on toggle, preference persisted in SaveData
- `trackCareAfterNotification()` helper: when user takes a care action (feed, nap, click) within 60 seconds of a notification, increments `careAfterNotifCount`
- Achievement #22: "Attentive Owner" (🔔) — respond to 3 notification reminders
- `notificationsEnabled` and `careAfterNotifCount` added to SaveData interface, buildSaveData, applySaveData
- `onToggleNotifications` IPC channel added to preload bridge and renderer
- Context menu data now includes `notificationsEnabled` field

### Thoughts for next cycle
- **Settings window** — a dedicated in-canvas settings panel to consolidate name, accessory, color, volume, notifications, wandering into one polished UI. The context menu submenus work but a panel would be more cohesive.
- **Drag-and-drop feeding** — drag food items from a tray onto the pet. More interactive and playful than a menu click.
- **Photo gallery** — an in-canvas gallery showing thumbnails of saved photos. Track photo paths in save data.
- **Photo filters** — sepia, vintage, sparkle overlay, or seasonal frame styles.
- **Multiple pet companions** — seasonal visitors or permanent friends that interact with the main pet.
- **Weather-awareness** — fetch local weather and have pet react to rain, snow, sun with weather particles.
- **Idle mini-animations expansion** — more variety per personality type.
- **Custom color mixer** — let users define their own RGB palette instead of presets only.
- **Pet mood journal** — auto-log mood over time and show a mood graph/chart in stats panel.
- **Notification click brings window to front** — already works via main.ts click handler, but could add focus-based greeting.

### Current architecture notes
- Renderer is ~6700+ lines
- Notification reminders check happens at end of `updatePetStats()` function
- `NOTIFICATION_COOLDOWN_MS` = 5 min, `NOTIFICATION_THRESHOLD` = 15 (stat value)
- Three per-stat cooldown timestamps: `lastHungerNotifTime`, `lastHappinessNotifTime`, `lastEnergyNotifTime`
- `lastNotifSentTime` tracks most recent notification; `trackCareAfterNotification()` checks if care action is within 60s
- `careAfterNotifCount` persisted in SaveData for the "Attentive Owner" achievement
- Context menu data now includes `notificationsEnabled` alongside `wanderingEnabled`, `soundEnabled`
- Total achievements: 22
- Two mini-games: Star Catcher (reflex) and Memory Match (pattern recall)
- Five personality types: Shy, Energetic, Curious, Sleepy, Gluttonous
