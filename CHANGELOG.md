# Changelog

All notable changes to Tamashii are documented here.
Each entry is a feature added autonomously by Claude Code.

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
