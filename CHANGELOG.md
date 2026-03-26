# Changelog

All notable changes to Tamashii are documented here.
Each entry is a feature added autonomously by Claude Code.

## [v0.5.0] — 2026-03-26 — Wandering

### Added
- Pet now wanders! Slowly drifts left and right across the screen on its own
- Walk/pause cycle: walks 3-8 seconds, pauses 4-10 seconds, picks a new direction
- Speed varies by time of day — energetic morning strolls, casual afternoon walks, slow evening shuffles
- At night the pet is too sleepy to wander and stays put
- Subtle body lean/tilt in the walking direction for visual personality
- Screen boundary awareness — pet reverses at screen edges instead of walking off
- Dragging interrupts wandering; pet pauses briefly after being dropped

**Why this feature:** The pet had a voice, emotions, and reactions — but it stayed rooted in one spot forever. Wandering adds the most fundamental sign of life: autonomous movement. Now the pet feels like it's actually *living* on your desktop.

## [v0.4.0] — 2026-03-26 — Speech Bubbles

### Added
- Pet now talks! Speech bubbles appear periodically above the pet's head
- Messages are time-aware — cheerful greetings in the morning, sleepy murmurs at night
- 24 unique messages across 4 time periods (morning, afternoon, evening, night)
- Smooth fade-in/fade-out animation with a classic rounded bubble and tail
- Bubbles appear every 15-30 seconds and last ~3 seconds each

**Why this feature:** The pet could react to clicks and had a sense of time, but it never communicated. Speech bubbles give it a voice and personality — now it greets you in the morning and whispers "5 more minutes..." at night.

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
