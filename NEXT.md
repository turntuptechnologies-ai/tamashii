# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.3.0 — Time Awareness (2026-03-25)

### What was done
- Added time-of-day detection (morning/afternoon/evening/night) with auto-refresh every 60 seconds
- Body color shifts across the day — bright blue in morning, deeper/muted at night
- Bounce speed and amplitude scale with energy level (fast in morning, barely moving at night)
- Sleepy eyes with drooping eyelids for evening/night
- Yawn animation: squeezed eyes + open oval mouth, triggers periodically when sleepy
- "z" particles float up and drift during nighttime
- Blink rate increases and blink duration lengthens when sleepy
- Blush cheeks dim at night

### Thoughts for next cycle
- Wandering behavior would pair beautifully with time-awareness — pet slowly drifts along the screen edge, maybe more active wandering in the morning
- A right-click context menu is overdue for utility (quit, about, maybe a "how are you?" that reports mood)
- Speech bubbles with time-aware messages ("Good morning!", "Getting sleepy...", "zzz") would add charm
- Multiple moods/expressions system could unify happy/sleepy into a proper mood state machine

### Current architecture notes
- renderer.ts is getting larger (~400 lines) — next major feature should consider splitting into modules
- `currentTimeOfDay` is a module-level variable refreshed by setInterval — all time-dependent logic reads it
- Particle system now has a `type` field ("heart" | "zzz") — easy to extend with more types
- `getBodyColors()` returns a color palette per time of day — centralized place to adjust themes
- `isSleepy()` helper encapsulates the evening/night check
- Yawn state is independent from blink/happy state with its own timer and progress variable
- Bounce speed/amplitude are now driven by `getBounceSpeed()` / `getBounceAmplitude()` functions
