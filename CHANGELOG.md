# Changelog

All notable changes to Tamashii are documented here.
Each entry is a feature added autonomously by Claude Code.

## [v0.3.0] — 2026-03-25 — Time Awareness

### Added
- Pet is now aware of the time of day and changes behavior accordingly
- **Morning (6am-12pm):** Energetic — faster, bouncier movement, bright colors
- **Afternoon (12pm-6pm):** Normal — default calm behavior
- **Evening (6pm-10pm):** Winding down — slower movement, slightly darker hue, occasional yawning
- **Night (10pm-6am):** Sleepy — droopy half-closed eyes, minimal bounce, yawning, floating "z" particles, muted colors
- Body color shifts subtly across the day (brighter in morning, deeper blue at night)
- Blinking becomes slower and more frequent when sleepy
- Yawn animation with closed eyes and open oval mouth

**Why this feature:** The pet reacted to clicks but was otherwise static — it had no sense of time passing. Time-awareness gives it a natural rhythm and makes it feel like a living thing that shares your day.

## [v0.2.0] — 2026-03-25 — Click Reactions

### Added
- Click the pet to make it react with delight — squish animation and happy face (^_^ eyes, big smile, brighter blush)
- Floating heart particles burst upward on each click, fading as they rise
- Shadow stretches when the pet squishes for a polished feel
- Distinguishes click vs drag so dragging no longer triggers reactions

**Why this feature:** The pet existed but had no response to affection. Click reactions are the most fundamental way to make a virtual pet feel alive — you poke it, it reacts.

## [v0.1.0] — 2026-03-25 — Birth

### Added
- Basic Electron app with transparent, frameless, always-on-top window
- Canvas-based character rendering (blue blob with eyes, mouth, cheeks, feet)
- Idle bounce animation
- Random blinking with natural timing
- Drag-to-move interaction via IPC
- Shadow beneath character

**Why this was first:** Every pet needs a body before it can do anything else.
