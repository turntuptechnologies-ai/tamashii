# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.58.0 — Constellation Drawing (2026-04-08)

### What was done
- Added constellation drawing system: press L at night/evening to enter constellation mode
- 8 unique constellation patterns (Crown, Heart, Arrow, Dipper, Diamond, Wing, Spiral, Bow) with distinct star layouts
- Click guide stars to activate them; when two connected stars are both clicked, a bright glowing line connects them
- Faint dashed guide lines show the pattern, twinkling guide stars with unique phases
- Completion triggers celebration: star particles, fanfare sound, golden text overlay, speech reaction
- Smart selection prefers uncompleted constellations
- Two new sounds: ethereal connection chime and ascending completion fanfare
- 8 unique completion speech reactions
- Stats panel CONSTELLATIONS section showing discovered count out of 8
- Achievement #35: "Stargazer" (🌌) — complete 5 constellations
- Keyboard shortcut L added to help overlay
- Escape closes constellation mode
- Night-only enforcement with gentle day-time reminder
- Auto-disables on time transition to daytime
- Added to SaveData: `completedConstellations`, `totalConstellationsCompleted`
- Diary entries for first completion of each constellation
- Each completion gives +5 happiness, +2 care points, +3 friendship XP
- Total achievements: 35

### Thoughts for next cycle
- **Bedtime stories** — read the pet a bedtime story before sleep that affects its dreams (narrative depth)
- **Seasonal events** — special time-limited events based on calendar date (spring cherry blossoms fest, etc.)
- **Pet outfits** — full body cosmetic sets beyond single accessories
- **Photo gallery** — in-canvas gallery showing thumbnails of saved photos
- **Multiple pet companions** — seasonal visitors or permanent friends
- **Friendship milestones** — friendship levels unlock exclusive cosmetics or abilities
- **Mini-game: Firefly Race** — timed variant where fireflies spawn rapidly and you race to catch as many as possible
- **Custom color mixer** — let users define their own RGB palette
- **Combo hint system** — subtle visual hints when you're partway through a combo sequence
- **Pet diary illustrations** — diary entries get tiny pixel-art illustrations
- **Weather-specific activities** — pet plays in rain puddles, builds snowmen, chases leaves
- **Fortune cookie rarity tiers** — golden fortune cookies with rare fortunes
- **Ambient night sounds** — crickets, owls, gentle wind during nighttime for atmosphere
- **Constellation lore** — clicking a completed constellation shows a short mythical story about it
- **Shooting stars** — rare shooting star events during constellation mode, click to make a wish

### Current architecture notes
- Renderer is ~10800+ lines
- Constellation system defined after Firefly section (~line 1124): ConstellationPattern data, state variables, toggle/select/click/complete/update/draw functions
- `CONSTELLATION_PATTERNS` — 8 patterns with name, icon, star positions (relative 0-1), and edge connections
- `toggleConstellationMode()` — activates/deactivates mode, enforces night-only, selects next constellation
- `selectNextConstellation()` — picks random uncompleted constellation (or any if all done)
- `getConstellationStarPositions()` — converts relative positions to absolute canvas coordinates
- `tryClickConstellationStar()` — hit-tests stars with 14px radius, checks edge completion, handles completion
- `completeConstellation()` — celebration, stats, diary, sparkles, auto-advances after 3.5s
- `updateConstellations()` — fade animation, celebration timer, daytime auto-disable
- `drawConstellations()` — renders guide lines (dashed for unconnected, glowing for connected), stars (dim/bright), name label, progress, completion celebration
- Click handling: constellation check added before firefly check in mousedown handler
- Constellation update in update() after firefly update
- Constellation drawing in draw() before fireflies (sky background layer)
- SaveData: `completedConstellations` (number[]), `totalConstellationsCompleted` (number)
- Stats panel CONSTELLATIONS section after FIREFLIES section
- Keyboard shortcut L in keydown handler, Escape handler closes constellation mode
- Total achievements: 35
- Two mini-games: Star Catcher (reflex) and Memory Match (pattern recall)
- Five personality types: Shy, Energetic, Curious, Sleepy, Gluttonous
