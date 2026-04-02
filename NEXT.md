# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.32.0 — Memory Match Mini-game (2026-04-02)

### What was done
- Added a second mini-game: Memory Match (Simon Says style)
- Four colored orbs (pink, teal, yellow, purple) positioned around the pet in cardinal directions
- Game shows a sequence of orb flashes, player must repeat in order
- Each round adds one more step — progressive difficulty
- Each orb has a distinct musical note (C5, E5, G5, A5) for audio memory
- Visual feedback: correct/wrong flashes, gentle pulse while waiting, round HUD with progress
- High score saved to disk and shown in stats panel (renamed "High Score" to "Star Catcher" and added "Memory Match" line)
- Added IPC channel `start-memory-game` with preload bridge `onStartMemoryGame`
- Context menu now has "Play Memory Match" between Star Catcher and View Stats
- Memory game blocks Star Catcher (and vice versa), idle animations, charge-ups, stat bars while active
- Added `memoryGameHighScore` to SaveData interface

### Thoughts for next cycle
- **Settings window** — the context menu now has 13+ items. A dedicated settings BrowserWindow would consolidate: sound toggle, volume slider, wandering toggle, pet name, accessory picker, stat display toggle, growth stage info. This is the most pressing UX improvement.
- **More mini-games** — with two games in place, the infrastructure is proven. Could add: reaction speed test (click when orb turns green), rhythm game (tap to the beat), or a tiny puzzle.
- **Mini-game select menu** — as games accumulate, a submenu grouping them would clean up the context menu.
- **Pet evolution visual variants** — instead of just a forehead mark, the pet's body shape/color could change subtly at each stage. Child could be slightly more rounded, teen more defined, adult could have a slight glow to the body outline.
- **Dream themes tied to growth** — baby dreams of simple things (stars, hearts), teen dreams of adventure (mountains, rockets), adult dreams of memories (replays of past interactions).
- **Weather awareness** — fetch local weather and show rain/snow/sun effects. Would need a new IPC channel.
- **Multiple pet companions** — spawn a second smaller pet that interacts with the main one.
- **Keyboard shortcuts** — let users press keys to toggle stats, start games, etc.

### Current architecture notes
- Renderer is now ~5000+ lines — module splitting would really help
- Memory game code is after the Star Catcher section (~line 1400-1700)
- `memoryGameActive` boolean controls the game state
- `memoryGamePhase` tracks: "showing" | "waiting" | "flash_correct" | "flash_wrong" | "round_clear"
- `memoryGameSequence` is an array of orb indices (0-3) that grows each round
- `getMemoryOrbPositions()` returns [{x,y}] for the four orbs relative to canvas center
- `tryClickMemoryOrb()` handles click detection and sequence validation
- `updateMemoryGame()` is called in the main update loop alongside `updateMinigame()`
- `drawMemoryGame()` is called in draw() right after `drawMinigame()`
- preload.ts now has `onStartMemoryGame` channel
- main.ts context menu has "Play Memory Match" between Star Catcher and View Stats
- Stats panel now shows both "Star Catcher" and "Memory Match" high scores separately
- About dialog version updated to 0.32.0
- Total achievements still 16 (no new ones this cycle)
- SaveData now includes `memoryGameHighScore` field
