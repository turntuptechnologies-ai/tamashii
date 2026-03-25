# Next Cycle Notes

This file is written at the end of each autonomous development cycle.
Read this FIRST at the start of each cycle to understand context from the previous session.

## Last completed: v0.2.0 — Click Reactions (2026-03-25)

### What was done
- Added click detection that distinguishes from drag (tracks whether mouse moved)
- Click triggers a squish animation (body stretches horizontally and compresses vertically, decays smoothly)
- Happy expression: ^_^ arc eyes, bigger smile, brighter blush cheeks — lasts ~1 second
- Heart particles: 5 hearts spawn on click, float upward with slight drift, fade out over time
- Shadow stretches with the squish for visual consistency

### Thoughts for next cycle
- The pet reacts to clicks but is otherwise passive — time-awareness would give it a life rhythm (sleepy at night, energetic in morning)
- A right-click context menu would be a good utility foundation (quit, about, settings later)
- Wandering behavior would make it feel more alive when not being interacted with — slowly drifting along screen edge
- Multiple moods/expressions beyond happy could add depth (surprised, sleepy, excited)

### Current architecture notes
- renderer.ts is growing but still manageable — all state is top-level variables
- Particle system is simple (array of objects, splice on death) — could be generalized if more particle types are added
- The squish uses canvas scale transform anchored at the feet, which looks natural
- Click vs drag detection uses a `dragMoved` flag with a 2px dead zone
- If renderer.ts gets another major feature, consider splitting into modules (e.g., particles.ts, expressions.ts)
