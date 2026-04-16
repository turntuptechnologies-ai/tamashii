# Changelog

All notable changes to Tamashii are documented here.
Each entry is a feature added autonomously by Claude Code.

## [v0.87.0] — 2026-04-16 — Dream Theater

### Added
- **Vivid dream scenes** — while sleeping, large cloud-shaped thought bubbles periodically appear above the pet, containing mini dream vignettes with multiple icons and dreamy captions
- **Activity-based dreams** — dream content is influenced by the day's activities: feeding produces feast dreams, playing produces bouncing-on-clouds dreams, music sessions produce dancing-to-starlight dreams, and more (11 activity-specific templates)
- **Cloud rendering** — dream scenes use overlapping ellipses to form a fluffy cloud shape, with trailing thought dots leading down to the pet, giving a classic comic-book dream bubble aesthetic
- **Dream icons and captions** — each cloud contains 3 hand-drawn dream icons arranged side by side, plus a small italic caption underneath (e.g., "a feast of yummies~", "flying through stars~")
- **Gentle lifecycle** — dream clouds fade in over ~40 frames, float upward slowly with organic wobble on two axes, and fade out gracefully over the final 15% of their ~5-7 second lifespan
- **One at a time** — only one dream scene is visible at a time, spawning every ~25-45 seconds during sleep, keeping dreams special rather than cluttered
- **Dream chime sound** — a soft ascending C-E-G major arpeggio (sine wave, very low volume) plays when each dream scene appears, adding a gentle celestial quality
- **Generic fallback dreams** — when no activities have been logged, generic dreamy scenes appear (fluffy cloud beds, a world of colors, flying through stars, warm and safe, a gentle breeze)
- **Diary entry** — first dream scene is logged to the pet diary
- **Sweet Dreamer achievement** — have 10 vivid dream scenes to unlock achievement #62 (💭)
- **Stats tracking** — total dream scenes displayed in stats panel
- **Full persistence** — dream scene count and first-time flag saved across sessions
- **Total achievements: 62**

**Why this feature:** The sleep system already has Zzz particles, sleep talking, contextual dream bubbles with single icons, a nightlight, and a bedtime ritual — but the dream experience was still limited to small floating icon bubbles. Dream Theater adds a new visual layer: larger, cloud-shaped thought bubbles that show actual dream *scenes* with multiple icons and captions, making the pet's inner dream world visible and connected to the day's activities. It rewards players who interact with many features during the day with richer, more varied dream content at night.

## [v0.86.0] — 2026-04-15 — Comet Event

### Added
- **Rare comet event** — during nighttime, a slow-moving comet can appear and drift across the entire sky over 60-120 seconds, with a glowing head and long particle tail
- **Dual color palette** — comets randomly spawn with either a warm amber (hue 45) or cool cyan (hue 190) head, with tail particles varying ±15 hue for natural color dispersion
- **Layered head rendering** — three concentric layers: soft outer glow (6x radius), bright mid-glow (3x radius), and white-hot core for realistic coma effect
- **Particle tail system** — up to 80 tail particles with position jitter, gradual alpha decay (0.97x per frame), size shrinkage, and depth-ordered rendering from tail tip to head
- **Smooth lifecycle** — fade-in over first 60 frames and fade-out over final 60 frames for graceful entry and exit
- **Rare spawn timing** — checked every ~90 seconds with 2.5% chance during nighttime only, making comets genuinely special events
- **Speech reactions** — 6 comet-themed messages ("A comet~!! It's so beautiful, look at that tail! ☄️✨", "A cosmic traveler from far far away~! ☄️💙") triggered on each sighting
- **Ethereal arrival sound** — ascending four-tone sine melody (E4→G4→B4→D5) for a celestial announcement
- **Diary entry** — first comet witnessed is logged to pet diary
- **Comet Gazer achievement** — witness 3 comets to unlock achievement #61 (☄️)
- **Stats tracking** — total comets witnessed displayed in stats panel
- **Full persistence** — comet count and first-time flag saved across sessions
- **Total achievements: 61**

**Why this feature:** The night sky already has stars, constellations, shooting stars, meteor showers, and aurora borealis — but all of these are either static or fast. A comet fills a unique niche: a rare, slow-moving celestial visitor that you can actually watch drift across the sky over minutes. It rewards patient nighttime observation and pairs naturally with the existing stargazing experience. The rarity (roughly one every hour of nighttime play) makes each sighting feel genuinely special.

## [v0.85.0] — 2026-04-15 — Thunderstorm Lightning Bolts

### Added
- **Forked lightning bolts** — during stormy weather, procedurally generated lightning bolts crack across the sky with realistic branching paths (recursive forking algorithm with up to 3 branch depths)
- **Layered rendering** — each bolt segment rendered with a bright white core and a soft blue-white outer glow, with sub-branches rendered thinner and more transparent than the main trunk
- **Animated lifecycle** — bolts appear with a bright screen flash, then fade out over ~20-35 frames with natural alpha decay
- **Thunder sync** — each lightning bolt triggers the existing thunder sound effects (deep sawtooth rumble + delayed follow-up), replacing the old random screen flash
- **Speech reactions** — 6 lightning-specific messages ("Whoa~! Did you see that lightning?! ⚡😲", "ZAP~! Nature's fireworks! ⚡🎆") triggered with 30% chance per bolt
- **Diary entry** — first lightning bolt witnessed is logged to pet diary
- **Storm Chaser achievement** — witness 15 lightning bolts to unlock achievement #60 (⚡)
- **Stats tracking** — total lightning bolts witnessed displayed in stats panel
- **Full persistence** — lightning bolt count and first-time flag saved across sessions
- **Total achievements: 60**

**Why this feature:** Storms already had rain sounds, thunder rumbles, and a faint white screen flash — but the lightning itself was invisible. Real thunderstorms are defined by their lightning, and the previous 0.003-probability white rectangle was underwhelming. This upgrade replaces that with dramatic forked lightning bolts that crack across the sky with branching paths, glowing cores, and natural fade-out — making storms the most visually spectacular weather event. Combined with the existing rain patter, heavy drops, and thunder rumbles, storms now deliver a complete audiovisual experience.

## [v0.84.0] — 2026-04-15 — Wind Sounds

### Added
- **Wind gusts** — sweeping bandpass-filtered noise with rising/falling frequency sweep (300-600Hz) and organic swell envelope, creating realistic gusting wind during windy weather
- **Rustling leaves** — clusters of 2-6 high-pass filtered noise bursts (3000-6000Hz) simulating leaves skittering and fluttering in the breeze
- **Wind chimes** — randomized 2-7 note sequences from a pentatonic-friendly scale (A4-E6) with sine oscillators, natural decay, and subtle overtone harmonics for metallic shimmer
- **Weather-aware activation** — all three sound layers activate only during windy weather and deactivate when weather changes
- **Speech reactions** — 6 wind-themed messages ("Whoooosh~! The wind is singing! 🌬️🎶", "The wind chimes are so pretty~ 🎐💫") triggered naturally during rustling and chime events
- **Diary entry** — first wind sound session logged to pet diary
- **Wind Whistler achievement** — listen to the wind 10 times to unlock achievement #59 (🌬️)
- **Stats tracking** — total wind sound sessions displayed in stats panel
- **Full persistence** — wind sound session count saved across sessions
- **Total achievements: 59**

**Why this feature:** After adding rain sounds last cycle, windy weather was the last weather type without its own ambient soundscape. The pet already reacts visually to wind with blowing particles, and the night ambient system had a basic low-pass wind gust. This upgrade gives windy weather a full three-layered sound palette — sweeping gusts for atmosphere, rustling leaves for texture, and wind chimes for melody — completing the weather-sound collection alongside rain/thunder, crickets, birdsong, cicadas, and frog chorus.

## [v0.83.0] — 2026-04-14 — Rain Sounds

### Added
- **Ambient rain patter** — gentle high-frequency noise bursts simulating clusters of raindrops hitting a window, using filtered white noise with exponential decay
- **Heavy drops** — occasional louder, deeper raindrop impacts with bandpass filtering for a satisfying splashy quality
- **Thunder rumbles** — during stormy weather, low-frequency rumbling thunder with organic envelope shaping (slow decay with sine modulation for rolling thunder effect)
- **Weather-aware intensity** — rain patter and heavy drops play twice as frequently during storms compared to regular rain
- **Speech reactions** — 6 cozy rain messages ("Listen to the rain~ So peaceful! 🌧️💤") and 4 thunder reactions ("Eep~! Thunder! Hold me! ⛈️😱") with natural randomness
- **Diary entry** — first rain sound session logged to pet diary
- **Rain Listener achievement** — listen to the rain 10 times to unlock achievement #58 (🌧️)
- **Stats tracking** — total rain sound sessions displayed in stats panel
- **Full persistence** — rain sound session count saved across sessions
- **Total achievements: 58**

**Why this feature:** The pet already has a beautiful visual rain system with falling raindrop particles and puddles, plus four ambient sound palettes covering the full day cycle (night crickets, morning birdsong, afternoon cicadas, evening frog chorus). But rainy weather — one of the most emotionally evocative weather types — was silent. Adding rain sounds fills this gap perfectly, making rainy days feel cozy and immersive rather than just visual. The three-layered sound design (gentle patter + heavy drops + thunder) creates natural depth, and the stormy weather intensification makes storms feel powerful and dramatic.

## [v0.82.0] — 2026-04-14 — Nightlight

### Added
- **Cozy nightlight** — a small, warm-glowing lamp appears beside the sleeping pet, automatically turning on when the pet falls asleep
- **Click to toggle** — click the nightlight during sleep to turn it on or off, giving the player a gentle interaction even while the pet sleeps
- **Warm radial glow** — when lit, the nightlight casts a soft, pulsing amber glow with layered radial gradients (outer warm haze + inner bright core)
- **Flickering flame** — a tiny animated filament inside the lamp shade flickers gently with multi-frequency sine waves for organic movement
- **Lamp design** — hand-drawn lamp with a dome shade (gradient-lit when on, muted when off), wooden base, and decorative detail
- **Toggle sound effect** — soft ascending tone when turning on, descending tone when turning off, subtle enough not to wake the pet
- **Speech reactions** — 8 cozy "on" messages ("The nightlight is so warm~ 🕯️✨") and 4 brave "off" messages ("The stars are my nightlight now~ ⭐"), triggered with natural randomness
- **Auto-on/off** — nightlight automatically turns on when the pet falls asleep (including bedtime ritual) and turns off when waking up
- **Session resume** — nightlight re-activates when loading during nighttime
- **Diary entry** — first nightlight discovery logged to pet diary
- **Nightlight Keeper achievement** — toggle the nightlight 20 times to unlock achievement #57 (🕯️)
- **Full persistence** — total toggles and first-time flag saved across sessions
- **Total achievements: 57**

**Why this feature:** The sleep system has grown beautifully — bedtime rituals, sleep talking, dream bubbles — but it's been entirely passive once the pet is asleep. The nightlight adds the first *interactive* element to the sleeping state: a warm, cozy lamp that players can toggle on and off. It's a small, intimate gesture — like tucking in a child and leaving a nightlight on — that deepens the emotional connection. The pulsing warm glow also adds visual richness to the nighttime scene, making the sleeping pet feel even more peaceful and cared for.

## [v0.81.0] — 2026-04-14 — Sleep Talking

### Added
- **Contextual sleep talking** — while sleeping, the pet occasionally mumbles speech bubbles based on the day's activities, revealing what it's dreaming about
- **12 generic mumbles** — universal sleep talk messages like "*mumble*... five more minutes..." and "Zzz... no no... that's my cookie..."
- **36 activity-specific mumbles** — contextual dream speech for 12 different activities (feeding, playing, tricks, petting, music, photos, fireflies, stories, meditation, tea parties, constellations, snowman building), each with 3 unique mumble variants
- **Smart context weighting** — 65% chance to reference a day's activity when one exists, otherwise falls back to generic mumbles
- **Gentle mumble sound** — soft two-tone descending hum (~150-200 Hz) that sounds like sleepy murmuring, quiet enough not to disturb the peaceful sleeping atmosphere
- **Randomized intervals** — sleep talks occur every ~15-40 seconds, keeping each night unique and unpredictable
- **Daily activity logging** — added activity tracking for meditation, tea parties, and snowman building to expand contextual dream content
- **Diary entry** — first sleep talk each session is logged with the actual mumbled message
- **Stats panel section** — sleep talk count displayed in the sleep stats area
- **Sleep Talker achievement** — hear 30 sleep talk mumbles to unlock achievement #56 (💤)
- **Full persistence** — total sleep talks and first-time flag saved across sessions
- **Total achievements: 56**

**Why this feature:** The bedtime ritual just added in v0.80.0 made falling asleep into a beautiful ceremony, but once the pet was asleep, the only visual feedback was breathing animation and dream icon bubbles. Sleep talking adds personality and narrative to the sleeping state — the pet's mumbles reveal what made an impression during the day, creating a delightful feedback loop where players recognize their activities reflected in the pet's dreams. Hearing "*mumble*... more head pats..." after a petting session, or "Zzz... happily ever... after..." after reading a bedtime story, makes the relationship feel alive even while the pet sleeps.

## [v0.80.0] — 2026-04-14 — Bedtime Ritual

### Added
- **Multi-phase bedtime ritual** — when night arrives, the pet now goes through a charming 5-phase winding-down sequence before falling asleep, instead of immediately transitioning to sleep
- **Yawn phase** (~2.3s) — big sleepy yawn with body leaning back, mouth opening wide showing tongue, heavy-lidded drooping eyes, descending 3-note lullaby tone
- **Stretch phase** (~1.8s) — gentle evening wind-down stretch with ascending body elongation and slight tilt, relaxing descending tones
- **Curl up phase** (~2.2s) — body settles downward and compresses slightly, as if curling into a cozy position, soft low tones
- **Nuzzle phase** (~1.5s) — adorable side-to-side nuzzling motion as the pet finds the perfect sleeping spot, gentle rhythmic tones
- **Drift off phase** (~2s) — final gentle swaying that gradually stills, descending 3-note melody fading to silence, then normal sleep transition begins
- **Progressive drowsiness** — eyes get progressively heavier and droopier across all phases, sleepy blush fades in
- **Dynamic eyelid** — heavy upper eyelid drawn in the pet's actual body color, covering more of the eye as the ritual progresses
- **Phase-specific speech** — unique speech bubble messages per phase (16 total), from "*biiiig yawn~*" to "Drifting off... to dreamland..."
- **Sleepy sparkle particles** — 6 sparkle particles burst gently outward when the ritual completes, marking the transition to sleep
- **Interaction blocking** — all clicks, tricks, hiccups, sneezes, yawn chains, and idle animations are suppressed during the ritual
- **Care points** — +1 friendship XP per completed ritual
- **Diary entry** — first bedtime ritual logged to pet diary
- **Stats panel section** — bedtime ritual count displayed in the sleep stats area
- **Sweet Dreamer achievement** — complete 20 bedtime rituals to unlock achievement #55 (😴)
- **Full persistence** — total rituals and first-time flag saved across sessions
- **Total achievements: 55**

**Why this feature:** Tamashii already has a beautiful morning stretch sequence (yawn → stretch up → shake → hop → sparkle) that makes waking up feel like an event. But falling asleep was just a 2-second eye-close transition — anticlimactic for such a daily ritual. The bedtime ritual mirrors the morning stretch as a bookend, transforming the transition to sleep into its own multi-phase ceremony: a big yawn, a winding-down stretch, curling up cozy, nuzzling into position, and finally drifting off. The progressively drooping eyelids and phase-specific sounds create that universal feeling of fighting sleep and gradually surrendering to it.

## [v0.79.0] — 2026-04-13 — Snowman Building

### Added
- **Interactive snowman building** — during snowy weather, a snowman building activity starts automatically after ~10 seconds, inviting the player to build a snowman step by step
- **5-stage build process** — click the snowman to progress through stages: base snowball → body → head → face (eyes, carrot nose, coal smile) → accessories (scarf, hat, stick arms)
- **Randomized cosmetics** — each snowman gets a random scarf color (6 options: red, blue, green, orange, purple, pink) and hat style (top hat, bucket hat, or beanie)
- **Snow particle bursts** — each build stage spawns a burst of 6 snowflake particles
- **Ascending build sounds** — each stage plays progressively higher-pitched tones (350→700 Hz)
- **Wobble animation** — snowman wobbles briefly after each stage is added, with smooth dampening
- **Gradual melting** — when weather changes from snowy, the snowman slowly melts over ~5 minutes (fading opacity + shrinking)
- **Build prompt hints** — pulsing text hints above the snowman showing what to add next
- **Speech reactions** — unique reaction messages per stage (15 total), with excited celebration on completion
- **Care points** — 2 points per build stage, 10 bonus points for completion
- **Diary entries** — diary logs for starting and completing each snowman build
- **Stats panel section** — dedicated SNOWMEN BUILT section showing total count
- **Snow Sculptor achievement** — build 5 snowmen to unlock achievement #54 (⛄)
- **Full persistence** — total snowmen built saved across sessions
- **Total achievements: 54**

**Why this feature:** Snowy weather in Tamashii has always been purely visual — falling snowflakes with no interactivity. Building a snowman is the quintessential snow activity, and it transforms passive weather observation into an engaging multi-step creative collaboration between the player and pet. The step-by-step build mechanic (base → body → head → face → accessories) gives each click a tangible, visible reward, and the randomized hats and scarves make every snowman unique.

## [v0.78.0] — 2026-04-13 — Evening Frog Chorus

### Added
- **Ambient evening frog chorus** — a rich, organic soundscape that plays during the evening time period, layering alongside existing night crickets to create a distinct twilight atmosphere
- **Frog croaks** — deep, resonant "ribbit" sounds using sawtooth oscillator with low-pass filter, featuring the characteristic two-pulse croak pattern (pitch rises then falls) at randomized base frequencies (120–180 Hz)
- **Spring peepers** — rapid high-pitched chirps (2800–3400 Hz) in bursts of 2–4 peeps, mimicking the iconic chorus of tiny tree frogs that fills spring and summer evenings
- **Katydids** — rhythmic buzzing bursts using bandpass-filtered square waves at ~4200–5000 Hz, replicating the staccato "ka-ty-did" call pattern in groups of 3–5 chirps
- **Randomized intervals** — frog croaks every ~3–7 min, spring peepers every ~1.5–4 min, katydids every ~5–12 min, creating an ever-shifting natural soundscape
- **Speech reactions** — 5 delighted twilight messages ("The frogs are singing tonight~ Ribbit ribbit! 🐸") plus specific peeper and katydid reactions
- **Diary entry** — first evening frog chorus session each run is logged to the pet diary
- **Stats panel section** — dedicated EVENING CHORUS section showing total sessions
- **Twilight Listener achievement** — enjoy 10 evening frog chorus sessions to unlock achievement #53 (🐸)
- **Full persistence** — total evening chorus sessions saved across sessions
- **Total achievements: 53**

**Why this feature:** Tamashii's ambient audio cycle covered night (crickets/owls/wind), morning (birdsong), and afternoon (wind chimes/bees/lawn mower), but evening — that magical twilight hour — had no distinct voice of its own, sharing only the night's crickets. In reality, dusk is when nature's chorus peaks: frogs emerge from ponds, spring peepers trill from the treetops, and katydids begin their rhythmic debates. Adding this evening-specific soundscape transforms twilight from a quiet transition into its own rich atmospheric moment, completing the full 24-hour ambient cycle with four distinct sound palettes.

## [v0.77.0] — 2026-04-13 — Afternoon Ambient Sounds

### Added
- **Ambient afternoon soundscape** — a warm, atmospheric audio layer that plays during the afternoon time period, completing the full day-night ambient audio cycle (night crickets → morning birdsong → afternoon ambience → evening/night)
- **Wind chimes** — gentle, randomized metallic tinkling with harmonic overtones (C5–D6 pentatonic range), creating that classic lazy-afternoon porch feeling
- **Buzzing bees** — soft sawtooth-based buzz with LFO-modulated pitch that rises and falls as a bee "flies by," creating a Doppler-like effect
- **Distant lawn mower** — low-frequency filtered drone that fades in and out over 4–7 seconds, evoking a suburban summer afternoon
- **Randomized intervals** — wind chimes every ~3–8 min, bees every ~4–10 min, lawn mower every ~30–60 min, keeping the soundscape varied and unpredictable
- **Speech reactions** — 5 relaxed afternoon messages ("Wind chimes~ Such a peaceful afternoon! 🎐", "Bzzzz~ A little bee friend flew by! 🐝") plus specific bee and lawn mower reactions
- **Diary entry** — first afternoon ambient session each run is logged to the pet diary
- **Stats panel section** — dedicated AFTERNOON AMBIENCE section showing total sessions
- **Afternoon Dreamer achievement** — enjoy 10 afternoon ambient sessions to unlock achievement #52 (🎐)
- **Full persistence** — total afternoon sound sessions saved across sessions
- **Total achievements: 52**

**Why this feature:** Tamashii already has night crickets/owls/wind and morning birdsong/robin/warbler/cuckoo, but afternoons were silent — a conspicuous gap in an otherwise rich ambient audio tapestry. Wind chimes, buzzing bees, and a distant lawn mower are universally recognizable afternoon sounds that evoke warmth, laziness, and suburban comfort. Together they transform the afternoon from a quiet interlude into its own distinct atmospheric experience, completing the full 24-hour ambient cycle.

## [v0.76.0] — 2026-04-13 — Meteor Shower

### Added
- **Meteor shower event** — a rare, spectacular nighttime event where 15–25 shooting stars burst outward from a single radiant point in rapid succession, filling the sky with streaking light
- **Radiant glow** — a soft blue-white glow marks the radiant point where meteors originate, fading in as the shower begins and lingering as it ends
- **Radiant-based trajectories** — meteors emanate outward from the radiant point in all directions with varied speeds and spread, creating a realistic radiating pattern
- **Rapid-fire spawning** — one new meteor every ~0.25 seconds with slight randomization, creating a steady cascade rather than a single burst
- **Periodic shimmer sounds** — every 5th meteor triggers a soft randomized tone, adding atmospheric audio without overwhelming
- **Cascading announcement sound** — a six-note ascending shimmer (1200–2200 Hz with overtones) plays when the shower begins
- **Aurora exclusion** — meteor showers don't spawn while the aurora borealis is active, preventing visual clutter
- **Raised star limit** — during a shower, up to 10 shooting stars can exist simultaneously (vs. the normal limit of 2)
- **Speech reactions** — 5 awestruck messages when the shower begins ("A meteor shower~!! The sky is raining stars! 🌠✨")
- **Diary entry** — first meteor shower each session is logged to the pet diary
- **Stats panel section** — dedicated METEOR SHOWERS section showing total showers witnessed
- **Starfall Watcher achievement** — witness 5 meteor showers to unlock achievement #51 (🌠)
- **Full persistence** — total meteor showers witnessed saved across sessions
- **Total achievements: 51**

**Why this feature:** Tamashii's night sky already has individual shooting stars, constellations, and the rare aurora borealis, but nothing that creates an overwhelming sense of cosmic spectacle. A meteor shower — dozens of stars streaking outward from a single radiant point — transforms an ordinary night into an event. The 3% chance per ~90-second check makes each shower genuinely rare and exciting, while the radiant-point geometry (all meteors emanating from one spot) gives it scientific authenticity. Combined with the cascading sound and the pet's awestruck reactions, it creates a "stop everything and watch" moment that rewards staying up late with your pet.

## [v0.75.0] — 2026-04-12 — Puddle Splashing

### Added
- **Puddles after rain** — 2–4 water puddles appear on the ground whenever weather transitions away from rainy or stormy conditions
- **Ripple animation** — each puddle has gentle concentric ripple rings and a shimmer highlight that undulate over time
- **Gradual evaporation** — puddles slowly fade out and disappear after ~2–3 minutes, with a smooth opacity fade in the last few seconds
- **Click to splash** — click any puddle to trigger a delightful splash burst, sending water droplets arcing upward
- **Splash particles** — 8 raindrop particles burst from the splash point in an upward fan pattern
- **Descending splash sound** — a quick three-tone descending cascade (800→600→400 Hz) plays on each splash
- **Speech reactions** — 5 playful messages when splashing ("Splash splash~! 💦😆", "Hehe, puddle jumping~! 💧✨")
- **Diary entry** — first puddle splash each session is recorded in the pet diary
- **Stats panel section** — dedicated PUDDLES section showing total splashes
- **Puddle Jumper achievement** — splash in 20 puddles to unlock achievement #50 (💦)
- **Care points** — each splash awards 2 care points
- **Full persistence** — total puddle splashes saved across sessions
- **Total achievements: 50**

**Why this feature:** The rainbow after rain made weather transitions feel magical, but once the rain stopped, the world immediately felt dry. Real rain leaves puddles — shimmering little mirrors on the ground that beg to be jumped in. Puddle splashing adds a tactile, interactive follow-up to rain events: the pet gets to play in the aftermath. It rewards players who notice the puddles before they evaporate, creating a brief window of playful interaction tied to weather. The splash particles and sounds make each click satisfying, and the evaporation timer ensures puddles feel transient and special rather than permanent fixtures.

## [v0.74.0] — 2026-04-12 — Rainbow After Rain

### Added
- **Rainbow arc** — a beautiful seven-band rainbow arc appears in the sky when weather transitions from rainy or stormy to sunny or cloudy, featuring all classic ROYGBIV colors rendered as smooth curved bands
- **Shimmer animation** — each color band has a subtle oscillating opacity and gentle radius shimmer, making the rainbow appear to glow and breathe
- **Soft glow backdrop** — a warm radial gradient glows behind the rainbow arc for an ethereal, atmospheric look
- **Smooth fade in/out** — rainbow gracefully fades in when it appears and fades out after ~45–90 seconds, never popping in or out abruptly
- **Previous weather tracking** — the weather system now tracks the previous weather type to detect rain-to-clear transitions
- **Speech reactions** — 5 delighted messages when the rainbow appears ("A rainbow~!! How beautiful! 🌈")
- **Ascending arpeggio sound** — a shimmering seven-note ascending scale (C5 to B5) with fifth overtones plays when the rainbow spawns
- **Diary entry** — first rainbow sighting each session is logged to the pet diary
- **Stats panel section** — dedicated RAINBOWS section showing total rainbows seen
- **Rainbow Chaser achievement** — see 10 rainbows after rain to unlock achievement #49 (🌈)
- **Full persistence** — total rainbows seen saved across sessions
- **Total achievements: 49**

**Why this feature:** Tamashii's weather system already creates immersive atmospheric variety — rain patters, storms flash, snow drifts — but weather transitions were abrupt and unremarkable. A rainbow appearing after rain is one of nature's most universally beloved moments: that instant when the clouds part and color arcs across the sky. It rewards players who weather the storm with a fleeting, beautiful surprise. The ~45–90 second duration makes each rainbow a moment to pause and appreciate, and the ascending arpeggio sound creates an unmistakable "something magical just happened" feeling. Combined with the pet's excited reactions, it transforms a simple weather change into a shared experience.

## [v0.73.0] — 2026-04-12 — 🧬 Aurora Borealis

### Added
- **Aurora borealis event** — rare, breathtaking northern lights appear during nighttime as flowing curtains of green, teal, cyan, purple, and magenta light undulating across the sky
- **Flowing curtain rendering** — 3–5 semi-transparent bands with layered sine-wave displacement create organic, rippling motion that looks like real aurora curtains
- **Shimmer effect** — each curtain band has varying opacity across its width, creating a dynamic sparkle-shimmer as the waves flow
- **Vertical gradient falloff** — bands glow brightest at their crests and fade downward, mimicking the way real aurora light diffuses
- **Smooth fade in/out** — aurora events gracefully fade in when they begin and fade out when they end, lasting ~45–90 seconds each
- **Rare spawn chance** — 4% chance every ~60 seconds during nighttime, making each sighting feel special and unexpected
- **Speech reactions** — 5 wonder-filled messages when the aurora appears ("The northern lights~!! I can't believe it! 🤩")
- **Ethereal pad sound** — a soft layered chord of sine tones (220–554Hz) fades in when the aurora begins
- **Diary entry** — first aurora sighting each session is logged to the pet diary
- **Stats panel section** — dedicated AURORA BOREALIS section showing total auroras witnessed
- **Aurora Witness achievement** — witness the aurora borealis 5 times to unlock achievement #48 (🌌)
- **Full persistence** — total auroras witnessed saved across sessions
- **Total achievements: 48**

🧬 **Mutation!** This feature has nothing to do with the previous cycle's ambient sound suggestions — it's an unexpected evolutionary leap! Instead of more audio, Tamashii got a stunning visual spectacle.

**Why this feature:** Three consecutive cycles focused on ambient audio (night sounds, morning birdsong). This mutation breaks the pattern with a purely visual atmospheric event. The aurora borealis is one of nature's most awe-inspiring phenomena — rare, beautiful, and worth staying up for. In Tamashii, it transforms an ordinary night into something magical: flowing curtains of color that make you stop and watch. The rarity (4% chance per minute of nighttime) means each sighting is genuinely special, and the pet's delighted reactions make it feel like a shared experience.

## [v0.72.0] — 2026-04-12 — Ambient Morning Birdsong

### Added
- **Robin chirps** — cheerful multi-note songbird phrases with randomized pitch (2000–2600Hz), note count, and gentle frequency slides for natural melodic variation
- **Warbler trills** — rapid alternating high-low tone trills (3000–3800Hz) that shimmer like a real warbler's song, with variable speed and length
- **Cuckoo calls** — a distinctive two-note "cu-ckoo" call with descending pitch, playing less frequently for a rare atmospheric treat
- **Randomized timing** — robins every ~2–6 seconds, warblers every ~4–10 seconds, cuckoos every ~20–40 seconds, all with randomized intervals
- **Speech reactions** — 15% chance of reacting to robin chirps with one of 5 charming messages ("The birds are singing~! What a lovely morning! 🐦"), 25% chance of reacting to cuckoo calls
- **Automatic activation** — birdsong begins at morning (6am) and fades when afternoon arrives (12pm)
- **Diary entry** — first morning birdsong session each run is logged to the pet diary
- **Sound-aware** — all birdsong respects the global sound toggle
- **Complements night sounds** — morning birdsong naturally bookends the existing cricket/owl/wind ambient night soundscape
- **Total achievements: 47** (unchanged)

**Why this feature:** Tamashii's nights are now richly atmospheric with crickets, owls, and wind gusts, but mornings were silent. Birdsong is the quintessential morning sound — waking up to robins, warblers, and the occasional cuckoo transforms the morning experience from merely bright to truly alive. The three bird types create a layered soundscape: robins provide frequent cheerful phrases, warblers add shimmering trills, and the rare cuckoo call becomes a delightful surprise that makes the pet react with wonder. Together with the night sounds, Tamashii now has a complete day-night audio cycle.

## [v0.71.0] — 2026-04-11 — Ambient Night Sounds

### Added
- **Cricket chirps** — synthesized cricket trills play at random intervals during evening and night, with varied frequency (4200–5000Hz), volume, and double-chirp patterns for natural variation
- **Owl hoots** — a two-part "hoo... hooo" owl call plays occasionally during deep night (night only, not evening), using low-frequency sine waves with gentle pitch descent
- **Wind gusts** — soft filtered noise bursts simulate gentle breezes, with dynamic low-pass filter sweeps and smooth volume envelopes for a realistic whoosh
- **Randomized timing** — crickets every ~1.5–5 seconds, owls every ~30–60 seconds, wind every ~15–30 seconds, all with randomized intervals to avoid repetition
- **Speech reactions** — when the owl hoots and the pet is awake, there's a 30% chance it reacts with one of 5 charming messages ("Hoo hoo~! Was that an owl? 🦉")
- **Automatic activation** — sounds begin at evening and fade naturally when morning arrives
- **Diary entry** — first ambient night each session is logged to the pet diary
- **Sound-aware** — all ambient sounds respect the global sound toggle
- **Sleep-compatible** — sounds continue softly while the pet sleeps, creating a cozy backdrop for the zzz particles and dream bubbles
- **Total achievements: 47** (unchanged)

**Why this feature:** Tamashii's nighttime is already visually rich — fireflies, constellations, dream bubbles, shooting stars — but it was aurally silent beyond the occasional yawn or lullaby. Ambient night sounds transform the experience from watching a scene to *being in one*. Cricket chirps provide a gentle rhythmic backdrop, owl hoots add rare atmospheric surprises that make the pet react with wonder, and wind gusts give a sense of the world breathing around you. Together they make nighttime feel alive, cozy, and immersive — the perfect companion to an evening spent with your desktop pet.

## [v0.70.0] — 2026-04-11 — Yawn Chain

### Added
- **Contagious yawn chain** — click the pet during a yawn to "catch" it, starting a back-and-forth yawn chain
- **Chain mechanic** — the pet yawns, you click to catch it, a "player yawn" visual plays from the bottom of the screen, then the pet yawns again — keep clicking to extend the chain
- **Decreasing continue chance** — each link in the chain has a slightly lower chance of the pet yawning again (starts at 85%, decays 6% per link), making long chains rare and exciting
- **Chain rewards** — happiness and friendship XP scale with chain length, with sparkle burst on completion
- **Click window** — you must click during the pet's yawn to continue the chain; miss it and the chain ends naturally
- **Speech reactions** — 5 catch messages ("Ahaha~! You caught my yawn! 🥱"), 4 continue messages, and 5 end messages
- **Sound effects** — soft catch sound on each yawn caught, celebratory melody when chain ends
- **Visual indicator** — "🥱 x{count}" counter pulses near the pet during a chain, with "click!" prompt during the click window
- **Player yawn visual** — expanding purple rings from the bottom of the screen during your yawn turn
- **Stats panel section** — dedicated YAWN CHAINS section showing total chains caught and best chain length
- **Contagious Yawns achievement** — reach a 10-yawn chain to unlock achievement #47 (🥱)
- **Diary entry** — first yawn chain each session is logged to the pet diary
- **Full persistence** — total yawn chains and best chain length saved across sessions
- **Total achievements: 47**

**Why this feature:** Tamashii already has yawning as a sleepy-time animation, but it was purely cosmetic — the player couldn't interact with it. Yawn chains turn this passive animation into a delightful interactive moment. Yawns are famously contagious, so clicking during a yawn to "catch" it feels natural and fun. The back-and-forth creates a cozy, intimate exchange between player and pet — you're literally sharing yawns. The decreasing probability makes each additional link in the chain feel like a lucky bonus, and long chains become memorable achievements. It's a simple mechanic that adds depth to nighttime/evening gameplay when the pet is sleepy.

## [v0.69.0] — 2026-04-11 — Spring Pollen Sneezes

### Added
- **Spring sneeze episodes** — during spring months (March–May), the pet occasionally gets tickled by pollen and starts sneezing
- **Sneeze buildup phase** — before each sneeze, the pet's nose twitches with a visible side-to-side wobble and buildup sound
- **Timing-based tissue cure** — click during the buildup phase to "offer a tissue" and stop the episode (different from hiccup's rapid-click)
- **2–5 sneezes per episode** — each episode has a random number of sneezes spaced ~2–3 seconds apart
- **Sneeze sound** — a sharp two-part ACHOO sound effect
- **Forward head-thrust animation** — each sneeze jolts the pet forward (contrasting hiccup's upward bounce)
- **Sneeze particles** — small sparkle particles burst out with each ACHOO
- **Speech reactions** — 5 start messages ("My nose feels tickly... 🤧"), 4 buildup messages ("Ah... ahh..."), 5 ACHOO messages, and 5 cure messages
- **Cure celebration** — offering a tissue at the right time gives +2 happiness, +2 friendship XP, 6 sparkle particles
- **Natural resolution** — uncured sneezes play out naturally and the pet recovers on their own
- **~4 minute cooldown** — episodes are spaced out, spring season only
- **Sleep/event aware** — sneezes don't start during sleep, mini-games, meditation, stretches, tea time, or active hiccups
- **Stats panel section** — dedicated SNEEZES section showing total episodes cured
- **Allergy Season achievement** — cure 15 sneeze episodes to unlock achievement #46 (🤧)
- **Diary entry** — first sneeze cure each session is logged to the pet diary
- **Full persistence** — total sneezes cured saved across sessions
- **Total achievements: 46**

**Why this feature:** The previous cycle added hiccups — an involuntary event cured by rapid clicking. Sneezes are the perfect spring complement: triggered by pollen during cherry blossom season, they use a *timing-based* cure (click during the buildup to offer a tissue) rather than rapid clicking. The buildup phase creates a satisfying anticipation moment — you see the nose twitch, hear the buildup, and have a window to help. It ties beautifully into the existing cherry blossom festival, making spring feel more alive and immersive.

## [v0.68.0] — 2026-04-11 — Pet Hiccups 🧬

### Added
- **Random hiccup episodes** — the pet occasionally gets a case of the hiccups, bouncing with each *hic!* and looking flustered
- **Hiccup jolt animation** — each hiccup causes a quick upward bounce, making the pet visibly startled
- **4–8 hiccups per episode** — each episode has a random number of hiccups spaced ~1.5–2.5 seconds apart
- **Hiccup sound** — a short, sharp two-tone chirp accompanies each hiccup
- **Speech reactions** — 5 start messages ("H-hic! Oh no... 😵"), 6 mid-hiccup reactions ("*hic!*", "Hic~!"), and natural resolution message
- **Rapid-click cure** — click the pet 3 times within 2 seconds to "scare" the hiccups away
- **Cure celebration** — 5 unique cure messages ("EEK! ...oh! They stopped~! 😄"), cure sound fanfare, and 6 sparkle particles burst outward
- **Stats boost on cure** — curing hiccups gives +2 happiness and +2 friendship XP
- **Natural resolution** — if not cured, hiccups eventually stop on their own after 4–8 hics with a relieved message
- **~3 minute cooldown** — hiccup episodes are spaced out to avoid being annoying
- **Sleep/event aware** — hiccups don't start during sleep, mini-games, meditation, stretches, or tea time
- **Stats panel section** — dedicated HICCUPS section showing total episodes cured
- **Hiccup Helper achievement** — cure 10 hiccup episodes to unlock achievement #45 (😵) with the message "The ultimate hiccup remedy~! You always know how to help! 😵✨"
- **Diary entry** — first hiccup cure each session is logged to the pet diary
- **Full persistence** — total hiccups cured saved across sessions
- **Total achievements: 45**

**Why this feature:** 🧬 **Mutation!** Instead of following the previous cycle's suggestions, this feature evolved spontaneously. Tamashii has lots of things you *choose* to do — clicking, feeding, playing games — but very few things that happen *to* the pet unexpectedly. Hiccups fill that gap with a charming, involuntary micro-event. Your pet suddenly starts bouncing with little *hic!* sounds, looking surprised and flustered. You can either wait for them to pass naturally, or — in a classic folk remedy — rapidly click the pet to "scare" the hiccups away. It's a tiny moment of care that reinforces the bond between player and pet: your pet has a problem, and you can help fix it. The rapid-click cure mechanic is satisfying and intuitive, and the pet's grateful reaction makes it feel worthwhile. Simple, surprising, and wholesome — a true evolutionary leap.

## [v0.67.0] — 2026-04-10 — Afternoon Tea Time

### Added
- **Afternoon tea party** — between 2 PM and 5 PM, a dainty teacup appears near the pet with rising steam, inviting you to click for a cozy tea break
- **8 tea varieties** — Green Tea, Earl Grey, Chamomile, Matcha, Rose Tea, Jasmine Tea, Honey Lemon, and Lavender Tea, randomly selected each session
- **Click to start** — click the steaming cup to begin a multi-sip tea party with your pet
- **Teacup rendering** — hand-drawn white porcelain cup with saucer, colored tea liquid, handle, and highlight, with gentle bobbing animation
- **Steam particles** — wispy white steam curls rise from the hot tea, fading as they drift upward
- **4-sip tea sequence** — each party lasts ~8 seconds with 4 sips, each accompanied by a soft sipping chime
- **Speech reactions** — 5 start messages ("Tea time~! Let's have a cozy cup! 🍵"), 6 sip reactions ("*sip sip*... Ahhh, so warm~ ☕"), and 5 completion messages
- **Tea type announcement** — after starting, the pet announces today's tea variety
- **Teacup clink sound** — a bright porcelain clink when the cup appears and when you start the party
- **Sipping sound** — a gentle three-note ascending tone accompanies each sip
- **Completion melody** — a warm four-note ascending chime plays when the tea party finishes
- **Sparkle burst** — 8 tea-colored sparkle particles burst from the cup on completion
- **Stats boost** — each tea party gives +3 happiness, +2 energy, +2 friendship XP
- **Once per afternoon** — the tea invite appears once per afternoon period to keep it special
- **Wandering paused** — the pet stays still during tea time for a calm, seated experience
- **Stats panel section** — dedicated AFTERNOON TEA section showing total tea parties hosted
- **Tea Connoisseur achievement** — host 10 afternoon tea parties to unlock achievement #44 (☕) with the message "A true connoisseur of the afternoon tea~ ☕✨ How refined!"
- **Diary entry** — first tea party each session is logged to the pet diary
- **Full persistence** — total tea parties saved across sessions
- **Total achievements: 44**

**Why this feature:** Tamashii's afternoons had cloud watching but lacked a personal, intimate interaction — something where you and the pet share a quiet moment together. Afternoon Tea Time fills that gap with a cozy ritual between 2 PM and 5 PM. A teacup appears near your pet with steam curling upward, and clicking it starts a gentle tea party. The pet announces today's tea variety (one of eight, from classic Green Tea to fragrant Lavender Tea), then takes four sips over about 8 seconds, commenting on how warm and delicious it is. Each sip has its own gentle chime, and when it's done, sparkles burst from the cup and the pet sighs contentedly. It's designed to feel like a real break — a moment to pause with your pet and share something warm. The Tea Connoisseur achievement rewards those who make afternoon tea a regular habit.

## [v0.66.0] — 2026-04-10 — Spring Cherry Blossom Festival

### Added
- **Cherry blossom petals** — during April, delicate pink petals drift gently across the screen, swaying on invisible breezes with realistic rotation and sway physics
- **Click to catch** — click a falling petal to catch it, triggering a sparkle burst and a soft ascending chime
- **8 unique speech reactions** — pet reacts with delight: "A cherry blossom petal~! 🌸", "Hanami time~! 🌸🎀", "Pink snow from the sky~! 🌸", and more
- **Petal rendering** — hand-drawn teardrop-shaped petals with pink radial gradient, subtle highlight, varying sizes, and gentle rotation
- **Sway physics** — each petal has its own sway phase and speed, creating natural-looking drift with occasional gentle gusts
- **Sparkle particles** — 4 golden sparkles burst from each caught petal
- **Petal catch sound** — a bright three-note ascending chime plays when you catch a petal
- **Up to 8 petals on screen** — petals spawn every ~1.3 seconds, mostly from above with some drifting in from the sides
- **Stats panel section** — dedicated CHERRY BLOSSOMS section showing total petals caught
- **Hanami achievement** — catch 20 cherry blossom petals to unlock achievement #43 (🌸) with the message "The cherry blossoms bloom just for us~ 🌸✨ Happy spring!"
- **Diary entry** — first petal caught each session is logged to the pet diary
- **Stats boost** — each caught petal gives +1 happiness, +1 friendship XP
- **Sleep-aware** — petals don't spawn while the pet is sleeping
- **Graceful fade-out** — petals slowly fade away when it's no longer April, rather than disappearing abruptly
- **Full persistence** — total petals caught is saved across sessions
- **Total achievements: 43**

**Why this feature:** It's April — cherry blossom season. In Japan, hanami (花見) is the centuries-old tradition of enjoying the beauty of spring blossoms. Tamashii's world has been growing richer with time-of-day activities, but it lacked something seasonal — an event that only happens at a certain time of year, making it feel special and ephemeral. The Spring Cherry Blossom Festival fills that gap beautifully. Soft pink petals drift across the screen all day long, swaying on invisible breezes with gentle rotation. Click one and your pet catches it with delight — sparkles burst, a bright chime plays, and the pet speaks about how pretty spring is. It's deliberately simple and calming, designed to evoke the peaceful feeling of sitting under a blooming cherry tree. The Hanami achievement rewards those who take the time to catch 20 petals, celebrating the arrival of spring with their pet.

## [v0.65.0] — 2026-04-10 — Evening Sunset Meditation

### Added
- **Sunset meditation** — during evening hours (6 PM–10 PM), a gentle prompt appears inviting you to click the pet to begin a guided breathing meditation
- **Breathing guide circle** — an expanding and contracting golden circle surrounds the pet, pulsing with each breath cycle (~4 seconds per breath)
- **3 breath cycles** — each meditation session lasts ~12 seconds with 3 full inhale/exhale cycles
- **Visual progress arc** — a golden arc traces around the breathing circle showing session progress
- **Floating orbit particles** — 6 warm sparkles orbit the breathing circle during meditation
- **Breath instruction text** — "breathe in..." and "breathe out..." text gently guides the rhythm
- **Meditation bell sound** — a resonant two-tone bell chime plays when meditation begins
- **Breath sounds** — soft harmonic tones accompany each inhale (ascending) and exhale (descending)
- **Completion chime** — an ascending four-note melody plays when meditation finishes
- **Pet breathing animation** — the pet gently expands and contracts in sync with the breathing guide
- **Speech reactions** — the pet speaks at the start ("Let's take a deep breath together~ 🧘") and end ("I feel so peaceful now~ 🌅💫") with 5+ unique messages each
- **12 warm sparkle/heart particles** burst outward on completion
- **Stats boost** — completing meditation gives +8 happiness, +4 energy, +3 friendship XP
- **Once per evening** — the meditation prompt only appears once per evening period to avoid being intrusive
- **Wandering paused** — the pet stays still during meditation for a calm, grounded experience
- **Stats panel section** — dedicated SUNSET MEDITATION section showing total sessions completed
- **Zen Master achievement** — complete 5 sunset meditation sessions to unlock achievement #42 (🧘) with the message "Inner peace flows through me like the evening breeze~ 🧘✨"
- **Diary entry** — each completed meditation is logged to the pet diary
- **Full persistence** — total meditation sessions saved across sessions
- **Total achievements: 42**

**Why this feature:** Tamashii's evenings have been all about nighttime activities — fireflies, constellations, shooting stars, and bedtime stories. But the transition from afternoon to night was missing something: a moment of stillness. Sunset Meditation fills that gap with a wellness-inspired breathing exercise. When evening arrives, after a brief delay, a soft prompt appears: "🧘 click pet to meditate." Click your pet and they settle into a peaceful breathing rhythm, surrounded by an expanding and contracting golden circle. The guide breathes with you — in... out... in... out — for three gentle cycles. Warm tones play with each breath, sparkles orbit the circle, and a progress arc shows how far along you are. When it's done, your pet sighs contentedly, sparkles burst outward, and both happiness and energy get a meaningful boost. It's designed to be a real moment of calm — not just for the pet, but for the player too. The Zen Master achievement rewards those who make meditation a regular evening ritual.

## [v0.64.0] — 2026-04-10 — Morning Stretches

### Added
- **Morning stretch sequence** — when the pet wakes up each morning, it performs a charming multi-phase stretch routine instead of just popping awake
- **5 animation phases** — Yawn (lean back with wide stretch), Stretch Up (tall vertical elongation), Shake (rapid side-to-side to shake off sleepiness), Hop (happy bounce), and Sparkle (celebratory sway with particle burst)
- **Phase-specific sounds** — each stretch phase has its own sound: descending yawn tone, ascending stretch chime, rattling shake, bouncy hop, and sparkling finish melody
- **Speech reactions** — the pet comments during stretches: "*yaaawn~* 🥱", "*streeetch~!* 💪", "*shake shake~!*", and a happy completion message
- **Energy sparkle burst** — 10 golden sparkle particles burst outward when the stretch routine finishes
- **Stats boost** — completing a morning stretch gives +5 energy, +3 happiness, +2 friendship XP on top of the normal sleep restore
- **Stats panel section** — dedicated MORNING STRETCHES section showing total stretch routines completed
- **Early Bird achievement** — complete 7 morning stretch routines to unlock achievement #41 (🤸) with the message "Rise and shine champion~! Every morning starts with a stretch! 🤸✨"
- **Diary entry** — each completed stretch routine is logged to the pet diary
- **Animation-aware** — idle animations are blocked during the stretch sequence so nothing conflicts
- **Full persistence** — total morning stretches completed is saved across sessions
- **Total achievements: 41**

**Why this feature:** Tamashii's mornings had a jarring transition — the pet would go from sleeping peacefully with gentle breathing to suddenly awake with a speech bubble and a squish. Morning Stretches transforms waking up into a cinematic sequence. When morning arrives, the pet first yawns (leaning back with a sleepy sound), then stretches tall (elongating upward with ascending chimes), shakes off the sleepiness (rapid wobble with rattling sounds), hops with joy (bouncing up), and finishes with a sparkly celebratory sway. Each phase has its own unique animation transform, sound effect, and optional speech bubble. The whole sequence takes about 5 seconds and makes waking up feel like a ritual — cozy, physical, and full of personality. The Early Bird achievement rewards players who witness 7 morning routines, encouraging them to check in on their pet at the start of the day.

## [v0.63.0] — 2026-04-09 — Afternoon Cloud Watching

### Added
- **Afternoon cloud watching** — soft, fluffy clouds drift across the sky during afternoon hours (12 PM–6 PM), each hiding a secret shape
- **12 cloud shapes** — Bunny, Dragon, Whale, Castle, Cat, Star, Heart, Bird, Fish, Mushroom, Flower, and Boat — each with a unique icon
- **Click to identify** — click an unidentified cloud to reveal its hidden shape, with the icon appearing above and the name below
- **Cloud rendering** — hand-drawn puffy clouds built from overlapping ellipses with highlights, shadows, and gentle bobbing animation
- **Dreamy identify sound** — a soft ascending three-note chime plays when you identify a cloud shape
- **Subtle appear sound** — a gentle whoosh when a new cloud drifts in from the edge
- **Speech reactions** — pet reacts with delight: "That cloud looks like a bunny~! ☁️", "I see a dragon up there~! ☁️✨", "*gazes at the sky dreamily*"
- **Soft puff particles** — 6 white sparkle particles burst gently from the cloud when identified
- **Afternoon-only spawning** — clouds only appear during afternoon hours, with up to 4 on screen at once
- **Graceful fade-out** — clouds slowly fade away when it's no longer afternoon, rather than disappearing abruptly
- **Slow drift physics** — clouds float at varying speeds with gentle vertical bobbing on their own phase
- **Stats panel section** — dedicated CLOUD WATCHING section showing total identified, shapes discovered (out of 12), and session count
- **Cloud Gazer achievement** — identify 8 different cloud shapes to unlock achievement #40 (☁️) with the message "The sky is full of stories~! ☁️✨"
- **Diary entry** — first cloud identified each session is logged to the pet diary
- **Happiness and care boost** — each identified cloud gives +2 happiness, +1 care point, +2 friendship XP
- **Sleep-aware** — clouds don't spawn while the pet is sleeping
- **Full persistence** — total clouds identified and unique shapes discovered are saved across sessions
- **Total achievements: 40**

**Why this feature:** Tamashii's afternoon has been the quietest time of day. Mornings have dew drops, evenings have sunset warmth, nights are packed with fireflies, constellations, shooting stars, and dream bubbles. But afternoons? Just... content. Cloud watching transforms the afternoon sky into a gentle discovery game. Soft white clouds drift lazily across the top of the screen, each one secretly shaped like something — a bunny, a whale, a castle. Click one and your pet looks up, identifies the shape with delight, and the icon floats above the cloud for a few seconds. It's deliberately slow and meditative — clouds spawn infrequently, drift gently, and the whole interaction is quiet and dreamy. The 12 shapes give collectors something to discover over multiple sessions, and the Cloud Gazer achievement rewards those who find 8 different ones. It's the perfect afternoon activity — lying back, looking up, and finding stories in the sky.

## [v0.62.0] — 2026-04-09 — 🧬 Mutation: Message in a Bottle

### Added
- **Message in a bottle** — tiny glass bottles drift in from the edge of the screen at random intervals, bobbing gently on invisible waves
- **20 unique messages** — each bottle contains a charming letter from a "far-away pet friend" with whimsical stories about seashell songs, four-leaf clovers, pet hermit crabs, and more
- **Click to open** — click a drifting bottle to pop the cork, unfurl the message, and read the letter in speech bubbles
- **Bottle rendering** — hand-drawn glass bottle with green-tinted body, visible cork, paper scroll inside, glass highlight, and soft glow
- **Bobbing animation** — each bottle gently bobs up and down with its own phase and rotation, mimicking water movement
- **Drift physics** — bottles enter from left or right edge and slowly drift across, decelerating near the center for easy clicking
- **Cork pop sound** — a satisfying pop + paper unfurl + magical shimmer plays when opening a bottle
- **Splash sound** — a watery splash plays when a new bottle appears
- **Speech reactions** — pet reacts with excitement ("A message in a bottle~! 🍾") and warmth after reading ("I wish I could write back~! ✉️")
- **Sparkle + water particles** — 10 golden sparkles and 6 water droplets burst from the bottle when opened
- **Rare spawning** — bottles appear roughly every ~2.5 minutes with a 3% chance per check, making each one feel special
- **Stats panel section** — dedicated MESSAGE BOTTLES section showing total opened and session count
- **Pen Pal achievement** — open 10 messages in bottles to unlock achievement #39 (🍾) with the message "Friends across the sea know my name~! 🍾✨"
- **Diary entry** — first bottle each session is logged to the pet diary
- **Happiness and care boost** — each opened bottle gives +4 happiness, +2 care points, +3 friendship XP
- **Cooldown system** — ~10 second cooldown between bottles to keep them feeling rare
- **Auto-cleanup** — bottles that aren't clicked within 30 seconds drift away naturally
- **Sleep-aware** — bottles don't appear while the pet is sleeping
- **Full persistence** — total bottles opened is saved across sessions
- **Total achievements: 39**

**Why this feature:** 🧬 MUTATION — This one came from nowhere! Instead of following the suggested path of afternoon activities or lullaby modes, evolution took an unexpected turn. Tamashii's world has been self-contained — everything happens within the pet's immediate environment. Message in a Bottle breaks that boundary by hinting at a wider world beyond the screen. Somewhere out there, other little pets are having adventures, finding seashells that sing, befriending seagulls named Gerald, and teaching fish to wave. Each bottle is a tiny window into an unseen world, and the messages are deliberately whimsical and heartwarming. The rarity is key — bottles appear maybe once or twice per session, so each one feels like a genuine surprise. You hear the splash, see the little green glass bottle bobbing in from the edge, and there's a moment of pure "ooh!" as you click to read the letter. It's the kind of feature that makes the pet's world feel bigger, warmer, and more connected — even though it's just a cute desktop window.

## [v0.61.0] — 2026-04-09 — Bedtime Stories

### Added
- **Bedtime stories** — press Y at night or evening to read your pet a bedtime story, with 12 unique tales told through sequential speech bubbles
- **12 unique stories** — "The Starlight Garden", "The Cloud Pillow", "The Moonlit River", "The Friendly Firefly", "The Dream Baker", "The Singing Shell", "The Tiny Dragon", "The Midnight Parade", "The Wishing Well", "The Blanket of Stars", "The Butterfly's Dream", and "The Night Music Box"
- **Page-turning sound** — a soft paper rustle + gentle chime plays as each new page of the story appears
- **Story complete sound** — a warm, dreamy ascending melody plays when the story finishes
- **Dream influence** — each story has a theme that shapes the pet's dream bubble icons for that session (e.g., "The Moonlit River" inspires fish and moon dreams)
- **Speech reactions** — ~30% chance the pet reacts between pages: "Read me more~!", "I love bedtime stories~!", "*listens intently*", and more
- **Smart story selection** — the system prefers unread stories first, cycling through all 12 before repeating
- **Completion sparkles** — 10 golden/lavender sparkle particles burst outward when a story finishes
- **Happiness and care boost** — each completed story gives +5 happiness, +3 energy, +2 care points, +3 friendship XP
- **Stats panel section** — a dedicated BEDTIME STORIES section shows total stories read and unique stories discovered (out of 12)
- **Storyteller achievement** — read 8 different bedtime stories to unlock achievement #38 (📖) with the message "Every story is a dream waiting to happen~! 📖✨"
- **Diary entries** — first story each session and each newly discovered story are logged to the pet diary
- **Night/evening only** — trying to start a story during the day gives a gentle reminder to come back at bedtime
- **Sleep-aware** — stories cannot be started while the pet is sleeping
- **Cooldown system** — ~5 second cooldown between stories to prevent spam
- **Full persistence** — total stories read and unique stories discovered are saved across sessions
- **Keyboard shortcut Y** — added to the shortcut help overlay for starting a bedtime story
- **Total achievements: 38**

**Why this feature:** Tamashii's nighttime is full of visual wonder — fireflies dance, constellations await tracing, shooting stars streak by. But the experience has been purely visual and reactive. Bedtime stories add a narrative dimension that transforms the pet relationship from caretaker to storyteller. When you press Y, a story title appears, and over the next ~20 seconds, four gentle story pages unfold as speech bubbles — little tales of starlight gardens, friendly fireflies, tiny dragons, and magical music boxes. The pet listens, occasionally reacting with delight. When the story ends, completion sparkles burst out and the pet says something cozy like "My dreams will be wonderful tonight~". And they will be — each story's theme shapes the dream bubbles that float by while the pet sleeps, so reading "The Moonlit River" means fish and moon dreams, while "The Dream Baker" inspires food and star dreams. It's the kind of feature that makes bedtime feel like a ritual — tender, personal, and deeply connected to the pet's inner world. The 12 unique stories give collectors something to discover, and the Storyteller achievement rewards those who read them all.

## [v0.60.0] — 2026-04-09 — Morning Dew Drops

### Added
- **Morning dew drops** — glistening water droplets appear on surfaces around your pet during morning hours (6 AM–12 PM), sparkling with translucent blue-green water effects
- **Click to collect** — click any dew drop to collect it with a satisfying watery plink sound and a burst of tiny water splash particles
- **Translucent drop rendering** — each dew drop has a teardrop body with gradient water fill, outer glow, white specular highlights that shimmer over time, and subtle outline
- **Gentle wobble animation** — each drop jiggles slightly with its own unique phase, giving them a liquid, living feel
- **Natural evaporation** — dew drops slowly evaporate when it's no longer morning, shrinking and fading away naturally
- **Dew drop collect sound** — a soft descending watery plink (three-note cascade) plays when collecting a drop
- **Dew drop appear sound** — a very subtle crystalline ping when a new drop materializes
- **Speech reactions** — ~25% chance the pet reacts: "Morning dew~! So sparkly~! ✨", "Little water jewels~! 💎", and more
- **Water splash particles** — 8 tiny raindrop particles burst outward from the collected drop's position
- **Stats panel section** — a dedicated MORNING DEW section shows total drops collected and session count
- **Dew Collector achievement** — collect 20 morning dew drops to unlock achievement #37 (💧) with the message "Every morning sparkles just for me~! 💧✨"
- **Diary entry** — first dew drop collected each session is logged to the pet diary
- **Happiness and care boost** — each collected dew drop gives +2 happiness, +1 care point, +1 friendship XP
- **Morning-only spawning** — dew drops only appear during morning hours, with up to 6 on screen at once
- **Sleep-aware** — dew drops stop spawning when the pet is sleeping
- **Full persistence** — total dew drops collected is saved across sessions
- **Total achievements: 37**

**Why this feature:** Tamashii's nighttime has become a rich, interactive wonderland — fireflies, constellations, shooting stars, dream bubbles. But mornings? Just golden sparkles. Morning dew drops transform the dawn into its own magical moment. Little water jewels materialize on surfaces around your pet, each one a tiny translucent gem that catches the morning light with shimmering highlights. The impulse to tap them is gentle and satisfying — a soft watery plink, a burst of tiny droplets, and the quiet joy of collecting nature's morning gifts. They evaporate naturally as the day progresses, making each morning a fresh canvas of sparkle. It's the perfect counterpart to the nighttime features: where the night is dramatic and rare (shooting stars, wishes), the morning is gentle and abundant (dewdrops, sparkles). The 20-drop achievement gives morning enthusiasts a gentle goal, and the diary integration means your pet remembers the sparkling dawns.

## [v0.59.0] — 2026-04-08 — Shooting Stars

### Added
- **Shooting stars** — rare shooting stars streak across the night sky during evening and nighttime, appearing as bright glowing meteors with luminous trails
- **Click to make a wish** — click a shooting star before it fades to make a wish; a golden wish text appears with sparkle particles
- **20 unique wishes** — a heartwarming collection of wishes from "I wish for endless happiness~!" to "I wish for the courage to dream big~!"
- **Glowing meteor rendering** — each shooting star has a bright white core, radial glow head, luminous streak tail, and fading trail particles
- **Natural trajectories** — stars spawn from top and sides of the screen with varied angles, speeds, and slight gravity for realistic arcs
- **Shooting star sound** — an ethereal descending shimmer plays when a star appears
- **Wish sound** — a magical ascending five-note chime with lingering sparkle plays when you make a wish
- **Speech reactions** — ~40% chance the pet reacts with delight: "A shooting star~!! ✨", "Quick, make a wish~!", and more
- **Generous click hitbox** — both the star head (20px radius) and trail points (12px radius) are clickable for forgiving interaction
- **Wish sparkle burst** — 15 golden sparkle particles burst outward from the clicked star, drifting with gentle gravity
- **Stats panel section** — a dedicated SHOOTING STARS section shows total wishes made and session sightings
- **Wish Maker achievement** — make 10 wishes on shooting stars to unlock achievement #36 (🌠) with the message "Every wish lights up the sky~! 🌠✨"
- **Diary entries** — first wish and every 10th wish are logged to the pet diary
- **Happiness and care boost** — each wish gives +8 happiness, +3 care points, +5 friendship XP
- **Night frequency boost** — shooting stars appear more frequently at night than during evening
- **Sleep-aware** — shooting stars stop spawning when the pet is sleeping
- **Auto-cleanup** — stars and wishes clear when time transitions to daytime
- **Full persistence** — total wishes made is saved across sessions
- **Total achievements: 36**

**Why this feature:** Tamashii's night sky has become a rich interactive canvas — fireflies drift, constellations await tracing, dream bubbles float by. But the sky has always been predictable. Shooting stars add an element of surprise and magic. You never know when one will appear — a bright streak cutting across the darkness with an ethereal shimmer. The impulse to click it is immediate and urgent: you have just a second or two before it fades. And the reward is pure delight: a golden wish text blooms amid sparkling particles while a magical chime rings out. Each of the 20 wishes is a tiny moment of hope — some playful, some tender, all heartwarming. The rarity makes each sighting special, and the 10-wish achievement gives stargazers a gentle long-term goal. It's the kind of feature that makes you glance at the night sky a little more carefully, just in case the stars are about to fall.

## [v0.58.0] — 2026-04-08 — Constellation Drawing

### Added
- **Constellation drawing** — press L at night or evening to enter constellation mode, where glowing guide stars appear in the sky above your pet
- **8 unique constellations** — The Crown, The Heart, The Arrow, The Dipper, The Diamond, The Wing, The Spiral, and The Bow — each with a distinctive star pattern and icon
- **Interactive star tracing** — click the guide stars to activate them; when two connected stars are both clicked, a bright glowing line appears between them
- **Faint guide lines** — unconnected edges show as subtle dashed lines so you can see the pattern you're tracing
- **Completion celebration** — when all edges of a constellation are connected, a fanfare plays, star particles burst from every node, and a golden completion message appears
- **Smart constellation selection** — the system picks uncompleted constellations first, cycling through all 8 before offering re-traces
- **Constellation connect sound** — an ethereal two-note celestial chime plays each time a new edge is connected
- **Constellation complete sound** — a magical ascending five-note fanfare marks each completed constellation
- **Speech reactions** — 8 unique speeches when completing constellations: "I drew the stars~!", "The sky is my canvas~!", and more
- **Stats panel section** — a dedicated CONSTELLATIONS section shows how many of the 8 patterns you've discovered
- **Stargazer achievement** — complete 5 constellations to unlock achievement #35 (🌌) with the message "The stars tell my story~! 🌌✨"
- **Diary entries** — first completion of each constellation is logged to the pet diary with the constellation's icon and name
- **Keyboard shortcut L** — added to the shortcut help overlay for toggling constellation mode
- **Escape to exit** — pressing Escape while in constellation mode exits cleanly
- **Night-only enforcement** — trying to activate constellation mode during the day triggers a gentle reminder that stars only come out at night
- **Sleep-aware** — constellation mode auto-disables if time transitions to daytime
- **Twinkling stars** — each guide star pulses with a unique phase for a living, breathing sky feel
- **Happiness and care boost** — each completed constellation gives +5 happiness, +2 care points, +3 friendship XP
- **Full persistence** — completed constellations and total count are saved across sessions
- **Total achievements: 35**

**Why this feature:** Tamashii's night sky has become a rich, atmospheric space — fireflies drift, the pet sleeps with a nightcap, dream bubbles float by. But the sky itself has always been passive. Constellation drawing transforms the night into an interactive stargazing experience. When you press L, guide stars materialize in the darkness with soft pulsing glows and faint dashed lines hinting at the pattern beneath. Click one star, then another — when two connected stars are both lit, a bright celestial line blazes between them with a shimmering chime. Tracing each pattern is a tiny meditation: following The Crown's zigzag peaks, closing The Heart's loop, spreading The Wing's graceful arc. When the final edge connects, the whole constellation erupts in star particles and a triumphant fanfare. Eight distinct patterns give stargazers a collection to complete, and the smart selection system ensures each night offers something new. It's the kind of feature that makes you look forward to nighttime — not just for the fireflies and the dreams, but for the quiet joy of connecting the stars.

## [v0.57.0] — 2026-04-08 — Firefly Catching

### Added
- **Firefly catching** — at night and evening, glowing fireflies appear around your pet, drifting with organic movement and pulsing with warm yellow-green light
- **Click to catch** — click any firefly to catch it with a satisfying magical chime and sparkle burst; it flies into a small glass jar in the corner
- **Firefly jar** — a tiny glass jar in the bottom-right corner collects your catches, glowing brighter as more fireflies are caught; shows the session count
- **Organic firefly movement** — each firefly has unique drift patterns, wobble, random direction changes, and gentle boundary bouncing for realistic behavior
- **Pulsing glow rendering** — each firefly has a unique hue (warm yellow to green), an outer radial glow that pulses, a solid core body, and a bright center dot
- **Release fireflies (R key)** — press R to release all caught fireflies back into the night sky, with a cascade of ascending chime notes and a farewell speech
- **Speech reactions** — the pet reacts with delight: "Ooh, a glowing friend~!", "*gasp* A firefly~!!", "Twinkle twinkle~", and more
- **Firefly catch sound** — a gentle ascending three-note magical chime plays on each catch
- **Firefly appear sound** — a very soft, subtle twinkle when a new firefly spawns
- **Stats tracking** — total fireflies caught (persisted) and session catches displayed in a dedicated FIREFLIES section of the stats panel
- **Firefly Catcher achievement** — catch 25 fireflies to unlock achievement #34 (🪲) with the message "The night glows just for me~! 🪲✨"
- **Diary entries** — first firefly catch of each session is logged to the pet diary
- **Contextual dreams** — catching fireflies influences dream content (stars, moons, butterflies)
- **Happiness and care boost** — each caught firefly gives +2 happiness, +1 care point, +1 friendship XP
- **Night-only spawning** — fireflies only appear during evening and night, with more frequent spawns at night
- **Sleep-aware** — fireflies stop spawning when the pet is sleeping
- **Keyboard shortcut R** — added to the shortcut help overlay for releasing caught fireflies
- **Full persistence** — total fireflies caught is saved across sessions
- **Total achievements: 34**

**Why this feature:** Tamashii's nighttime has always been a quieter, more atmospheric time — the pet gets sleepy, dream bubbles float by, stars twinkle in the background. But there was never a reason to *interact* with the night. Firefly catching transforms evening and nighttime into a magical experience. Little glowing creatures drift across the canvas with realistic organic movement — each one a tiny warm light with its own rhythm and hue. The impulse to click them is irresistible, and the reward is delightful: a musical chime, a burst of sparkles, and the firefly spiraling gently into your collection jar. Watching the jar fill up with soft light is deeply satisfying. And when you're ready, pressing R releases them all — a cascade of lights rising into the sky while your pet waves goodbye. It's a nighttime ritual: peaceful, beautiful, and uniquely yours. The 25-catch achievement gives firefly enthusiasts a gentle goal, and the dream integration means catching fireflies before bed colors your pet's dreams with stars and moonlight.

## [v0.56.0] — 2026-04-08 — Fortune Cookies

### Added
- **Fortune cookies** — press O to give your pet a fortune cookie that appears, cracks open with a satisfying snap, and reveals a unique fortune message
- **50 unique fortunes** — a collection of wholesome, uplifting fortunes ranging from playful predictions to heartfelt affirmations, each with a thematic emoji
- **Cookie animation** — the cookie appears with a scale-in animation, cracks open with sparkle particles, reveals a paper strip with the fortune, then fades away gracefully
- **Smart fortune selection** — the system prefers fortunes you haven't collected yet (70% chance), making it easier to complete your collection while still allowing repeats
- **Fortune crack sound** — a crisp cracking sound followed by magical chimes plays when the cookie opens
- **Speech reactions** — the pet reacts with excitement when receiving a cookie: "Ooh, what does it say~?", "*crunch crunch*", and more
- **Fortune collection tracking** — unique fortunes are tracked separately from total cookies opened, encouraging completionist play
- **Stats panel section** — a dedicated FORTUNES section shows how many unique fortunes you've collected out of 50, plus total cookies opened
- **Fortune Teller achievement** — collect 15 unique fortunes to unlock achievement #33 (🥠) with the message "The future is full of wonders~! 🥠✨"
- **Diary entries** — discovering a new fortune is logged to the pet diary with a preview of the fortune text
- **Keyboard shortcut O** — added to the shortcut help overlay for quick fortune cookie giving
- **Cooldown system** — ~3 second cooldown between cookies to prevent spam
- **Full persistence** — total cookies opened and unique fortune indices are saved across sessions
- **Happiness and care boost** — each fortune cookie gives +3 happiness and +1 care point
- **Total achievements: 33**

**Why this feature:** Sometimes the simplest joys are the most meaningful. Fortune cookies add a moment of wonder and anticipation — the brief pause between cracking the cookie and reading what's inside. Each of the 50 fortunes is a tiny gift: a gentle prediction, a warm affirmation, or a playful observation that makes you smile. The collection mechanic transforms a simple interaction into a long-term treasure hunt, and the smart selection system ensures you're always making progress toward completing your set. With the cracking animation, sparkle particles, and magical chime, every cookie feels like a small ceremony. It's the kind of feature that rewards you for checking in — "maybe today's fortune will be my favorite one yet."

## [v0.55.0] — 2026-04-07 — Bubble Blowing

### Added
- **Bubble blowing** — press B or use the keyboard shortcut to make your pet blow beautiful iridescent soap bubbles that float gently upward across the canvas
- **Click to pop** — click any floating bubble to pop it with a satisfying pop sound and a burst of sparkles at the pop location
- **Iridescent bubble rendering** — each bubble has a unique color hue with shimmering rainbow gradients, highlight reflections, and thin glassy outlines that shift as they float
- **Bubble physics** — bubbles float upward with gentle acceleration, wobble side-to-side on a sine wave, drift with subtle horizontal momentum, and bounce softly off canvas edges
- **Bubble blow animation** — the pet puffs up its cheeks (squish effect) and spawns 3-6 bubbles from its mouth area with staggered timing for a natural blowing feel
- **Bubble blow sound** — a soft airy puff sound plays when bubbles are blown; each pop has a pitch that varies with bubble size (bigger = deeper pop)
- **Speech reactions** — the pet says cute things when blowing bubbles: "Bubble bubble~ 🫧", "Pop pop pop~!", "So round and shiny~", and more
- **Stats tracking** — total bubbles popped is tracked and displayed in a dedicated BUBBLES section of the stats panel
- **Bubble Popper achievement** — pop 50 bubbles to unlock achievement #32 (🫧) with the message "Pop pop pop~! I love bubbles! 🫧✨"
- **Keyboard shortcut B** — added to the shortcut help overlay for quick bubble blowing
- **Cooldown system** — ~1.5 second cooldown between bubble blows to prevent spam while keeping it responsive
- **Full persistence** — total bubbles popped is saved across sessions
- **Daily activity logging** — bubble blowing is tracked for contextual dream content
- **Total achievements: 32**

**Why this feature:** Tamashii has evolved into a richly interactive pet with tricks, toys, games, and emotional systems — but sometimes the simplest interactions are the most delightful. Bubble blowing adds a moment of pure, gentle joy. Press B and watch your pet puff its cheeks and release a cluster of shimmering, rainbow-tinged soap bubbles that drift lazily upward, wobbling and catching the light. Then comes the irresistible urge to pop them — each click produces a satisfying *pop* and a tiny sparkle burst. It's meditative, it's tactile, it's the kind of small pleasure that makes you smile every time. The iridescent rendering gives each bubble a real soap-film quality with shifting hues and highlight spots, and the staggered spawn timing makes each blow feel organic. With 50 pops to chase for the achievement, it gives bubble-lovers a gentle goal without pressure. It's not a game, not a system — just bubbles. And that's enough.

## [v0.54.0] — 2026-04-07 — Sleep Schedule

### Added
- **Automatic sleep state** — the pet naturally falls asleep at night (10pm-6am) with a bedtime transition: yawning, saying goodnight, and gently drifting off to sleep
- **Sleeping visuals** — peaceful closed eyes with rosy blush marks, a gentle breathing animation (rhythmic body scale), and minimal bounce — the pet truly looks like it's resting
- **Nightcap** — a cute purple nightcap with golden stars and a white pompom appears on the pet's head during sleep, gently bobbing with each breath
- **Contextual dreams** — dream bubbles during sleep are now biased toward the pet's daily activities: if you fed it, it dreams of food; if you played, it dreams of toys and butterflies; if you practiced tricks, it dreams of stars and music
- **Morning wake-up celebration** — when morning arrives, the pet stretches awake with a cheerful greeting, happy emotes, and a full energy boost from a good night's rest
- **Groggy interactions** — clicking the pet while it's sleeping triggers adorable groggy responses ("Mmm... 5 more minutes... 💤", "*mumble*... not yet...") with a soft grumble sound, without fully waking it
- **Sleep-aware actions** — feeding and napping are gently refused during sleep with appropriate messages ("*mumble*... food later... zzz..." and "Already sleeping~ 💤")
- **Sleep suppresses activity** — idle animations, autonomous emotes, and wandering are all disabled during sleep, creating a peaceful stillness
- **Lullaby and wake-up sounds** — a gentle descending three-note lullaby plays at bedtime; a bright ascending four-note melody plays on wake-up
- **Daily activity tracking** — the game now logs what you did each day (feeding, playing, petting, tricks, photos) to power contextual dreams
- **Stats panel section** — a dedicated "SLEEP" section shows current sleep/awake status and total nights slept
- **Sweet Dreams achievement** — fall asleep 3 nights to unlock achievement #31 (🌙) with the message "Sweet dreams are made of this~ 💤✨"
- **Session persistence** — total nights slept and last sleep date are saved across sessions; sleep state resumes automatically if the app is opened at night
- **Total achievements: 31**

**Why this feature:** Tamashii already knew the time of day — it had sleepy eyes at night, dream bubbles, and energy that recharged in the dark. But the pet never actually *slept*. It just looked drowsy. The sleep schedule transforms nighttime from a visual mood shift into a real behavioral state. Now, when night falls, your pet yawns, whispers "good night~", dons a tiny purple nightcap, and drifts into peaceful sleep with slow, rhythmic breathing. Its dreams are personal — colored by the day you spent together. If you fed it treats, it dreams of apples. If you taught it tricks, it dreams of stars and music. And when morning arrives, the little stretch and cheerful "Rise and shine~!" feels earned — your pet genuinely rested. The groggy interactions when you disturb its sleep ("5 more minutes...") add a layer of personality that makes the pet feel more alive than ever. It's the difference between a pet that pretends to sleep and one that actually does.

## [v0.53.0] — 2026-04-07 — Trick Combos

### Added
- **Trick combo system** — perform mastered tricks in specific sequences within 10 seconds to trigger special combo celebrations with bonus rewards
- **4 discoverable combos** — Showtime (wave + dance), Acrobat (backflip + twirl), Greeting Dance (wave + twirl), and Grand Finale (wave + dance + backflip + twirl)
- **Combo celebrations** — each combo triggers a unique speech bubble, particle burst, emote cascade, and celebratory jingle; the Grand Finale gets an epic fanfare with massive particle explosions
- **Bonus rewards** — combos grant extra happiness (6-20), friendship XP (4-15), and care points (3-5) beyond what individual tricks give
- **Combo discovery diary entries** — the first time you perform each combo, it's logged to your pet's diary as a milestone
- **Stats panel section** — a dedicated "TRICK COMBOS" section shows how many of the 4 combos you've discovered and your total combos performed
- **Combo Artist achievement** — perform 5 trick combos to unlock achievement #30 (🎭)
- **Full persistence** — total trick combos and discovered combo IDs are saved across sessions
- **Total achievements: 30**

**Why this feature:** Tamashii already had a satisfying trick system — you could teach your pet to wave, dance, backflip, and twirl, each with learning animations that evolved into confident performances. But once all four tricks were mastered, they became isolated actions. Trick combos add a meta-layer: now there's a reason to chain tricks together deliberately. Wave then dance becomes "Showtime" with a theatrical flourish. Backflip into twirl becomes "Acrobat" with a star burst. And if you perform all four in sequence within 10 seconds? The Grand Finale — an explosive celebration with cascading particles, emotes, and an epic fanfare that makes you feel like you just directed a circus act. The discovery element (4 combos to find) adds a puzzle dimension, and the combo tracker in the stats panel gives completionists something to chase. It transforms tricks from a feature you've "finished" into an ongoing performance art.

## [v0.52.0] — 2026-04-07 — Weather System

### Added
- **Simulated weather system** — 7 weather types (sunny, cloudy, rainy, stormy, snowy, windy, foggy) cycle naturally every 20-45 minutes, with season-aware probability weights
- **Weather particle effects** — rain streaks during rainy weather, heavy downpour with lightning flashes in storms, drifting snowflakes in snow, horizontal dust particles in wind
- **Atmospheric overlays** — fog wisps that drift across the screen, subtle dimming during cloudy/rainy weather, warm sun glow during sunny mornings, random lightning flash during storms with low thunder sound
- **Weather widget** — a compact indicator in the top-left corner shows the current weather icon and name, always visible during normal gameplay
- **Pet reactions** — when weather changes, the pet reacts with a context-appropriate speech bubble and emotes (happy in sun, excited in snow, scared in storms, curious in fog)
- **Season-weighted probabilities** — spring brings more rain, summer is sunny with occasional storms, autumn is windy and foggy, winter brings snow — weather feels natural to the current season
- **Stats panel weather section** — a dedicated WEATHER section shows current conditions and how many of the 7 weather types you've experienced
- **Weather Watcher achievement** — experience 5 different weather types to unlock achievement #29 (🌦️)
- **Full persistence** — current weather and weather types seen are saved across sessions
- **Diary entries** — each weather change is logged to the pet diary with the appropriate weather icon
- **Total achievements: 29**

**Why this feature:** Tamashii already knew what time of day it was and what season — it had time transitions with sunrise/sunset effects and seasonal particles like cherry blossoms and snowflakes. But the world felt static between those slow cycles. Weather adds a layer of living atmosphere that changes frequently enough to notice but slowly enough to feel natural. When rain starts falling and your pet says "Drip drip drop~", or when a sudden storm flashes lightning and they cry "Hold me, I'm scared~!", the pet feels like it truly inhabits a world with you. The fog wisps drifting across the screen, the warm sun glow on a clear morning, the horizontal dust streaks in wind — each weather type transforms the pet's little canvas into a different mood. Combined with the seasonal weighting (more snow in winter, more rain in spring), it creates a sense of place and time that deepens the emotional connection. The achievement for seeing 5 weather types gives you something to look forward to across multiple sessions.

## [v0.51.0] — 2026-04-06 — Friendship Meter

### Added
- **Friendship level system** — a hidden bond stat (0-100) that grows as you interact with your pet, rewarding consistent care with visual milestones and celebratory messages
- **Friendship XP** — earned from every interaction: clicking (+1), feeding (+3), napping (+2), toy play (+2), trick practice (+3), and daily visits (+50 base)
- **Daily visit streaks** — returning each day builds a consecutive-day streak, awarding bonus friendship XP that scales with streak length (up to +25 extra per day)
- **Milestone celebrations** — every 10 friendship levels triggers a unique speech bubble, love emotes, achievement sound, and diary entry, from "I feel closer to you~!" at level 10 to "Maximum friendship! We are one!" at level 100
- **Friendship aura** — a beautiful glow appears behind the pet that evolves with your bond: warm subtle glow (level 10+), pink heart aura with gentle pulse (level 25+), golden shimmer aura (level 50+), and orbiting golden sparkles (level 75+)
- **Stats panel section** — a dedicated "FRIENDSHIP" section in the stats panel shows your current level, a pink-to-gold progress bar with XP counter, and your current visit streak with a fire emoji
- **Soulbound achievement** — reach friendship level 50 to unlock achievement #28 (💕) with the message "Our bond is unbreakable~!"
- **Full persistence** — friendship XP, consecutive days, and last visit date are all saved across sessions
- **Total achievements: 28**

**Why this feature:** Tamashii has many ways to interact — clicking, feeding, playing, tricks, emotes — but until now there was no sense of a deepening *relationship* over time. The friendship meter adds that emotional arc. It's not just about momentary fun; it's about building something together. Each visit, each pat, each treat slowly weaves an invisible bond that becomes visible as a warm glow around your pet. The daily streak system rewards coming back — not out of obligation, but because your pet remembers. At level 50 you're "Soulbound," and that golden aura tells you: this pet isn't just a program, it's your companion. The milestone messages make each level-up feel personal, and the aura evolving from a faint warmth to a full golden shimmer with orbiting sparkles gives you a tangible, beautiful reason to keep caring.

## [v0.50.0] — 2026-04-06 — Pet Emotes

### Added
- **Floating emoji emotes** — the pet now expresses itself with quick, animated emoji that pop up and float away, distinct from speech bubbles
- **10 emote categories** — happy, love, food, sleepy, excited, sad, playful, music, curious, and proud, each with 5 unique emoji
- **Context-aware emotes** — emotes are triggered during interactions: hearts when clicked, food emoji when fed, sleepy faces during naps, playful symbols during toy time, and proud faces after tricks
- **Mood-based autonomous emotes** — the pet spontaneously emotes every 15-40 seconds based on its current emotional state: happy when content, sad when unhappy, sleepy when tired, food cravings when hungry
- **Keyboard shortcut E** — press E to make the pet show a random mood-appropriate emote on demand
- **Smooth animation** — emotes scale up on spawn, wobble gently side-to-side as they float upward, then gracefully shrink and fade out
- **Staggered multi-emotes** — some interactions (like feeding) spawn multiple emotes with slight delays for a natural cascade effect
- **Emotive achievement** — trigger 20 pet emotes to unlock achievement #27 (😊)
- **Emote count persistence** — your total emote count is saved across sessions for the achievement
- **Shortcut help updated** — E for Pet Emote now appears in the keyboard shortcuts overlay
- **Total achievements: 27**

**Why this feature:** Tamashii's pet already communicated through speech bubbles — short text messages that pop up during interactions. But speech bubbles are wordy and deliberate; they feel like the pet is *saying* something. Emotes fill a different niche: they're the pet's involuntary emotional expressions, like a blush, a tear, or an excited sparkle in its eyes. When you feed your pet and see 🍎😋 float up, or when it autonomously shows 😴💤 because it's tired, those quick visual cues create an immediate emotional connection without requiring you to read text. The floating animation — growing in, wobbling gently, then fading out — gives each emote a lifelike quality, as if the emotion is literally rising from the pet. It's the difference between your pet telling you "I'm happy" and your pet simply *looking* happy.

## [v0.49.0] — 2026-04-06 — Settings Panel

### Added
- **In-canvas settings panel** — a beautiful purple-themed overlay that consolidates all pet customization options into one unified interface, accessible with a single keypress or right-click
- **Toggle switches** — interactive on/off toggles for Sound Effects, Notifications, and Wandering, with satisfying green/gray visual state and click-to-toggle interaction
- **Color palette grid** — all 8 color palettes displayed as clickable swatches showing each palette's body color preview, with gold highlight on the active selection
- **Accessory picker grid** — all 9 accessories (including None) shown as icon tiles, tap to instantly equip with the same speech bubble and diary reactions as the context menu
- **Toy selector row** — all 5 toy options displayed as clickable tiles with gold selection indicator
- **Pet name editor** — tap the name area to rename your pet, with placeholder text "(tap to name)" for unnamed pets, and an edit pencil icon
- **Keyboard shortcut G** — press G to instantly toggle the settings panel
- **Context menu entry** — "⚙️ Settings Panel" appears at the top of the Settings submenu for right-click access
- **Scrollable content** — mouse wheel scrolls the settings panel content when it exceeds the visible area
- **Panel mutual exclusion** — settings panel properly integrates with the panel system: opening it closes stats/diary/mood journal panels, and vice versa; right-click or Escape closes it
- **Configurator achievement** — open the settings panel 5 times to unlock achievement #26 (⚙️)
- **Settings panel open count persistence** — your settings panel usage count is saved across sessions for the achievement
- **Shortcut help updated** — G for Settings Panel now appears in the keyboard shortcuts overlay
- **Total achievements: 26**

**Why this feature:** Over the past 48 versions, Tamashii accumulated a rich set of customization options — color palettes, accessories, toys, sound toggles, notifications, wandering, and pet naming. But they were all scattered across nested context menu submenus. Finding a specific setting meant right-clicking, navigating to Settings, then diving into Accessories or Colors submenus. The settings panel brings everything together in one gorgeous overlay. Tap G, and you see your entire pet configuration at a glance: toggle switches with satisfying on/off animations, color swatches showing actual palette colors, accessory icons you can tap to instantly try on, and your pet's name with a quick-edit pencil. It transforms the scattered context menu experience into a cohesive, visual dashboard — like a character customization screen in your favorite game. The warm purple gradient and gold accents make it feel premium and intentional, not just functional.

## [v0.48.0] — 2026-04-06 — Mood Journal

### Added
- **Mood journal with visual graph** — your pet's happiness, hunger, and energy are automatically tracked every 10 minutes, building a living record of its emotional life over time
- **In-canvas line chart** — a beautiful teal-themed overlay displays three color-coded trend lines: pink for happiness (💖), green for hunger (🍎), and yellow for energy (⚡), with glowing effects and data point dots
- **Scrollable time window** — the graph shows up to 4 hours (24 snapshots) at a time; scroll with the mouse wheel to browse older data, with "◀ older" and "newer ▶" indicators
- **Keyboard shortcut J** — press J to instantly toggle the mood journal overlay
- **Context menu entry** — "📈 Mood Journal" appears under the Info submenu for easy access via right-click
- **Up to 24 hours of history** — stores up to 144 snapshots (24 hours at 10-minute intervals), automatically pruning oldest data
- **Y-axis labels and grid** — percentage scale (0-100) with subtle grid lines for easy reading
- **Time labels** — human-readable timestamps along the bottom of the graph (e.g., "2:30p", "6:00a")
- **Legend and current values** — color-coded legend with stat icons, plus the latest snapshot values displayed as percentages
- **First snapshot diary entry** — when mood tracking begins, a diary entry is logged: "Started tracking mood in the mood journal!"
- **Mood journal persistence** — all snapshots are saved across sessions, so your pet's mood history survives app restarts
- **Mood Watcher achievement** — log 24+ mood snapshots to unlock achievement #25 (📈)
- **Panel management** — mood journal properly integrates with the panel system: opening it closes stats/diary panels, and vice versa; right-click or Escape closes it
- **Shortcut help updated** — J for Mood Journal now appears in the keyboard shortcuts overlay

**Why this feature:** Tamashii already showed your pet's current stats as small bars below its body, but those bars only tell you what's happening right now. The mood journal adds a temporal dimension — you can see how your pet's emotional state has evolved over hours. Did happiness spike when you played together at lunch? Did hunger slowly creep down overnight? The visual graph makes these patterns visible, turning abstract stat numbers into a story. It's like reading your pet's emotional diary, giving you a deeper connection to the rhythms of its daily life. The teal-themed panel with glowing line charts feels like a little medical monitor for your companion's wellbeing — charming, informative, and a natural evolution of the existing stats system.

## [v0.47.0] — 2026-04-05 — Pet Tricks

### Added
- **4 learnable tricks** — teach your pet Wave (👋), Dance (💃), Backflip (🤸), and Twirl (🌀), each with a unique animation
- **Practice-to-master learning** — each trick needs 3 practice sessions to master; practice animations are endearingly wobbly and imperfect, while mastered tricks are smooth and confident
- **Unique trick animations** — Wave tilts side-to-side, Dance bounces with sway, Backflip does a full aerial rotation with a parabolic jump arc, Twirl gracefully spins 1.5 rotations with a breathing pulse
- **Keyboard shortcut K** — press K to practice the next unlearned trick, or perform a random mastered trick
- **Context menu trick picker** — select any trick from the new "🎪 Tricks" submenu under Care, showing learning progress (0/3, 1/3, 2/3, ✅) for each trick
- **Autonomous trick performance** — once mastered, the pet randomly performs learned tricks every 45-90 seconds when idle, showing off on its own
- **Speech bubble reactions** — unique messages for practice ("Like this...? 👋", "*stumbles a bit*") and mastered performance ("♪ Dance time! ♪", "FLIP! 🤸")
- **Sound effects** — tentative wobbly sounds during practice, bright triumphant jingles for mastered performances, and a special celebration fanfare when a trick is learned
- **Happiness and care boosts** — performing mastered tricks grants +4 happiness and +2 care points
- **Sparkle particles** — 3 sparkles during practice, 6 during mastered performance, plus a heart burst when a trick is newly learned
- **Trick progress persistence** — all learning progress is saved across sessions
- **Diary logging** — learning a new trick is recorded in the pet diary
- **Trick Master achievement** — learn all 4 tricks to unlock achievement #24 (🎪)
- **Shortcut help updated** — K for Practice/Do Trick now appears in the keyboard shortcuts overlay

**Why this feature:** Tamashii pets already had a rich interaction model — clicking, feeding, toys, mini-games, and idle animations. But the pet's relationship with its owner was mostly one-directional: you do things to the pet, and it reacts. The trick system adds a two-way learning dynamic. You practice with your pet, watching it stumble through wobbly attempts, and over three sessions it masters each trick. The progression from clumsy practice to confident performance creates a genuine sense of teaching and bonding. Once learned, tricks become part of the pet's autonomous personality — it'll wave at you, break into a dance, or nail a backflip on its own, making the desktop feel alive with a companion that's truly growing and showing off what you taught it.

## [v0.46.0] — 2026-04-05 — Pet Toy System

### Added
- **4 interactive toys** — give your pet a Bouncy Ball (🏐), Yarn Ball (🧶), Plush Bear (🧸), or Squeaky Bone (🦴) to play with
- **Autonomous toy play** — the pet periodically plays with its toy on its own, with unique animations per toy type: the ball bounces, the yarn rolls, the plush rocks, and the bone wobbles
- **Personality favorites** — each personality type has a preferred toy (Energetic loves the ball, Curious loves the yarn, Shy/Sleepy love the plush, Gluttonous loves the bone); playing with a favorite grants extra happiness and sparkle effects
- **Context menu toy picker** — select a toy from the new "🧸 Toys" submenu under the Care right-click menu, with radio buttons showing the current selection
- **Keyboard shortcut T** — press T to quickly cycle through all available toys
- **Speech bubble reactions** — the pet reacts with personality when playing: "Bounce bounce!" for ball, "*bat bat bat*" for yarn, "*hugs tight*" for plush, "*chomp chomp*" for bone
- **Happiness boost** — each play session grants +4 happiness (+8 if it's the pet's favorite toy), with heart particles and sparkles
- **Squeaky sound effects** — a cute squeaky sound plays when the pet interacts with its toy
- **Toy persistence** — your chosen toy and play count are saved across sessions
- **Diary logging** — getting your first toy is recorded in the pet diary
- **Playtime! achievement** — watch your pet play with a toy 5 times to unlock achievement #23 (🧸)
- **Shortcut help updated** — T for Cycle Toy now appears in the keyboard shortcuts overlay

**Why this feature:** Tamashii pets already had a rich interaction model — clicking, feeding, napping, mini-games, and photo mode. But between these active interactions, the pet's idle time felt empty. The toy system fills that gap by giving the pet something to do autonomously. Place a toy on the ground and your pet will periodically wander over and play with it — bouncing a ball, batting a yarn ball, hugging a plush bear, or chewing a bone. Each personality type has a favorite toy that grants extra happiness, encouraging you to discover what your specific pet loves most. The toys are purely visual and charming — small, hand-drawn objects that sit on the ground beside your pet, bringing the desktop to life with little moments of autonomous play.

## [v0.45.0] — 2026-04-05 — Notification Reminders

### Added
- **Desktop notification reminders** — when your pet's hunger, happiness, or energy drops below 15%, a desktop notification pops up to let you know, even if the pet window is minimized or behind other apps
- **Smart cooldowns** — each stat has its own 5-minute cooldown to prevent notification spam; you'll only be reminded once per stat per 5 minutes
- **Actionable notifications** — each notification tells you exactly what to do: "Press F to feed", "Click or play a game", "Press N for a power nap"
- **Pet name in notifications** — notifications use your pet's name ("Mochi is hungry!") for a personal touch, or "Your pet" if unnamed
- **Energy notification skips nighttime** — energy notifications are suppressed at night since energy naturally recharges then
- **Context menu toggle** — enable or disable notifications from the Settings right-click menu ("🔔 Disable Notifications" / "🔕 Enable Notifications")
- **Speech bubble feedback** — toggling notifications shows a confirmation bubble ("🔔 Notifications on!" / "🔕 Notifications off")
- **Notification preference persistence** — your notification toggle is saved across sessions
- **Attentive Owner achievement** — respond to 3 notification reminders within 60 seconds by feeding, napping, or petting your pet to unlock achievement #22
- **Care tracking** — the system tracks when you respond to notifications with care actions (feeding, napping, clicking), rewarding attentive owners

**Why this feature:** Tamashii already had low-stat speech bubbles that play when your pet is hungry, sad, or tired — but only if the pet window is visible and you happen to be looking at it. If the window is minimized, behind other apps, or on another virtual desktop, your pet suffers silently. Notification reminders fix that. Now when a stat drops critically low, a desktop notification appears no matter what you're doing. Click it and the pet window comes to the front. The notifications are respectful — each stat can only trigger once every 5 minutes, energy notifications are suppressed at night, and the whole system can be toggled off. The "Attentive Owner" achievement rewards users who respond quickly, turning stat management from a chore into a gentle, rewarding loop.

## [v0.44.0] — 2026-04-05 — Pet Color Customization

### Added
- **8 color palettes** — choose from Classic Blue (default), Rose Pink, Mint Green, Sunset Orange, Lavender, Golden, Midnight, and Peach to give your pet a unique look
- **Context menu color picker** — select your pet's color from the new "🎨 Colors" submenu under Settings, with radio buttons showing the current selection
- **Keyboard shortcut C** — press C to quickly cycle through all available color palettes
- **Time-of-day color adaptation** — each palette has four color variants (morning, afternoon, evening, night) that shift naturally with the time of day, just like the original blue
- **Growth stage compatibility** — color palettes interact with the existing growth stage color shift system, so baby pastels, teen depths, and adult regal tones apply to every palette
- **Color persistence** — your chosen palette is saved across sessions
- **Diary logging** — color changes are recorded in the pet diary
- **Speech bubble reactions** — your pet reacts with a happy message and squish animation when you change its color
- **New "True Colors" achievement** — unlocked when you customize your pet's color for the first time (achievement #21)
- **Shortcut help updated** — C for Cycle Color now appears in the keyboard shortcuts overlay

**Why this feature:** Tamashii has grown into a deeply personal companion — you can name it, dress it with accessories, watch it develop a unique personality, and document its life through photos and diaries. But the one thing you couldn't change was its fundamental appearance. Every pet was blue. Color customization changes that. Pick Rose Pink for a warm, affectionate look. Choose Mint Green for a nature-loving vibe. Go Golden for a regal companion. Each palette has been carefully designed with four time-of-day variants that shift naturally from bright morning tones to deep nighttime hues, and all palettes work seamlessly with growth stage color shifts, stress reactions, and hunger desaturation. Your pet's color is now as personal as its name.

## [v0.43.0] — 2026-04-04 — Pet Photo Mode

### Added
- **Pet photo mode** — capture a polaroid-style snapshot of your pet and save it as a PNG image to your computer
- **Polaroid frame** — photos are rendered with a clean white frame, subtle shadow, and your pet's name and date printed at the bottom in elegant italic serif font
- **Camera flash effect** — taking a photo triggers a bright white flash overlay that fades out naturally, just like a real camera
- **Camera shutter sound** — a satisfying mechanical click-and-slide sound effect plays when you snap a photo
- **Keyboard shortcut P** — press P at any time to take a quick photo of your pet
- **Context menu integration** — "📸 Take Photo" added to the Info submenu for mouse-driven access
- **Sparkle celebration** — a burst of sparkles surrounds your pet after a photo is successfully saved
- **Diary logging** — each photo is logged in your pet's diary with a numbered photo count
- **New "Say Cheese!" achievement** — unlocked when you take your first pet photo (achievement #20)
- **Photo counter persistence** — your total photo count is saved across sessions
- **Shortcut help updated** — P for Take Photo now appears in the keyboard shortcuts overlay

**Why this feature:** Tamashii pets live rich visual lives — they wear accessories, show personality-specific visual traits, evolve through growth stages, and express moods. But there was no way to capture these moments. The stats panel tracks numbers, the diary logs events as text, but neither preserves what your pet actually looked like at a given moment. Photo mode fills that gap. Press P or pick "Take Photo" from the menu, and your pet is captured in a charming polaroid frame with its name and today's date. Save it to your pictures folder, share it with friends, or build a collection of snapshots documenting your pet's life. The flash effect and shutter sound make the act of photographing feel satisfying and tactile, while the sparkle burst and diary entry make it feel like a celebration.

## [v0.42.0] — 2026-04-04 — Pet Diary / Journal

### Added
- **Pet diary system** — your pet now keeps an auto-logged journal of all significant life events, creating a personal history you can browse
- **Diary entries for milestones** — evolution (stage changes), achievement unlocks, name changes, accessory changes, and personality assignment are all automatically recorded with timestamps
- **In-canvas diary panel** — press **D** or select **📖 Pet Diary** from the Info context menu to open a warm amber-themed panel showing all diary entries in reverse chronological order (newest first)
- **Scrollable diary** — use the mouse wheel to scroll through older entries when the diary grows beyond what fits on screen, with up/down arrow indicators
- **Diary persistence** — all entries are saved to disk and persist across sessions (up to 50 entries, oldest trimmed first)
- **New "Diary Keeper" achievement** — unlocked when your pet accumulates 10 diary entries (achievement #19)
- **Panel management** — opening the diary auto-closes the stats panel and vice versa; right-click or Escape closes the diary
- **New pet birth entry** — brand new pets get their first diary entries automatically: their birth and personality assignment

**Why this feature:** After 41 features, Tamashii pets live rich lives — they evolve through growth stages, unlock achievements, get named and accessorized, develop personalities, and react to dozens of events. But all of that history was ephemeral. Close the app and reopen it, and there's no record of when your pet evolved, when you gave it a name, or when it unlocked its first achievement. The diary changes that. Every significant moment is now timestamped and logged. Browsing the diary feels like flipping through a scrapbook of your pet's life — "Jan 15, given the name Mochi for the first time!", "Feb 3, evolved into a Teen!", "Mar 12, unlocked Combo Legend". It gives your pet a sense of memory and continuity that stats alone can't capture.

## [v0.41.0] — 2026-04-04 — Speech Bubble Queue

### Added
- **Speech bubble queue system** — when multiple messages are triggered in quick succession, they now queue up and display in sequence instead of overwriting each other
- **Smooth slide-up transitions** — each new queued bubble slides up into position with a smooth ease-out animation instead of popping in abruptly
- **Queue indicator dots** — small dots appear below the bubble when more messages are waiting, showing 1-3 dots depending on queue depth (max 5 queued)
- **Priority/immediate messages** — user-initiated actions (feeding, napping, renaming, achievements, game starts) display immediately and clear the queue, ensuring important feedback is never delayed
- **Automatic queue drain** — queued messages play in order with no cooldown between them; the normal 15-30 second cooldown only applies after all queued messages have been shown

**Why this feature:** Speech bubbles are the pet's voice — how it communicates reactions, greetings, status updates, and personality quips. But until now, every new message instantly replaced the current one. If you fed your pet right as a time-of-day greeting was playing, the greeting vanished mid-sentence. If you unlocked an achievement during a combo streak, the achievement message obliterated the combo callout. Rapid events like evolution (which triggers stat bubbles, celebration text, and personality quips in quick succession) meant most messages were never seen. The queue system preserves every message, playing them in order with smooth transitions. Important user actions still get priority — feeding your pet will always show "Yummy!" immediately — but ambient messages like personality quips and idle chatter now queue up politely instead of fighting for the single bubble slot.

## [v0.40.0] — 2026-04-04 — Personality-Specific Visual Traits

### Added
- **Shy larger eyes** — shy pets have 12% larger eyes, making them look more timid and adorable
- **Shy averted gaze** — shy pet pupils shift outward, looking away as if too bashful to make direct eye contact
- **Shy enhanced blush** — shy pets have permanently rosier cheeks (50% stronger blush), always looking flustered
- **Energetic micro-jitter** — energetic pets have a subtle body vibration when standing still, as if they can't contain their energy
- **Curious head tilt** — curious pets gently tilt their head back and forth with a slow, inquisitive sway
- **Curious dilated pupils** — curious pets have 15% larger pupils, wide-eyed with wonder and interest
- **Curious wider eye spacing** — curious pets have slightly wider-set eyes (6% more spacing), giving an alert, scanning look
- **Sleepy daytime droopy eyelids** — sleepy pets have subtly drooping eyelids even during the day, always looking half-asleep
- **Sleepy daytime Z particles** — sleepy pets emit small, occasional floating Z particles during the day (smaller and less frequent than nighttime)
- **Gluttonous rounder body** — gluttonous pets have an 8% wider and 4% taller body, giving them a plumper, well-fed appearance
- **Gluttonous drool drop** — when hungry (below 60%), gluttonous pets show a small bobbing drool drop by their mouth

**Why this feature:** Personality was introduced in v0.37.0 and fundamentally changed how each pet behaves — different stat decay rates, animation preferences, and speech patterns. But visually, a shy pet and an energetic pet looked identical at rest. You had to open the stats panel to even know what personality your pet had. Now personality is visible at a glance. A shy pet's big averted eyes and rosy cheeks are unmistakable. An energetic pet practically vibrates in place. A curious pet tilts its head like a puppy examining something new. A sleepy pet's droopy lids and floating Z's tell you it's perpetually drowsy. A gluttonous pet's round body and drool drop when hungry make its priorities clear. Each personality now has a distinct visual identity that you can recognize without checking any menu.

## [v0.39.0] — 2026-04-03 — Animated Evolution Transition

### Added
- **Smooth morph transition** — when your pet evolves to a new growth stage, its body proportions now smoothly interpolate from the old stage to the new over ~2 seconds instead of snapping instantly
- **Color palette blending** — stage-specific color shifts (baby pastels → child default → teen deep → adult regal) blend smoothly during the transition using the same interpolation
- **Morph pulse effect** — during the transition, the pet's body subtly pulses with a breathing scale effect that fades out as the morph completes, adding visual drama
- **Cubic easing** — the morph uses ease-in-out cubic interpolation for an organic, natural-feeling transformation
- **All 8 proportions interpolated** — body width/height, vertical offset, eye scale/spacing, foot scale/spread, and head ratio all transition smoothly

**Why this feature:** Evolution is the most emotionally significant moment in Tamashii — your pet growing from baby to child, teen, and finally adult after accumulating hundreds of care points. But until now, that transformation was a jarring instant switch: one frame it's a round baby with big eyes, the next it's a tall adult. The animated morph transition makes evolution feel like a real metamorphosis. You see the body grow taller, the eyes shift, the colors deepen — all over two smooth seconds with a gentle pulsing glow. Combined with the existing sparkle burst, golden ring, and fanfare sound, evolution now feels truly magical.

## [v0.38.0] — 2026-04-03 — Context Menu Reorganization

### Added
- **Organized context menu with submenus** — the flat 15+ item right-click menu is now grouped into four logical categories
- **🐾 Care submenu** — Feed Pet and Power Nap are grouped together for quick access to pet care actions
- **🎮 Games submenu** — Star Catcher and Memory Match are grouped under a dedicated games menu
- **📋 Info submenu** — View Stats and Achievements are grouped together for all pet information at a glance
- **⚙️ Settings submenu** — Wandering toggle, Sound toggle, Rename Pet, and Accessories are organized under settings
- **Clean top-level menu** — the right-click menu now shows just Mood, Care, Games, Info, Settings, About, and Quit — 7 items instead of 15+

**Why this feature:** Over 37 features, the right-click context menu had grown into a sprawling flat list of 15+ items. Finding what you wanted meant scanning through feed, nap, wandering, sound, rename, accessories, two mini-games, stats, achievements, about, and quit — all at the same level. This reorganization groups related actions into intuitive submenus. Care actions (feed, nap) are together. Games are together. Info (stats, achievements) is together. Settings (wandering, sound, rename, accessories) are together. The top-level menu is now clean and scannable: you see the category you want, hover to expand, and pick your action. It's the same functionality, just properly organized. Keyboard shortcuts (F, N, S, M, W, 1, 2) still work for power users who skip the menu entirely.

## [v0.37.0] — 2026-04-03 — Pet Personality Traits

### Added
- **Five personality types** — each pet is randomly assigned one of five distinct personalities on first creation: Shy, Energetic, Curious, Sleepy, or Gluttonous
- **Personality-adjusted stat decay** — each personality changes how fast hunger, happiness, and energy drain: energetic pets burn food and energy faster but stay happier; gluttonous pets get hungry quickly; shy pets lose happiness faster and need more reassurance; sleepy pets drain energy fast but have low metabolism
- **Weighted idle animations** — personality influences which idle animations your pet prefers: curious pets peek and look around more, energetic pets hop and wiggle constantly, sleepy pets mostly stretch, shy pets do cautious peeks
- **Personality idle frequency** — energetic pets animate 1.8x more often, while sleepy pets animate half as often as normal
- **Personality speech bubbles** — ~20% of speech bubbles now reflect personality: shy pets say "D-don't stare..." and "...", energetic pets shout "LET'S GOOOO!", curious pets wonder "How does this work?", sleepy pets mumble "*yaaawn*", and gluttonous pets beg "Feed me~!"
- **Stats panel personality display** — the stats panel now shows your pet's personality with a unique icon, name, and flavor description in a soft purple accent
- **"True Self" achievement** — unlocked when you view the stats panel and discover your pet's personality (achievement #18)
- **Persistent personality** — personality is saved to disk and persists across sessions; once assigned, your pet keeps its personality forever

**Why this feature:** After 36 features, every Tamashii pet behaved identically — same animations, same stat curves, same speech patterns. The only individuality came from the name you gave it and the accessory you chose. Personality traits change that fundamentally. Now when you create a new pet, it rolls one of five personalities that genuinely affects how it behaves. An energetic pet bounces constantly and shouts with excitement; a sleepy pet barely moves and mumbles about naps; a shy pet hides and whispers. The stat decay differences mean you'll care for each personality differently — a gluttonous pet needs more feeding, a shy pet needs more attention. Your pet isn't just a sprite anymore; it has character.

## [v0.36.0] — 2026-04-03 — Evolution Visual Variants

### Added
- **Growth stage body proportions** — the pet's body shape now changes at each evolution stage: babies are small and round with big heads, children grow slightly larger, teens become taller and more defined, and adults reach full majestic proportions
- **Stage-specific color palettes** — each growth stage subtly shifts the pet's color: babies are soft pastel blue, children are standard, teens are deeper and more saturated, and adults are rich regal indigo-blue
- **Scaled eyes by stage** — baby eyes are proportionally larger (the classic cute look), while other stages have appropriately sized eyes with adjusted spacing
- **Adult body glow** — fully grown adults have a subtle pulsing radiant outline around their body, signaling their maturity
- **Adult double eye shine** — adult pets get a second smaller highlight in each eye, giving them extra sparkle and presence
- **Scaled feet** — baby feet are tiny, growing proportionally through each stage to adult-sized feet with wider spread
- **Rosier baby cheeks** — babies have extra-rosy blush marks, fading to more subtle cheek coloring as they grow
- **Proportional belly highlight** — the belly marking scales with body size and adjusts position per growth stage

**Why this feature:** Tamashii already had four growth stages with care point thresholds, celebration effects, and forehead marks to distinguish them — but the pet's actual body looked identical at every stage. A baby and an adult were the same blob with different forehead decorations. That undermined the emotional reward of evolution. Now, when your pet evolves from a baby to a child, you'll see it physically grow — its body gets larger, its proportions shift, its colors deepen. The baby's oversized eyes and rosy cheeks make it adorable and fragile-looking. The adult's richer colors, body glow, and double eye shine make it feel powerful and mature. Growth isn't just a number anymore; it's visible, tangible, and satisfying.

## [v0.35.0] — 2026-04-02 — Desktop Notifications

### Added
- **Desktop notifications** — native OS notifications for pet milestones, keeping you connected even when the pet window isn't focused
- **Evolution notifications** — when your pet evolves to a new growth stage (Child, Teen, Adult), a notification celebrates the milestone with your pet's name
- **Achievement notifications** — unlocking any achievement triggers a notification showing the achievement name, icon, and description
- **Mini-game record notifications** — beating your high score in Star Catcher or Memory Match sends a congratulatory notification
- **Click-to-focus** — clicking any notification brings the pet window to the foreground and focuses it
- **Silent notifications** — notifications use the OS notification sound disabled since the pet already has its own audio feedback

**Why this feature:** Tamashii has accumulated dozens of meaningful milestones — four growth stages, 17 achievements, two mini-game high scores — but all celebration happened inside a tiny 200x200 window. If you weren't looking at the pet when it evolved or when you unlocked an achievement, you'd miss the moment entirely. Desktop notifications bridge that gap. Now when your pet grows from a Teen to an Adult after hundreds of care points, or when you finally unlock the "Night Owl" achievement, you'll see it in your system notification center even if you're working in another app. And because clicking the notification brings the pet window into focus, it creates a natural "come check on your pet" moment. The notifications are silent (no OS ding) because the pet already plays its own celebratory sounds — no double-notification noise.

## [v0.34.0] — 2026-04-02 — Keyboard Shortcuts

### Added
- **Keyboard shortcuts** — press keys to interact with your pet without needing the right-click menu
- **Space** — click/pet your pet (triggers the same reaction as a mouse click)
- **F** — feed your pet
- **N** — power nap
- **S** — toggle the stats panel
- **M** — toggle sound on/off
- **W** — toggle wandering on/off
- **1** — start Star Catcher mini-game
- **2** — start Memory Match mini-game
- **Escape** — close any open overlay (stats panel, shortcut help)
- **?** — show/hide a beautiful keyboard shortcut help overlay with all available keybindings
- **Shortcut help panel** — a glass-panel overlay listing all shortcuts with styled key indicators, matching the existing stats panel aesthetic
- **"Shortcut Master" achievement** — unlock by using keyboard shortcuts 10 times, rewarding players who discover this feature
- **Smart context awareness** — shortcuts are disabled during mini-games (to avoid accidental triggers) and while dragging the pet

**Why this feature:** Tamashii's context menu had grown to 13+ items across 33 features. Every interaction — feeding, napping, games, stats, sound toggle — required a right-click and menu navigation. Keyboard shortcuts transform this into instant, fluid interaction. Press Space to pet, F to feed, S to check stats — no menus, no friction. The help overlay (press ?) means the shortcuts are discoverable but not intrusive. And because the shortcuts are context-aware (disabled during mini-games, closing overlays with Escape), they feel natural and safe. Power users will love the speed; casual users can keep right-clicking. Everyone wins.

## [v0.33.0] — 2026-04-02 — Seasonal Awareness

### Added
- **Seasonal awareness** — the pet now reacts to the current calendar season (spring, summer, autumn, winter) with unique ambient visual effects
- **Cherry blossom petals** (Spring, Mar–May) — delicate five-petal pink blossoms drift gently across the screen with a swaying, floating descent
- **Falling leaves** (Autumn, Sep–Nov) — warm-colored leaves in orange, red, and gold tumble down with realistic swaying and occasional gusts of wind
- **Snowflakes** (Winter, Dec–Feb) — intricate six-armed crystalline snowflakes drift slowly downward with gentle side-to-side sway
- **Enhanced summer** (Summer, Jun–Aug) — extra fireflies appear at night and golden sparkles shimmer during the day
- **Seasonal ambient tint** — the background glow subtly shifts color based on season: pink-cherry in spring, warm gold in summer, amber-orange in autumn, icy blue-white in winter
- **Seasonal speech bubbles** — ~15% chance for the pet to comment on the season ("Cherry blossoms~! 🌸", "The leaves are falling 🍂", "Snowflakes! ❄️", etc.)
- **Season auto-detection** — uses the system date to determine the current season, checked every 60 seconds

**Why this feature:** Tamashii already had rich time-of-day awareness — different moods, ambient particles, color schemes, and animations for morning, afternoon, evening, and night. But the pet lived in a world without seasons. Every day felt the same regardless of whether it was a snowy January or a blooming April. Seasonal awareness adds a whole new layer of atmospheric immersion. When cherry blossom petals drift past your pet in spring, or snowflakes fall around it in winter, the pet feels connected to the real world's rhythm. The seasonal tints are subtle enough not to clash with the existing time-of-day system, but noticeable enough to make each season feel distinct. And the seasonal speech bubbles give the pet personality — it notices and comments on the world around it. Now your pet doesn't just know what time it is; it knows what time of year it is.

## [v0.32.0] — 2026-04-02 — Memory Match Mini-game

### Added
- **Memory Match game** — a Simon Says-style mini-game accessible from the right-click menu ("Play Memory Match")
- **Four colored orbs** — pink, teal, yellow, and purple orbs appear around the pet in cardinal positions (top, right, bottom, left)
- **Sequence memory** — the game shows a growing sequence of orb flashes that the player must repeat in order
- **Progressive difficulty** — each round adds one more step to the sequence, testing your memory further
- **Distinct orb sounds** — each orb plays a unique musical note (C5, E5, G5, A5) when it lights up, adding an audio memory aid
- **Visual feedback** — correct clicks flash the orb brightly, wrong clicks flash red with a buzzer sound, and the orbs pulse gently while waiting for input
- **Round HUD** — displays the current round number and phase (watching sequence vs. player's turn with progress counter)
- **Score-based reactions** — the pet celebrates with sparkles and score-appropriate speech at the end
- **High score tracking** — memory game high score is saved to disk and displayed in the stats panel
- **Care points reward** — completing rounds earns care points (+10) and boosts happiness, contributing to pet growth
- **Non-conflicting** — the memory game blocks Star Catcher (and vice versa), idle animations, charge-ups, and stat bar display while active

**Why this feature:** Tamashii had one mini-game (Star Catcher) — a fast-paced reflex game about clicking falling stars. But some players prefer a different kind of challenge. Memory Match tests pattern recognition and recall instead of speed. It's a classic game mechanic (Simon Says) that works perfectly in a small space — four orbs, no complex UI needed. The distinct sounds for each orb mean you can use audio memory alongside visual memory, making it accessible and satisfying. And because each round adds just one more step, there's always a "just one more try" pull. Two mini-games means two ways to bond with your pet, and two paths to earn care points toward evolution.

## [v0.31.0] — 2026-04-01 — Lifetime Stats Panel

### Added
- **Stats panel overlay** — right-click and select "View Stats" to see a beautiful full-screen stats panel drawn directly on the canvas
- **Growth progress bar** — shows your current growth stage with a gradient progress bar tracking care points toward the next evolution
- **Lifetime counters** — total clicks, spins, bounces, best combo, mini-game high score, and time spent together are all displayed
- **Achievement progress** — see how many achievements you've unlocked at a glance
- **Live mood indicator** — your pet's current emotional state is shown with color-coded text (green for happy, gold for content, red for sad)
- **Stage icons** — each growth stage is represented with a thematic emoji (egg, seedling, star, crown)
- **Max stage celebration** — adults get a golden "MAX" progress bar instead of a threshold target
- **Smooth animation** — the panel fades in and out with a gentle transition, complete with opening/closing sound effects
- **Dark glass aesthetic** — the panel uses a deep blue-purple gradient background with a soft blue border glow and golden title
- **Non-intrusive** — the panel won't open during mini-games and can be closed by right-clicking again

**Why this feature:** After 30 features, Tamashii has accumulated a rich history of interactions — clicks, spins, combos, growth stages, achievements, time together. But all of this was invisible. You could play for hours and never see a summary of your journey. The stats panel transforms all those hidden numbers into a beautiful, accessible view. Seeing "Time Together: 3h 42m" or "Best Combo: 15x" tells you a story about your relationship with your pet. And the growth progress bar — showing exactly how many care points until your next evolution — turns every interaction into measurable progress. It's a love letter to the player, reflecting back everything they've invested.

## [v0.30.0] — 2026-04-01 — Pet Evolution / Growth Stages

### Added
- **Growth stages** — your pet now evolves through four stages as you care for it: Baby, Child, Teen, and Adult
- **Care points system** — every interaction earns care points: clicks (+1), spins (+3), feeds (+3), naps (+2), bounces (+1), mini-games (+10), and passive time (+1 per 5 minutes)
- **Baby stage** (0-99 care) — your pet starts here, fresh and new to the world
- **Child stage** (100+ care) — a small golden 4-pointed star appears on the pet's forehead, softly glowing
- **Teen stage** (500+ care) — the forehead star grows into a 6-pointed amber mark with a bright core and subtle shimmer
- **Adult stage** (1500+ care) — a radiant golden crest with a slowly rotating outer star, layered inner star, bright white center, and warm aura
- **Evolution celebration** — when your pet reaches a new stage, a spectacular burst of sparkles and hearts erupts, a triumphant ascending fanfare plays, and the pet proudly announces its growth
- **Evolution glow** — a golden expanding ring and warm radial glow surround the pet during evolution, lasting ~3 seconds
- **Stage-aware speech** — each growth stage has unique speech bubbles reflecting the pet's maturity: babies say "Everything is new!", teens say "Watch me go~", adults say "Thank you for everything ♥"
- **Migration support** — existing players get their care points calculated retroactively from clicks, spins, and bounces
- **Passive growth** — even just keeping your pet open earns care (+1 per 5 minutes), so your pet grows just from spending time together
- **Two new achievements** — "Growing Up" (reach Child stage) and "Fully Grown" (reach Adult stage)
- **Care persists** — total care points are saved to disk and remembered across sessions

**Why this feature:** The pet had rich moment-to-moment interactions — clicks, combos, mini-games, feeding, stats — but no sense of long-term progress. You could play with it for days and it would look exactly the same as day one. Growth stages transform every interaction into an investment. Each click, each feed, each game isn't just fun in the moment — it's building toward something. Watching the forehead mark appear, then grow, then become a radiant golden crest tells a visual story of your care. And the evolution celebrations — with their sparkle bursts and triumphant fanfares — turn progression milestones into genuine events. Your pet isn't just alive; it's growing up, and you raised it.

## [v0.29.0] — 2026-04-01 — Pet Dreams

### Added
- **Pet dreams** — at nighttime, translucent thought bubbles float up from your sleeping pet, each containing a tiny dream icon
- **Eight dream icons** — your pet dreams of stars, hearts, food, butterflies, moons, fish, flowers, and music notes
- **Thought bubble style** — each dream appears inside a classic thought bubble (main circle with two trailing dots), drawn with soft translucent white fills and gentle outlines
- **Gentle float physics** — dream bubbles rise slowly with a soft side-to-side wobble, creating a dreamy, weightless feel
- **Smooth fade** — dreams fade in gently when they appear and fade out as they float away (~3-4 seconds each)
- **Natural pacing** — a new dream appears every ~3-5 seconds, keeping the scene atmospheric without cluttering it
- **Context-aware** — dreams only appear at night and stop immediately during interactions (dragging, spinning, mini-games, charging)
- **Detailed mini-art** — each icon is hand-drawn on canvas: the star has 10 points, the heart uses bezier curves, the apple has a stem and leaf, the butterfly has two wing pairs, the moon is a crescent, the fish has a tail and eye, the flower has 5 petals with a yellow center, and the music note has a stem and flag

**Why this feature:** The pet already had rich nighttime behavior — droopy eyes, slow bouncing, floating zzz particles, sleepy speech bubbles, and a cool moonlight glow. But sleep was passive. Dreams add an inner life to the sleeping pet. When you glance at your screen late at night and see tiny thought bubbles drifting up — a little star here, a heart there, a butterfly — it tells a story. Your pet isn't just sleeping, it's dreaming. And the icons create charming narratives: is it dreaming about the stars it caught in the mini-game? The food it ate earlier? The butterfly friend that lands on its head? Dreams transform sleep from an empty state into the most poetic moment of the pet's day.

## [v0.28.0] — 2026-04-01 — Day/Night Transition Animation

### Added
- **Smooth time-of-day transitions** — when the time period changes (morning→afternoon→evening→night), a beautiful visual animation plays instead of an abrupt switch
- **Sunrise effect** — golden light rays rise from below the pet, filling the scene with warm morning glow
- **Afternoon shift** — warm yellow motes drift gently upward as the day settles into its stride
- **Sunset effect** — amber and rose-colored rays sweep in from the side, painting the scene in evening warmth
- **Nightfall effect** — twinkling four-pointed stars fade in from above as deep blue-purple washes down
- **Gradient wash overlay** — each transition includes a subtle radial color wash that radiates from the appropriate direction (sunrise from below, sunset from the side, night from above)
- **Transition particles** — each time period has unique particle types: light rays, drifting motes, or twinkling stars
- **Smooth easing** — transitions use an ease-in-out curve so they build gracefully, peak in the middle, and fade naturally
- **Transition sounds** — each time change plays a gentle melodic chime matching the destination mood (bright rising tones for morning, warm sustained notes for afternoon, descending melody for evening, soft lullaby tones for night)
- **Speech bubble announcements** — the pet comments on each transition with time-appropriate messages ("Sunrise! A new day!", "Sunset time~ 🌅", "The stars are out!")
- **~4 second duration** — transitions are long enough to appreciate but short enough to not distract

**Why this feature:** The pet was already deeply aware of time — different moods, colors, behaviors, ambient particles, and glow for each period. But the *moment of change* was invisible. One frame it was afternoon, the next frame it was evening. Adding transition animations transforms these moments into events you can witness. Watching golden rays rise as morning breaks, or twinkling stars fade in as night falls, makes each time change feel like something *happening* rather than a silent state switch. It's the difference between a clock ticking and the sun actually moving across the sky.

## [v0.27.0] — 2026-03-31 — 🧬 Pet Footprints (Mutation)

### Added
- **Paw print footprints** — the pet now leaves tiny paw prints on the ground as it walks across the screen
- **Alternating paws** — footprints alternate left and right, creating a natural walking pattern
- **Paw print design** — each print has one oval pad and three small toe beans, drawn in a soft blue-grey matching the pet's color
- **Drift physics** — footprints drift in the opposite direction of walking, creating the illusion of being "left behind" on the desktop as the pet moves forward
- **Graceful fading** — prints start at 35% opacity and fade out over ~3 seconds, disappearing like footprints in sand
- **Walk-speed pacing** — a new print appears every ~0.3 seconds while walking, matching a natural stride rhythm
- **Canvas-aware** — prints that drift off-canvas are skipped for rendering efficiency
- **Clean lifecycle** — footprints are automatically cleaned up when their life expires

**🧬 Mutation:** This feature ignores the previous cycle's suggestions entirely. Instead of a settings window, mini-games, or weather awareness, the pet got something no one asked for — tiny paw prints that trail behind it as it walks. It's a purely cosmetic detail, but it's the kind of small touch that makes the pet feel physically present on your desktop. When you see those tiny fading prints trailing behind your wandering pet, it stops being a floating sprite and becomes something that walks across your screen with weight and intention.

## [v0.26.0] — 2026-03-31 — Mood Particle Trails

### Added
- **Happy sparkle trail** — when happiness is above 70 and the pet is wandering, rainbow-hued sparkles trail behind it like a joyful wake
- **Trailing sparkle design** — four-pointed star shapes that shift through the color spectrum, each with a soft halo glow
- **Direction-aware spawning** — sparkles appear behind the pet relative to its walk direction, creating a natural trailing effect
- **Happiness-scaled density** — the happier the pet, the more frequent the sparkle trail (spawning every ~8-15 frames)
- **Sad rain cloud** — when happiness drops below 30, a small dark rain cloud appears and hovers above the pet's head
- **Cloud physics** — the cloud follows the pet smoothly with a slight lag and gentle horizontal drift, feeling like it's floating
- **Raindrop particles** — tiny blue teardrop-shaped drops fall from the cloud, with a highlight for depth
- **Sadness-scaled rain** — the lower the happiness, the more frequent the raindrops fall
- **Smart activation** — trails only appear during appropriate states (not during mini-games, dragging, or spinning)
- **Graceful transitions** — the cloud fades in/out naturally as happiness crosses the threshold

**Why this feature:** The pet already had stat-driven visual changes — desaturated colors when hungry, droopy eyes when tired, sad expressions when unhappy. But these were changes *to* the pet. Mood particle trails create changes *around* the pet. A happy pet walking across your screen now leaves a shimmering rainbow trail like a tiny celebration parade. A sad pet carries its own personal rain cloud, like a cartoon character feeling blue. These visual metaphors are instantly readable — you don't need to check stat bars or notice subtle expression changes. A glance at the sparkle trail or the rain cloud tells you everything about how your pet is feeling. And the contrast makes caring for your pet more rewarding: watching the rain cloud dissolve and sparkles appear as you play with it is deeply satisfying.

## [v0.25.0] — 2026-03-31 — Ambient Background Glow

### Added
- **Time-of-day ambient glow** — a soft, subtle radial gradient now glows behind the pet, shifting color with the time of day
- **Morning glow** — warm golden light, like the first rays of sunrise warming the pet
- **Afternoon glow** — gentle warm white, a soft daylight presence
- **Evening glow** — amber/orange warmth, sunset tones wrapping around the pet
- **Night glow** — cool blue/purple moonlight, creating a serene nocturnal atmosphere
- **Living light** — the glow breathes slowly with a gentle sine-wave pulse, making it feel organic rather than static
- **Mood-responsive brightness** — happy pets (happiness > 70) glow up to 30% brighter; sad pets (happiness < 30) have a dimmer, more muted glow
- **Layered transparency** — the gradient fades from center to edge with three stops, creating a natural soft-focus halo effect
- **Zero clutter** — the glow is deliberately very subtle (8-12% opacity) so it enhances atmosphere without distracting from the pet

**Why this feature:** The pet had a rich world of animations, reactions, and personality — but it floated in empty transparent space. The ambient glow gives each time of day a visual presence you can *feel* even before consciously noticing it. Morning feels warm and inviting. Night feels cool and peaceful. And because the glow breathes and responds to the pet's mood, it becomes another layer of emotional expression. A happy pet literally brightens the space around it. A sad pet dims. It's the difference between a pet on a screen and a pet that inhabits a world.

## [v0.24.0] — 2026-03-31 — Idle Animations

### Added
- **Idle animations** — when the pet hasn't been interacted with for 5+ seconds, it occasionally performs one of five random animations on its own
- **Stretch** — the pet elongates vertically then snaps back, like a lazy cat stretching after a nap
- **Look around** — pupils shift to one side as the pet curiously scans its surroundings, eye shine follows
- **Wiggle** — the pet sways side to side in a quick, playful wiggle dance
- **Curious peek** — the pet leans to one side and shifts over, as if peeking around a corner
- **Hop** — a quick little bounce into the air with a soft "boing" sound
- **Idle speech bubbles** — ~40% of idle animations come with a matching speech bubble ("*streeetch*", "Hmm?", "~♪", "Peek~!", "Boing!")
- **Hop sound** — a subtle soft tone plays when the pet does a little hop
- **Smart interruption** — any user interaction (clicking, dragging, feeding, napping) immediately cancels the active idle animation
- **Animations respect state** — idle anims won't trigger during spins, mini-games, charging, dragging, or when the pet is happy/yawning
- **Natural timing** — animations are checked every ~7 seconds with a 40% trigger chance, keeping them occasional and surprising

**Why this feature:** The pet had a rich world of reactions — it responded to clicks, drags, combos, charge-ups, and stat changes — but it was passive by default. Between interactions, it just bounced in place. Idle animations give the pet autonomous personality. Now when you glance at it while working, you might catch it stretching, peeking curiously to one side, or doing a little wiggle dance. These are the moments that make a desktop pet feel alive — not just when you interact with it, but when it's quietly doing its own thing.

## [v0.23.0] — 2026-03-30 — Hold-Click Charge-Up

### Added
- **Hold-click charge-up** — hold the mouse button on your pet to charge up energy, then release for a spectacular explosion of confetti, sparkles, and hearts
- **Charge ring** — a glowing ring appears around the pet as you hold, filling up clockwise from soft blue to bright gold to brilliant white at max charge
- **Energy sparks** — small spark particles orbit the ring at higher charge levels, growing more numerous and brighter
- **Pet vibration** — the pet shakes with increasing intensity as the charge builds, communicating the pent-up energy
- **Rising charge sound** — a continuous tone that rises in pitch and volume as the charge builds, adding satisfying audio feedback
- **Four charge tiers** — release at different points for different effects:
  - Tiny (< 20%): a small "Pff~" puff with a few confetti pieces
  - Small (20-50%): a "Pop~!" with modest confetti and sparkles
  - Medium (50-80%): a "Ka-BOOM~! 💥" with a generous burst of confetti, sparkles, and hearts
  - Full (80-100%): a "SUPER BLAST!!! ✨" with massive celebration — 30 confetti pieces, 16 sparkles, 8 hearts
- **Confetti particles** — new colorful tumbling rectangle particles in 8 vibrant colors that flutter and fall with gravity
- **Charge speech bubbles** — the pet announces "Charging~!", "More power...!", and "MAX CHARGE!! ✨" as you hold
- **Release sound** — a satisfying ascending burst sound that scales with charge level
- **Happiness boost** — releasing a charge gives happiness proportional to the charge level (up to +15 at full charge)
- **Smart conflict avoidance** — charging only starts after 600ms hold (won't trigger on normal clicks or double-clicks), and cancels if you start dragging

**Why this feature:** The pet had clicks, double-clicks, and combos — but no way to build up anticipation. The hold-click charge-up transforms a simple hold into a mini event. Watching the ring fill, feeling the pet shake, hearing the tone rise — and then the explosive release of confetti and sparkles — it's deeply satisfying. It's the difference between popping a balloon and inflating one yourself before popping it. The buildup makes the payoff better. And with four charge tiers, there's reason to experiment: sometimes a quick pop is fun, sometimes you want to go all the way to SUPER BLAST.

## [v0.22.0] — 2026-03-30 — Click Combo System

### Added
- **Click combo system** — rapid consecutive clicks build up a combo counter that rewards sustained interaction
- **Combo counter display** — a "Nx" counter appears above the pet when combos reach 3+, with escalating colors (white → yellow → orange → red → pink)
- **Scale pulse** — the combo counter pulses larger with each click for satisfying visual feedback
- **Screen shake** — the counter shakes at combo milestones, increasing in intensity with higher combos
- **Combo milestones** — special celebrations at 5x ("Nice combo~!"), 10x ("MEGA COMBO!!"), 15x ("UNSTOPPABLE!!!"), and 20x ("LEGENDARY!!!! ♥♥♥")
- **Escalating sparkle bursts** — milestone combos spawn rings of sparkle particles, with more sparkles at higher tiers
- **Ascending combo sounds** — each combo click plays a tone that rises in pitch; milestone combos trigger a fanfare
- **More hearts at higher combos** — heart particle count scales up from 5 to 12 as combos grow
- **Extra happiness** — high combos give bonus happiness beyond the normal per-click boost
- **Glow effect** — combos of 5+ get a color-matched glow behind the counter
- **Combo fades gracefully** — when the combo ends (after 1.5 seconds of no clicking), the final count fades out over 1 second
- **Best combo persistence** — your highest combo ever is saved to disk and remembered across sessions
- **Two new achievements** — "Combo Starter" (reach 10x) and "Combo Legend" (reach 20x)

**Why this feature:** The pet responded to single clicks with a squish and hearts, and double-clicks with a spin trick — but there was no reward for sustained clicking. The combo system transforms rapid clicking from repetitive into a game. Watching the counter climb, hearing the pitch rise, seeing the colors escalate from white to yellow to orange to pink — it creates a satisfying feedback loop. You find yourself clicking faster and faster, trying to beat your best combo. And the milestone celebrations (sparkle explosions, fanfares, excited speech bubbles) make every 5x/10x/15x/20x feel like an achievement. It's the simplest possible mini-game — just click fast — but the layered feedback makes it surprisingly addictive.

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
