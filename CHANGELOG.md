# Changelog

All notable changes to Tamashii are documented here.
Each entry is a feature added autonomously by Claude Code.

## [v0.9.0] — 2026-03-27 — System Tray Integration

### Added
- System tray icon — Tamashii now lives in your system tray with a blue circle icon matching the pet's body color
- Tray context menu with mood display, show/hide toggle, about dialog, and quit
- Click the tray icon to toggle pet visibility (show/hide)
- Closing the window hides the pet to tray instead of quitting — your pet is always there
- Mood updates live in the tray menu as the time of day changes
- Renderer reports mood changes to the main process via IPC so the tray stays in sync

**Why this feature:** The pet had personality, movement, physics, and atmosphere — but no persistent desktop presence. If you accidentally closed it or wanted it out of the way temporarily, it was gone. System tray integration gives the pet a permanent home: it's always one click away, and the tray menu provides a quick glance at its mood without needing to find the window.

## [v0.8.0] — 2026-03-27 — Ambient Particle Effects

### Added
- Time-of-day ambient particles that create a living atmosphere around the pet
- **Morning:** Golden sparkles drift upward with a gentle sway, catching the light
- **Afternoon:** Soft pollen motes float lazily through the air with a warm glow
- **Evening:** Fireflies wander erratically with pulsing green-yellow bioluminescence
- **Night:** Tiny twinkling stars appear and shimmer in place (alongside existing zzz particles)
- Each particle type has unique physics: sparkles sway, pollen drifts, fireflies wander randomly, stars stay still
- Particles spawn at natural intervals — not too many, just enough for atmosphere

**Why this feature:** The pet had personality, movement, and physics — but the space around it felt empty. Ambient particles give each time of day a distinct visual mood, making the pet's world feel alive and atmospheric. Morning feels bright and magical, evening feels warm and cozy, and night feels peaceful and starlit.

## [v0.7.0] — 2026-03-26 — Gravity & Bounce Physics

### Added
- Drag the pet up and release — it falls back down with realistic gravity!
- Bouncy landings: the pet bounces off the ground with decreasing energy until it settles
- Landing squish effect: the harder the impact, the more the pet squishes on landing
- Dust particle puffs on hard landings — little clouds burst outward from the impact point
- Grabbing the pet mid-fall instantly stops it (no fighting gravity to catch it)
- Shadow stretches dynamically during landing squish for a polished feel

**Why this feature:** The pet could be dragged anywhere but felt weightless — releasing it from a height and having nothing happen broke the illusion. Gravity gives it physical presence and makes dragging feel playful. Picking up the pet and dropping it is now inherently fun.

## [v0.6.0] — 2026-03-26 — Right-Click Context Menu

### Added
- Right-click the pet to open a native context menu with useful options
- **Mood display** — see the pet's current mood and time of day at a glance
- **Toggle wandering** — enable or disable the pet's autonomous walking
- **About dialog** — shows version info and credits
- **Quit** — cleanly exit Tamashii from the menu
- Menu state is live: mood updates with time of day, wander toggle reflects current state

**Why this feature:** The pet had personality, voice, and movement — but no way to interact beyond clicking and dragging. A context menu adds real utility and control, letting users toggle behaviors and learn about their pet's state without breaking the desktop-pet illusion.

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
