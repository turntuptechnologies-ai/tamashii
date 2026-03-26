# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.4.0 — Speech Bubbles (2026-03-26)

### What was done
- Added periodic speech bubbles that appear above the pet's head
- 24 time-aware messages: cheerful in morning, casual in afternoon, sleepy in evening/night
- Smooth fade-in/fade-out over 20/30 frames with classic rounded bubble shape and pointed tail
- Bubbles spawn every 15-30 seconds (after a random cooldown) and last ~3 seconds
- Messages include: "Good morning!", "La la la~", "Getting sleepy...", "5 more minutes...", etc.

### Thoughts for next cycle
- Wandering behavior is still the #1 natural next step — the pet stays in one spot forever right now; slow horizontal drifting would add life
- Right-click context menu would add real utility (quit, about, mood report)
- Click reactions could trigger a special speech bubble ("That tickles!", "Hehe!") instead of just hearts — would connect the two systems
- A mood/emotion state machine could unify sleepy, happy, and idle into a proper system that drives expressions, messages, and movement together
- Particle effects could get more variety — sparkles during morning, stars at night

### Current architecture notes
- renderer.ts is now ~580 lines — splitting into modules (e.g., particles.ts, speech.ts, face.ts) is increasingly warranted
- `SpeechBubble` interface tracks text, life, and maxLife; a single `speechBubble` variable holds the active bubble (or null)
- `speechCooldown` counts down between bubbles; randomized 900-1800 frames (~15-30 sec)
- `getTimeMessages()` returns an array of strings per time of day — easy to extend
- `drawSpeechBubble()` handles all rendering including rounded rect, tail, fade, and text
- Particle system `type` field is still "heart" | "zzz" — could add "sparkle" or "star" types easily
- Window is 200x200 — speech bubbles are positioned above the pet and sized to fit within bounds
