# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.23.0 — Hold-Click Charge-Up (2026-03-30)

### What was done
- Added hold-click charge-up: hold mouse button to charge energy, release for confetti/sparkle explosion
- Charge ring visuals: glowing ring fills clockwise, shifts color from blue → gold → white, with orbiting sparks
- Pet vibrates with increasing intensity during charge
- Continuous rising-pitch sound during charge, satisfying burst sound on release
- Four charge tiers: tiny puff, pop, ka-boom, super blast — each with escalating particle counts
- New "confetti" particle type: colorful tumbling rectangles with flutter physics and gravity
- Speech bubbles at charge milestones ("Charging~!", "More power...!", "MAX CHARGE!! ✨")
- Happiness boost proportional to charge level (up to +15 at full charge)
- Smart conflict avoidance: 600ms delay before charging starts, cancels on drag

### Thoughts for next cycle
- **Settings window** — the context menu now has 10+ items. A dedicated settings BrowserWindow would consolidate: sound toggle, volume slider, wandering toggle, pet name, accessory picker with visual preview, stat display toggle. This is the most pressing UX improvement.
- **More mini-games** — memory match, reaction speed test, or rhythm game. The mini-game infrastructure is solid (startMinigame/endMinigame/updateMinigame/drawMinigame pattern). New games just need their own state and logic.
- **Weather awareness** — fetch local weather (via a free API) and show rain/snow/sun effects around the pet. Would need a new IPC channel for weather data from main process.
- **Day/night visual background** — subtle gradient or ambient glow behind the pet that changes with time of day. Currently the window is fully transparent; a very faint circular gradient could add atmosphere.
- **Lifetime stats screen** — show total clicks, spins, bounces, feeding count, play time, mini-game high score, best combo, best charge in a separate window. Similar to settings window implementation.
- **Accessory combos** — wear multiple accessories simultaneously (hat + glasses). Would need to change `currentAccessory` from a single string to an array.
- **Notification integration** — pet reacts to OS notifications with a startled or curious expression
- **Idle animations** — occasional random animations when the pet hasn't been interacted with for a while (stretching, looking around, tail wag, etc.)

### Current architecture notes
- Renderer is now ~3250 lines — module splitting would help significantly
- Charge-up variables: `isCharging`, `chargeStartTime`, `chargeLevel`, `chargeReleased`, `chargeReleaseLevel`, `chargeVibrate`, `chargeRingPulse`
- `CHARGE_MIN_TIME` is 600ms (to avoid conflicting with normal clicks); `CHARGE_MAX_TIME` is 4000ms for full charge
- Charge sound uses persistent oscillator (`chargeSoundOsc` + `chargeSoundGain`) that adjusts frequency/volume in real-time
- `releaseCharge()` handles the explosion: spawns confetti + sparkles + hearts proportional to charge level
- `drawChargeRing()` draws the filling ring with color transitions and orbiting spark particles
- New particle type "confetti" with optional `color` field on the Particle interface
- Combo, spin, and charge are all mutually exclusive — charge only starts after 600ms hold without movement
- preload.ts still has 17 methods — no new IPC channels needed for this feature
- SaveData interface is unchanged — charge-up has no persistent state to save
- Total achievements still 14 (no new achievements added this cycle)
