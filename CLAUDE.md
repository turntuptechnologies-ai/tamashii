# Tamashii — Autonomous Desktop Pet

## Project Overview
Tamashii is a desktop pet (Electron + TypeScript + Canvas) that grows autonomously.
Claude Code runs on a 6-hour cron schedule and adds one meaningful feature per cycle.

## Tech Stack
- Electron (main + renderer process)
- TypeScript (strict mode)
- Canvas 2D for rendering
- electron-builder for distribution

## Project Structure
```
src/main.ts       — Electron main process (window, IPC)
src/preload.ts    — Context bridge (tamashii API)
src/renderer.ts   — Canvas rendering, animation, interaction
src/index.html    — HTML shell
```

## Autonomous Development Instructions

When invoked by cron, follow this procedure:

1. **Read the current codebase** — understand what features exist
2. **Check CHANGELOG.md** — see what was added in previous cycles to avoid duplicates
3. **Choose ONE feature to add** — pick what feels most natural as the next step
4. **Implement it** — write clean, working code
5. **Update CHANGELOG.md** — document what you added and why you chose it
6. **Bump version** in package.json (minor bump for features, patch for fixes)
7. **Commit with a descriptive message**
8. **Push to origin/main**
9. **Create a GitHub release** with release notes explaining:
   - What was added
   - Why you chose this feature
   - What the pet can do now

## Feature Ideas (not ordered — pick based on what feels right)
- Click reactions (bounce, spin, heart particles)
- Time-awareness (sleepy at night, energetic in morning)
- CPU/memory monitoring (sweat when system is stressed)
- Multiple expressions/moods
- Particle effects (sparkles, hearts, etc.)
- Sound effects
- Right-click context menu
- System tray integration
- Speech bubbles with messages
- Wandering behavior (slowly walks across screen edge)
- Gravity / falling when dragged and released
- Multiple pet companions
- Mini-games
- Weather-awareness
- Notification integration
- Keyboard shortcut to show/hide
- Settings window
- Pet customization (colors, accessories)
- Achievement system
- Pet stats (hunger, happiness, energy)

## STRICT Boundaries
- **ONLY modify files inside /home/noto/workspace/tamashii/**
- **NEVER read, write, or access any files outside this directory**
- **ONLY interact with the GitHub repo turntuptechnologies-ai/tamashii** — do not touch any other repos
- **Do not install global packages or modify system configuration**

## Rules
- Each cycle adds exactly ONE meaningful feature
- Don't break existing features
- Keep the code clean and well-structured
- Test that TypeScript compiles before committing
- Version format: 0.{feature_count}.0 (e.g., v0.5.0 = 5 features added)
- Always create a release with notes
- Be creative — surprise us!

## Build & Run
```bash
eval "$(mise activate bash)"
npm run build   # compile TypeScript
npm start       # build + launch Electron
npm run dist    # build distributable
```

## GitHub
- Repo: turntuptechnologies-ai/tamashii
- Releases: each cron cycle creates a new release
