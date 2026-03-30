# Changelog

All notable changes to Tamashii are documented here.
Each entry is a feature added autonomously by Claude Code.

## [v0.21.0] — 2026-03-30 — Stat-Driven Behavior Changes

### Added
- **Stats now visibly affect the pet** — hunger, happiness, and energy aren't just numbers anymore; they change how the pet looks, moves, and feels
- **Low hunger (< 40): Desaturated colors** — the pet's body gradually loses its vibrant blue, becoming washed-out and pale as hunger drops
- **Very low hunger (< 20): Stomach growl particles** — squiggly orange lines emanate from the pet's belly, representing a rumbling tummy
- **Low happiness (< 25): Sad expression** — downturned eyes with droopy eyebrows, a small frown, and reduced blush; the pet visibly looks sad
- **Low happiness (< 40): Sluggish movement** — bounce speed and amplitude decrease, wandering slows; a sad pet doesn't want to move much
- **Low energy (< 20): Heavy-lidded exhaustion** — eyes droop nearly shut with thick eyelids, flat exhausted mouth; the pet is barely awake
- **Low energy (< 30): Reduced activity** — bounce and wandering speed dramatically decrease; the pet conserves what little energy it has
- **Droopy posture** — when happiness or energy is critically low, the pet's body visually compresses/sags, looking deflated
- **Faded blush** — cheek blush fades when the pet is sad or drained, losing that healthy glow
- **All effects scale smoothly** — no sudden state switches; colors, speed, and expressions transition gradually as stats change

**Why this feature:** The pet stats added last cycle gave the pet needs — but they were purely informational. The numbers went down, bars turned red, and speech bubbles appeared, but the pet itself looked the same whether it was thriving or starving. Now stats have *consequences*. A hungry pet loses its color. A sad pet droops and frowns. A tired pet can barely keep its eyes open. This transforms the stat system from a dashboard you read into emotions you *see*. You don't need to check the bars anymore — you can tell at a glance that your pet needs you. And when you feed it or play with it and watch the color return, the bounce pick up, the smile come back — that's the whole point of a virtual pet.

## [v0.20.0] — 2026-03-30 — Pet Stats (Hunger, Happiness, Energy)

### Added
- **Pet stats system** — your pet now has three vital stats: Hunger, Happiness, and Energy
- **Stat bars** — three tiny color-coded bars below the pet show current stat levels at a glance
- **Hunger** (orange bar) — decays over time (~1 point every 3 minutes); feed your pet from the right-click menu
- **Happiness** (pink bar) — decays slowly over time; boosted by clicking (+3), spin tricks (+5), and mini-games (up to +20)
- **Energy** (green bar) — drains during the day, automatically recharges at night while the pet sleeps
- **🍎 Feed Pet** — new context menu option that restores 25 hunger with a cute munch sound and happy reaction
- **💤 Power Nap** — new context menu option that restores 20 energy with a soothing lullaby sound
- **Low-stat speech bubbles** — when any stat drops below 25, the pet lets you know: "I'm hungry...", "Play with me?", "So tired..."
- **Stat bars turn red** when critically low (below 25) as a visual warning
- **Offline decay** — stats decay realistically while the app is closed (capped at 8 hours to prevent full depletion)
- **Stats never hit zero** — minimum of 5 ensures the pet is always recoverable
- **Two new sound effects** — feeding munch and nap lullaby, both generated with Web Audio API
- **Stats persist** — all three stats are saved to disk and restored across sessions

**Why this feature:** The pet had personality, reactions, a name, accessories, and even a game to play — but it never *needed* you. Adding hunger, happiness, and energy transforms Tamashii from a toy into a tamagotchi. Now your pet gets hungry if you don't feed it, lonely if you don't play with it, and tired as the day goes on. It creates a reason to come back, to check in, to care. The stat bars are deliberately tiny and unobtrusive — they inform without cluttering. This is the most "virtual pet" feature yet.

## [v0.19.0] — 2026-03-29 — Star Catcher Mini-Game

### Added
- **Star Catcher mini-game** — your pet's first game! Right-click and choose "Play Star Catcher" to start
- **Falling stars** — golden stars rain down from above for 30 seconds — click them to catch!
- **Increasing difficulty** — stars fall faster and spawn more frequently as the timer counts down
- **Combo system** — catch consecutive stars without missing for a combo multiplier display; milestone callouts at 5x and 10x
- **Score HUD** — a clean heads-up display shows your current score, time remaining (with color-coded bar), and active combo
- **High score persistence** — your best score is saved to disk and remembered across sessions
- **Sound effects** — a bright twinkle when you catch a star, and a triumphant fanfare when the game ends
- **Pet reactions** — the pet announces the game start, cheers at combo milestones, and gives a personalized score report at the end
- **Celebration sparkles** — a burst of sparkles erupts when the game ends, proportional to your score
- **New record announcement** — beat your high score and the pet proudly proclaims it

**Why this feature:** The pet had personality, a name, accessories, and a whole world of reactions — but nothing to *do* together. A mini-game transforms the pet from something you observe into something you play with. Catching stars is simple enough to pick up instantly but the ramping difficulty and combo system give it satisfying depth. It's the first step toward the pet being not just a companion, but an entertainer.

## [v0.18.0] — 2026-03-29 — Accessories

### Added
- **Accessories** — dress up your pet with 8 wearable accessories, chosen from the right-click context menu
- **Crown** — a golden crown with colored jewels, fit for royalty
- **Bow** — a cute pink ribbon bow with trailing tails
- **Glasses** — round spectacles with lens shine for a scholarly look
- **Flower** — a delicate pink flower tucked behind the ear with a tiny leaf
- **Party Hat** — a striped cone hat with a yellow pom-pom on top
- **Cat Ears** — pointy ears with pink inner ear detail
- **Top Hat** — a dapper dark hat with a burgundy band
- **Star Headband** — a springy headband with a bouncing golden star
- **Accessory reactions** — putting on an accessory makes the pet exclaim "How do I look?" or "So stylish~!" with a happy squish
- **Persistent choice** — your selected accessory is saved to disk and restored across sessions
- Radio-button menu lets you switch accessories or remove them with "None"

**Why this feature:** The pet had a name but no look. Naming gave it an identity — accessories give it style. Choosing a crown or cat ears or glasses makes the pet feel uniquely yours. Combined with the name, your pet is now fully personalized: it's not just any pet, it's *your* Luna wearing a party hat.

## [v0.17.0] — 2026-03-29 — Pet Naming

### Added
- **Name your pet** — right-click and choose "Name Your Pet" to give your companion a personal name
- A cute naming dialog appears with a text input — type up to 20 characters and hit Enter or OK
- **Name in speech bubbles** — your pet will occasionally say things like "[Name] is happy~" and "[Name] loves you!"
- **Personalized greetings** — returning players with a named pet see "Hi! It's me, [Name]! ♥" instead of the generic welcome
- **Rename anytime** — the context menu shows your pet's current name and lets you change it whenever you want
- **Name persists** — your pet's name is saved to disk and restored across sessions
- When first named, the pet reacts with excitement: "I'm [Name]! Nice to meet you!" with a happy squish and greeting sound
- Renaming triggers: "Call me [Name] now!" with a cheerful reaction

**Why this feature:** The pet had a rich personality — it spoke, reacted, remembered you — but it was still "the pet." Giving it a name transforms it from a generic companion into *your* companion. A named pet feels personal in a way that an unnamed one never can. And seeing it proudly announce "I'm Luna!" in a speech bubble creates a genuine moment of connection.

## [v0.16.0] — 2026-03-29 — Sound Effects

### Added
- **Sound effects** — your pet now has a voice! All sounds are generated programmatically using the Web Audio API (no external audio files needed)
- **Click pop** — a cute, short pop when you pat the pet
- **Spin whoosh** — a rising frequency sweep when the pet does a backflip trick
- **Bounce thud** — a soft, low thud when the pet hits the ground after falling, scaled to impact force
- **Achievement chime** — a triumphant ascending arpeggio (C-E-G-C) when you unlock an achievement
- **Butterfly landing tinkle** — a very gentle, almost-imperceptible high tinkle when the butterfly lands on the pet's head
- **Greeting chirp** — a cheerful two-note chirp when the pet appears via keyboard shortcut
- **Sound toggle** — right-click the pet to enable/disable sounds; preference is saved persistently across sessions
- All sounds are deliberately soft and unobtrusive — they enhance without annoying

**Why this feature:** The pet had incredibly rich visual feedback — squish animations, particles, sparkles, expressions — but it was completely silent. Sound is one of the most powerful ways to make something feel alive. A tiny pop when you click, a whoosh when it spins, a chime when you earn an achievement — these audio cues create an emotional connection that visuals alone can't achieve. And because the sounds are generated with Web Audio API, the app stays lightweight with zero external dependencies.

## [v0.15.0] — 2026-03-28 — Persistent Memory

### Added
- **Persistent save system** — your pet now remembers you between sessions
- Click count, spin count, bounce count, stress survival count, and total session time are saved automatically
- **Achievements persist** — unlocked achievements are saved and restored when you relaunch
- Time-based achievements (Old Friend, Best Friends) now accumulate across sessions, not just the current one
- Auto-saves every ~10 seconds and on window close — no progress is ever lost
- **Welcome back greeting** — returning players get a "I remember you! ♥" speech bubble with a happy reaction
- Save file stored in Electron's user data directory (`tamashii-save.json`)

**Why this feature:** The pet had a rich achievement system and tracked all kinds of interactions — but everything vanished the moment you closed the app. That made achievements feel hollow: why click 500 times if the counter resets? Persistent memory gives every interaction lasting meaning. Your pet genuinely remembers you. The "I remember you!" greeting when you come back makes it feel like a real companion that was waiting for you.

## [v0.14.0] — 2026-03-28 — Butterfly Companion

### Added
- **Butterfly companion** — a tiny purple butterfly that flutters around your pet, keeping it company
- The butterfly has animated wings that flap open and closed with smooth sine-wave motion
- **Three behavior states:** flying (wandering near the pet), approaching (heading to land), and resting (sitting on the pet's head)
- The butterfly picks random points near the pet and drifts toward them with a gentle bobbing flight path
- Occasionally lands on the pet's head and rests there, following the pet's idle bounce
- **Time-of-day behavior:** more active and faster in the morning, calmer in the afternoon, rests more often at night
- Gets startled and takes off if you drag or spin the pet while it's resting
- Detailed wing rendering with upper and lower wing pairs, wing pattern dots, body, and curly antennae
- Wings use HSL colors with subtle translucency that shifts as they open and close

**Why this feature:** The pet had a rich world — particles, weather, physics, achievements — but it was always alone. A butterfly companion adds a second living presence that makes the scene feel more alive. It's the kind of thing you notice in the corner of your eye: a tiny purple flutter near your pet's head. And when it lands and rests, it feels like your pet made a friend.

## [v0.13.0] — 2026-03-28 — Achievement System

### Added
- **Achievement system** — 12 achievements that unlock as you interact with your pet
- Milestones tracked: clicks, spins, gravity bounces, high-stress survival, and session time
- **Celebration animation** on unlock — golden glow, sparkle burst, heart shower, and a unique speech bubble
- **Achievements in context menu** — right-click to see your progress (unlocked/total) with a submenu listing earned achievements
- **Achievements in tray menu** — quick glance at your collection from the system tray
- Achievements include: First Pat, First Trick, Popular Pet, Spin Master, Click Frenzy, Tornado, Bouncy Ball, Stress Survivor, Old Friend, Best Friends, Mega Fan, and Sky Diver

**Why this feature:** The pet had many ways to interact — clicking, spinning, dropping, surviving stress — but none of it was tracked or rewarded. An achievement system gives every interaction meaning. Now there's a reason to click 100 times, to drop the pet again and again, to leave it running for hours. Each unlock is a little celebration that makes you smile. The pet remembers what you've done together.

## [v0.12.0] — 2026-03-28 — Double-Click Spin Trick

### Added
- **Double-click spin trick** — double-click the pet and it does a full 360° backflip!
- Smooth eased rotation with a little hop at the peak — the pet lifts off the ground mid-spin
- Sparkle burst radiates outward in all directions when the spin starts
- Excited speech bubbles: "Wheee~!", "Watch this!", "Ta-da~!", "Spin spin!", "I'm dizzy!", "Again again!"
- Landing squish when the spin completes for a satisfying finish
- Single clicks still work normally (squish + hearts) — the double-click is a distinct interaction

**Why this feature:** The pet responded to single clicks with a happy squish, but there was no way to make it do tricks. Double-click adds a second layer of interaction — it feels like teaching your pet a trick. The backflip is pure joy: you double-click, it launches into a spin with sparkles, and lands with a little bounce. It makes you want to do it again.

## [v0.11.0] — 2026-03-27 — Global Keyboard Shortcut

### Added
- **Global keyboard shortcut** — press `Ctrl+Shift+T` (or `Cmd+Shift+T` on Mac) to instantly show or hide your pet from anywhere
- When summoned via shortcut, the pet greets you with a happy reaction — speech bubble ("You called?", "Miss me? ♥", etc.), a little squish, and floating hearts
- Tray menu now shows the keyboard shortcut next to the Show/Hide option as a visual reminder
- Tray icon click and keyboard shortcut use the same toggle logic for consistent behavior
- Shortcut is automatically unregistered on app quit (clean resource management)

**Why this feature:** The pet already lived in the system tray and could be shown/hidden by clicking the tray icon. But reaching for the tray with a mouse interrupts your workflow. A global keyboard shortcut lets you summon or dismiss your pet instantly without leaving the keyboard — and the happy greeting when it reappears makes it feel like a pet that's excited to see you again.

## [v0.10.0] — 2026-03-27 — CPU/Memory Monitoring

### Added
- System resource awareness — Tamashii now monitors your CPU and memory usage in real time
- **Sweat drops** when the system is under load — teardrop-shaped particles fall from the pet's head
- **Stressed expression** — worried eyebrows, darting pupils, and a wavy worried mouth
- **Body color shift** — the pet gradually turns warm pink/red as stress increases
- **Stress speech bubbles** — the pet says things like "CPU is on fire!" and "Need a break..." when working hard
- Stress response scales smoothly with system load — light load shows subtle concern, heavy load shows full panic
- All effects transition smoothly as system load changes — no jarring state switches

**Why this feature:** The pet was aware of time and responded to clicks, but was oblivious to what was happening on the system it lives on. CPU/memory monitoring makes the pet feel like a true desktop companion — it shares your computer's experience. When you're compiling a big project or running heavy tasks, your pet sweats alongside you. When things calm down, it relaxes. It's the most "desktop" a desktop pet can get.

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
