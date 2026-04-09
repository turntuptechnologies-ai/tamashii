declare global {
  interface Window {
    tamashii: {
      moveWindow: (deltaX: number, deltaY: number) => void;
      getScreenBounds: () => Promise<{ screenWidth: number; screenHeight: number; windowX: number; windowY: number }>;
      showContextMenu: (menuData: { timeOfDay: string; wanderingEnabled: boolean; soundEnabled: boolean; notificationsEnabled: boolean; petName: string; accessory: string; colorPalette: string; currentToy: string; trickProgress: Record<string, number> }) => Promise<void>;
      onSetColor: (callback: (colorId: string) => void) => void;
      promptPetName: (currentName: string) => Promise<string | null>;
      onPromptName: (callback: () => void) => void;
      onToggleWandering: (callback: () => void) => void;
      onToggleSound: (callback: () => void) => void;
      onToggleNotifications: (callback: () => void) => void;
      onSetAccessory: (callback: (accessory: string) => void) => void;
      updateMood: (mood: string) => void;
      onSystemStats: (callback: (stats: { cpu: number; mem: number }) => void) => void;
      onShortcutToggled: (callback: (shown: boolean) => void) => void;
      updateAchievements: (data: { progress: { unlocked: number; total: number }; unlocked: { id: string; name: string; icon: string; description: string }[] }) => void;
      loadSaveData: () => Promise<unknown>;
      saveData: (data: unknown) => void;
      onStartMinigame: (callback: () => void) => void;
      onFeedPet: (callback: () => void) => void;
      onPetNap: (callback: () => void) => void;
      onViewStats: (callback: () => void) => void;
      onStartMemoryGame: (callback: () => void) => void;
      showNotification: (title: string, body: string) => void;
      onViewDiary: (callback: () => void) => void;
      onTakePhoto: (callback: () => void) => void;
      savePhoto: (dataUrl: string) => Promise<string | null>;
      onSetToy: (callback: (toyId: string) => void) => void;
      onPerformTrick: (callback: (trickId: string) => void) => void;
      onViewMoodJournal: (callback: () => void) => void;
      onViewSettings: (callback: () => void) => void;
    };
  }
}

const canvas = document.getElementById("pet") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

// --- Sound Effects (Web Audio API) ---
let soundEnabled = true;
let notificationsEnabled = true;
const audioCtx = new AudioContext();

function playTone(freq: number, duration: number, type: OscillatorType = "sine", volume = 0.15, detune = 0): void {
  if (!soundEnabled) return;
  if (audioCtx.state === "suspended") audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.detune.value = detune;
  gain.gain.setValueAtTime(volume, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

function playClickSound(): void {
  // Cute pop — short high tone
  playTone(880, 0.08, "sine", 0.12);
  playTone(1320, 0.06, "sine", 0.06);
}

function playSpinSound(): void {
  // Rising whoosh — ascending frequency sweep
  if (!soundEnabled) return;
  if (audioCtx.state === "suspended") audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(300, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.3);
  gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.4);
}

function playBounceSound(impact: number): void {
  // Soft thud — low frequency, louder with more impact
  const vol = Math.min(0.12, impact * 0.015);
  playTone(120 + impact * 8, 0.12, "sine", vol);
  playTone(80, 0.08, "triangle", vol * 0.5);
}

function playAchievementSound(): void {
  // Triumphant chime — ascending arpeggio
  playTone(523, 0.15, "sine", 0.1);  // C5
  setTimeout(() => playTone(659, 0.15, "sine", 0.1), 100);  // E5
  setTimeout(() => playTone(784, 0.15, "sine", 0.1), 200);  // G5
  setTimeout(() => playTone(1047, 0.3, "sine", 0.12), 300); // C6
}

function playBubbleBlowSound(): void {
  // Soft airy puff — breathy ascending tone
  playTone(400, 0.2, "sine", 0.06);
  playTone(600, 0.15, "sine", 0.04, 10);
  setTimeout(() => playTone(800, 0.12, "sine", 0.03), 80);
}

function playBubblePopSound(pitch = 1): void {
  // Satisfying pop — short bright burst
  playTone(1200 * pitch, 0.06, "sine", 0.1);
  playTone(800 * pitch, 0.04, "triangle", 0.06);
}

function playButterflyLandSound(): void {
  // Gentle flutter — very soft high tinkle
  playTone(1800, 0.06, "sine", 0.04);
  setTimeout(() => playTone(2200, 0.05, "sine", 0.03), 40);
}

function playGreetingSound(): void {
  // Cheerful two-note chirp
  playTone(660, 0.1, "sine", 0.08);
  setTimeout(() => playTone(880, 0.15, "sine", 0.08), 80);
}

function playStarCatchSound(): void {
  // Bright twinkle — quick ascending sparkle
  playTone(1200, 0.08, "sine", 0.1);
  setTimeout(() => playTone(1600, 0.1, "sine", 0.08), 50);
}

function playMinigameEndSound(): void {
  // Fanfare — descending then rising resolution
  playTone(784, 0.12, "sine", 0.1);  // G5
  setTimeout(() => playTone(659, 0.12, "sine", 0.1), 120);  // E5
  setTimeout(() => playTone(784, 0.12, "sine", 0.1), 240);  // G5
  setTimeout(() => playTone(1047, 0.3, "sine", 0.12), 360); // C6
}

function playFeedSound(): void {
  // Cute munch — three quick soft pops at slightly different pitches
  playTone(400, 0.06, "sine", 0.08);
  setTimeout(() => playTone(500, 0.06, "sine", 0.08), 80);
  setTimeout(() => playTone(450, 0.08, "sine", 0.1), 160);
}

function playNapSound(): void {
  // Gentle descending lullaby — soothing two notes
  playTone(600, 0.15, "sine", 0.06);
  setTimeout(() => playTone(400, 0.25, "sine", 0.05), 150);
}

function playComboSound(combo: number): void {
  // Ascending pitch with each combo hit — gets more excited
  const basePitch = 500 + Math.min(combo * 40, 600);
  playTone(basePitch, 0.06, "sine", 0.08);
  if (combo >= 5) {
    setTimeout(() => playTone(basePitch * 1.25, 0.06, "sine", 0.06), 40);
  }
  if (combo >= 10) {
    setTimeout(() => playTone(basePitch * 1.5, 0.08, "sine", 0.08), 80);
  }
}

function playComboMilestoneSound(): void {
  // Big fanfare for milestone combos
  playTone(660, 0.1, "sine", 0.12);
  setTimeout(() => playTone(880, 0.1, "sine", 0.12), 60);
  setTimeout(() => playTone(1100, 0.1, "sine", 0.12), 120);
  setTimeout(() => playTone(1320, 0.2, "sine", 0.14), 180);
}

function startChargeSound(): void {
  if (!soundEnabled) return;
  if (audioCtx.state === "suspended") audioCtx.resume();
  // Continuous rising tone that builds as charge increases
  chargeSoundOsc = audioCtx.createOscillator();
  chargeSoundGain = audioCtx.createGain();
  chargeSoundOsc.type = "sine";
  chargeSoundOsc.frequency.value = 200;
  chargeSoundGain.gain.value = 0;
  chargeSoundOsc.connect(chargeSoundGain);
  chargeSoundGain.connect(audioCtx.destination);
  chargeSoundOsc.start();
}

function updateChargeSound(level: number): void {
  if (!chargeSoundOsc || !chargeSoundGain) return;
  // Pitch rises from 200Hz to 800Hz, volume rises from 0 to 0.08
  chargeSoundOsc.frequency.value = 200 + level * 600;
  chargeSoundGain.gain.value = Math.min(level * 0.08, 0.08);
}

function stopChargeSound(): void {
  if (chargeSoundOsc) {
    try { chargeSoundOsc.stop(); } catch (_e) { /* already stopped */ }
    chargeSoundOsc = null;
  }
  if (chargeSoundGain) {
    chargeSoundGain = null;
  }
}

function playChargeReleaseSound(level: number): void {
  if (!soundEnabled) return;
  if (audioCtx.state === "suspended") audioCtx.resume();
  // Big satisfying release — ascending burst proportional to charge level
  const baseFreq = 400 + level * 400;
  playTone(baseFreq, 0.15, "sine", 0.12);
  setTimeout(() => playTone(baseFreq * 1.25, 0.12, "sine", 0.1), 60);
  setTimeout(() => playTone(baseFreq * 1.5, 0.12, "sine", 0.1), 120);
  if (level > 0.5) {
    setTimeout(() => playTone(baseFreq * 2, 0.2, "sine", 0.12), 180);
  }
  if (level > 0.8) {
    setTimeout(() => playTone(baseFreq * 2.5, 0.25, "sine", 0.1), 240);
  }
}

function playTransitionSound(to: TimeOfDay): void {
  if (!soundEnabled) return;
  if (audioCtx.state === "suspended") audioCtx.resume();
  // Gentle melodic chime that matches the destination time
  if (to === "morning") {
    // Rising, bright — like a sunrise bell
    playTone(523, 0.2, "sine", 0.07);
    setTimeout(() => playTone(659, 0.2, "sine", 0.07), 150);
    setTimeout(() => playTone(784, 0.3, "sine", 0.08), 300);
  } else if (to === "afternoon") {
    // Warm, sustained — midday calm
    playTone(440, 0.25, "sine", 0.06);
    setTimeout(() => playTone(554, 0.3, "sine", 0.06), 200);
  } else if (to === "evening") {
    // Descending, warm — settling down
    playTone(659, 0.2, "sine", 0.06);
    setTimeout(() => playTone(554, 0.2, "sine", 0.06), 200);
    setTimeout(() => playTone(440, 0.3, "sine", 0.06), 400);
  } else {
    // Soft, low — lullaby tones
    playTone(392, 0.3, "sine", 0.05);
    setTimeout(() => playTone(330, 0.4, "sine", 0.04), 250);
  }
}

function startTimeTransition(from: TimeOfDay, to: TimeOfDay): void {
  isTimeTransitioning = true;
  transitionFrom = from;
  transitionTo = to;
  transitionProgress = 0;
  transitionFrame = 0;
  transitionParticles = [];
  playTransitionSound(to);

  // Speech bubble announcing the transition
  const messages: Record<TimeOfDay, string[]> = {
    morning: ["Good morning~! ☀️", "Sunrise! A new day!", "The sun is up~!"],
    afternoon: ["Afternoon already~", "Lunchtime feels~", "The day goes on!"],
    evening: ["Sunset time~ 🌅", "What a pretty sky!", "Evening is here~"],
    night: ["Night night~ 🌙", "The stars are out!", "Sleepy time..."],
  };
  const msgs = messages[to];
  queueSpeechBubble(msgs[Math.floor(Math.random() * msgs.length)], 180);
}

// --- Time of Day ---
type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  if (hour >= 18 && hour < 22) return "evening";
  return "night";
}

// --- Season ---
type Season = "spring" | "summer" | "autumn" | "winter";

function getSeason(): Season {
  const month = new Date().getMonth(); // 0-11
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "autumn";
  return "winter";
}

let currentSeason: Season = getSeason();
let seasonalSpawnTimer = 0;

// Re-check season every 60 seconds (alongside time-of-day check)
setInterval(() => {
  currentSeason = getSeason();
}, 60000);

let currentTimeOfDay: TimeOfDay = getTimeOfDay();

function getMoodLabel(tod: TimeOfDay): string {
  switch (tod) {
    case "morning": return "☀️ Energetic (Morning)";
    case "afternoon": return "🌤️ Content (Afternoon)";
    case "evening": return "🌅 Winding Down (Evening)";
    case "night": return "🌙 Sleepy (Night)";
  }
}

// Report initial mood to tray
window.tamashii.updateMood(getMoodLabel(currentTimeOfDay));

// Re-check time every 60 seconds
setInterval(() => {
  const newTime = getTimeOfDay();
  if (newTime !== currentTimeOfDay) {
    startTimeTransition(currentTimeOfDay, newTime);
    currentTimeOfDay = newTime;
    window.tamashii.updateMood(getMoodLabel(currentTimeOfDay));
  }
}, 60000);

// --- State ---
let frame = 0;
let blinkTimer = 0;
let isBlinking = false;
let bounceOffset = 0;
let bounceDirection = 1;
let yawnTimer = 0;
let isYawning = false;
let yawnProgress = 0; // 0 to 1

// --- Click Reaction ---
let squishAmount = 0; // 0 = normal, positive = squished
let isHappy = false;
let happyTimer = 0;

// --- Spin Trick (double-click) ---
let isSpinning = false;
let spinProgress = 0; // 0 to 1
const SPIN_DURATION = 40; // frames for a full spin
let spinFrame = 0;
let lastClickTime = 0;
const DOUBLE_CLICK_THRESHOLD = 400; // ms

// --- Click Combo System ---
let comboCount = 0;           // current consecutive click count
let comboTimer = 0;           // frames since last click (resets combo when too long)
let bestCombo = 0;            // best combo ever achieved
const COMBO_TIMEOUT = 90;     // ~1.5 seconds at 60fps before combo resets
let comboDisplayTimer = 0;    // how long to show the combo counter after it resets
let comboDisplayValue = 0;    // the combo value to display while fading
let comboShakeAmount = 0;     // screen shake intensity for big combos
let comboScale = 1;           // scale pulse for combo counter

// --- Sleep Schedule ---
let isSleeping = false;
let sleepBreathProgress = 0;       // 0 to 2π, oscillates for breathing animation
let sleepTransitionProgress = 0;   // 0 to 1, for falling asleep / waking up
let sleepTransitionType: "falling_asleep" | "waking_up" | null = null;
let totalNightsSlept = 0;          // for achievement tracking
let lastSleepDate = "";            // ISO date string to track unique nights
let sleepStartFrame = 0;           // frame when sleep began
let sleepNightcapBob = 0;          // wobble for nightcap
let dailyActivityLog: string[] = []; // tracks activities for contextual dreams

function playLullabySound(): void {
  // Gentle descending lullaby — soft, dreamy three-note melody
  playTone(659, 0.2, "sine", 0.06);  // E5
  setTimeout(() => playTone(523, 0.25, "sine", 0.05), 200);  // C5
  setTimeout(() => playTone(392, 0.35, "sine", 0.04), 450);  // G4
}

function playWakeUpSound(): void {
  // Bright ascending chirp — cheerful morning melody
  playTone(392, 0.1, "sine", 0.06);   // G4
  setTimeout(() => playTone(523, 0.1, "sine", 0.07), 100);   // C5
  setTimeout(() => playTone(659, 0.12, "sine", 0.08), 200);  // E5
  setTimeout(() => playTone(784, 0.2, "sine", 0.09), 300);   // G5
}

function logDailyActivity(activity: string): void {
  if (!dailyActivityLog.includes(activity)) {
    dailyActivityLog.push(activity);
  }
}

function getContextualDreamIcons(): string[] {
  // Return dream icons biased toward what the pet did today
  const contextIcons: string[] = [];
  if (dailyActivityLog.includes("fed")) contextIcons.push("food", "food");
  if (dailyActivityLog.includes("played")) contextIcons.push("star", "butterfly");
  if (dailyActivityLog.includes("trick")) contextIcons.push("star", "music");
  if (dailyActivityLog.includes("petted")) contextIcons.push("heart", "heart");
  if (dailyActivityLog.includes("music")) contextIcons.push("music", "music");
  if (dailyActivityLog.includes("photo")) contextIcons.push("flower", "butterfly");
  if (dailyActivityLog.includes("fireflies")) contextIcons.push("star", "moon", "butterfly");
  if (dailyActivityLog.includes("story")) contextIcons.push(...activeStoryDreamTheme);
  // Always include some baseline dream icons
  const baseline = ["star", "heart", "moon", "butterfly", "flower"];
  const allIcons = [...contextIcons, ...baseline];
  return allIcons;
}

function startFallingAsleep(): void {
  if (isSleeping || sleepTransitionType) return;
  sleepTransitionType = "falling_asleep";
  sleepTransitionProgress = 0;

  const bedtimeMessages = [
    "*yaaaawn*... Good night~",
    "So sleepy... night night~ 🌙",
    "Time for bed... *yawn*",
    "Sweet dreams await~ 💤",
    "Sleepy time... zzz...",
  ];
  queueSpeechBubble(bedtimeMessages[Math.floor(Math.random() * bedtimeMessages.length)], 180, true);
  playLullabySound();
  spawnEmoteSet("sleepy", 2);
}

function startWakingUp(): void {
  if (!isSleeping || sleepTransitionType === "waking_up") return;
  sleepTransitionType = "waking_up";
  sleepTransitionProgress = 0;
}

function completeFallingAsleep(): void {
  isSleeping = true;
  sleepTransitionType = null;
  sleepStartFrame = frame;
  sleepBreathProgress = 0;

  // Track unique nights slept
  const today = new Date().toISOString().slice(0, 10);
  if (lastSleepDate !== today) {
    lastSleepDate = today;
    totalNightsSlept++;
    addDiaryEntry("milestone", "🌙", "Fell asleep for the night~ Sweet dreams!");
  }
  saveGame();
}

function completeWakingUp(): void {
  isSleeping = false;
  sleepTransitionType = null;
  sleepBreathProgress = 0;
  dailyActivityLog = []; // reset daily activities for new day

  // Wake up celebration
  const wakeMessages = [
    "Good morning~! ☀️ *stretch*",
    "Rise and shine~! I slept so well!",
    "What a great sleep! Ready for today!",
    "*yawn* ...Morning! I feel refreshed~!",
    "New day, new adventures~! ☀️",
  ];
  queueSpeechBubble(wakeMessages[Math.floor(Math.random() * wakeMessages.length)], 200, true);
  playWakeUpSound();
  spawnEmoteSet("happy", 2);

  // Full energy restore from a good night's sleep
  petEnergy = Math.min(100, petEnergy + 30);

  // Squish animation for the stretch
  squishAmount = 0.5;
  isHappy = true;
  happyTimer = 90;

  saveGame();
}

// --- Idle Animations ---
type IdleAnimation = "none" | "stretch" | "look_around" | "wiggle" | "curious_peek" | "hop";
let idleAnim: IdleAnimation = "none";
let idleAnimProgress = 0;       // 0 to 1
let idleAnimTimer = 0;          // frames until next idle anim check
let lastInteractionTime = 0;    // timestamp of last user interaction
const IDLE_ANIM_COOLDOWN = 420; // ~7 seconds between idle anim attempts
const IDLE_ANIM_IDLE_THRESHOLD = 5000; // 5 seconds of no interaction before idle anims start
let idleLookDirection = 1;      // -1 or 1 for look_around direction
let idlePeekDirection = 1;      // -1 or 1 for curious_peek direction

const idleAnimMessages: Record<string, string[]> = {
  stretch: ["*streeetch*", "Ahh~", "So stiff..."],
  look_around: ["Hmm?", "What's that?", "Looking around~"],
  wiggle: ["~♪", "La la~", "Wiggle wiggle!"],
  curious_peek: ["Hello?", "Anyone there?", "Peek~!"],
  hop: ["Boing!", "Hup!", "Wheee~"],
};

function startIdleAnimation(): void {
  if (idleAnim !== "none" || isSpinning || isDragging || isCharging || minigameActive || memoryGameActive || activeTrick !== null || isSleeping) return;
  // Pick animation weighted by personality
  idleAnim = pickWeightedIdleAnimation();
  idleAnimProgress = 0;
  if (idleAnim === "look_around") {
    idleLookDirection = Math.random() < 0.5 ? -1 : 1;
  } else if (idleAnim === "curious_peek") {
    idlePeekDirection = Math.random() < 0.5 ? -1 : 1;
  }
  // Play a subtle sound for hop
  if (idleAnim === "hop") {
    playTone(600, 0.06, "sine", 0.05);
  }
  // ~40% chance to show a speech bubble with the animation
  if (!speechBubble && Math.random() < 0.4) {
    const msgs = idleAnimMessages[idleAnim];
    const msg = msgs[Math.floor(Math.random() * msgs.length)];
    queueSpeechBubble(msg, 90);
  }
}

function getIdleAnimDuration(): number {
  switch (idleAnim) {
    case "stretch": return 90;       // ~1.5 seconds
    case "look_around": return 120;  // ~2 seconds
    case "wiggle": return 80;        // ~1.3 seconds
    case "curious_peek": return 100; // ~1.7 seconds
    case "hop": return 50;           // ~0.8 seconds
    default: return 60;
  }
}

// --- Pet Personality ---
type Personality = "shy" | "energetic" | "curious" | "sleepy" | "gluttonous";
let petPersonality: Personality | null = null; // null = not yet assigned

const PERSONALITY_NAMES: Record<Personality, string> = {
  shy: "Shy",
  energetic: "Energetic",
  curious: "Curious",
  sleepy: "Sleepy",
  gluttonous: "Gluttonous",
};

const PERSONALITY_ICONS: Record<Personality, string> = {
  shy: "🫣",
  energetic: "⚡",
  curious: "🔍",
  sleepy: "😴",
  gluttonous: "🍔",
};

const PERSONALITY_DESCRIPTIONS: Record<Personality, string> = {
  shy: "Blushes easily, quiet but sweet",
  energetic: "Always bouncing, never slows down",
  curious: "Loves peeking around and exploring",
  sleepy: "Drowsy dreamer, loves naps",
  gluttonous: "Lives to eat, always hungry",
};

// Stat decay multipliers per personality
const PERSONALITY_DECAY: Record<Personality, { hunger: number; happiness: number; energy: number }> = {
  shy:        { hunger: 1.0,  happiness: 1.3,  energy: 1.0  }, // loses happiness faster (needs reassurance)
  energetic:  { hunger: 1.2,  happiness: 0.7,  energy: 1.4  }, // burns energy & food fast, stays happy
  curious:    { hunger: 1.0,  happiness: 1.0,  energy: 1.1  }, // balanced, slightly more energy use
  sleepy:     { hunger: 0.8,  happiness: 1.0,  energy: 1.5  }, // low metabolism but drains energy fast
  gluttonous: { hunger: 1.6,  happiness: 0.9,  energy: 0.9  }, // gets hungry fast, otherwise content
};

// Idle animation weights per personality (higher = more likely to pick that anim)
const PERSONALITY_IDLE_WEIGHTS: Record<Personality, Record<string, number>> = {
  shy:        { stretch: 1, look_around: 0.5, wiggle: 0.5, curious_peek: 2, hop: 0.3 },
  energetic:  { stretch: 0.5, look_around: 1, wiggle: 2, curious_peek: 1, hop: 2.5 },
  curious:    { stretch: 0.5, look_around: 2.5, wiggle: 1, curious_peek: 2.5, hop: 1 },
  sleepy:     { stretch: 2.5, look_around: 0.5, wiggle: 0.5, curious_peek: 0.5, hop: 0.3 },
  gluttonous: { stretch: 1.5, look_around: 1, wiggle: 1.5, curious_peek: 1, hop: 1 },
};

// Personality-specific speech bubbles
const PERSONALITY_MESSAGES: Record<Personality, string[]> = {
  shy: [
    "...", "D-don't stare...", "You're... nice.", "*hides*", "Eep~!",
    "I-I like you...", "So embarrassing...", "Please be gentle...",
  ],
  energetic: [
    "LET'S GOOOO!", "I can't sit still~!", "ZOOM ZOOM!", "More! More!",
    "Energy overload!!", "Race you~!", "Woohoo~!", "So pumped!!",
  ],
  curious: [
    "What's that?!", "Ooh, interesting~", "Tell me more!", "I wonder...",
    "Let me see!", "How does this work?", "Fascinating~!", "Hmm hmm hmm~",
  ],
  sleepy: [
    "*yaaawn*", "Five more minutes...", "So comfy...", "Naptime?",
    "zzz... huh?", "I dreamt of clouds~", "Sleepy...", "*dozes off*",
  ],
  gluttonous: [
    "Is it snack time?", "I smell food~!", "Nom nom nom!", "Feed me~!",
    "My tummy spoke!", "Yummy thoughts~", "Seconds please!", "Hungry again...",
  ],
};

// Idle animation frequency multiplier per personality
const PERSONALITY_IDLE_FREQUENCY: Record<Personality, number> = {
  shy: 0.7,        // less frequent — shy pets are still
  energetic: 1.8,  // much more frequent
  curious: 1.4,    // moderately more frequent
  sleepy: 0.5,     // rare — too tired to move
  gluttonous: 1.0, // normal
};

function assignPersonality(): Personality {
  const types: Personality[] = ["shy", "energetic", "curious", "sleepy", "gluttonous"];
  return types[Math.floor(Math.random() * types.length)];
}

function pickWeightedIdleAnimation(): IdleAnimation {
  const anims: IdleAnimation[] = ["stretch", "look_around", "wiggle", "curious_peek", "hop"];
  if (!petPersonality) {
    return anims[Math.floor(Math.random() * anims.length)];
  }
  const weights = PERSONALITY_IDLE_WEIGHTS[petPersonality];
  const totalWeight = anims.reduce((sum, a) => sum + (weights[a] || 1), 0);
  let roll = Math.random() * totalWeight;
  for (const a of anims) {
    roll -= (weights[a] || 1);
    if (roll <= 0) return a;
  }
  return anims[anims.length - 1];
}

// --- Hold-Click Charge-Up ---
let isCharging = false;        // true when mouse is held down without moving
let chargeStartTime = 0;      // timestamp when charge started
let chargeLevel = 0;          // 0-1 smoothed charge progress
let chargeReleased = false;   // true briefly after charge release for explosion
let chargeReleaseLevel = 0;   // the charge level at time of release
let chargeVibrate = 0;        // vibration intensity during charge
let chargeRingPulse = 0;      // ring animation phase
const CHARGE_MIN_TIME = 600;  // ms before charge starts registering (to not conflict with normal click)
const CHARGE_MAX_TIME = 4000; // ms for full charge
let chargeSoundOsc: OscillatorNode | null = null;
let chargeSoundGain: GainNode | null = null;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  type: "heart" | "zzz" | "dust" | "sparkle" | "pollen" | "firefly" | "star" | "sweat" | "growl" | "confetti" | "raindrop" | "happy_trail" | "blossom" | "leaf" | "snowflake";
  color?: string; // optional color for confetti
}

const particles: Particle[] = [];
let zzzSpawnTimer = 0;
let ambientSpawnTimer = 0;

// --- Fortune Cookies ---
const FORTUNE_MESSAGES: string[] = [
  "A smile is your greatest accessory~ 😊",
  "Good things come to those who wait... and click! 🖱️",
  "Today is a perfect day for a nap~ 💤",
  "Your lucky number is 7. Or maybe 42. 🔢",
  "A butterfly will bring you good news~ 🦋",
  "The stars are aligned in your favor tonight~ ⭐",
  "Someone is thinking of you right now~ 💭",
  "A tasty treat awaits you just around the corner~ 🍎",
  "Your kindness ripples outward like a stone in water~ 🌊",
  "Dance like nobody's watching! 💃",
  "The best adventures start with a single step~ 🐾",
  "You are braver than you believe~ 💪",
  "A warm surprise will brighten your evening~ 🌅",
  "Trust your instincts — they know the way~ 🧭",
  "Happiness is homemade~ 🏠",
  "The moon has a secret just for you~ 🌙",
  "Every cloud has a silver lining... and sparkles! ✨",
  "Your pet thinks you're the best human ever~ 💕",
  "Fortune favors the bold — and the fluffy~ 🐾",
  "A friend in need is a friend indeed~ 🤝",
  "Tomorrow holds a pleasant surprise~ 🎁",
  "Laughter is the best medicine~ 😄",
  "You will master a new trick soon~ 🎪",
  "The weather will be perfect for stargazing~ 🔭",
  "A dream you had will come true~ 💫",
  "Your creativity knows no bounds~ 🎨",
  "Patience brings all good things~ ⏳",
  "You radiate warmth wherever you go~ ☀️",
  "An old friend will reach out to you~ 📬",
  "The next bubble you blow will be the biggest yet~ 🫧",
  "Wisdom comes from listening to your heart~ ❤️",
  "A cozy blanket and warm cocoa await~ ☕",
  "You will discover something wonderful today~ 🔍",
  "The universe conspires in your favor~ 🌌",
  "Be like water — gentle, but unstoppable~ 💧",
  "Your smile lights up the darkest room~ 💡",
  "Good fortune follows those who are kind~ 🌸",
  "A melody in your heart will guide you home~ 🎵",
  "The best is yet to come~ 🌈",
  "You are exactly where you need to be~ 📍",
  "A shooting star has your name on it~ 🌠",
  "Believe in yourself — your pet already does~ 🐱",
  "Every sunset promises a new dawn~ 🌄",
  "Your next adventure will be legendary~ ⚔️",
  "A little rest goes a long way~ 😴",
  "The secret ingredient is always love~ 💖",
  "You make the world a better place~ 🌍",
  "Magic is all around you — just look closer~ ✨",
  "Your lucky color today is golden~ 🟡",
  "A purr of contentment echoes in the wind~ 🐾",
];

interface FortuneCookie {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
  phase: "appearing" | "cracking" | "reading" | "fading";
  timer: number;
  fortuneIndex: number;
}

let activeFortuneCookie: FortuneCookie | null = null;
let fortuneCookieCooldown = 0;
const FORTUNE_COOKIE_COOLDOWN = 180; // ~3 seconds between cookies
let totalFortuneCookies = 0;
let uniqueFortunesCollected: Set<number> = new Set();

// --- Firefly Catching ---
interface Firefly {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
  glowPhase: number;
  glowSpeed: number;
  hue: number; // 50-80 range for warm yellow-green
  driftAngle: number;
  driftSpeed: number;
  wobbleOffset: number;
  life: number;
  maxLife: number;
  caught: boolean;
  catchAnimProgress: number; // 0-1 animation to jar
}

const fireflies: Firefly[] = [];
let fireflySpawnTimer = 0;
const FIREFLY_SPAWN_INTERVAL = 180; // ~3 seconds between spawns
const FIREFLY_MAX_COUNT = 8;
let totalFirefliesCaught = 0;
let sessionFirefliesCaught = 0;
let firstFireflyCaughtThisSession = false;
let fireflyCatchJarGlow = 0; // glow animation when catching

const FIREFLY_CATCH_SPEECHES = [
  "Ooh, a glowing friend~! ✨",
  "So pretty~! Come here little light~ 🌟",
  "*gasp* A firefly~!! 🪲",
  "Twinkle twinkle~ ✨",
  "I caught a star~! ⭐",
  "How magical~! 💫",
  "The night is full of wonders~ 🌙",
  "Another one for the collection~! 🫙",
];

function playFireflyCatchSound(): void {
  // Soft magical chime — gentle ascending tinkle
  playTone(1200, 0.12, "sine", 0.06);
  setTimeout(() => playTone(1500, 0.1, "sine", 0.05), 60);
  setTimeout(() => playTone(1800, 0.08, "sine", 0.04), 120);
}

function playFireflyAppearSound(): void {
  // Very subtle soft twinkle
  playTone(2000, 0.06, "sine", 0.02);
  setTimeout(() => playTone(2400, 0.05, "sine", 0.015), 80);
}

function spawnFirefly(): void {
  if (fireflies.length >= FIREFLY_MAX_COUNT) return;
  if (currentTimeOfDay !== "night" && currentTimeOfDay !== "evening") return;
  if (isSleeping) return;

  const w = canvas.width;
  const h = canvas.height;
  // Spawn from edges or random positions in upper 2/3 of canvas
  const edge = Math.random();
  let x: number, y: number;
  if (edge < 0.3) {
    x = -10;
    y = 20 + Math.random() * (h * 0.5);
  } else if (edge < 0.6) {
    x = w + 10;
    y = 20 + Math.random() * (h * 0.5);
  } else {
    x = 20 + Math.random() * (w - 40);
    y = 10 + Math.random() * (h * 0.4);
  }

  fireflies.push({
    x, y,
    baseX: x,
    baseY: y,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.3,
    size: 2.5 + Math.random() * 1.5,
    glowPhase: Math.random() * Math.PI * 2,
    glowSpeed: 0.03 + Math.random() * 0.03,
    hue: 50 + Math.random() * 30,
    driftAngle: Math.random() * Math.PI * 2,
    driftSpeed: 0.005 + Math.random() * 0.01,
    wobbleOffset: Math.random() * Math.PI * 2,
    life: 0,
    maxLife: 600 + Math.floor(Math.random() * 600), // 10-20 seconds
    caught: false,
    catchAnimProgress: 0,
  });

  playFireflyAppearSound();
}

function updateFireflies(): void {
  // Only spawn at night/evening
  if (currentTimeOfDay === "night" || currentTimeOfDay === "evening") {
    fireflySpawnTimer++;
    // Spawn more frequently at night than evening
    const interval = currentTimeOfDay === "night" ? FIREFLY_SPAWN_INTERVAL : FIREFLY_SPAWN_INTERVAL * 2;
    if (fireflySpawnTimer >= interval && !isSleeping) {
      fireflySpawnTimer = 0;
      if (Math.random() < 0.7) { // 70% chance each interval
        spawnFirefly();
      }
    }
  } else {
    // Daytime — fireflies fade away
    fireflySpawnTimer = 0;
  }

  // Jar glow decay
  if (fireflyCatchJarGlow > 0) {
    fireflyCatchJarGlow = Math.max(0, fireflyCatchJarGlow - 0.02);
  }

  for (let i = fireflies.length - 1; i >= 0; i--) {
    const f = fireflies[i];
    f.life++;

    if (f.caught) {
      // Animate toward jar position (bottom-right corner)
      f.catchAnimProgress = Math.min(1, f.catchAnimProgress + 0.04);
      const jarX = canvas.width - 22;
      const jarY = canvas.height - 25;
      const t = f.catchAnimProgress;
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      f.x = f.x + (jarX - f.x) * eased * 0.15;
      f.y = f.y + (jarY - f.y) * eased * 0.15;
      f.size *= 0.97;
      if (f.catchAnimProgress >= 1 || f.size < 0.5) {
        fireflies.splice(i, 1);
        fireflyCatchJarGlow = 1;
      }
      continue;
    }

    // Organic movement: drift + wobble + gentle direction changes
    f.driftAngle += (Math.random() - 0.5) * 0.1;
    f.vx += Math.cos(f.driftAngle) * f.driftSpeed;
    f.vy += Math.sin(f.driftAngle) * f.driftSpeed;

    // Dampen velocity
    f.vx *= 0.98;
    f.vy *= 0.98;

    // Wobble
    f.x += f.vx + Math.sin(f.life * 0.02 + f.wobbleOffset) * 0.3;
    f.y += f.vy + Math.cos(f.life * 0.015 + f.wobbleOffset) * 0.2;

    // Soft boundary bouncing
    const margin = 15;
    if (f.x < margin) f.vx += 0.05;
    if (f.x > canvas.width - margin) f.vx -= 0.05;
    if (f.y < margin) f.vy += 0.03;
    if (f.y > canvas.height * 0.7) f.vy -= 0.04;

    // Glow pulsing
    f.glowPhase += f.glowSpeed;

    // Remove if life expired or out of bounds
    if (f.life > f.maxLife) {
      // Fade out by shrinking
      f.size *= 0.95;
      if (f.size < 0.3) {
        fireflies.splice(i, 1);
      }
    }
  }
}

function drawFireflies(): void {
  for (const f of fireflies) {
    const glowIntensity = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(f.glowPhase));
    const fadeIn = Math.min(1, f.life / 30); // fade in over 0.5 seconds
    const alpha = fadeIn * glowIntensity;

    if (f.caught) {
      // Shrinking as it flies to jar
      const catchAlpha = 1 - f.catchAnimProgress;
      ctx.save();
      ctx.globalAlpha = catchAlpha * alpha;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${f.hue}, 100%, 75%, 1)`;
      ctx.fill();
      ctx.restore();
      continue;
    }

    ctx.save();
    ctx.globalAlpha = alpha;

    // Outer glow
    const glowRadius = f.size * (3 + glowIntensity * 2);
    const glowGrad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, glowRadius);
    glowGrad.addColorStop(0, `hsla(${f.hue}, 100%, 80%, 0.4)`);
    glowGrad.addColorStop(0.4, `hsla(${f.hue}, 100%, 70%, 0.15)`);
    glowGrad.addColorStop(1, `hsla(${f.hue}, 100%, 60%, 0)`);
    ctx.beginPath();
    ctx.arc(f.x, f.y, glowRadius, 0, Math.PI * 2);
    ctx.fillStyle = glowGrad;
    ctx.fill();

    // Core body
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${f.hue}, 100%, 85%, 1)`;
    ctx.fill();

    // Bright center dot
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.size * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${f.hue}, 100%, 95%, 1)`;
    ctx.fill();

    ctx.restore();
  }
}

function drawFireflyJar(): void {
  // Only show jar when there are fireflies or catches this session
  if (sessionFirefliesCaught <= 0 && fireflies.length === 0) return;
  if (currentTimeOfDay !== "night" && currentTimeOfDay !== "evening") return;

  const jarX = canvas.width - 22;
  const jarY = canvas.height - 25;
  const jarW = 14;
  const jarH = 20;

  ctx.save();

  // Jar glow effect when catching
  if (fireflyCatchJarGlow > 0) {
    ctx.globalAlpha = fireflyCatchJarGlow * 0.5;
    const catchGlow = ctx.createRadialGradient(jarX, jarY, 0, jarX, jarY, jarH);
    catchGlow.addColorStop(0, "hsla(60, 100%, 80%, 0.6)");
    catchGlow.addColorStop(1, "hsla(60, 100%, 60%, 0)");
    ctx.beginPath();
    ctx.arc(jarX, jarY, jarH, 0, Math.PI * 2);
    ctx.fillStyle = catchGlow;
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // Jar body (glass)
  ctx.globalAlpha = 0.6;
  ctx.beginPath();
  ctx.roundRect(jarX - jarW / 2, jarY - jarH / 2, jarW, jarH, 3);
  ctx.fillStyle = "rgba(180, 220, 255, 0.15)";
  ctx.fill();
  ctx.strokeStyle = "rgba(180, 220, 255, 0.4)";
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // Jar lid
  ctx.fillStyle = "rgba(160, 140, 120, 0.5)";
  ctx.beginPath();
  ctx.roundRect(jarX - jarW / 2 - 1, jarY - jarH / 2 - 3, jarW + 2, 4, 1.5);
  ctx.fill();

  // Inner glow based on session catches (more catches = brighter)
  if (sessionFirefliesCaught > 0) {
    const innerGlowAlpha = Math.min(0.7, sessionFirefliesCaught * 0.08);
    const innerGlow = ctx.createRadialGradient(jarX, jarY + 2, 0, jarX, jarY + 2, jarW * 0.8);
    innerGlow.addColorStop(0, `hsla(60, 100%, 75%, ${innerGlowAlpha})`);
    innerGlow.addColorStop(1, `hsla(60, 100%, 50%, 0)`);
    ctx.globalAlpha = 0.8 + 0.2 * Math.sin(frame * 0.03);
    ctx.beginPath();
    ctx.arc(jarX, jarY + 2, jarW * 0.8, 0, Math.PI * 2);
    ctx.fillStyle = innerGlow;
    ctx.fill();

    // Tiny dots inside jar representing caught fireflies
    const dotCount = Math.min(sessionFirefliesCaught, 5);
    for (let i = 0; i < dotCount; i++) {
      const dotX = jarX + Math.sin(frame * 0.02 + i * 1.3) * 3;
      const dotY = jarY + Math.cos(frame * 0.025 + i * 1.7) * 4;
      const dotAlpha = 0.4 + 0.4 * Math.sin(frame * 0.04 + i * 2);
      ctx.globalAlpha = dotAlpha;
      ctx.beginPath();
      ctx.arc(dotX, dotY, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${55 + i * 5}, 100%, 80%, 1)`;
      ctx.fill();
    }
  }

  // Count label
  if (sessionFirefliesCaught > 0) {
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = "#FFE87C";
    ctx.font = "bold 7px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${sessionFirefliesCaught}`, jarX, jarY + jarH / 2 + 9);
  }

  ctx.restore();
}

function tryClickFirefly(clickX: number, clickY: number): boolean {
  for (const f of fireflies) {
    if (f.caught) continue;
    const dx = clickX - f.x;
    const dy = clickY - f.y;
    const hitRadius = f.size * 4; // generous hit area around the glow
    if (dx * dx + dy * dy < hitRadius * hitRadius) {
      // Caught!
      f.caught = true;
      f.catchAnimProgress = 0;
      totalFirefliesCaught++;
      sessionFirefliesCaught++;
      playFireflyCatchSound();

      // Sparkle particles at catch point
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        particles.push({
          x: f.x,
          y: f.y,
          vx: Math.cos(angle) * 1.5,
          vy: Math.sin(angle) * 1.2,
          life: 30 + Math.random() * 20,
          maxLife: 30 + Math.random() * 20,
          size: 2 + Math.random() * 2,
          type: "sparkle",
        });
      }

      // Speech reaction (occasional, not every catch)
      if (sessionFirefliesCaught === 1 || Math.random() < 0.3) {
        const speech = FIREFLY_CATCH_SPEECHES[Math.floor(Math.random() * FIREFLY_CATCH_SPEECHES.length)];
        queueSpeechBubble(speech, 150, true);
      }

      // First firefly this session — diary entry
      if (!firstFireflyCaughtThisSession) {
        firstFireflyCaughtThisSession = true;
        addDiaryEntry("milestone", "🪲", "Caught my first firefly of the evening~! The night is magical ✨");
        // Track daily activity for contextual dreams
        logDailyActivity("fireflies");
      }

      // Happiness boost
      petHappiness = Math.min(100, petHappiness + 2);
      totalCarePoints++;
      friendshipXP += 1;

      // Check achievements
      checkAchievements();
      saveGame();

      return true;
    }
  }
  return false;
}

function releaseFireflies(): void {
  if (sessionFirefliesCaught <= 0) return;
  if (currentTimeOfDay !== "night" && currentTimeOfDay !== "evening") return;

  // Release all session catches — spawn several fireflies that fly upward and away
  const releaseCount = Math.min(sessionFirefliesCaught, 6);
  const jarX = canvas.width - 22;
  const jarY = canvas.height - 25;

  for (let i = 0; i < releaseCount; i++) {
    setTimeout(() => {
      fireflies.push({
        x: jarX + (Math.random() - 0.5) * 10,
        y: jarY + (Math.random() - 0.5) * 8,
        baseX: jarX,
        baseY: jarY,
        vx: (Math.random() - 0.5) * 2,
        vy: -(1 + Math.random() * 1.5),
        size: 2.5 + Math.random() * 1,
        glowPhase: Math.random() * Math.PI * 2,
        glowSpeed: 0.04 + Math.random() * 0.02,
        hue: 50 + Math.random() * 30,
        driftAngle: -Math.PI / 2 + (Math.random() - 0.5) * 1,
        driftSpeed: 0.01,
        wobbleOffset: Math.random() * Math.PI * 2,
        life: 0,
        maxLife: 300 + Math.floor(Math.random() * 200),
        caught: false,
        catchAnimProgress: 0,
      });
    }, i * 100);
  }

  // Play release sound — gentle ascending cascade
  playTone(800, 0.15, "sine", 0.05);
  setTimeout(() => playTone(1000, 0.12, "sine", 0.04), 80);
  setTimeout(() => playTone(1200, 0.1, "sine", 0.04), 160);
  setTimeout(() => playTone(1500, 0.08, "sine", 0.03), 240);

  queueSpeechBubble("Fly free, little lights~! ✨🪲", 150, true);
  addDiaryEntry("general", "🫙", `Released ${sessionFirefliesCaught} fireflies back into the night sky~`);

  sessionFirefliesCaught = 0;
  fireflyCatchJarGlow = 0;
}

// --- Constellation Drawing (Night-only interactive feature) ---

interface ConstellationStar {
  x: number; // relative position 0-1 within constellation area
  y: number;
}

interface ConstellationEdge {
  from: number; // index into stars array
  to: number;
}

interface ConstellationPattern {
  name: string;
  icon: string;
  stars: ConstellationStar[];
  edges: ConstellationEdge[];
}

const CONSTELLATION_PATTERNS: ConstellationPattern[] = [
  {
    name: "The Crown",
    icon: "👑",
    stars: [
      { x: 0.2, y: 0.6 }, { x: 0.35, y: 0.25 }, { x: 0.5, y: 0.5 },
      { x: 0.65, y: 0.25 }, { x: 0.8, y: 0.6 },
    ],
    edges: [{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 4 }],
  },
  {
    name: "The Heart",
    icon: "💖",
    stars: [
      { x: 0.5, y: 0.8 }, { x: 0.25, y: 0.45 }, { x: 0.35, y: 0.2 },
      { x: 0.5, y: 0.35 }, { x: 0.65, y: 0.2 }, { x: 0.75, y: 0.45 },
    ],
    edges: [{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 4 }, { from: 4, to: 5 }, { from: 5, to: 0 }],
  },
  {
    name: "The Arrow",
    icon: "🏹",
    stars: [
      { x: 0.15, y: 0.5 }, { x: 0.45, y: 0.5 }, { x: 0.85, y: 0.5 },
      { x: 0.6, y: 0.25 }, { x: 0.6, y: 0.75 },
    ],
    edges: [{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 1, to: 3 }, { from: 1, to: 4 }],
  },
  {
    name: "The Dipper",
    icon: "🫗",
    stars: [
      { x: 0.2, y: 0.3 }, { x: 0.35, y: 0.25 }, { x: 0.5, y: 0.3 },
      { x: 0.5, y: 0.5 }, { x: 0.65, y: 0.65 }, { x: 0.8, y: 0.55 },
    ],
    edges: [{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 4 }, { from: 4, to: 5 }],
  },
  {
    name: "The Diamond",
    icon: "💎",
    stars: [
      { x: 0.5, y: 0.15 }, { x: 0.75, y: 0.45 }, { x: 0.5, y: 0.75 }, { x: 0.25, y: 0.45 },
    ],
    edges: [{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 0 }],
  },
  {
    name: "The Wing",
    icon: "🪽",
    stars: [
      { x: 0.15, y: 0.7 }, { x: 0.3, y: 0.45 }, { x: 0.5, y: 0.25 },
      { x: 0.7, y: 0.2 }, { x: 0.85, y: 0.35 },
    ],
    edges: [{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 4 }],
  },
  {
    name: "The Spiral",
    icon: "🌀",
    stars: [
      { x: 0.5, y: 0.45 }, { x: 0.65, y: 0.3 }, { x: 0.8, y: 0.5 },
      { x: 0.6, y: 0.7 }, { x: 0.3, y: 0.6 }, { x: 0.25, y: 0.3 },
    ],
    edges: [{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 4 }, { from: 4, to: 5 }],
  },
  {
    name: "The Bow",
    icon: "🎀",
    stars: [
      { x: 0.2, y: 0.25 }, { x: 0.5, y: 0.5 }, { x: 0.8, y: 0.25 },
      { x: 0.8, y: 0.75 }, { x: 0.2, y: 0.75 },
    ],
    edges: [{ from: 0, to: 1 }, { from: 1, to: 2 }, { from: 1, to: 3 }, { from: 1, to: 4 }],
  },
];

let constellationModeActive = false;
let constellationCurrentIndex = 0; // which constellation is currently being traced
let constellationClickedStars: Set<number> = new Set(); // indices of clicked stars in current constellation
let constellationCompletedEdges: Set<number> = new Set(); // indices of completed edges
let completedConstellations: Set<number> = new Set(); // indices of completed constellation patterns (persisted)
let constellationCompletionTimer = 0; // celebration timer
let constellationCompletionName = ""; // name of just-completed constellation
let constellationFade = 0; // 0-1 fade for mode toggle
let totalConstellationsCompleted = 0;

const CONSTELLATION_COMPLETE_SPEECHES = [
  "I drew the stars~! ✨",
  "A constellation! So beautiful~ 🌟",
  "The sky is my canvas~! 🎨",
  "Look, the stars connect~! ⭐",
  "Starlight masterpiece~! 💫",
  "I traced the cosmos~! 🌌",
  "The night sky tells a story~! 🌙",
  "My own star map~! ✨",
];

function playConstellationConnectSound(): void {
  // Soft celestial chime — ethereal connection tone
  playTone(1000, 0.15, "sine", 0.06);
  setTimeout(() => playTone(1400, 0.12, "sine", 0.05), 70);
}

function playConstellationCompleteSound(): void {
  // Magical ascending fanfare — stars aligned
  playTone(600, 0.15, "sine", 0.08);
  setTimeout(() => playTone(800, 0.15, "sine", 0.08), 100);
  setTimeout(() => playTone(1000, 0.15, "sine", 0.08), 200);
  setTimeout(() => playTone(1200, 0.2, "sine", 0.1), 300);
  setTimeout(() => playTone(1600, 0.3, "sine", 0.08), 400);
}

function toggleConstellationMode(): void {
  if (isSleeping || minigameActive || memoryGameActive) return;
  if (currentTimeOfDay !== "night" && currentTimeOfDay !== "evening") {
    queueSpeechBubble("Stars only come out at night~ 🌙", 120, true);
    return;
  }

  constellationModeActive = !constellationModeActive;

  if (constellationModeActive) {
    // Find the next uncompleted constellation
    selectNextConstellation();
    playTone(800, 0.1, "sine", 0.06);
    setTimeout(() => playTone(1100, 0.12, "sine", 0.06), 60);
    queueSpeechBubble("Let's trace the stars~! ⭐", 120, true);
  } else {
    playTone(1100, 0.08, "sine", 0.04);
    setTimeout(() => playTone(800, 0.1, "sine", 0.04), 60);
    constellationClickedStars.clear();
    constellationCompletedEdges.clear();
  }
}

function selectNextConstellation(): void {
  // Prefer uncompleted constellations
  const uncompleted = CONSTELLATION_PATTERNS.map((_, i) => i).filter(i => !completedConstellations.has(i));
  if (uncompleted.length > 0) {
    constellationCurrentIndex = uncompleted[Math.floor(Math.random() * uncompleted.length)];
  } else {
    // All completed — let them re-trace any
    constellationCurrentIndex = Math.floor(Math.random() * CONSTELLATION_PATTERNS.length);
  }
  constellationClickedStars.clear();
  constellationCompletedEdges.clear();
}

function getConstellationStarPositions(): { x: number; y: number }[] {
  const pattern = CONSTELLATION_PATTERNS[constellationCurrentIndex];
  const w = canvas.width;
  const h = canvas.height;
  // Constellation area: upper portion of canvas with some padding
  const areaX = 15;
  const areaY = 10;
  const areaW = w - 30;
  const areaH = h * 0.55;

  return pattern.stars.map(s => ({
    x: areaX + s.x * areaW,
    y: areaY + s.y * areaH,
  }));
}

function tryClickConstellationStar(clickX: number, clickY: number): boolean {
  if (!constellationModeActive) return false;

  const positions = getConstellationStarPositions();
  const pattern = CONSTELLATION_PATTERNS[constellationCurrentIndex];
  const hitRadius = 14;

  for (let i = 0; i < positions.length; i++) {
    const dx = clickX - positions[i].x;
    const dy = clickY - positions[i].y;
    if (dx * dx + dy * dy <= hitRadius * hitRadius) {
      constellationClickedStars.add(i);

      // Check which edges are now completed (both endpoints clicked)
      for (let e = 0; e < pattern.edges.length; e++) {
        const edge = pattern.edges[e];
        if (!constellationCompletedEdges.has(e) &&
            constellationClickedStars.has(edge.from) &&
            constellationClickedStars.has(edge.to)) {
          constellationCompletedEdges.add(e);
          playConstellationConnectSound();

          // Spawn sparkle at midpoint
          const midX = (positions[edge.from].x + positions[edge.to].x) / 2;
          const midY = (positions[edge.from].y + positions[edge.to].y) / 2;
          for (let p = 0; p < 3; p++) {
            particles.push({
              x: midX + (Math.random() - 0.5) * 10,
              y: midY + (Math.random() - 0.5) * 10,
              vx: (Math.random() - 0.5) * 1.5,
              vy: (Math.random() - 0.5) * 1.5,
              life: 40 + Math.random() * 20,
              maxLife: 60,
              size: 1.5 + Math.random() * 1.5,
              type: "sparkle",
            });
          }
        }
      }

      // Check if all edges are completed
      if (constellationCompletedEdges.size === pattern.edges.length) {
        completeConstellation();
      }

      return true;
    }
  }
  return false;
}

function completeConstellation(): void {
  const pattern = CONSTELLATION_PATTERNS[constellationCurrentIndex];
  const isFirstTime = !completedConstellations.has(constellationCurrentIndex);

  completedConstellations.add(constellationCurrentIndex);
  if (isFirstTime) {
    totalConstellationsCompleted++;
  }

  constellationCompletionTimer = 180; // 3 seconds of celebration
  constellationCompletionName = pattern.name;

  playConstellationCompleteSound();

  const speech = CONSTELLATION_COMPLETE_SPEECHES[Math.floor(Math.random() * CONSTELLATION_COMPLETE_SPEECHES.length)];
  queueSpeechBubble(speech, 150, true);

  // Spawn celebration sparkles
  const positions = getConstellationStarPositions();
  for (const pos of positions) {
    for (let p = 0; p < 4; p++) {
      particles.push({
        x: pos.x,
        y: pos.y,
        vx: (Math.random() - 0.5) * 3,
        vy: -Math.random() * 2 - 0.5,
        life: 60 + Math.random() * 30,
        maxLife: 90,
        size: 2 + Math.random() * 2,
        type: "star",
      });
    }
  }

  // Stat boosts
  petHappiness = Math.min(100, petHappiness + 5);
  totalCarePoints += 2;
  friendshipXP += 3;

  // Diary entry for first completion
  if (isFirstTime) {
    addDiaryEntry("general", pattern.icon, `Traced the constellation "${pattern.name}" in the night sky~`);
    logDailyActivity("constellations");
  }

  checkAchievements();
  saveGame();

  // After celebration, move to next constellation
  setTimeout(() => {
    if (constellationModeActive) {
      selectNextConstellation();
    }
  }, 3500);
}

function updateConstellations(): void {
  // Fade in/out
  if (constellationModeActive && constellationFade < 1) {
    constellationFade = Math.min(1, constellationFade + 0.04);
  } else if (!constellationModeActive && constellationFade > 0) {
    constellationFade = Math.max(0, constellationFade - 0.04);
  }

  // Celebration timer
  if (constellationCompletionTimer > 0) {
    constellationCompletionTimer--;
  }

  // Auto-disable if time changes to daytime
  if (constellationModeActive && currentTimeOfDay !== "night" && currentTimeOfDay !== "evening") {
    constellationModeActive = false;
    constellationClickedStars.clear();
    constellationCompletedEdges.clear();
  }
}

function drawConstellations(): void {
  if (constellationFade <= 0) return;

  const pattern = CONSTELLATION_PATTERNS[constellationCurrentIndex];
  const positions = getConstellationStarPositions();
  const alpha = constellationFade;

  ctx.save();
  ctx.globalAlpha = alpha;

  // Draw dim guide lines (unconnected edges)
  for (let e = 0; e < pattern.edges.length; e++) {
    const edge = pattern.edges[e];
    const from = positions[edge.from];
    const to = positions[edge.to];

    if (constellationCompletedEdges.has(e)) {
      // Completed edge — bright glowing line
      ctx.strokeStyle = `rgba(180, 220, 255, ${0.8 * alpha})`;
      ctx.lineWidth = 2;
      ctx.shadowColor = "rgba(150, 200, 255, 0.6)";
      ctx.shadowBlur = 8;
    } else {
      // Guide line — very faint dashed
      ctx.strokeStyle = `rgba(150, 180, 220, ${0.15 * alpha})`;
      ctx.lineWidth = 0.5;
      ctx.shadowBlur = 0;
      ctx.setLineDash([3, 4]);
    }

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.shadowBlur = 0;
  }

  // Draw constellation stars
  for (let i = 0; i < positions.length; i++) {
    const pos = positions[i];
    const isClicked = constellationClickedStars.has(i);
    const twinkle = Math.sin(frame * 0.05 + i * 1.7) * 0.3 + 0.7;

    if (isClicked) {
      // Bright clicked star with glow
      const glow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 10);
      glow.addColorStop(0, `rgba(220, 240, 255, ${0.9 * alpha * twinkle})`);
      glow.addColorStop(0.4, `rgba(150, 200, 255, ${0.4 * alpha * twinkle})`);
      glow.addColorStop(1, `rgba(100, 150, 255, 0)`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2);
      ctx.fill();

      // Bright core
      ctx.fillStyle = `rgba(255, 255, 255, ${0.95 * alpha})`;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Unclicked guide star — pulsing softly
      const guideGlow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 7);
      guideGlow.addColorStop(0, `rgba(200, 220, 255, ${0.5 * alpha * twinkle})`);
      guideGlow.addColorStop(0.5, `rgba(150, 180, 255, ${0.2 * alpha * twinkle})`);
      guideGlow.addColorStop(1, `rgba(100, 140, 255, 0)`);
      ctx.fillStyle = guideGlow;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 7, 0, Math.PI * 2);
      ctx.fill();

      // Dimmer core
      ctx.fillStyle = `rgba(200, 220, 255, ${0.6 * alpha * twinkle})`;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Constellation name label at top
  ctx.font = "bold 9px monospace";
  ctx.textAlign = "center";
  ctx.fillStyle = `rgba(180, 210, 255, ${0.7 * alpha})`;
  ctx.fillText(`${pattern.icon} ${pattern.name}`, canvas.width / 2, 12);

  // Progress indicator
  const progress = constellationCompletedEdges.size;
  const total = pattern.edges.length;
  ctx.font = "7px monospace";
  ctx.fillStyle = `rgba(160, 190, 230, ${0.5 * alpha})`;
  ctx.fillText(`${progress}/${total} connected`, canvas.width / 2, 22);

  // Overall completion count
  ctx.font = "7px monospace";
  ctx.fillStyle = `rgba(140, 170, 210, ${0.4 * alpha})`;
  ctx.textAlign = "right";
  ctx.fillText(`${completedConstellations.size}/${CONSTELLATION_PATTERNS.length} discovered`, canvas.width - 8, 12);

  // Completion celebration overlay
  if (constellationCompletionTimer > 0) {
    const celebAlpha = Math.min(1, constellationCompletionTimer / 60) * alpha;
    ctx.font = "bold 11px monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = `rgba(255, 230, 150, ${celebAlpha})`;
    ctx.shadowColor = `rgba(255, 200, 100, ${celebAlpha * 0.5})`;
    ctx.shadowBlur = 10;
    ctx.fillText(`✨ ${constellationCompletionName} Complete! ✨`, canvas.width / 2, canvas.height * 0.7);
    ctx.shadowBlur = 0;
  }

  ctx.restore();
}

// --- Shooting Stars (Night-only rare event, click to make a wish) ---

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  life: number;
  maxLife: number;
  brightness: number;
  clicked: boolean;
  trail: { x: number; y: number; alpha: number }[];
}

interface ActiveWish {
  text: string;
  x: number;
  y: number;
  life: number;
  maxLife: number;
  sparkles: { x: number; y: number; vx: number; vy: number; life: number }[];
}

const WISH_MESSAGES: string[] = [
  "I wish for endless happiness~! ✨",
  "I wish for sweet dreams tonight~! 🌙",
  "I wish my friend smiles today~! 💕",
  "I wish for a sky full of stars~! ⭐",
  "I wish for warm sunny mornings~! ☀️",
  "I wish to see a rainbow~! 🌈",
  "I wish for cozy rainy days~! 🌧️",
  "I wish for a magical adventure~! 🗺️",
  "I wish for a field of flowers~! 🌸",
  "I wish for gentle breezes~! 🍃",
  "I wish to dance with fireflies~! ✨",
  "I wish for a thousand hugs~! 🤗",
  "I wish for butterflies everywhere~! 🦋",
  "I wish the moon would wave back~! 🌝",
  "I wish for starlight lullabies~! 🎵",
  "I wish for pockets full of joy~! 💫",
  "I wish to paint the sunset~! 🎨",
  "I wish for a blanket of clouds~! ☁️",
  "I wish for friendship forever~! 💗",
  "I wish for the courage to dream big~! 🌟",
];

const SHOOTING_STAR_SPEECH = [
  "A shooting star~!! ✨",
  "Quick, make a wish~! 🌠",
  "*gasp* Did you see that~?!",
  "So beautiful~!! 💫",
  "The sky is winking at me~! ⭐",
  "Catch that star~!! 🌟",
  "Woooah~!! A meteor~! ✨",
  "The stars are falling for me~! 💕",
];

let shootingStars: ShootingStar[] = [];
let activeWish: ActiveWish | null = null;
let totalWishesMade = 0;
let sessionShootingStarsSeen = 0;
let shootingStarSpawnTimer = 0;
let nextShootingStarAt = 300 + Math.random() * 600; // ~5-15 seconds at 60fps
const SHOOTING_STAR_MIN_INTERVAL = 300; // ~5 seconds minimum
const SHOOTING_STAR_MAX_INTERVAL = 1200; // ~20 seconds maximum

function playShootingStarSound(): void {
  // Ethereal descending shimmer
  playTone(1800, 0.3, "sine", 0.06);
  playTone(1400, 0.35, "sine", 0.05, 5);
  setTimeout(() => {
    playTone(1100, 0.25, "sine", 0.04);
    playTone(800, 0.3, "sine", 0.03, -5);
  }, 120);
  setTimeout(() => {
    playTone(600, 0.2, "sine", 0.02);
  }, 250);
}

function playWishSound(): void {
  // Magical ascending chime with sparkle
  playTone(523, 0.2, "sine", 0.08);  // C5
  setTimeout(() => playTone(659, 0.2, "sine", 0.08), 80);  // E5
  setTimeout(() => playTone(784, 0.2, "sine", 0.08), 160); // G5
  setTimeout(() => playTone(1047, 0.25, "sine", 0.1), 240); // C6
  setTimeout(() => {
    playTone(1319, 0.4, "sine", 0.07); // E6 — lingering sparkle
    playTone(1568, 0.5, "sine", 0.04, 7); // G6 — gentle shimmer
  }, 340);
}

function spawnShootingStar(): void {
  if (currentTimeOfDay !== "night" && currentTimeOfDay !== "evening") return;
  if (isSleeping) return;
  if (shootingStars.length >= 2) return; // max 2 at once

  const w = canvas.width;
  const h = canvas.height;

  // Start from a random edge (top or sides, upper portion)
  const side = Math.random();
  let sx: number, sy: number, angle: number;
  if (side < 0.5) {
    // From top
    sx = 20 + Math.random() * (w - 40);
    sy = -5;
    angle = Math.PI * 0.3 + Math.random() * Math.PI * 0.4; // 54-126 degrees (downward)
  } else if (side < 0.75) {
    // From left
    sx = -5;
    sy = 5 + Math.random() * (h * 0.3);
    angle = -Math.PI * 0.1 + Math.random() * Math.PI * 0.3; // slight downward-right
  } else {
    // From right
    sx = w + 5;
    sy = 5 + Math.random() * (h * 0.3);
    angle = Math.PI * 0.8 + Math.random() * Math.PI * 0.3; // slight downward-left
  }

  const speed = 3 + Math.random() * 3;
  const maxLife = 60 + Math.floor(Math.random() * 60); // 1-2 seconds

  shootingStars.push({
    x: sx,
    y: sy,
    vx: Math.cos(angle) * speed,
    vy: Math.abs(Math.sin(angle)) * speed, // always move downward
    length: 20 + Math.random() * 25,
    life: maxLife,
    maxLife,
    brightness: 0.7 + Math.random() * 0.3,
    clicked: false,
    trail: [],
  });

  sessionShootingStarsSeen++;
  playShootingStarSound();

  // Speech reaction (~40% chance)
  if (Math.random() < 0.4 && !isSleeping) {
    const msg = SHOOTING_STAR_SPEECH[Math.floor(Math.random() * SHOOTING_STAR_SPEECH.length)];
    queueSpeechBubble(msg, 100, false);
  }
}

function tryClickShootingStar(clickX: number, clickY: number): boolean {
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const star = shootingStars[i];
    if (star.clicked) continue;

    // Hit test — generous radius around the star head
    const dx = clickX - star.x;
    const dy = clickY - star.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 20) {
      star.clicked = true;
      makeWish(star.x, star.y);
      return true;
    }

    // Also check along the trail for easier clicking
    for (const t of star.trail) {
      const tdx = clickX - t.x;
      const tdy = clickY - t.y;
      if (Math.sqrt(tdx * tdx + tdy * tdy) < 12) {
        star.clicked = true;
        makeWish(star.x, star.y);
        return true;
      }
    }
  }
  return false;
}

function makeWish(x: number, y: number): void {
  const wish = WISH_MESSAGES[Math.floor(Math.random() * WISH_MESSAGES.length)];

  // Create sparkle burst
  const sparkles: ActiveWish["sparkles"] = [];
  for (let i = 0; i < 15; i++) {
    const angle = (Math.PI * 2 * i) / 15 + Math.random() * 0.3;
    const speed = 0.5 + Math.random() * 1.5;
    sparkles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 0.5,
      life: 60 + Math.floor(Math.random() * 40),
    });
  }

  activeWish = {
    text: wish,
    x: Math.max(50, Math.min(canvas.width - 50, x)),
    y: Math.max(30, Math.min(canvas.height * 0.6, y)),
    life: 180, // 3 seconds
    maxLife: 180,
    sparkles,
  };

  totalWishesMade++;
  petHappiness = Math.min(100, petHappiness + 8);
  totalCarePoints += 3;
  friendshipXP += 5;

  playWishSound();

  // Diary entry for first wish and every 10th wish
  if (totalWishesMade === 1) {
    addDiaryEntry("milestone", "🌠", `Made my very first wish on a shooting star: "${wish.replace(/~!.*$/, "...")}"`);
  } else if (totalWishesMade % 10 === 0) {
    addDiaryEntry("general", "🌠", `Made wish #${totalWishesMade} on a shooting star!`);
  }

  saveGame();
  checkAchievements();
}

function updateShootingStars(): void {
  // Only spawn at night/evening
  if (currentTimeOfDay !== "night" && currentTimeOfDay !== "evening") {
    shootingStars = [];
    activeWish = null;
    return;
  }

  // Spawn timer
  if (!isSleeping) {
    shootingStarSpawnTimer++;
    if (shootingStarSpawnTimer >= nextShootingStarAt) {
      spawnShootingStar();
      shootingStarSpawnTimer = 0;
      // More frequent at night than evening
      const multiplier = currentTimeOfDay === "night" ? 0.7 : 1.0;
      nextShootingStarAt = (SHOOTING_STAR_MIN_INTERVAL + Math.random() * (SHOOTING_STAR_MAX_INTERVAL - SHOOTING_STAR_MIN_INTERVAL)) * multiplier;
    }
  }

  // Update stars
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const star = shootingStars[i];
    star.life--;

    // Add to trail
    star.trail.push({ x: star.x, y: star.y, alpha: star.life / star.maxLife });
    if (star.trail.length > 12) star.trail.shift();

    // Move
    star.x += star.vx;
    star.y += star.vy;

    // Slight gravity
    star.vy += 0.02;

    // Remove if dead or off-screen
    if (star.life <= 0 || star.x < -30 || star.x > canvas.width + 30 || star.y > canvas.height + 30) {
      shootingStars.splice(i, 1);
    }
  }

  // Update active wish
  if (activeWish) {
    activeWish.life--;
    for (const s of activeWish.sparkles) {
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.01; // slight gravity on sparkles
      s.life--;
    }
    activeWish.sparkles = activeWish.sparkles.filter(s => s.life > 0);
    if (activeWish.life <= 0) {
      activeWish = null;
    }
  }
}

function drawShootingStars(): void {
  if (currentTimeOfDay !== "night" && currentTimeOfDay !== "evening") return;

  ctx.save();

  // Draw each shooting star
  for (const star of shootingStars) {
    const lifeRatio = star.life / star.maxLife;
    const alpha = lifeRatio * star.brightness;
    if (alpha <= 0) continue;

    // Draw trail
    for (let t = 0; t < star.trail.length; t++) {
      const point = star.trail[t];
      const trailAlpha = (t / star.trail.length) * alpha * 0.5;
      const trailSize = (t / star.trail.length) * 2;
      ctx.beginPath();
      ctx.arc(point.x, point.y, trailSize, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 240, ${trailAlpha})`;
      ctx.fill();
    }

    // Draw glowing head
    const headGlow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, 8);
    headGlow.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
    headGlow.addColorStop(0.3, `rgba(200, 220, 255, ${alpha * 0.6})`);
    headGlow.addColorStop(1, `rgba(150, 180, 255, 0)`);
    ctx.beginPath();
    ctx.arc(star.x, star.y, 8, 0, Math.PI * 2);
    ctx.fillStyle = headGlow;
    ctx.fill();

    // Draw bright core
    ctx.beginPath();
    ctx.arc(star.x, star.y, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.fill();

    // Draw streak line behind the star
    const speed = Math.sqrt(star.vx * star.vx + star.vy * star.vy);
    const nx = -star.vx / speed;
    const ny = -star.vy / speed;
    const streakGrad = ctx.createLinearGradient(
      star.x, star.y,
      star.x + nx * star.length, star.y + ny * star.length
    );
    streakGrad.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.8})`);
    streakGrad.addColorStop(0.3, `rgba(200, 220, 255, ${alpha * 0.4})`);
    streakGrad.addColorStop(1, `rgba(150, 180, 255, 0)`);

    ctx.beginPath();
    ctx.moveTo(star.x, star.y);
    ctx.lineTo(star.x + nx * star.length, star.y + ny * star.length);
    ctx.strokeStyle = streakGrad;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Thinner bright core streak
    ctx.beginPath();
    ctx.moveTo(star.x, star.y);
    ctx.lineTo(star.x + nx * star.length * 0.5, star.y + ny * star.length * 0.5);
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }

  // Draw active wish
  if (activeWish) {
    const wishAlpha = Math.min(1, activeWish.life / 40) * Math.min(1, (activeWish.maxLife - activeWish.life + 30) / 30);

    // Draw sparkles
    for (const s of activeWish.sparkles) {
      const sAlpha = (s.life / 100) * wishAlpha;
      const sSize = 1 + (s.life / 100) * 2;
      ctx.beginPath();
      ctx.arc(s.x, s.y, sSize, 0, Math.PI * 2);
      const hue = 40 + Math.random() * 20; // warm gold
      ctx.fillStyle = `hsla(${hue}, 100%, 80%, ${sAlpha})`;
      ctx.fill();
    }

    // Draw wish text with glow
    ctx.textAlign = "center";
    ctx.font = "bold 9px monospace";
    ctx.shadowColor = `rgba(255, 220, 100, ${wishAlpha * 0.7})`;
    ctx.shadowBlur = 12;
    ctx.fillStyle = `rgba(255, 245, 200, ${wishAlpha})`;
    ctx.fillText(activeWish.text, activeWish.x, activeWish.y);
    ctx.shadowBlur = 0;

    // Subtle rising star icon
    const riseOffset = (activeWish.maxLife - activeWish.life) * 0.1;
    ctx.font = "12px monospace";
    ctx.globalAlpha = wishAlpha * 0.6;
    ctx.fillText("🌠", activeWish.x, activeWish.y - 14 - riseOffset);
    ctx.globalAlpha = 1;
  }

  ctx.restore();
}

// --- Morning Dew Drops (Morning-only interactive drops, click to collect) ---

interface DewDrop {
  x: number;
  y: number;
  size: number;
  wobblePhase: number;
  wobbleSpeed: number;
  shimmerPhase: number;
  life: number;
  maxLife: number;
  collected: boolean;
  collectAnimProgress: number;
  hue: number; // 180-220 range for cool water blues
  surfaceY: number; // the "ground" y-position it sits on
}

const dewDrops: DewDrop[] = [];
let dewDropSpawnTimer = 0;
const DEW_DROP_SPAWN_INTERVAL = 200; // ~3.3 seconds between spawns
const DEW_DROP_MAX_COUNT = 6;
let totalDewDropsCollected = 0;
let sessionDewDropsCollected = 0;
let firstDewDropCollectedThisSession = false;

const DEW_DROP_SPEECHES = [
  "Morning dew~! So sparkly~! ✨",
  "Little water jewels~! 💎",
  "*touch* So cool and fresh~! 💧",
  "The morning left me presents~! 🌸",
  "Dewdrops are nature's gems~! 💫",
  "Sparkle sparkle~! ✨",
  "The world is glistening~! 🌅",
  "Fresh morning magic~! 💧",
];

function playDewDropCollectSound(): void {
  // Soft watery plink — gentle descending droplet
  playTone(1600, 0.1, "sine", 0.07);
  setTimeout(() => playTone(1200, 0.12, "sine", 0.05), 40);
  setTimeout(() => playTone(900, 0.15, "sine", 0.04, 3), 80);
}

function playDewDropAppearSound(): void {
  // Very subtle crystalline ping
  playTone(2200, 0.05, "sine", 0.015);
}

function spawnDewDrop(): void {
  if (dewDrops.length >= DEW_DROP_MAX_COUNT) return;
  if (currentTimeOfDay !== "morning") return;
  if (isSleeping) return;

  const w = canvas.width;
  const h = canvas.height;
  // Dew drops appear on surfaces: ground level area, on ledges near the pet
  const groundY = h / 2 + 50; // near the pet's feet area
  const x = 15 + Math.random() * (w - 30);
  const surfaceY = groundY + (Math.random() - 0.5) * 30;

  dewDrops.push({
    x,
    y: surfaceY,
    size: 3 + Math.random() * 3,
    wobblePhase: Math.random() * Math.PI * 2,
    wobbleSpeed: 0.02 + Math.random() * 0.02,
    shimmerPhase: Math.random() * Math.PI * 2,
    life: 0,
    maxLife: 900 + Math.floor(Math.random() * 600), // 15-25 seconds
    collected: false,
    collectAnimProgress: 0,
    hue: 180 + Math.random() * 40,
    surfaceY,
  });

  playDewDropAppearSound();
}

function updateDewDrops(): void {
  // Only spawn in the morning
  if (currentTimeOfDay === "morning") {
    dewDropSpawnTimer++;
    if (dewDropSpawnTimer >= DEW_DROP_SPAWN_INTERVAL && !isSleeping) {
      dewDropSpawnTimer = 0;
      if (Math.random() < 0.6) {
        spawnDewDrop();
      }
    }
  } else {
    // Not morning — dew drops evaporate
    dewDropSpawnTimer = 0;
    for (let i = dewDrops.length - 1; i >= 0; i--) {
      const d = dewDrops[i];
      if (!d.collected) {
        d.size *= 0.96; // shrink/evaporate
        if (d.size < 0.3) {
          dewDrops.splice(i, 1);
        }
      }
    }
  }

  for (let i = dewDrops.length - 1; i >= 0; i--) {
    const d = dewDrops[i];
    d.life++;

    if (d.collected) {
      // Animate upward + fade out (splash)
      d.collectAnimProgress = Math.min(1, d.collectAnimProgress + 0.05);
      d.y -= 1.5;
      d.size *= 0.94;
      if (d.collectAnimProgress >= 1 || d.size < 0.3) {
        dewDrops.splice(i, 1);
      }
      continue;
    }

    // Gentle wobble — the drop jiggles slightly
    d.wobblePhase += d.wobbleSpeed;
    d.shimmerPhase += 0.04;

    // Remove if life expired
    if (d.life > d.maxLife) {
      d.size *= 0.97; // slowly evaporate
      if (d.size < 0.5) {
        dewDrops.splice(i, 1);
      }
    }
  }
}

function tryClickDewDrop(clickX: number, clickY: number): boolean {
  for (const d of dewDrops) {
    if (d.collected) continue;
    const dx = clickX - d.x;
    const dy = clickY - d.y;
    const hitRadius = d.size * 3; // generous hit area
    if (dx * dx + dy * dy < hitRadius * hitRadius) {
      // Collected!
      d.collected = true;
      d.collectAnimProgress = 0;
      totalDewDropsCollected++;
      sessionDewDropsCollected++;
      playDewDropCollectSound();

      // Water splash particles — tiny droplets burst outward
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const speed = 0.8 + Math.random() * 1.2;
        particles.push({
          x: d.x,
          y: d.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1,
          life: 25 + Math.random() * 15,
          maxLife: 25 + Math.random() * 15,
          size: 1.5 + Math.random() * 1.5,
          type: "raindrop",
        });
      }

      // Speech reaction (occasional)
      if (sessionDewDropsCollected === 1 || Math.random() < 0.25) {
        const speech = DEW_DROP_SPEECHES[Math.floor(Math.random() * DEW_DROP_SPEECHES.length)];
        queueSpeechBubble(speech, 150, true);
      }

      // First dew drop this session — diary entry
      if (!firstDewDropCollectedThisSession) {
        firstDewDropCollectedThisSession = true;
        addDiaryEntry("milestone", "💧", "Collected my first morning dewdrop~! The world sparkles at dawn ✨");
        logDailyActivity("dewdrops");
      }

      // Happiness boost
      petHappiness = Math.min(100, petHappiness + 2);
      totalCarePoints++;
      friendshipXP += 1;

      // Check achievements
      checkAchievements();
      return true;
    }
  }
  return false;
}

function drawDewDrops(): void {
  for (const d of dewDrops) {
    const fadeIn = Math.min(1, d.life / 40); // fade in over ~0.7 seconds
    const collectFade = d.collected ? 1 - d.collectAnimProgress : 1;
    const alpha = fadeIn * collectFade;

    if (alpha <= 0) continue;

    ctx.save();
    ctx.globalAlpha = alpha;

    const wobbleX = Math.sin(d.wobblePhase) * 0.5;
    const drawX = d.x + wobbleX;
    const drawY = d.y;
    const s = d.size;

    // Shimmer highlight position oscillates
    const shimmerOffset = Math.sin(d.shimmerPhase) * s * 0.2;

    // Outer glow — soft morning light reflection
    const glowRadius = s * 2.5;
    const glowGrad = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, glowRadius);
    glowGrad.addColorStop(0, `hsla(${d.hue}, 80%, 85%, 0.25)`);
    glowGrad.addColorStop(0.5, `hsla(${d.hue}, 70%, 80%, 0.08)`);
    glowGrad.addColorStop(1, `hsla(${d.hue}, 60%, 70%, 0)`);
    ctx.beginPath();
    ctx.arc(drawX, drawY, glowRadius, 0, Math.PI * 2);
    ctx.fillStyle = glowGrad;
    ctx.fill();

    // Drop body — teardrop/dome shape (rounded bottom, pointed top)
    ctx.beginPath();
    ctx.moveTo(drawX, drawY - s * 1.2);
    ctx.quadraticCurveTo(drawX + s * 0.8, drawY - s * 0.2, drawX + s * 0.5, drawY + s * 0.3);
    ctx.quadraticCurveTo(drawX, drawY + s * 0.6, drawX - s * 0.5, drawY + s * 0.3);
    ctx.quadraticCurveTo(drawX - s * 0.8, drawY - s * 0.2, drawX, drawY - s * 1.2);
    ctx.closePath();

    // Fill with gradient — translucent water
    const bodyGrad = ctx.createLinearGradient(drawX, drawY - s, drawX, drawY + s * 0.5);
    bodyGrad.addColorStop(0, `hsla(${d.hue}, 60%, 90%, 0.7)`);
    bodyGrad.addColorStop(0.5, `hsla(${d.hue}, 70%, 80%, 0.5)`);
    bodyGrad.addColorStop(1, `hsla(${d.hue}, 80%, 70%, 0.4)`);
    ctx.fillStyle = bodyGrad;
    ctx.fill();

    // Subtle outline
    ctx.strokeStyle = `hsla(${d.hue}, 60%, 75%, 0.3)`;
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Highlight — white specular reflection
    ctx.beginPath();
    ctx.arc(drawX - s * 0.15 + shimmerOffset, drawY - s * 0.5, s * 0.25, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${0.6 + Math.sin(d.shimmerPhase) * 0.2})`;
    ctx.fill();

    // Secondary smaller highlight
    ctx.beginPath();
    ctx.arc(drawX + s * 0.2 + shimmerOffset * 0.5, drawY - s * 0.15, s * 0.12, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, 0.35)`;
    ctx.fill();

    ctx.restore();
  }
}

// --- Bedtime Stories ---
interface BedtimeStory {
  title: string;
  icon: string;
  pages: string[];
  dreamTheme: string[]; // dream icons this story inspires
}

const BEDTIME_STORIES: BedtimeStory[] = [
  {
    title: "The Starlight Garden",
    icon: "🌟",
    pages: [
      "Once upon a time, a little pet found a garden that only bloomed at night...",
      "Each flower glowed with soft starlight, humming a gentle melody~",
      "The pet danced among them, and the flowers swayed along~ 🌸",
      "From that night on, the garden bloomed whenever the pet dreamed of it~ ✨",
    ],
    dreamTheme: ["flower", "star", "music"],
  },
  {
    title: "The Cloud Pillow",
    icon: "☁️",
    pages: [
      "High above the world, a fluffy cloud drifted down to say hello...",
      "\"You look sleepy,\" it whispered. \"Rest on me~\"",
      "The pet curled up on the softest cloud and floated through the sky~ ☁️",
      "And the cloud promised to come back every bedtime~ 💤",
    ],
    dreamTheme: ["moon", "star", "butterfly"],
  },
  {
    title: "The Moonlit River",
    icon: "🌊",
    pages: [
      "A silver river appeared one night, flowing with liquid moonlight...",
      "Little fish made of starlight leaped and splashed along the way~",
      "The pet followed the river to a hidden waterfall of dreams~ 🌙",
      "There, the moon whispered: \"Sweet dreams are made of wonder~\" ✨",
    ],
    dreamTheme: ["fish", "moon", "star"],
  },
  {
    title: "The Friendly Firefly",
    icon: "🪲",
    pages: [
      "One evening, a tiny firefly with an extra-bright glow appeared...",
      "\"I'm lost,\" it said softly. \"Will you help me find my family?\"",
      "Together they searched, following trails of gentle light~ 💛",
      "They found the firefly family, and they all danced together until dawn~ ✨",
    ],
    dreamTheme: ["star", "heart", "butterfly"],
  },
  {
    title: "The Dream Baker",
    icon: "🧁",
    pages: [
      "In a tiny kitchen made of clouds, a dream baker stirred a pot of wishes...",
      "\"One pinch of stardust, two scoops of moonbeam~\" the baker hummed~",
      "The pet helped sprinkle happiness on each dream cookie~ 🍪",
      "\"Now everyone will have sweet dreams tonight!\" the baker smiled~ ✨",
    ],
    dreamTheme: ["food", "star", "heart"],
  },
  {
    title: "The Singing Shell",
    icon: "🐚",
    pages: [
      "The pet found a beautiful shell that glowed with inner light...",
      "When held close, it sang the softest lullaby ever heard~ 🎵",
      "The melody drifted up and painted colors across the night sky~",
      "Now the pet listens to the shell whenever the stars come out~ ✨",
    ],
    dreamTheme: ["music", "star", "flower"],
  },
  {
    title: "The Tiny Dragon",
    icon: "🐉",
    pages: [
      "A small dragon, no bigger than a teacup, landed on the windowsill...",
      "It couldn't breathe fire — instead it breathed warm, cozy light~ 🔥",
      "The pet and the dragon snuggled together under a blanket of stars~",
      "And the dragon's warm glow kept all nightmares far, far away~ ✨",
    ],
    dreamTheme: ["star", "heart", "moon"],
  },
  {
    title: "The Midnight Parade",
    icon: "🎪",
    pages: [
      "At the stroke of midnight, a tiny parade marched across the room...",
      "Toy soldiers, dancing bears, and spinning tops all joined in~ 🎠",
      "The pet clapped along as confetti rained down like stardust~",
      "\"Come back tomorrow night!\" the pet called as they marched away~ ✨",
    ],
    dreamTheme: ["music", "heart", "star"],
  },
  {
    title: "The Wishing Well",
    icon: "💫",
    pages: [
      "Deep in a forest of sleeping trees, the pet found a glowing well...",
      "\"Whisper your wish,\" the well bubbled gently. \"I'll keep it safe~\"",
      "The pet wished for happiness for everyone it loved~ 💕",
      "The well glowed brighter, and a warm feeling filled the night~ ✨",
    ],
    dreamTheme: ["heart", "heart", "star"],
  },
  {
    title: "The Blanket of Stars",
    icon: "🌌",
    pages: [
      "The night sky reached down and offered the pet a blanket woven from stars...",
      "Each thread sparkled with a different memory — happy days, warm hugs~",
      "Wrapped in starlight, the pet felt safe and loved~ 🌟",
      "\"Goodnight, little one,\" the sky whispered. \"I'll watch over you~\" ✨",
    ],
    dreamTheme: ["star", "moon", "heart"],
  },
  {
    title: "The Butterfly's Dream",
    icon: "🦋",
    pages: [
      "A sleeping butterfly rested on a moonbeam near the pet...",
      "\"What do butterflies dream of?\" the pet wondered~ 🤔",
      "The butterfly smiled in its sleep: fields of flowers stretching forever~",
      "The pet closed its eyes and dreamed the same beautiful dream~ 🌸✨",
    ],
    dreamTheme: ["butterfly", "flower", "butterfly"],
  },
  {
    title: "The Night Music Box",
    icon: "🎵",
    pages: [
      "Hidden under a loose floorboard, the pet discovered a tiny music box...",
      "Its melody was so gentle, even the wind stopped to listen~ 🎶",
      "The notes turned into tiny glowing birds that circled the room~",
      "As the last note faded, the pet drifted into the sweetest sleep~ ✨",
    ],
    dreamTheme: ["music", "music", "star"],
  },
];

const BEDTIME_STORY_SPEECHES: string[] = [
  "Read me a story~! 📖",
  "Storytime! I love this part~! 🌙",
  "Once upon a time... 💫",
  "Another page, another dream~! ✨",
  "This story is so nice~ 😊",
  "Tell me more~ tell me more~! 📚",
  "I love bedtime stories~! 💕",
  "*listens intently* 👀✨",
];

let bedtimeStoryActive = false;
let bedtimeStoryIndex = -1;      // which story is being read
let bedtimeStoryPage = 0;        // current page within story
let bedtimeStoryTimer = 0;       // timer between pages
let bedtimeStoryCooldown = 0;    // prevent spam
let totalStoriesRead = 0;
let uniqueStoriesRead: Set<number> = new Set();
let sessionStoriesRead = 0;
let firstStoryThisSession = false;
let activeStoryDreamTheme: string[] = []; // current dream influence
const BEDTIME_STORY_PAGE_INTERVAL = 240; // ~4 seconds between pages
const BEDTIME_STORY_COOLDOWN = 300;      // ~5 seconds between stories

function playPageTurnSound(): void {
  // Soft paper rustle + gentle chime
  if (!soundEnabled) return;
  if (audioCtx.state === "suspended") audioCtx.resume();
  // Paper rustle — filtered noise-like effect using detuned oscillators
  playTone(150, 0.08, "triangle", 0.04, 20);
  playTone(200, 0.06, "triangle", 0.03, -15);
  // Gentle chime
  setTimeout(() => {
    playTone(880, 0.15, "sine", 0.05);
    playTone(1100, 0.12, "sine", 0.03);
  }, 60);
}

function playStoryCompleteSound(): void {
  // Warm, dreamy ascending melody
  playTone(523, 0.2, "sine", 0.07);  // C5
  setTimeout(() => playTone(659, 0.2, "sine", 0.06), 150);  // E5
  setTimeout(() => playTone(784, 0.2, "sine", 0.06), 300);  // G5
  setTimeout(() => playTone(1047, 0.35, "sine", 0.08), 450); // C6
  setTimeout(() => playTone(880, 0.4, "sine", 0.04), 550);  // A5 (dreamy resolve)
}

function startBedtimeStory(): void {
  if (bedtimeStoryActive || bedtimeStoryCooldown > 0) return;
  if (isSleeping || minigameActive || memoryGameActive) return;
  if (currentTimeOfDay !== "night" && currentTimeOfDay !== "evening") {
    queueSpeechBubble("Stories are best at bedtime~ Come back tonight! 🌙", 150, true);
    return;
  }

  // Pick a story — prefer unread ones
  const unread = BEDTIME_STORIES.map((_, i) => i).filter(i => !uniqueStoriesRead.has(i));
  if (unread.length > 0 && Math.random() < 0.75) {
    bedtimeStoryIndex = unread[Math.floor(Math.random() * unread.length)];
  } else {
    bedtimeStoryIndex = Math.floor(Math.random() * BEDTIME_STORIES.length);
  }

  bedtimeStoryActive = true;
  bedtimeStoryPage = 0;
  bedtimeStoryTimer = 0;

  const story = BEDTIME_STORIES[bedtimeStoryIndex];

  // Announce the story
  playPageTurnSound();
  queueSpeechBubble(`${story.icon} "${story.title}" ${story.icon}`, 180, true);

  // Set dream theme for this story
  activeStoryDreamTheme = [...story.dreamTheme];
  logDailyActivity("story");
}

function updateBedtimeStory(): void {
  // Cooldown tick
  if (bedtimeStoryCooldown > 0) bedtimeStoryCooldown--;

  if (!bedtimeStoryActive) return;

  bedtimeStoryTimer++;

  const story = BEDTIME_STORIES[bedtimeStoryIndex];
  if (!story) {
    bedtimeStoryActive = false;
    return;
  }

  // Time to show next page
  if (bedtimeStoryTimer >= BEDTIME_STORY_PAGE_INTERVAL) {
    bedtimeStoryTimer = 0;

    if (bedtimeStoryPage < story.pages.length) {
      // Show the current page
      playPageTurnSound();
      queueSpeechBubble(story.pages[bedtimeStoryPage], 220, true);
      bedtimeStoryPage++;

      // Occasional reaction speech from the pet (30% chance, not on first/last page)
      if (bedtimeStoryPage > 1 && bedtimeStoryPage < story.pages.length && Math.random() < 0.3) {
        const reaction = BEDTIME_STORY_SPEECHES[Math.floor(Math.random() * BEDTIME_STORY_SPEECHES.length)];
        // Queue it (non-immediate) so it shows after the story page
        queueSpeechBubble(reaction, 120);
      }
    } else {
      // Story complete!
      bedtimeStoryActive = false;
      bedtimeStoryCooldown = BEDTIME_STORY_COOLDOWN;

      totalStoriesRead++;
      sessionStoriesRead++;
      const isNewStory = !uniqueStoriesRead.has(bedtimeStoryIndex);
      uniqueStoriesRead.add(bedtimeStoryIndex);

      playStoryCompleteSound();

      // Happiness boost
      petHappiness = Math.min(100, petHappiness + 5);
      petEnergy = Math.min(100, petEnergy + 3);
      totalCarePoints += 2;
      friendshipXP += 3;

      // Completion message
      const completeMsgs = [
        "That was a lovely story~ 💤✨",
        "I feel so sleepy and happy now~ 🌙",
        "Best bedtime story ever~! 💕",
        "My dreams will be wonderful tonight~ ✨",
        "*yaaawn* ...so cozy~ 😊💤",
        "Read me another one tomorrow~ 📖✨",
      ];
      queueSpeechBubble(completeMsgs[Math.floor(Math.random() * completeMsgs.length)], 200, true);

      // Sparkle particles at story completion
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      for (let i = 0; i < 10; i++) {
        const angle = (Math.PI * 2 * i) / 10;
        const speed = 1 + Math.random() * 1.5;
        particles.push({
          x: cx, y: cy - 20,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.5,
          life: 50 + Math.random() * 30,
          maxLife: 80,
          size: 2 + Math.random() * 2,
          color: Math.random() < 0.5 ? "#FFD700" : "#E0C0FF",
          type: "sparkle",
        });
      }

      // Diary entry for first story this session, or new unique story
      if (!firstStoryThisSession) {
        firstStoryThisSession = true;
        addDiaryEntry("milestone", "📖", `Heard "${story.title}" — a bedtime story under the stars~ 🌙✨`);
      } else if (isNewStory) {
        addDiaryEntry("milestone", "📖", `Discovered a new story: "${story.title}"~ ${story.icon}`);
      }

      checkAchievements();
    }
  }
}

// --- Message in a Bottle ---
interface MessageBottle {
  x: number;
  y: number;
  vx: number;
  bobPhase: number;
  bobSpeed: number;
  rotation: number;
  rotationSpeed: number;
  life: number;
  opened: boolean;
  openAnimProgress: number;
  messageIndex: number;
  fromSide: "left" | "right"; // which side it drifted in from
}

const BOTTLE_MESSAGES: string[] = [
  "Dear friend~ I found a seashell that sings! 🐚✨",
  "Greetings from across the sea~ The sunsets here are pink! 🌅",
  "I made a flower crown today~ I wish I could share it! 🌸",
  "The clouds here look like bunnies~ Do yours look like bunnies too? 🐰☁️",
  "I learned to whistle! ...sort of. It sounds like a teapot~ 🫖",
  "My garden grew a sunflower taller than me~! 🌻",
  "I saw a rainbow with SEVEN colors today~ Is that normal? 🌈",
  "I found a rock shaped like a heart~ Sending it to you via imagination! 💎",
  "The fireflies here spell out words at night~ Last night they spelled 'hello'! ✨",
  "I taught a fish to wave~ ...okay maybe it was just swimming. 🐟",
  "Do you ever talk to the moon? It's a good listener~ 🌙",
  "I built a tiny castle out of sand~ Population: 1 hermit crab 🏰🦀",
  "The stars rearranged themselves into a smiley face last night~ 😊⭐",
  "I found a four-leaf clover! I'm sending you all the luck~ 🍀",
  "A butterfly landed on my nose today~ It tickled! 🦋",
  "I'm collecting interesting clouds~ I have 47 so far! ☁️",
  "The waves here sound like a lullaby~ I fell asleep three times today 💤",
  "I made friends with a seagull~ Its name is Gerald 🐦",
  "There's a cave nearby that echoes everything THREE times! ...times! ...times! 🗣️",
  "I drew a picture of you in the sand~ The tide says hi too! 🌊",
];

const BOTTLE_SPEECHES = [
  "Oh! A message in a bottle~! 🍾",
  "Someone sent me a letter~! 📜",
  "A bottle washed ashore~! ✨",
  "I wonder who wrote this~! 💌",
  "From a faraway friend~! 🌊",
  "A message from the sea~! 🐚",
];

const BOTTLE_REACTION_SPEECHES = [
  "How wonderful~! 💕",
  "I wish I could write back~! ✉️",
  "What a lovely message~! 🌟",
  "I'll treasure this forever~! 💎",
  "Somewhere out there, a friend~! 🌍",
  "This made my day~! ☀️",
];

let activeBottle: MessageBottle | null = null;
let bottleSpawnTimer = 0;
const BOTTLE_SPAWN_CHECK_INTERVAL = 300; // check every ~5 seconds
const BOTTLE_SPAWN_CHANCE = 0.03; // 3% chance per check — rare!
let totalBottlesOpened = 0;
let sessionBottlesOpened = 0;
let firstBottleThisSession = false;
let bottleCooldown = 0;
const BOTTLE_COOLDOWN = 600; // ~10 seconds after opening before next can spawn

function playBottleSplashSound(): void {
  // Watery splash + gentle cork pop
  playTone(180, 0.12, "sine", 0.06);
  playTone(350, 0.08, "sine", 0.04);
  setTimeout(() => playTone(600, 0.1, "sine", 0.06), 60);
  setTimeout(() => playTone(900, 0.15, "sine", 0.05), 120);
}

function playBottleOpenSound(): void {
  // Cork pop + paper unfurl
  playTone(400, 0.05, "square", 0.08); // pop
  playTone(800, 0.03, "square", 0.05);
  setTimeout(() => {
    playTone(1200, 0.12, "sine", 0.06); // shimmer
    playTone(1500, 0.15, "sine", 0.04);
  }, 80);
  setTimeout(() => {
    playTone(1800, 0.2, "sine", 0.03); // magical reveal
  }, 160);
}

function spawnMessageBottle(): void {
  if (activeBottle !== null) return;
  if (isSleeping) return;
  if (bottleCooldown > 0) return;
  if (minigameActive || memoryGameActive) return;

  const w = canvas.width;
  const h = canvas.height;
  const fromSide = Math.random() < 0.5 ? "left" : "right";
  const startX = fromSide === "left" ? -15 : w + 15;
  const speed = (fromSide === "left" ? 1 : -1) * (0.3 + Math.random() * 0.2);
  const groundY = h / 2 + 40 + Math.random() * 15;

  activeBottle = {
    x: startX,
    y: groundY,
    vx: speed,
    bobPhase: Math.random() * Math.PI * 2,
    bobSpeed: 0.03 + Math.random() * 0.02,
    rotation: (Math.random() - 0.5) * 0.3,
    rotationSpeed: (Math.random() - 0.5) * 0.005,
    life: 0,
    opened: false,
    openAnimProgress: 0,
    messageIndex: Math.floor(Math.random() * BOTTLE_MESSAGES.length),
    fromSide,
  };

  playBottleSplashSound();
}

function updateMessageBottle(): void {
  if (bottleCooldown > 0) bottleCooldown--;

  // Spawn check
  if (activeBottle === null && !isSleeping && !minigameActive && !memoryGameActive) {
    bottleSpawnTimer++;
    if (bottleSpawnTimer >= BOTTLE_SPAWN_CHECK_INTERVAL) {
      bottleSpawnTimer = 0;
      if (Math.random() < BOTTLE_SPAWN_CHANCE) {
        spawnMessageBottle();
      }
    }
  }

  if (!activeBottle) return;

  const b = activeBottle;
  b.life++;
  b.bobPhase += b.bobSpeed;
  b.rotation += b.rotationSpeed;

  if (b.opened) {
    b.openAnimProgress = Math.min(1, b.openAnimProgress + 0.02);
    // Float upward and fade
    b.y -= 0.3;
    if (b.openAnimProgress >= 1) {
      activeBottle = null;
    }
    return;
  }

  // Drift across screen
  b.x += b.vx;

  // Slow down as it reaches center area
  const centerX = canvas.width / 2;
  const distToCenter = Math.abs(b.x - centerX);
  if (distToCenter < 40) {
    b.vx *= 0.98; // decelerate near center
  }

  // Remove if drifted off the other side
  if ((b.fromSide === "left" && b.x > canvas.width + 20) ||
      (b.fromSide === "right" && b.x < -20)) {
    activeBottle = null;
    return;
  }

  // Also remove if it's been around too long without being clicked (30 seconds)
  if (b.life > 1800) {
    activeBottle = null;
  }
}

function tryClickBottle(clickX: number, clickY: number): boolean {
  if (!activeBottle || activeBottle.opened) return false;

  const b = activeBottle;
  const bobY = b.y + Math.sin(b.bobPhase) * 3;
  const dx = clickX - b.x;
  const dy = clickY - bobY;
  const hitRadius = 18; // generous click area

  if (dx * dx + dy * dy < hitRadius * hitRadius) {
    // Opened!
    b.opened = true;
    b.openAnimProgress = 0;
    totalBottlesOpened++;
    sessionBottlesOpened++;
    bottleCooldown = BOTTLE_COOLDOWN;

    playBottleOpenSound();

    // Show discovery speech
    const speech = BOTTLE_SPEECHES[Math.floor(Math.random() * BOTTLE_SPEECHES.length)];
    queueSpeechBubble(speech, 100, true);

    // Show the message after a short delay (queued)
    queueSpeechBubble(`"${BOTTLE_MESSAGES[b.messageIndex]}"`, 250);

    // Reaction speech
    if (Math.random() < 0.6) {
      const reaction = BOTTLE_REACTION_SPEECHES[Math.floor(Math.random() * BOTTLE_REACTION_SPEECHES.length)];
      queueSpeechBubble(reaction, 150);
    }

    // Sparkle particles — magical bottle opening
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2;
      const speed = 0.8 + Math.random() * 1.2;
      particles.push({
        x: b.x,
        y: bobY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.8,
        life: 35 + Math.random() * 25,
        maxLife: 35 + Math.random() * 25,
        size: 2 + Math.random() * 2,
        type: "sparkle",
      });
    }

    // Water splash particles
    for (let i = 0; i < 6; i++) {
      const angle = -Math.PI * 0.5 + (Math.random() - 0.5) * Math.PI * 0.8;
      particles.push({
        x: b.x,
        y: bobY,
        vx: Math.cos(angle) * (0.5 + Math.random()),
        vy: Math.sin(angle) * (1 + Math.random()) - 0.5,
        life: 20 + Math.random() * 15,
        maxLife: 20 + Math.random() * 15,
        size: 1.5 + Math.random() * 1,
        type: "raindrop",
      });
    }

    // Happiness boost
    petHappiness = Math.min(100, petHappiness + 4);
    totalCarePoints += 2;
    friendshipXP += 3;

    // First bottle this session — diary entry
    if (!firstBottleThisSession) {
      firstBottleThisSession = true;
      addDiaryEntry("milestone", "🍾", `Found a message in a bottle from a faraway friend~! 🌊✨`);
      logDailyActivity("bottle");
    }

    isHappy = true;
    happyTimer = 60;
    squishAmount = 0.4;

    checkAchievements();
    saveGame();
    return true;
  }
  return false;
}

function drawMessageBottle(): void {
  if (!activeBottle) return;

  const b = activeBottle;
  const fadeIn = Math.min(1, b.life / 30);
  const fadeOut = b.opened ? 1 - b.openAnimProgress : 1;
  const alpha = fadeIn * fadeOut;

  if (alpha <= 0) return;

  ctx.save();
  ctx.globalAlpha = alpha;

  const bobY = b.y + Math.sin(b.bobPhase) * 3;
  const drawX = b.x;
  const drawY = bobY;

  ctx.translate(drawX, drawY);
  ctx.rotate(b.rotation + Math.sin(b.bobPhase * 0.7) * 0.08);

  // Bottle body — glass green
  const bottleH = 14;
  const bottleW = 7;

  // Glass body
  ctx.beginPath();
  ctx.moveTo(-bottleW / 2, -bottleH / 2 + 3);
  ctx.quadraticCurveTo(-bottleW / 2 - 1, bottleH / 2 - 1, -bottleW / 2 + 1, bottleH / 2);
  ctx.lineTo(bottleW / 2 - 1, bottleH / 2);
  ctx.quadraticCurveTo(bottleW / 2 + 1, bottleH / 2 - 1, bottleW / 2, -bottleH / 2 + 3);
  ctx.closePath();

  const glassGrad = ctx.createLinearGradient(-bottleW / 2, 0, bottleW / 2, 0);
  glassGrad.addColorStop(0, "rgba(100, 200, 150, 0.7)");
  glassGrad.addColorStop(0.3, "rgba(140, 220, 170, 0.5)");
  glassGrad.addColorStop(0.7, "rgba(100, 200, 150, 0.6)");
  glassGrad.addColorStop(1, "rgba(80, 180, 130, 0.7)");
  ctx.fillStyle = glassGrad;
  ctx.fill();
  ctx.strokeStyle = "rgba(60, 160, 120, 0.5)";
  ctx.lineWidth = 0.5;
  ctx.stroke();

  // Bottle neck
  ctx.beginPath();
  ctx.moveTo(-2.5, -bottleH / 2 + 3);
  ctx.lineTo(-2, -bottleH / 2 - 2);
  ctx.lineTo(2, -bottleH / 2 - 2);
  ctx.lineTo(2.5, -bottleH / 2 + 3);
  ctx.closePath();
  ctx.fillStyle = "rgba(120, 210, 160, 0.6)";
  ctx.fill();
  ctx.strokeStyle = "rgba(60, 160, 120, 0.4)";
  ctx.stroke();

  // Cork
  ctx.beginPath();
  ctx.roundRect(-2, -bottleH / 2 - 5, 4, 4, 1);
  ctx.fillStyle = "#c8956a";
  ctx.fill();
  ctx.strokeStyle = "#a0784e";
  ctx.lineWidth = 0.3;
  ctx.stroke();

  // Glass highlight
  ctx.beginPath();
  ctx.moveTo(-bottleW / 2 + 1.5, -bottleH / 2 + 5);
  ctx.lineTo(-bottleW / 2 + 1.5, bottleH / 2 - 3);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // Paper scroll visible inside (tiny rolled paper)
  ctx.beginPath();
  ctx.roundRect(-1.5, -2, 3, 6, 0.5);
  ctx.fillStyle = "rgba(255, 245, 220, 0.6)";
  ctx.fill();

  // Gentle glow around bottle
  ctx.beginPath();
  ctx.arc(0, 0, 15, 0, Math.PI * 2);
  const glowGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 15);
  glowGrad.addColorStop(0, "rgba(180, 230, 200, 0.15)");
  glowGrad.addColorStop(1, "rgba(180, 230, 200, 0)");
  ctx.fillStyle = glowGrad;
  ctx.fill();

  ctx.restore();
}

function playFortuneCrackSound(): void {
  // Crisp crack + magical chime
  playTone(200, 0.08, "square", 0.08);
  playTone(400, 0.06, "square", 0.05);
  setTimeout(() => {
    playTone(800, 0.2, "sine", 0.08);
    playTone(1200, 0.25, "sine", 0.06);
  }, 80);
  setTimeout(() => {
    playTone(1600, 0.3, "sine", 0.05);
  }, 180);
}

function giveFortuneCookie(): void {
  if (isSleeping || minigameActive || memoryGameActive || activeFortuneCookie !== null || fortuneCookieCooldown > 0) return;

  fortuneCookieCooldown = FORTUNE_COOKIE_COOLDOWN;

  // Pick a fortune — prefer uncollected ones if available
  let fortuneIndex: number;
  const uncollected = FORTUNE_MESSAGES.map((_, i) => i).filter(i => !uniqueFortunesCollected.has(i));
  if (uncollected.length > 0 && Math.random() < 0.7) {
    fortuneIndex = uncollected[Math.floor(Math.random() * uncollected.length)];
  } else {
    fortuneIndex = Math.floor(Math.random() * FORTUNE_MESSAGES.length);
  }

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  activeFortuneCookie = {
    x: cx,
    y: cy + 15,
    scale: 0,
    rotation: (Math.random() - 0.5) * 0.3,
    opacity: 0,
    phase: "appearing",
    timer: 0,
    fortuneIndex,
  };

  totalFortuneCookies++;
  const isNew = !uniqueFortunesCollected.has(fortuneIndex);
  uniqueFortunesCollected.add(fortuneIndex);

  // Cute reaction messages
  const reactions = [
    "A fortune cookie~! 🥠",
    "Ooh, what does it say~? 🥠",
    "Crack it open~! ✨",
    "Fortune time~! 🥠",
    "I wonder what my fortune is~!",
    "*crunch crunch* 🥠",
  ];
  queueSpeechBubble(reactions[Math.floor(Math.random() * reactions.length)], 80);

  if (isNew) {
    addDiaryEntry("milestone", "🥠", `Found a new fortune: "${FORTUNE_MESSAGES[fortuneIndex].slice(0, 40)}..."`);
  }

  logDailyActivity("fortune");
  addFriendshipXP(1);
  petHappiness = Math.min(100, petHappiness + 3);
  totalCarePoints++;
  checkAchievements();
  saveGame();
}

function updateFortuneCookie(): void {
  if (fortuneCookieCooldown > 0) fortuneCookieCooldown--;
  if (!activeFortuneCookie) return;

  const fc = activeFortuneCookie;
  fc.timer++;

  switch (fc.phase) {
    case "appearing":
      fc.scale = Math.min(1, fc.scale + 0.06);
      fc.opacity = Math.min(1, fc.opacity + 0.06);
      if (fc.timer > 30) {
        fc.phase = "cracking";
        fc.timer = 0;
        playFortuneCrackSound();
        // Spawn sparkle particles
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2;
          particles.push({
            x: fc.x,
            y: fc.y,
            vx: Math.cos(angle) * 2,
            vy: Math.sin(angle) * 2,
            life: 30 + Math.random() * 20,
            maxLife: 30 + Math.random() * 20,
            size: 3 + Math.random() * 3,
            type: "sparkle",
          });
        }
      }
      break;
    case "cracking":
      if (fc.timer > 20) {
        fc.phase = "reading";
        fc.timer = 0;
        // Show the fortune as a speech bubble
        queueSpeechBubble(FORTUNE_MESSAGES[fc.fortuneIndex], 200, true);
      }
      break;
    case "reading":
      if (fc.timer > 120) {
        fc.phase = "fading";
        fc.timer = 0;
      }
      break;
    case "fading":
      fc.opacity = Math.max(0, fc.opacity - 0.04);
      fc.scale = Math.max(0, fc.scale - 0.02);
      if (fc.opacity <= 0) {
        activeFortuneCookie = null;
      }
      break;
  }
}

function drawFortuneCookie(): void {
  if (!activeFortuneCookie) return;
  const fc = activeFortuneCookie;

  ctx.save();
  ctx.globalAlpha = fc.opacity;
  ctx.translate(fc.x, fc.y);
  ctx.rotate(fc.rotation);
  ctx.scale(fc.scale, fc.scale);

  if (fc.phase === "appearing" || fc.phase === "cracking" && fc.timer < 10) {
    // Draw whole fortune cookie
    // Cookie body (crescent shape)
    ctx.fillStyle = "#e8b84b";
    ctx.beginPath();
    ctx.ellipse(0, 0, 14, 10, 0, 0, Math.PI, true);
    ctx.quadraticCurveTo(-8, 6, 0, 2);
    ctx.quadraticCurveTo(8, 6, 14, 0);
    ctx.fill();

    // Cookie highlight
    ctx.fillStyle = "#f5d36e";
    ctx.beginPath();
    ctx.ellipse(0, -2, 10, 5, 0, Math.PI, Math.PI * 2, true);
    ctx.fill();

    // Cookie shadow line
    ctx.strokeStyle = "#c49430";
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(-10, 0);
    ctx.quadraticCurveTo(0, 3, 10, 0);
    ctx.stroke();
  } else if (fc.phase === "cracking" || fc.phase === "reading" || fc.phase === "fading") {
    // Draw cracked cookie halves
    ctx.fillStyle = "#e8b84b";

    // Left half
    ctx.save();
    ctx.translate(-5, 0);
    ctx.rotate(-0.2);
    ctx.beginPath();
    ctx.ellipse(0, 0, 9, 8, 0, Math.PI * 0.6, Math.PI * 1.8);
    ctx.fill();
    ctx.restore();

    // Right half
    ctx.save();
    ctx.translate(5, 0);
    ctx.rotate(0.2);
    ctx.beginPath();
    ctx.ellipse(0, 0, 9, 8, 0, -Math.PI * 0.8, Math.PI * 0.6);
    ctx.fill();
    ctx.restore();

    // Paper strip sticking out
    ctx.fillStyle = "#fff8e8";
    ctx.save();
    ctx.rotate(0.05);
    ctx.fillRect(-12, -2, 24, 4);
    // Tiny text hint on paper
    ctx.fillStyle = "rgba(180, 140, 80, 0.5)";
    ctx.font = "3px monospace";
    ctx.textAlign = "center";
    ctx.fillText("~ fortune ~", 0, 1);
    ctx.restore();
  }

  ctx.restore();
}

// --- Bubble Blowing ---
interface Bubble {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  life: number;
  maxLife: number;
  wobblePhase: number;
  hue: number; // color hue 0-360
  shimmerPhase: number;
}

const bubbles: Bubble[] = [];
let totalBubblesPopped = 0;
let bubbleBlowCooldown = 0;
const BUBBLE_BLOW_COOLDOWN = 90; // ~1.5 seconds between blows
let isBubbleBlowing = false;
let bubbleBlowTimer = 0;
const BUBBLE_BLOW_DURATION = 40;

// --- Pet Emotes ---
interface Emote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  emoji: string;
  size: number;
  wobbleOffset: number; // unique phase for side-to-side wobble
}

const emotes: Emote[] = [];
let totalEmotesTriggered = 0;
let autonomousEmoteTimer = 0;
const AUTONOMOUS_EMOTE_INTERVAL_MIN = 900; // ~15 seconds
const AUTONOMOUS_EMOTE_INTERVAL_MAX = 2400; // ~40 seconds
let nextAutonomousEmoteAt = AUTONOMOUS_EMOTE_INTERVAL_MIN + Math.random() * (AUTONOMOUS_EMOTE_INTERVAL_MAX - AUTONOMOUS_EMOTE_INTERVAL_MIN);

// --- Weather System ---
type WeatherType = "sunny" | "cloudy" | "rainy" | "stormy" | "snowy" | "windy" | "foggy";

const WEATHER_ICONS: Record<WeatherType, string> = {
  sunny: "☀️", cloudy: "☁️", rainy: "🌧️", stormy: "⛈️", snowy: "❄️", windy: "💨", foggy: "🌫️",
};

const WEATHER_NAMES: Record<WeatherType, string> = {
  sunny: "Sunny", cloudy: "Cloudy", rainy: "Rainy", stormy: "Stormy", snowy: "Snowy", windy: "Windy", foggy: "Foggy",
};

// Season-weighted weather probabilities
const SEASON_WEATHER_WEIGHTS: Record<Season, Record<WeatherType, number>> = {
  spring: { sunny: 3, cloudy: 3, rainy: 4, stormy: 1, snowy: 0, windy: 2, foggy: 1 },
  summer: { sunny: 5, cloudy: 2, rainy: 1, stormy: 2, snowy: 0, windy: 1, foggy: 0 },
  autumn: { sunny: 2, cloudy: 3, rainy: 3, stormy: 1, snowy: 0, windy: 3, foggy: 2 },
  winter: { sunny: 2, cloudy: 3, rainy: 1, stormy: 0, snowy: 4, windy: 2, foggy: 1 },
};

let currentWeather: WeatherType = "sunny";
let weatherTimer = 0;             // frames until next weather change
let weatherTransitionAlpha = 0;   // 0-1 fade for weather transition
let weatherTransitioning = false;
let weatherNextType: WeatherType = "sunny";
let weatherParticleTimer = 0;     // spawn timer for weather-specific particles
let weatherWidgetPulse = 0;       // animation phase for widget
let weatherTypesSeen: Set<string> = new Set();
let weatherReactionCooldown = 0;  // prevent spam reactions

const WEATHER_CHANGE_MIN = 72000;  // ~20 minutes at 60fps
const WEATHER_CHANGE_MAX = 162000; // ~45 minutes at 60fps

function pickWeather(): WeatherType {
  const weights = SEASON_WEATHER_WEIGHTS[currentSeason];
  const types = Object.keys(weights) as WeatherType[];
  const totalWeight = types.reduce((sum, t) => sum + weights[t], 0);
  let roll = Math.random() * totalWeight;
  for (const t of types) {
    roll -= weights[t];
    if (roll <= 0) return t;
  }
  return "sunny";
}

function startWeatherChange(): void {
  const next = pickWeather();
  // Avoid same weather twice in a row (re-roll once)
  if (next === currentWeather) {
    weatherNextType = pickWeather();
    if (weatherNextType === currentWeather) weatherNextType = "cloudy"; // fallback
  } else {
    weatherNextType = next;
  }
  weatherTransitioning = true;
  weatherTransitionAlpha = 0;
}

function getWeatherPetReaction(weather: WeatherType): string {
  const reactions: Record<WeatherType, string[]> = {
    sunny: ["What a beautiful day! ☀️", "Warm and cozy~!", "Sunshine makes me happy!"],
    cloudy: ["The clouds look so fluffy~", "A grey kind of day...", "Hmm, overcast today."],
    rainy: ["Rain, rain~ 🌧️", "I love the sound of rain!", "Drip drip drop~"],
    stormy: ["Eek! Thunder! ⚡", "It's stormy outside..!", "Hold me, I'm scared~!"],
    snowy: ["Snow! So pretty~ ❄️", "Everything is white!", "Brr, it's cold!"],
    windy: ["Whooo~ the wind! 💨", "My fur is blowing!", "Hold on tight~!"],
    foggy: ["So mysterious~ 🌫️", "I can barely see...", "Spooky fog..."],
  };
  const msgs = reactions[weather];
  return msgs[Math.floor(Math.random() * msgs.length)];
}

function getWeatherEmoteSet(weather: WeatherType): string {
  switch (weather) {
    case "sunny": return "happy";
    case "rainy": return "sad";
    case "stormy": return "sad";
    case "snowy": return "excited";
    case "windy": return "curious";
    case "foggy": return "curious";
    default: return "happy";
  }
}

function updateWeather(): void {
  weatherWidgetPulse += 0.03;

  // Weather transition fade
  if (weatherTransitioning) {
    weatherTransitionAlpha += 0.008; // ~2 seconds to fully transition
    if (weatherTransitionAlpha >= 1) {
      weatherTransitioning = false;
      weatherTransitionAlpha = 0;
      currentWeather = weatherNextType;
      weatherTypesSeen.add(currentWeather);

      // Pet reacts to new weather
      if (weatherReactionCooldown <= 0) {
        queueSpeechBubble(getWeatherPetReaction(currentWeather), 180);
        spawnEmoteSet(getWeatherEmoteSet(currentWeather), 2);
        addDiaryEntry("general", WEATHER_ICONS[currentWeather], `Weather changed to ${WEATHER_NAMES[currentWeather]}!`);
        weatherReactionCooldown = 600; // 10 second cooldown
      }
    }
  }

  if (weatherReactionCooldown > 0) weatherReactionCooldown--;

  // Weather change timer
  weatherTimer--;
  if (weatherTimer <= 0) {
    weatherTimer = WEATHER_CHANGE_MIN + Math.floor(Math.random() * (WEATHER_CHANGE_MAX - WEATHER_CHANGE_MIN));
    startWeatherChange();
  }

  // Weather-specific particle spawning
  const cx2 = canvas.width / 2;
  const w = canvas.width;
  weatherParticleTimer++;

  if (currentWeather === "rainy" || currentWeather === "stormy") {
    const rate = currentWeather === "stormy" ? 3 : 6;
    if (weatherParticleTimer % rate === 0) {
      particles.push({
        x: Math.random() * (w + 40) - 20,
        y: -5,
        vx: currentWeather === "stormy" ? -1.5 + Math.random() * -1 : -0.3,
        vy: 4 + Math.random() * 2 + (currentWeather === "stormy" ? 3 : 0),
        life: 40 + Math.random() * 20,
        maxLife: 40 + Math.random() * 20,
        size: currentWeather === "stormy" ? 3 + Math.random() * 2 : 2 + Math.random() * 1.5,
        type: "raindrop",
      });
    }
  }

  if (currentWeather === "snowy") {
    if (weatherParticleTimer % 8 === 0) {
      particles.push({
        x: Math.random() * (w + 20) - 10,
        y: -5,
        vx: (Math.random() - 0.5) * 0.5,
        vy: 0.4 + Math.random() * 0.4,
        life: 200 + Math.random() * 100,
        maxLife: 200 + Math.random() * 100,
        size: 3 + Math.random() * 3,
        type: "snowflake",
      });
    }
  }

  if (currentWeather === "windy") {
    if (weatherParticleTimer % 12 === 0) {
      particles.push({
        x: -10,
        y: 20 + Math.random() * (canvas.height - 40),
        vx: 3 + Math.random() * 2,
        vy: (Math.random() - 0.5) * 0.8,
        life: 60 + Math.random() * 30,
        maxLife: 60 + Math.random() * 30,
        size: 2 + Math.random() * 2,
        type: "dust",
      });
    }
  }
}

function drawWeatherOverlay(): void {
  const w = canvas.width;
  const h = canvas.height;
  ctx.save();

  // Fog overlay
  if (currentWeather === "foggy") {
    const fogAlpha = 0.12 + 0.03 * Math.sin(weatherWidgetPulse * 0.7);
    ctx.fillStyle = `rgba(200, 210, 220, ${fogAlpha})`;
    ctx.fillRect(0, 0, w, h);
    // Soft fog wisps
    for (let i = 0; i < 3; i++) {
      const wy = h * 0.3 + i * h * 0.2 + Math.sin(weatherWidgetPulse * 0.5 + i * 2) * 10;
      const wx = w * 0.5 + Math.sin(weatherWidgetPulse * 0.3 + i) * w * 0.3;
      const grad = ctx.createRadialGradient(wx, wy, 0, wx, wy, 60);
      grad.addColorStop(0, `rgba(220, 225, 235, ${0.08 + 0.02 * Math.sin(weatherWidgetPulse + i)})`);
      grad.addColorStop(1, "rgba(220, 225, 235, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(wx, wy, 60, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Storm flash
  if (currentWeather === "stormy" && Math.random() < 0.003) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
    ctx.fillRect(0, 0, w, h);
    // Thunder sound
    playTone(60, 0.3, "sawtooth", 0.06);
    setTimeout(() => playTone(40, 0.4, "sawtooth", 0.04), 150);
  }

  // Cloudy/rainy/stormy dim overlay
  if (currentWeather === "cloudy" || currentWeather === "rainy" || currentWeather === "stormy") {
    const dimAlpha = currentWeather === "stormy" ? 0.08 : currentWeather === "rainy" ? 0.05 : 0.03;
    ctx.fillStyle = `rgba(80, 90, 110, ${dimAlpha})`;
    ctx.fillRect(0, 0, w, h);
  }

  // Sunny glow (subtle warm overlay)
  if (currentWeather === "sunny" && (currentTimeOfDay === "morning" || currentTimeOfDay === "afternoon")) {
    const sunX = w * 0.85;
    const sunY = 15;
    const sunPulse = 0.5 + 0.5 * Math.sin(weatherWidgetPulse);
    const grad = ctx.createRadialGradient(sunX, sunY, 2, sunX, sunY, 35 + sunPulse * 5);
    grad.addColorStop(0, "rgba(255, 220, 100, 0.12)");
    grad.addColorStop(0.5, "rgba(255, 200, 80, 0.05)");
    grad.addColorStop(1, "rgba(255, 200, 80, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 35 + sunPulse * 5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawWeatherWidget(): void {
  // Skip if any panel is open
  if (statsPanelOpen || diaryPanelOpen || moodJournalOpen || settingsPanelOpen || shortcutHelpOpen || minigameActive || memoryGameActive) return;

  const x = 6;
  const y = 6;
  const w = 52;
  const h = 20;

  ctx.save();

  // Widget background
  const bgAlpha = 0.55 + 0.05 * Math.sin(weatherWidgetPulse);
  ctx.fillStyle = `rgba(15, 15, 30, ${bgAlpha})`;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 6);
  ctx.fill();

  // Subtle border
  ctx.strokeStyle = "rgba(120, 160, 200, 0.25)";
  ctx.lineWidth = 0.5;
  ctx.stroke();

  // Weather icon
  ctx.font = "10px serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(WEATHER_ICONS[currentWeather], x + 4, y + h / 2 + 1);

  // Weather name
  ctx.font = "bold 7px monospace";
  ctx.fillStyle = "rgba(220, 230, 245, 0.85)";
  ctx.fillText(WEATHER_NAMES[currentWeather], x + 18, y + h / 2);

  ctx.restore();
}

// --- Friendship Meter ---
let friendshipXP = 0;
let consecutiveDays = 0;
let lastVisitDate = ""; // YYYY-MM-DD format
let friendshipAuraPhase = 0; // animation phase for the aura glow

function getFriendshipLevel(): number {
  // Level = floor(sqrt(friendshipXP / 5)), capped at 100
  return Math.min(100, Math.floor(Math.sqrt(friendshipXP / 5)));
}

function addFriendshipXP(amount: number): void {
  const oldLevel = getFriendshipLevel();
  friendshipXP += amount;
  const newLevel = getFriendshipLevel();
  if (newLevel > oldLevel && newLevel % 10 === 0) {
    // Milestone level — celebrate with speech bubble
    const milestoneMessages: Record<number, string> = {
      10: "I feel closer to you~! ♥",
      20: "We're becoming good friends!",
      30: "Our bond is growing strong!",
      40: "I trust you so much~!",
      50: "Soulbound! We're inseparable! ✨",
      60: "Best friend forever~! 💕",
      70: "Our friendship is legendary!",
      80: "You mean the world to me!",
      90: "An unbreakable bond... 💎",
      100: "Maximum friendship! We are one! 🌟",
    };
    const msg = milestoneMessages[newLevel] || `Friendship level ${newLevel}!`;
    queueSpeechBubble(msg, 240, true);
    spawnEmoteSet("love", 3);
    playAchievementSound();
    addDiaryEntry("general", "💕", `Reached friendship level ${newLevel}!`);
  }
}

function getTodayDate(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function drawFriendshipAura(cx: number, cy: number): void {
  const level = getFriendshipLevel();
  if (level < 10) return;

  friendshipAuraPhase += 0.02;
  ctx.save();

  if (level >= 50) {
    // Golden shimmer aura — warm, radiant
    const pulse = 0.5 + 0.5 * Math.sin(friendshipAuraPhase * 1.2);
    const radius = 55 + pulse * 8;
    const alpha = 0.08 + pulse * 0.06;
    const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, radius);
    grad.addColorStop(0, `rgba(255, 215, 0, ${alpha * 1.5})`);
    grad.addColorStop(0.5, `rgba(255, 180, 60, ${alpha})`);
    grad.addColorStop(1, "rgba(255, 180, 60, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();

    // Sparkle ring at high levels
    if (level >= 75) {
      const sparkleCount = 6;
      for (let i = 0; i < sparkleCount; i++) {
        const angle = friendshipAuraPhase * 0.5 + (i / sparkleCount) * Math.PI * 2;
        const sparkleR = 45 + Math.sin(friendshipAuraPhase * 2 + i) * 5;
        const sx = cx + Math.cos(angle) * sparkleR;
        const sy = cy + Math.sin(angle) * sparkleR;
        const sparkleAlpha = 0.3 + 0.3 * Math.sin(friendshipAuraPhase * 3 + i * 1.5);
        const sparkleSize = 2 + Math.sin(friendshipAuraPhase * 2.5 + i) * 1;
        ctx.globalAlpha = sparkleAlpha;
        ctx.fillStyle = "#FFD700";
        ctx.beginPath();
        ctx.arc(sx, sy, sparkleSize, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
  } else if (level >= 25) {
    // Pink heart aura — soft pulse
    const pulse = 0.5 + 0.5 * Math.sin(friendshipAuraPhase);
    const radius = 50 + pulse * 6;
    const alpha = 0.05 + pulse * 0.04;
    const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, radius);
    grad.addColorStop(0, `rgba(255, 130, 180, ${alpha * 1.3})`);
    grad.addColorStop(0.6, `rgba(255, 100, 150, ${alpha})`);
    grad.addColorStop(1, "rgba(255, 100, 150, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Warm subtle glow — level 10-24
    const pulse = 0.5 + 0.5 * Math.sin(friendshipAuraPhase * 0.8);
    const radius = 45 + pulse * 4;
    const alpha = 0.03 + pulse * 0.025;
    const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, radius);
    grad.addColorStop(0, `rgba(255, 200, 150, ${alpha * 1.2})`);
    grad.addColorStop(1, "rgba(255, 200, 150, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

const EMOTE_SETS: Record<string, string[]> = {
  happy: ["😊", "😄", "🥰", "✨", "💕"],
  love: ["❤️", "💖", "💗", "😍", "🥰"],
  food: ["🍎", "🍰", "🍪", "😋", "🤤"],
  sleepy: ["😴", "💤", "🌙", "😪", "🥱"],
  excited: ["🎉", "🤩", "⚡", "🔥", "💥"],
  sad: ["😢", "😿", "💧", "🥺", "😞"],
  playful: ["🎮", "🎪", "🎈", "🤹", "🎯"],
  music: ["🎵", "🎶", "♪", "🎤", "💃"],
  curious: ["🤔", "👀", "❓", "🔍", "🧐"],
  proud: ["😎", "💪", "🏆", "👑", "⭐"],
};

function spawnEmote(emoji: string, cx?: number, cy?: number): void {
  const x = cx ?? canvas.width / 2;
  const y = cy ?? (canvas.height / 2 - 30);
  emotes.push({
    x: x + (Math.random() - 0.5) * 30,
    y,
    vx: (Math.random() - 0.5) * 0.8,
    vy: -(1.2 + Math.random() * 0.6),
    life: 90 + Math.random() * 30,
    maxLife: 90 + Math.random() * 30,
    emoji,
    size: 16 + Math.random() * 6,
    wobbleOffset: Math.random() * Math.PI * 2,
  });
}

function spawnEmoteSet(setName: string, count: number = 1): void {
  const set = EMOTE_SETS[setName];
  if (!set) return;
  for (let i = 0; i < count; i++) {
    const emoji = set[Math.floor(Math.random() * set.length)];
    setTimeout(() => spawnEmote(emoji), i * 120); // stagger slightly
  }
  totalEmotesTriggered += count;
}

function spawnRandomEmote(): void {
  // Choose emote set based on current mood/state
  let setName: string;
  if (petHappiness > 80) {
    setName = Math.random() < 0.5 ? "happy" : "excited";
  } else if (petHappiness < 30) {
    setName = "sad";
  } else if (petEnergy < 25) {
    setName = "sleepy";
  } else if (petHunger < 25) {
    setName = "food";
  } else {
    const neutralSets = ["happy", "curious", "playful", "music", "proud"];
    setName = neutralSets[Math.floor(Math.random() * neutralSets.length)];
  }
  spawnEmoteSet(setName, 1);
}

function drawEmotes(): void {
  for (const e of emotes) {
    const alpha = e.life / e.maxLife;
    // Scale up briefly then shrink at end
    const lifeRatio = 1 - (e.life / e.maxLife);
    let scale = 1;
    if (lifeRatio < 0.1) {
      scale = lifeRatio / 0.1; // grow in
    } else if (lifeRatio > 0.7) {
      scale = (1 - lifeRatio) / 0.3; // shrink out
    }

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.font = `${Math.round(e.size * scale)}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(e.emoji, e.x, e.y);
    ctx.restore();
  }
}

function updateEmotes(): void {
  for (let i = emotes.length - 1; i >= 0; i--) {
    const e = emotes[i];
    e.x += e.vx;
    e.y += e.vy;
    // Gentle wobble
    e.vx = Math.sin(e.life * 0.06 + e.wobbleOffset) * 0.3;
    e.vy *= 0.995; // slow deceleration
    e.life--;
    if (e.life <= 0) {
      emotes.splice(i, 1);
    }
  }
}

// --- Bubble Blowing Functions ---
function blowBubbles(): void {
  if (isSleeping || minigameActive || memoryGameActive || isBubbleBlowing || bubbleBlowCooldown > 0) return;

  isBubbleBlowing = true;
  bubbleBlowTimer = BUBBLE_BLOW_DURATION;
  bubbleBlowCooldown = BUBBLE_BLOW_COOLDOWN;
  playBubbleBlowSound();

  // Pet puffs up cheeks (squish effect)
  squishAmount = 0.25;

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  // Spawn 3-6 bubbles from pet's mouth area
  const count = 3 + Math.floor(Math.random() * 4);
  for (let i = 0; i < count; i++) {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.2; // mostly upward
    const speed = 0.5 + Math.random() * 0.8;
    const delay = i * 4;
    setTimeout(() => {
      bubbles.push({
        x: cx + (Math.random() - 0.5) * 20,
        y: cy - 30 + (Math.random() - 0.5) * 10,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 5 + Math.random() * 8,
        life: 300 + Math.random() * 300,
        maxLife: 300 + Math.random() * 300,
        wobblePhase: Math.random() * Math.PI * 2,
        hue: Math.random() * 360,
        shimmerPhase: Math.random() * Math.PI * 2,
      });
    }, delay * 16);
  }

  queueSpeechBubble(BUBBLE_BLOW_MESSAGES[Math.floor(Math.random() * BUBBLE_BLOW_MESSAGES.length)], 100);
  logDailyActivity("bubbles");
  addFriendshipXP(1);
}

const BUBBLE_BLOW_MESSAGES = [
  "Bubble bubble~ 🫧",
  "Pop pop pop~! ✨",
  "Look at them float~!",
  "So round and shiny~",
  "Pfffft~ 🫧🫧",
  "Catch them if you can~!",
  "Wheeee~ Bubbles!",
];

function tryPopBubble(clickX: number, clickY: number): boolean {
  for (let i = bubbles.length - 1; i >= 0; i--) {
    const b = bubbles[i];
    const dx = clickX - b.x;
    const dy = clickY - b.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist <= b.radius + 5) {
      // Pop this bubble!
      const pitch = 0.8 + (b.radius / 13) * 0.4; // bigger bubbles = lower pop
      playBubblePopSound(pitch);
      totalBubblesPopped++;

      // Sparkle burst at pop location
      for (let j = 0; j < 4; j++) {
        const angle = (j / 4) * Math.PI * 2 + Math.random() * 0.5;
        particles.push({
          x: b.x,
          y: b.y,
          vx: Math.cos(angle) * 1.5,
          vy: Math.sin(angle) * 1.5,
          life: 25 + Math.random() * 15,
          maxLife: 25 + Math.random() * 15,
          size: 3 + Math.random() * 2,
          type: "sparkle",
        });
      }

      bubbles.splice(i, 1);
      checkAchievements();
      saveGame();
      return true;
    }
  }
  return false;
}

function updateBubbles(): void {
  if (bubbleBlowCooldown > 0) bubbleBlowCooldown--;
  if (bubbleBlowTimer > 0) {
    bubbleBlowTimer--;
    if (bubbleBlowTimer <= 0) isBubbleBlowing = false;
  }

  for (let i = bubbles.length - 1; i >= 0; i--) {
    const b = bubbles[i];
    // Gentle floating upward with drift
    b.vy -= 0.003; // slight upward acceleration
    b.vy = Math.max(-0.8, b.vy); // terminal rise speed
    b.x += b.vx + Math.sin(b.wobblePhase) * 0.3;
    b.y += b.vy;
    b.wobblePhase += 0.03;
    b.shimmerPhase += 0.05;

    // Gentle horizontal drift dampening
    b.vx *= 0.998;

    // Bounce off canvas edges
    if (b.x - b.radius < 0) { b.x = b.radius; b.vx = Math.abs(b.vx) * 0.5; }
    if (b.x + b.radius > canvas.width) { b.x = canvas.width - b.radius; b.vx = -Math.abs(b.vx) * 0.5; }

    b.life--;
    // Bubbles that float off the top or expire get removed
    if (b.life <= 0 || b.y + b.radius < -10) {
      bubbles.splice(i, 1);
    }
  }
}

function drawBubble(b: Bubble): void {
  const alpha = Math.min(1, b.life / 30); // fade out in last 30 frames

  ctx.save();
  ctx.globalAlpha = alpha;

  // Outer iridescent ring
  const gradient = ctx.createRadialGradient(
    b.x - b.radius * 0.3, b.y - b.radius * 0.3, b.radius * 0.1,
    b.x, b.y, b.radius
  );
  const hue1 = (b.hue + Math.sin(b.shimmerPhase) * 30) % 360;
  const hue2 = (b.hue + 120 + Math.cos(b.shimmerPhase * 0.7) * 20) % 360;
  gradient.addColorStop(0, `hsla(${hue1}, 80%, 90%, 0.15)`);
  gradient.addColorStop(0.5, `hsla(${hue2}, 70%, 80%, 0.1)`);
  gradient.addColorStop(0.8, `hsla(${hue1}, 60%, 70%, 0.2)`);
  gradient.addColorStop(1, `hsla(${hue2}, 50%, 60%, 0.3)`);

  ctx.beginPath();
  ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();

  // Thin outline
  ctx.strokeStyle = `hsla(${hue1}, 60%, 80%, ${0.35 * alpha})`;
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // Highlight shine (small bright spot top-left)
  ctx.beginPath();
  ctx.arc(b.x - b.radius * 0.3, b.y - b.radius * 0.3, b.radius * 0.25, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255, 255, 255, ${0.5 * alpha})`;
  ctx.fill();

  // Secondary smaller highlight
  ctx.beginPath();
  ctx.arc(b.x + b.radius * 0.15, b.y - b.radius * 0.15, b.radius * 0.1, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255, 255, 255, ${0.25 * alpha})`;
  ctx.fill();

  ctx.restore();
}

// --- System Stress ---
let cpuUsage = 0;
let memUsage = 0;
let stressLevel = 0; // 0-1 smoothed stress indicator
let sweatSpawnTimer = 0;
let isStressed = false; // true when stress > 0.5
let growlSpawnTimer = 0; // stomach growl particle timer

// --- Mood Particle Trails ---
let happyTrailTimer = 0;     // spawn timer for happy sparkle trails
let sadCloudActive = false;  // whether the rain cloud is visible
let sadCloudX = 0;           // cloud x position (follows pet)
let sadCloudY = 0;           // cloud y position (above pet)
let sadRainTimer = 0;        // spawn timer for raindrops

// --- Pet Footprints ---
interface Footprint {
  x: number;       // canvas x position
  y: number;       // canvas y position
  life: number;    // remaining life (frames)
  maxLife: number;
  isLeft: boolean; // alternating left/right paw
  drift: number;   // accumulated x drift (simulates being "left behind")
}

const footprints: Footprint[] = [];
let footprintTimer = 0;    // spawn timer
let footprintLeft = true;  // alternates between left and right paw

// --- Pet Dreams (Night) ---
interface DreamBubble {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  icon: string;       // which dream icon to draw
  size: number;
  wobblePhase: number;
}

const dreamBubbles: DreamBubble[] = [];
let dreamSpawnTimer = 0;
const DREAM_ICONS = ["star", "heart", "food", "butterfly", "moon", "fish", "flower", "music"];

// --- Toy System ---
type ToyType = "none" | "ball" | "yarn" | "plush" | "bone";

interface ToyInfo {
  id: ToyType;
  name: string;
  icon: string;
}

const TOYS: ToyInfo[] = [
  { id: "none", name: "No Toy", icon: "❌" },
  { id: "ball", name: "Bouncy Ball", icon: "🏐" },
  { id: "yarn", name: "Yarn Ball", icon: "🧶" },
  { id: "plush", name: "Plush Bear", icon: "🧸" },
  { id: "bone", name: "Squeaky Bone", icon: "🦴" },
];

// Personality toy preferences — preferred toy gets extra happiness
const PERSONALITY_TOY_PREF: Record<string, ToyType> = {
  energetic: "ball",
  curious: "yarn",
  shy: "plush",
  sleepy: "plush",
  gluttonous: "bone",
};

let currentToy: ToyType = "none";
let toyX = 0;         // toy position on canvas
let toyY = 0;
let toyBouncePhase = 0;   // animation phase for idle bobbing
let toyPlayTimer = 0;     // countdown until pet plays with toy
let toyPlayState: "idle" | "approaching" | "playing" | "celebrating" = "idle";
let toyPlayAnimTimer = 0; // animation timer during play
let totalToyPlays = 0;    // for achievement tracking
const TOY_PLAY_INTERVAL_MIN = 600;  // ~10 seconds at 60fps minimum between plays
const TOY_PLAY_INTERVAL_MAX = 1800; // ~30 seconds at 60fps maximum

function setToy(toyId: ToyType): void {
  const prevToy = currentToy;
  currentToy = toyId;
  // Place toy to the right of the pet
  toyX = canvas.width / 2 + 50;
  toyY = canvas.height / 2 + 35;
  toyPlayState = "idle";
  toyPlayTimer = TOY_PLAY_INTERVAL_MIN + Math.floor(Math.random() * (TOY_PLAY_INTERVAL_MAX - TOY_PLAY_INTERVAL_MIN));

  if (toyId !== "none") {
    const toyInfo = TOYS.find(t => t.id === toyId)!;
    const isFavorite = petPersonality && PERSONALITY_TOY_PREF[petPersonality] === toyId;
    const msg = isFavorite ? `${toyInfo.icon} My favorite! ${toyInfo.name}!` : `${toyInfo.icon} Ooh, a ${toyInfo.name}!`;
    queueSpeechBubble(msg, 150, true);
    playClickSound();
    squishAmount = 0.4;
    isHappy = true;
    happyTimer = 45;
    if (prevToy === "none") {
      addDiaryEntry("milestone", toyInfo.icon, `Got first toy: ${toyInfo.name}!`);
    }
  } else if (prevToy !== "none") {
    queueSpeechBubble("Toy put away~", 100, true);
  }
  saveGame();
}

function playToySqueak(): void {
  // Quick squeaky sound
  playTone(1400, 0.06, "sine", 0.08);
  setTimeout(() => playTone(1800, 0.05, "sine", 0.06), 40);
}

function drawToy(cx: number, cy: number): void {
  if (currentToy === "none") return;

  const bobY = Math.sin(toyBouncePhase) * 2;
  const tx = toyX;
  const ty = toyY + bobY;

  ctx.save();

  if (currentToy === "ball") {
    // Bouncy ball — round with highlight
    const radius = 8;
    const grad = ctx.createRadialGradient(tx - 2, ty - 2, 1, tx, ty, radius);
    grad.addColorStop(0, "#FF6B6B");
    grad.addColorStop(0.7, "#E84040");
    grad.addColorStop(1, "#CC2020");
    ctx.beginPath();
    ctx.arc(tx, ty, radius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = "#B01818";
    ctx.lineWidth = 0.8;
    ctx.stroke();
    // Shine
    ctx.beginPath();
    ctx.arc(tx - 2.5, ty - 3, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fill();
  } else if (currentToy === "yarn") {
    // Yarn ball — round with cross-hatch lines
    const radius = 8;
    ctx.beginPath();
    ctx.arc(tx, ty, radius, 0, Math.PI * 2);
    ctx.fillStyle = "#E080D0";
    ctx.fill();
    ctx.strokeStyle = "#C060B0";
    ctx.lineWidth = 0.8;
    ctx.stroke();
    // Cross-hatch yarn texture
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 0.6;
    for (let i = -6; i <= 6; i += 3) {
      ctx.beginPath();
      ctx.moveTo(tx + i - 3, ty - 7);
      ctx.lineTo(tx + i + 3, ty + 7);
      ctx.stroke();
    }
    // Trailing yarn end
    ctx.strokeStyle = "#E080D0";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(tx + 7, ty + 2);
    ctx.quadraticCurveTo(tx + 14, ty + 6, tx + 12, ty + 10);
    ctx.stroke();
  } else if (currentToy === "plush") {
    // Plush bear — simple teddy shape
    const s = 9;
    // Body
    ctx.beginPath();
    ctx.ellipse(tx, ty + 2, s * 0.7, s * 0.9, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#C89060";
    ctx.fill();
    ctx.strokeStyle = "#A07040";
    ctx.lineWidth = 0.8;
    ctx.stroke();
    // Head
    ctx.beginPath();
    ctx.arc(tx, ty - 6, s * 0.55, 0, Math.PI * 2);
    ctx.fillStyle = "#D0A070";
    ctx.fill();
    ctx.stroke();
    // Ears
    ctx.beginPath();
    ctx.arc(tx - 4, ty - 10, 2.5, 0, Math.PI * 2);
    ctx.arc(tx + 4, ty - 10, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = "#C89060";
    ctx.fill();
    ctx.stroke();
    // Eyes
    ctx.fillStyle = "#333";
    ctx.beginPath();
    ctx.arc(tx - 2, ty - 7, 1, 0, Math.PI * 2);
    ctx.arc(tx + 2, ty - 7, 1, 0, Math.PI * 2);
    ctx.fill();
    // Nose
    ctx.beginPath();
    ctx.arc(tx, ty - 5, 1, 0, Math.PI * 2);
    ctx.fillStyle = "#704030";
    ctx.fill();
  } else if (currentToy === "bone") {
    // Bone shape
    ctx.fillStyle = "#F0E8D8";
    ctx.strokeStyle = "#C8B8A0";
    ctx.lineWidth = 0.8;
    // Shaft
    ctx.beginPath();
    ctx.roundRect(tx - 8, ty - 2.5, 16, 5, 2);
    ctx.fill();
    ctx.stroke();
    // Left knobs
    ctx.beginPath();
    ctx.arc(tx - 8, ty - 3, 3.5, 0, Math.PI * 2);
    ctx.arc(tx - 8, ty + 3, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Right knobs
    ctx.beginPath();
    ctx.arc(tx + 8, ty - 3, 3.5, 0, Math.PI * 2);
    ctx.arc(tx + 8, ty + 3, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

function updateToy(): void {
  if (currentToy === "none") return;

  toyBouncePhase += 0.03;

  // Don't play during mini-games, panels, or when dragging
  if (minigameActive || memoryGameActive || isDragging || statsPanelOpen || diaryPanelOpen || moodJournalOpen || settingsPanelOpen || shortcutHelpOpen) return;

  if (toyPlayState === "idle") {
    toyPlayTimer--;
    if (toyPlayTimer <= 0 && idleAnim === "none" && !isSpinning && !isCharging && activeTrick === null) {
      toyPlayState = "approaching";
      toyPlayAnimTimer = 0;
    }
  } else if (toyPlayState === "approaching") {
    toyPlayAnimTimer++;
    // Pet "looks" at toy for ~30 frames
    if (toyPlayAnimTimer >= 30) {
      toyPlayState = "playing";
      toyPlayAnimTimer = 0;
      playToySqueak();
    }
  } else if (toyPlayState === "playing") {
    toyPlayAnimTimer++;
    // Animate the toy being played with for ~60 frames
    if (currentToy === "ball") {
      // Ball bounces
      toyY = canvas.height / 2 + 35 - Math.abs(Math.sin(toyPlayAnimTimer * 0.15)) * 15;
      toyX = canvas.width / 2 + 50 + Math.sin(toyPlayAnimTimer * 0.08) * 8;
    } else if (currentToy === "yarn") {
      // Yarn rolls side to side
      toyX = canvas.width / 2 + 50 + Math.sin(toyPlayAnimTimer * 0.1) * 12;
    } else if (currentToy === "plush") {
      // Plush gets gentle rocking
      toyBouncePhase += 0.1; // faster bobbing during play
    } else if (currentToy === "bone") {
      // Bone slides and wobbles
      toyX = canvas.width / 2 + 50 + Math.sin(toyPlayAnimTimer * 0.12) * 6;
      toyY = canvas.height / 2 + 35 + Math.cos(toyPlayAnimTimer * 0.2) * 3;
    }

    if (toyPlayAnimTimer >= 60) {
      toyPlayState = "celebrating";
      toyPlayAnimTimer = 0;
      totalToyPlays++;
      logDailyActivity("played");
      addFriendshipXP(2);
      spawnEmoteSet("playful", 1);

      // Happiness boost — more if it's the pet's favorite toy
      const isFavorite = petPersonality && PERSONALITY_TOY_PREF[petPersonality] === currentToy;
      const happinessGain = isFavorite ? 8 : 4;
      petHappiness = Math.min(100, petHappiness + happinessGain);

      // Spawn heart particles
      const pcx = canvas.width / 2;
      const pcy = canvas.height / 2;
      for (let i = 0; i < 3; i++) {
        particles.push({
          x: pcx + (Math.random() - 0.5) * 30,
          y: pcy - 15,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -(1 + Math.random()),
          life: 50 + Math.random() * 20,
          maxLife: 50 + Math.random() * 20,
          size: 5 + Math.random() * 3,
          type: "heart",
        });
      }

      // Speech bubble about playing
      const toyInfo = TOYS.find(t => t.id === currentToy)!;
      const playMessages: Record<ToyType, string[]> = {
        none: [],
        ball: ["Bounce bounce!", "Wheee~!", "Catch!", "So bouncy!"],
        yarn: ["*bat bat bat*", "Unravel~!", "So soft!", "Tangle time!"],
        plush: ["*hugs tight*", "My friend~!", "Snuggle!", "So cuddly!"],
        bone: ["*chomp chomp*", "Mine!", "Crunchy~!", "Good bone!"],
      };
      const msgs = playMessages[currentToy];
      if (msgs.length > 0) {
        queueSpeechBubble(`${toyInfo.icon} ${msgs[Math.floor(Math.random() * msgs.length)]}`, 120, false);
      }

      if (isFavorite) {
        // Extra sparkles for favorite toy
        for (let i = 0; i < 4; i++) {
          particles.push({
            x: pcx + (Math.random() - 0.5) * 40,
            y: pcy + (Math.random() - 0.5) * 30,
            vx: (Math.random() - 0.5) * 1,
            vy: -(0.5 + Math.random() * 0.5),
            life: 40 + Math.random() * 20,
            maxLife: 40 + Math.random() * 20,
            size: 3 + Math.random() * 2,
            type: "sparkle",
          });
        }
      }

      checkAchievements();
      saveGame();
    }
  } else if (toyPlayState === "celebrating") {
    toyPlayAnimTimer++;
    // Reset toy position smoothly
    toyX += (canvas.width / 2 + 50 - toyX) * 0.1;
    toyY += (canvas.height / 2 + 35 - toyY) * 0.1;
    if (toyPlayAnimTimer >= 30) {
      toyPlayState = "idle";
      toyPlayTimer = TOY_PLAY_INTERVAL_MIN + Math.floor(Math.random() * (TOY_PLAY_INTERVAL_MAX - TOY_PLAY_INTERVAL_MIN));
      toyX = canvas.width / 2 + 50;
      toyY = canvas.height / 2 + 35;
    }
  }
}

// --- Pet Tricks System ---
type TrickId = "wave" | "dance" | "backflip" | "twirl";

interface TrickInfo {
  id: TrickId;
  name: string;
  icon: string;
  duration: number;       // frames for full animation
  practiceMessages: string[];
  masteredMessages: string[];
}

const TRICKS: TrickInfo[] = [
  {
    id: "wave", name: "Wave", icon: "👋", duration: 50,
    practiceMessages: ["Like this...? 👋", "Am I doing it?", "Wave... wave..."],
    masteredMessages: ["Hi there! 👋", "Hello~! 👋", "*waves excitedly*"],
  },
  {
    id: "dance", name: "Dance", icon: "💃", duration: 70,
    practiceMessages: ["One two... three?", "Is this dancing?", "*stumbles a bit*"],
    masteredMessages: ["♪ Dance time! ♪", "Watch me groove~!", "💃 Ta-da~!"],
  },
  {
    id: "backflip", name: "Backflip", icon: "🤸", duration: 45,
    practiceMessages: ["Okay here goes...", "Almost...!", "*wobbles* Whoa!"],
    masteredMessages: ["FLIP! 🤸", "Nailed it!", "Watch this~!"],
  },
  {
    id: "twirl", name: "Twirl", icon: "🌀", duration: 55,
    practiceMessages: ["Round and... round...", "*dizzy*", "Whoa spinny~"],
    masteredMessages: ["✨ Twirl~! ✨", "So graceful~!", "Round and round!"],
  },
];

const TRICK_PRACTICES_TO_MASTER = 3;

// Trick learning state: maps trick ID to number of practice sessions completed (3 = mastered)
let trickProgress: Record<TrickId, number> = { wave: 0, dance: 0, backflip: 0, twirl: 0 };

// Active trick animation state
let activeTrick: TrickId | null = null;
let trickAnimProgress = 0;       // 0 to 1
let trickAnimFrame = 0;
let trickIsPractice = false;     // true = wobbly learning animation

// Autonomous trick performance timer
let trickAutoTimer = 0;
const TRICK_AUTO_MIN = 2700;  // ~45 seconds at 60fps
const TRICK_AUTO_MAX = 5400;  // ~90 seconds at 60fps

function isTrickMastered(trickId: TrickId): boolean {
  return trickProgress[trickId] >= TRICK_PRACTICES_TO_MASTER;
}

function getMasteredTricks(): TrickId[] {
  return TRICKS.filter(t => isTrickMastered(t.id)).map(t => t.id);
}

function getNextUnlearnedTrick(): TrickId | null {
  for (const t of TRICKS) {
    if (!isTrickMastered(t.id)) return t.id;
  }
  return null;
}

function playTrickSound(mastered: boolean): void {
  if (mastered) {
    // Bright triumphant jingle
    playTone(600, 0.1, "sine", 0.1);
    setTimeout(() => playTone(750, 0.1, "sine", 0.1), 80);
    setTimeout(() => playTone(900, 0.15, "sine", 0.12), 160);
  } else {
    // Tentative learning sound — wobbly ascending
    playTone(400, 0.1, "sine", 0.07);
    setTimeout(() => playTone(480, 0.08, "sine", 0.06), 100);
    setTimeout(() => playTone(520, 0.1, "sine", 0.08), 200);
  }
}

function playTrickLearnedSound(): void {
  // Celebration fanfare — longer and more excited than regular trick sound
  playTone(523, 0.12, "sine", 0.1);
  setTimeout(() => playTone(659, 0.12, "sine", 0.1), 80);
  setTimeout(() => playTone(784, 0.12, "sine", 0.1), 160);
  setTimeout(() => playTone(1047, 0.25, "sine", 0.14), 240);
  setTimeout(() => playTone(1175, 0.3, "sine", 0.12), 360);
}

function performTrick(trickId: TrickId, practice: boolean): void {
  if (activeTrick !== null || isSpinning || isDragging || isCharging || minigameActive || memoryGameActive) return;

  const trick = TRICKS.find(t => t.id === trickId)!;
  activeTrick = trickId;
  trickAnimProgress = 0;
  trickAnimFrame = 0;
  trickIsPractice = practice;
  lastInteractionTime = Date.now();

  isHappy = true;
  happyTimer = trick.duration + 20;

  if (practice) {
    playTrickSound(false);
    const msgs = trick.practiceMessages;
    queueSpeechBubble(`${trick.icon} ${msgs[Math.floor(Math.random() * msgs.length)]}`, 120, true);
  } else {
    playTrickSound(true);
    const msgs = trick.masteredMessages;
    queueSpeechBubble(`${trick.icon} ${msgs[Math.floor(Math.random() * msgs.length)]}`, 120, true);
    petHappiness = Math.min(100, petHappiness + 4);
    addCarePoints(2);
  }

  // Sparkle particles
  const pcx = canvas.width / 2;
  const pcy = canvas.height / 2;
  const sparkleCount = practice ? 3 : 6;
  for (let i = 0; i < sparkleCount; i++) {
    const angle = (i / sparkleCount) * Math.PI * 2;
    particles.push({
      x: pcx + Math.cos(angle) * 18,
      y: pcy + Math.sin(angle) * 12,
      vx: Math.cos(angle) * 1.2,
      vy: Math.sin(angle) * 0.8,
      life: 40 + Math.random() * 20,
      maxLife: 40 + Math.random() * 20,
      size: 2.5 + Math.random() * 2,
      type: "sparkle",
    });
  }
}

// --- Trick Combos System ---
interface TrickCombo {
  id: string;
  name: string;
  icon: string;
  sequence: TrickId[];
  messages: string[];
  bonusHappiness: number;
  bonusFriendshipXP: number;
}

const TRICK_COMBOS: TrickCombo[] = [
  {
    id: "showtime", name: "Showtime", icon: "🎭",
    sequence: ["wave", "dance"],
    messages: ["Ta-da! Show's over~!", "What a performance!", "Encore, encore~!"],
    bonusHappiness: 8, bonusFriendshipXP: 5,
  },
  {
    id: "acrobat", name: "Acrobat", icon: "🤹",
    sequence: ["backflip", "twirl"],
    messages: ["I'm an acrobat~!", "So athletic!", "Catch me if you can~!"],
    bonusHappiness: 8, bonusFriendshipXP: 5,
  },
  {
    id: "greeting_dance", name: "Greeting Dance", icon: "💫",
    sequence: ["wave", "twirl"],
    messages: ["Hello and a twirl~!", "Fancy greeting!", "Spin-hello~!"],
    bonusHappiness: 6, bonusFriendshipXP: 4,
  },
  {
    id: "grand_finale", name: "Grand Finale", icon: "🎆",
    sequence: ["wave", "dance", "backflip", "twirl"],
    messages: ["THE GRAND FINALE~!!!", "My greatest show ever!", "Standing ovation~!!!"],
    bonusHappiness: 20, bonusFriendshipXP: 15,
  },
];

// Track recent trick history for combo detection
interface TrickHistoryEntry {
  trickId: TrickId;
  timestamp: number; // frame number
}

const trickHistory: TrickHistoryEntry[] = [];
const TRICK_COMBO_WINDOW = 600; // ~10 seconds at 60fps to chain tricks
let totalTrickCombos = 0;
let combosDiscovered: Set<string> = new Set();

function checkTrickCombo(currentFrame: number): TrickCombo | null {
  // Check combos longest-first so Grand Finale takes priority
  const sortedCombos = [...TRICK_COMBOS].sort((a, b) => b.sequence.length - a.sequence.length);

  for (const combo of sortedCombos) {
    const seqLen = combo.sequence.length;
    if (trickHistory.length < seqLen) continue;

    // Get the last N entries
    const recent = trickHistory.slice(-seqLen);

    // Check time window: first entry must be within window of now
    if (currentFrame - recent[0].timestamp > TRICK_COMBO_WINDOW) continue;

    // Check sequence match
    let match = true;
    for (let i = 0; i < seqLen; i++) {
      if (recent[i].trickId !== combo.sequence[i]) {
        match = false;
        break;
      }
    }

    if (match) return combo;
  }

  return null;
}

function playTrickComboJingle(isGrandFinale: boolean): void {
  if (isGrandFinale) {
    // Epic fanfare
    playTone(523, 0.1, "sine", 0.1);
    setTimeout(() => playTone(659, 0.1, "sine", 0.1), 80);
    setTimeout(() => playTone(784, 0.1, "sine", 0.1), 160);
    setTimeout(() => playTone(1047, 0.15, "sine", 0.12), 240);
    setTimeout(() => playTone(1175, 0.15, "sine", 0.12), 320);
    setTimeout(() => playTone(1319, 0.2, "sine", 0.14), 400);
    setTimeout(() => playTone(1568, 0.4, "sine", 0.15), 500);
  } else {
    // Quick celebratory jingle
    playTone(660, 0.08, "sine", 0.1);
    setTimeout(() => playTone(880, 0.08, "sine", 0.1), 70);
    setTimeout(() => playTone(1100, 0.1, "sine", 0.12), 140);
    setTimeout(() => playTone(1320, 0.2, "sine", 0.1), 210);
  }
}

function celebrateTrickCombo(combo: TrickCombo): void {
  const msg = combo.messages[Math.floor(Math.random() * combo.messages.length)];
  queueSpeechBubble(`${combo.icon} ${msg}`, 200, true);

  playTrickComboJingle(combo.id === "grand_finale");

  petHappiness = Math.min(100, petHappiness + combo.bonusHappiness);
  addFriendshipXP(combo.bonusFriendshipXP);
  addCarePoints(combo.id === "grand_finale" ? 5 : 3);

  totalTrickCombos++;
  const isNew = !combosDiscovered.has(combo.id);
  combosDiscovered.add(combo.id);

  if (isNew) {
    addDiaryEntry("milestone", combo.icon, `Discovered the "${combo.name}" trick combo!`);
  }

  // Massive particle burst
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const isGrand = combo.id === "grand_finale";
  const burstCount = isGrand ? 20 : 10;
  const particleTypes: Array<"sparkle" | "heart" | "star"> = ["sparkle", "heart", "star"];

  for (let i = 0; i < burstCount; i++) {
    const angle = (i / burstCount) * Math.PI * 2;
    const speed = isGrand ? 2.5 + Math.random() * 1.5 : 1.5 + Math.random() * 1;
    particles.push({
      x: cx + Math.cos(angle) * 10,
      y: cy + Math.sin(angle) * 8,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 0.5,
      life: 80 + Math.random() * 40,
      maxLife: 80 + Math.random() * 40,
      size: isGrand ? 5 + Math.random() * 4 : 3.5 + Math.random() * 3,
      type: particleTypes[Math.floor(Math.random() * particleTypes.length)],
    });
  }

  // Big squish celebration
  squishAmount = isGrand ? 0.6 : 0.7;
  isHappy = true;
  happyTimer = isGrand ? 120 : 80;

  // Emotes burst
  spawnEmoteSet("excited", isGrand ? 3 : 2);
  spawnEmoteSet("proud", 1);

  // Clear history to prevent re-triggering
  trickHistory.length = 0;
}

function completeTrickAnimation(): void {
  if (activeTrick === null) return;

  const trickId = activeTrick;
  const trick = TRICKS.find(t => t.id === trickId)!;
  logDailyActivity("trick");

  if (trickIsPractice) {
    trickProgress[trickId] = Math.min(TRICK_PRACTICES_TO_MASTER, trickProgress[trickId] + 1);
    addFriendshipXP(3);

    if (isTrickMastered(trickId)) {
      // Just mastered this trick!
      playTrickLearnedSound();
      queueSpeechBubble(`${trick.icon} I learned ${trick.name}!!! ✨`, 200, true);
      squishAmount = 0.7;
      addDiaryEntry("milestone", trick.icon, `Learned the ${trick.name} trick!`);

      // Celebration particles
      const pcx = canvas.width / 2;
      const pcy = canvas.height / 2;
      for (let i = 0; i < 8; i++) {
        particles.push({
          x: pcx + (Math.random() - 0.5) * 40,
          y: pcy - 10,
          vx: (Math.random() - 0.5) * 2,
          vy: -(1.5 + Math.random() * 1.5),
          life: 60 + Math.random() * 30,
          maxLife: 60 + Math.random() * 30,
          size: 5 + Math.random() * 3,
          type: "heart",
        });
      }
    } else {
      const remaining = TRICK_PRACTICES_TO_MASTER - trickProgress[trickId];
      queueSpeechBubble(`${trick.icon} ${remaining} more practice${remaining > 1 ? "s" : ""}!`, 100, false);
    }
  }

  squishAmount = Math.max(squishAmount, 0.4);
  // Emote on trick completion
  spawnEmoteSet(trickIsPractice ? "curious" : "proud", 1);
  activeTrick = null;
  trickAnimProgress = 0;
  trickAnimFrame = 0;

  // Track trick for combo detection (only mastered performances count)
  if (!trickIsPractice) {
    trickHistory.push({ trickId, timestamp: frame });
    // Keep history trimmed
    while (trickHistory.length > 4) trickHistory.shift();
    // Prune old entries outside combo window
    while (trickHistory.length > 0 && frame - trickHistory[0].timestamp > TRICK_COMBO_WINDOW) {
      trickHistory.shift();
    }
    // Check for combo
    const combo = checkTrickCombo(frame);
    if (combo) {
      celebrateTrickCombo(combo);
    }
  }

  checkAchievements();
  saveGame();
}

function handleTrickShortcut(): void {
  if (activeTrick !== null || isSpinning || isDragging || isCharging || minigameActive || memoryGameActive) return;

  // If there's an unlearned trick, practice it; otherwise perform a random mastered trick
  const nextUnlearned = getNextUnlearnedTrick();
  if (nextUnlearned) {
    performTrick(nextUnlearned, true);
  } else {
    const mastered = getMasteredTricks();
    if (mastered.length > 0) {
      const randomTrick = mastered[Math.floor(Math.random() * mastered.length)];
      performTrick(randomTrick, false);
    }
  }
}

function updateTricks(): void {
  // Update active trick animation
  if (activeTrick !== null) {
    const trick = TRICKS.find(t => t.id === activeTrick)!;
    trickAnimFrame++;
    trickAnimProgress = trickAnimFrame / trick.duration;
    if (trickAnimProgress >= 1) {
      completeTrickAnimation();
    }
    return; // Don't auto-trigger while performing
  }

  // Don't auto-trigger during other activities
  if (minigameActive || memoryGameActive || isDragging || statsPanelOpen || diaryPanelOpen || moodJournalOpen || shortcutHelpOpen || isSpinning || isCharging || toyPlayState !== "idle" || idleAnim !== "none") return;

  // Autonomous trick performance — only mastered tricks
  const mastered = getMasteredTricks();
  if (mastered.length === 0) return;

  trickAutoTimer--;
  if (trickAutoTimer <= 0) {
    const randomTrick = mastered[Math.floor(Math.random() * mastered.length)];
    performTrick(randomTrick, false);
    trickAutoTimer = TRICK_AUTO_MIN + Math.floor(Math.random() * (TRICK_AUTO_MAX - TRICK_AUTO_MIN));
  }
}

// Get trick animation transform values for the draw function
function getTrickTransform(): { rotation: number; scaleX: number; scaleY: number; offsetX: number; offsetY: number } | null {
  if (activeTrick === null) return null;

  const t = trickAnimProgress;
  // Eased progress (ease-in-out)
  const eased = 0.5 - 0.5 * Math.cos(t * Math.PI);
  // Wobble factor for practice (adds jitter)
  const wobble = trickIsPractice ? Math.sin(t * Math.PI * 12) * 0.08 * (1 - t) : 0;

  switch (activeTrick) {
    case "wave": {
      // Tilt side to side like waving
      const waveCycles = 3;
      const tiltAngle = Math.sin(t * Math.PI * waveCycles * 2) * 0.25;
      const hop = Math.sin(t * Math.PI) * 3;
      return { rotation: tiltAngle + wobble, scaleX: 1, scaleY: 1, offsetX: 0, offsetY: -hop };
    }
    case "dance": {
      // Bounce up and down with left-right sway
      const bounceCycles = 4;
      const bounce = Math.abs(Math.sin(t * Math.PI * bounceCycles)) * 12;
      const sway = Math.sin(t * Math.PI * bounceCycles) * 0.15;
      const squishDanceY = 1 - Math.abs(Math.sin(t * Math.PI * bounceCycles)) * 0.1;
      const squishDanceX = 1 + Math.abs(Math.sin(t * Math.PI * bounceCycles)) * 0.08;
      return { rotation: sway + wobble, scaleX: squishDanceX, scaleY: squishDanceY, offsetX: 0, offsetY: -bounce };
    }
    case "backflip": {
      // Full rotation with a parabolic jump arc
      const jumpHeight = Math.sin(t * Math.PI) * 30;
      const rotation = eased * Math.PI * 2;
      return { rotation: rotation + wobble * 3, scaleX: 1, scaleY: 1, offsetX: 0, offsetY: -jumpHeight };
    }
    case "twirl": {
      // Graceful slow spin with slight vertical pulse
      const twistAngle = eased * Math.PI * 3; // 1.5 full rotations
      const pulse = Math.sin(t * Math.PI * 2) * 5;
      const breathe = 1 + Math.sin(t * Math.PI * 4) * 0.05;
      return { rotation: twistAngle + wobble * 2, scaleX: breathe, scaleY: breathe, offsetX: 0, offsetY: -pulse };
    }
    default:
      return null;
  }
}

// --- Day/Night Transition Animation ---
let isTimeTransitioning = false;
let transitionFrom: TimeOfDay = "morning";
let transitionTo: TimeOfDay = "afternoon";
let transitionProgress = 0;       // 0 to 1
const TRANSITION_DURATION = 240;  // ~4 seconds at 60fps
let transitionFrame = 0;
let transitionParticles: { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number; hue: number; type: "ray" | "twinkle" | "drift" }[] = [];

window.tamashii.onSystemStats((stats) => {
  cpuUsage = stats.cpu;
  memUsage = stats.mem;
});

// --- Speech Bubble ---
interface SpeechBubble {
  text: string;
  life: number;
  maxLife: number;
  slideOffset: number; // vertical slide offset for transition animation
}

let speechBubble: SpeechBubble | null = null;
let speechBubbleQueue: { text: string; life: number }[] = [];
const SPEECH_QUEUE_MAX = 5;
let speechCooldown = 300; // Start with a short cooldown so first bubble comes soon

function queueSpeechBubble(text: string, life: number, immediate = false): void {
  if (immediate || !speechBubble) {
    // Show immediately — replace current bubble
    speechBubble = { text, life, maxLife: life, slideOffset: 0 };
    // Clear queue when showing an immediate/priority bubble
    if (immediate) speechBubbleQueue = [];
  } else {
    // Queue it up if there's already a bubble showing
    if (speechBubbleQueue.length < SPEECH_QUEUE_MAX) {
      speechBubbleQueue.push({ text, life });
    }
  }
}

// --- Pet Diary / Journal ---
interface DiaryEntry {
  timestamp: number;   // Date.now() when event occurred
  type: "evolution" | "achievement" | "name" | "accessory" | "milestone" | "personality" | "general";
  icon: string;
  text: string;
}

let petDiary: DiaryEntry[] = [];
const DIARY_MAX_ENTRIES = 50;
let diaryPanelOpen = false;
let diaryPanelFade = 0;
const DIARY_PANEL_FADE_SPEED = 0.06;
let diaryScrollOffset = 0; // for scrolling through entries

function addDiaryEntry(type: DiaryEntry["type"], icon: string, text: string): void {
  petDiary.push({ timestamp: Date.now(), type, icon, text });
  if (petDiary.length > DIARY_MAX_ENTRIES) {
    petDiary = petDiary.slice(petDiary.length - DIARY_MAX_ENTRIES);
  }
  saveGame();
}

function formatDiaryDate(timestamp: number): string {
  const d = new Date(timestamp);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, "0");
  const ampm = h >= 12 ? "pm" : "am";
  const h12 = h % 12 || 12;
  return `${months[d.getMonth()]} ${d.getDate()} ${h12}:${m}${ampm}`;
}

function toggleDiaryPanel(): void {
  if (minigameActive || memoryGameActive) return;
  // Close other panels if open
  if (statsPanelOpen) statsPanelOpen = false;
  if (moodJournalOpen) moodJournalOpen = false;
  if (settingsPanelOpen) settingsPanelOpen = false;
  diaryPanelOpen = !diaryPanelOpen;
  diaryScrollOffset = 0; // reset scroll on toggle
  if (diaryPanelOpen) {
    playTone(500, 0.1, "sine", 0.08);
    setTimeout(() => playTone(700, 0.12, "sine", 0.08), 60);
  } else {
    playTone(700, 0.08, "sine", 0.06);
    setTimeout(() => playTone(500, 0.1, "sine", 0.06), 60);
  }
}

// --- Pet Mood Journal ---
interface MoodSnapshot {
  timestamp: number;
  happiness: number;
  hunger: number;
  energy: number;
}

let moodSnapshots: MoodSnapshot[] = [];
const MOOD_JOURNAL_MAX_SNAPSHOTS = 144; // 24 hours at 10-minute intervals
const MOOD_SNAPSHOT_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes
let lastMoodSnapshotTime = 0;
let moodJournalOpen = false;
let moodJournalFade = 0;
const MOOD_JOURNAL_FADE_SPEED = 0.06;
let moodJournalScrollOffset = 0; // 0 = most recent, positive = scroll back in time

function takeMoodSnapshot(): void {
  moodSnapshots.push({
    timestamp: Date.now(),
    happiness: Math.round(petHappiness),
    hunger: Math.round(petHunger),
    energy: Math.round(petEnergy),
  });
  if (moodSnapshots.length > MOOD_JOURNAL_MAX_SNAPSHOTS) {
    moodSnapshots = moodSnapshots.slice(moodSnapshots.length - MOOD_JOURNAL_MAX_SNAPSHOTS);
  }
  if (moodSnapshots.length === 1) {
    addDiaryEntry("general", "📈", "Started tracking mood in the mood journal!");
  }
  saveGame();
}

function toggleMoodJournal(): void {
  if (minigameActive || memoryGameActive) return;
  // Close other panels if open
  if (statsPanelOpen) statsPanelOpen = false;
  if (diaryPanelOpen) diaryPanelOpen = false;
  if (settingsPanelOpen) settingsPanelOpen = false;
  moodJournalOpen = !moodJournalOpen;
  moodJournalScrollOffset = 0;
  if (moodJournalOpen) {
    playTone(550, 0.1, "sine", 0.08);
    setTimeout(() => playTone(750, 0.12, "sine", 0.08), 60);
  } else {
    playTone(750, 0.08, "sine", 0.06);
    setTimeout(() => playTone(550, 0.1, "sine", 0.06), 60);
  }
}

function updateMoodJournal(): void {
  const now = Date.now();
  if (now - lastMoodSnapshotTime >= MOOD_SNAPSHOT_INTERVAL_MS) {
    lastMoodSnapshotTime = now;
    takeMoodSnapshot();
  }
}

// --- Settings Panel ---
let settingsPanelOpen = false;
let settingsPanelFade = 0;
const SETTINGS_PANEL_FADE_SPEED = 0.06;
let settingsPanelOpenCount = 0; // for achievement tracking
let settingsScrollOffset = 0; // vertical scroll for settings content

function toggleSettingsPanel(): void {
  if (minigameActive || memoryGameActive) return;
  // Close other panels if open
  if (statsPanelOpen) statsPanelOpen = false;
  if (diaryPanelOpen) diaryPanelOpen = false;
  if (moodJournalOpen) moodJournalOpen = false;
  settingsPanelOpen = !settingsPanelOpen;
  settingsScrollOffset = 0;
  if (settingsPanelOpen) {
    settingsPanelOpenCount++;
    playTone(520, 0.1, "sine", 0.08);
    setTimeout(() => playTone(780, 0.12, "sine", 0.08), 60);
  } else {
    playTone(780, 0.08, "sine", 0.06);
    setTimeout(() => playTone(520, 0.1, "sine", 0.06), 60);
  }
}

// Settings panel click areas (recalculated each draw)
interface SettingsClickArea {
  x: number; y: number; w: number; h: number;
  action: () => void;
}
let settingsClickAreas: SettingsClickArea[] = [];

function drawSettingsPanel(): void {
  // Animate fade
  if (settingsPanelOpen && settingsPanelFade < 1) {
    settingsPanelFade = Math.min(1, settingsPanelFade + SETTINGS_PANEL_FADE_SPEED);
  } else if (!settingsPanelOpen && settingsPanelFade > 0) {
    settingsPanelFade = Math.max(0, settingsPanelFade - SETTINGS_PANEL_FADE_SPEED);
  }
  if (settingsPanelFade <= 0) return;

  const w = canvas.width;
  const h = canvas.height;
  const alpha = settingsPanelFade;

  ctx.save();
  ctx.globalAlpha = alpha;

  // Panel dimensions
  const panelX = 8;
  const panelY = 8;
  const panelW = w - 16;
  const panelH = h - 16;

  // Background gradient — warm purple-blue
  const bgGrad = ctx.createLinearGradient(panelX, panelY, panelX, panelY + panelH);
  bgGrad.addColorStop(0, "rgba(45, 30, 70, 0.94)");
  bgGrad.addColorStop(1, "rgba(25, 20, 50, 0.96)");
  ctx.fillStyle = bgGrad;
  ctx.beginPath();
  ctx.roundRect(panelX, panelY, panelW, panelH, 10);
  ctx.fill();

  // Border glow
  ctx.strokeStyle = `rgba(180, 140, 255, ${0.5 * alpha})`;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Clip to panel for scrolling
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(panelX, panelY, panelW, panelH, 10);
  ctx.clip();

  // Reset click areas
  settingsClickAreas = [];

  // Title
  ctx.fillStyle = "#FFD700";
  ctx.font = "bold 11px monospace";
  ctx.textAlign = "center";
  ctx.fillText("⚙️ Settings", w / 2, panelY + 18);

  let curY = panelY + 32 - settingsScrollOffset;

  // Helper: draw a section header
  function drawSectionHeader(label: string, y: number): number {
    ctx.fillStyle = "rgba(180, 140, 255, 0.7)";
    ctx.font = "bold 9px monospace";
    ctx.textAlign = "left";
    ctx.fillText(label, panelX + 10, y);
    // Underline
    ctx.strokeStyle = "rgba(180, 140, 255, 0.25)";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(panelX + 10, y + 3);
    ctx.lineTo(panelX + panelW - 10, y + 3);
    ctx.stroke();
    return y + 14;
  }

  // Helper: draw a toggle switch
  function drawToggle(label: string, value: boolean, x: number, y: number, toggleAction: () => void): number {
    // Label
    ctx.fillStyle = "rgba(220, 220, 240, 0.9)";
    ctx.font = "9px monospace";
    ctx.textAlign = "left";
    ctx.fillText(label, x, y);

    // Toggle track
    const trackX = panelX + panelW - 42;
    const trackY = y - 7;
    const trackW = 28;
    const trackH = 12;
    const knobR = 5;

    ctx.fillStyle = value ? "rgba(100, 220, 120, 0.7)" : "rgba(100, 100, 120, 0.5)";
    ctx.beginPath();
    ctx.roundRect(trackX, trackY, trackW, trackH, 6);
    ctx.fill();

    // Knob
    const knobX = value ? trackX + trackW - knobR - 2 : trackX + knobR + 2;
    ctx.fillStyle = value ? "#FFFFFF" : "rgba(200, 200, 210, 0.8)";
    ctx.beginPath();
    ctx.arc(knobX, trackY + trackH / 2, knobR, 0, Math.PI * 2);
    ctx.fill();

    // Register click area
    settingsClickAreas.push({
      x: trackX - 4, y: trackY - 2, w: trackW + 8, h: trackH + 4,
      action: toggleAction,
    });

    return y + 18;
  }

  // --- Pet Name ---
  curY = drawSectionHeader("🏷️ PET NAME", curY);
  const nameDisplay = petName || "(tap to name)";
  ctx.fillStyle = petName ? "rgba(255, 240, 200, 0.9)" : "rgba(160, 160, 180, 0.6)";
  ctx.font = petName ? "bold 10px monospace" : "italic 9px monospace";
  ctx.textAlign = "left";
  ctx.fillText(nameDisplay, panelX + 14, curY);
  // Edit icon
  ctx.fillStyle = "rgba(180, 140, 255, 0.6)";
  ctx.font = "9px monospace";
  const nameTextW = ctx.measureText(nameDisplay).width;
  ctx.fillText(" ✏️", panelX + 14 + nameTextW, curY);
  settingsClickAreas.push({
    x: panelX + 10, y: curY - 10, w: panelW - 20, h: 14,
    action: async () => {
      const newName = await window.tamashii.promptPetName(petName);
      if (newName !== null) {
        const oldName = petName;
        petName = newName;
        saveGame();
        if (newName && newName !== oldName) {
          queueSpeechBubble(`Call me ${newName}! ♥`, 180, true);
          addDiaryEntry("general", "🏷️", `Got a new name: ${newName}!`);
          squishAmount = 0.4;
          isHappy = true;
          happyTimer = 45;
        }
      }
    },
  });
  curY += 16;

  // --- Toggles ---
  curY = drawSectionHeader("🔧 TOGGLES", curY);
  curY = drawToggle("🔊 Sound Effects", soundEnabled, panelX + 14, curY, () => {
    soundEnabled = !soundEnabled;
    if (soundEnabled) playClickSound();
    saveGame();
  });
  curY = drawToggle("🔔 Notifications", notificationsEnabled, panelX + 14, curY, () => {
    notificationsEnabled = !notificationsEnabled;
    const msg = notificationsEnabled ? "🔔 Notifications on!" : "🔕 Notifications off";
    queueSpeechBubble(msg, 120, true);
    saveGame();
  });
  curY = drawToggle("🚶 Wandering", wanderingEnabled, panelX + 14, curY, () => {
    wanderingEnabled = !wanderingEnabled;
    if (!wanderingEnabled) {
      wanderState = "pausing";
      wanderTimer = 60;
    }
  });
  curY += 4;

  // --- Color Palette ---
  curY = drawSectionHeader("🎨 COLOR", curY);
  const colorGridX = panelX + 12;
  const colorCellSize = 18;
  const colorCellGap = 4;
  const colorsPerRow = Math.floor((panelW - 24) / (colorCellSize + colorCellGap));

  for (let i = 0; i < COLOR_PALETTES.length; i++) {
    const palette = COLOR_PALETTES[i];
    const col = i % colorsPerRow;
    const row = Math.floor(i / colorsPerRow);
    const cellX = colorGridX + col * (colorCellSize + colorCellGap);
    const cellY = curY + row * (colorCellSize + colorCellGap);

    // Cell background — use the palette's afternoon body color as preview
    const previewColor = palette.colors["afternoon"]?.body || "#888";
    const isSelected = currentColorPalette === palette.id;

    // Selected highlight
    if (isSelected) {
      ctx.fillStyle = "rgba(255, 215, 0, 0.4)";
      ctx.beginPath();
      ctx.roundRect(cellX - 2, cellY - 2, colorCellSize + 4, colorCellSize + 4, 5);
      ctx.fill();
    }

    ctx.fillStyle = previewColor;
    ctx.beginPath();
    ctx.roundRect(cellX, cellY, colorCellSize, colorCellSize, 4);
    ctx.fill();

    // Border
    ctx.strokeStyle = isSelected ? "rgba(255, 215, 0, 0.8)" : "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = isSelected ? 1.5 : 0.5;
    ctx.stroke();

    // Icon inside
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "8px monospace";
    ctx.textAlign = "center";
    ctx.fillText(palette.icon, cellX + colorCellSize / 2, cellY + colorCellSize / 2 + 3);

    settingsClickAreas.push({
      x: cellX, y: cellY, w: colorCellSize, h: colorCellSize,
      action: () => {
        if (currentColorPalette === palette.id) return;
        const oldPalette = currentColorPalette;
        currentColorPalette = palette.id;
        saveGame();
        queueSpeechBubble(`${palette.icon} ${palette.name}!`, 120, true);
        playClickSound();
        squishAmount = 0.3;
        if (palette.id !== "default" && oldPalette !== palette.id) {
          addDiaryEntry("accessory", "🎨", `Changed color to ${palette.name}!`);
        }
        checkAchievements();
      },
    });
  }
  const colorRows = Math.ceil(COLOR_PALETTES.length / colorsPerRow);
  curY += colorRows * (colorCellSize + colorCellGap) + 8;

  // --- Accessories ---
  curY = drawSectionHeader("👒 ACCESSORY", curY);
  const accessoryList: { id: AccessoryType; icon: string; name: string }[] = [
    { id: "none", icon: "❌", name: "None" },
    { id: "crown", icon: "👑", name: "Crown" },
    { id: "bow", icon: "🎀", name: "Bow" },
    { id: "glasses", icon: "👓", name: "Glasses" },
    { id: "flower", icon: "🌸", name: "Flower" },
    { id: "party_hat", icon: "🎉", name: "Party Hat" },
    { id: "cat_ears", icon: "😺", name: "Cat Ears" },
    { id: "top_hat", icon: "🎩", name: "Top Hat" },
    { id: "headband_star", icon: "⭐", name: "Star" },
  ];
  const accGridX = panelX + 12;
  const accCellSize = 18;
  const accCellGap = 4;
  const accPerRow = Math.floor((panelW - 24) / (accCellSize + accCellGap));

  for (let i = 0; i < accessoryList.length; i++) {
    const acc = accessoryList[i];
    const col = i % accPerRow;
    const row = Math.floor(i / accPerRow);
    const cellX = accGridX + col * (accCellSize + accCellGap);
    const cellY = curY + row * (accCellSize + accCellGap);

    const isSelected = currentAccessory === acc.id;

    if (isSelected) {
      ctx.fillStyle = "rgba(255, 215, 0, 0.4)";
      ctx.beginPath();
      ctx.roundRect(cellX - 2, cellY - 2, accCellSize + 4, accCellSize + 4, 5);
      ctx.fill();
    }

    ctx.fillStyle = isSelected ? "rgba(80, 60, 120, 0.8)" : "rgba(60, 50, 90, 0.6)";
    ctx.beginPath();
    ctx.roundRect(cellX, cellY, accCellSize, accCellSize, 4);
    ctx.fill();

    ctx.strokeStyle = isSelected ? "rgba(255, 215, 0, 0.8)" : "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = isSelected ? 1.5 : 0.5;
    ctx.stroke();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "9px monospace";
    ctx.textAlign = "center";
    ctx.fillText(acc.icon, cellX + accCellSize / 2, cellY + accCellSize / 2 + 3);

    settingsClickAreas.push({
      x: cellX, y: cellY, w: accCellSize, h: accCellSize,
      action: () => {
        const oldAccessory = currentAccessory;
        currentAccessory = acc.id;
        saveGame();
        if (acc.id !== "none") {
          const msgs = ["How do I look?", "So stylish~!", "I love it! ♥", "Fashion icon!", "Looking good!"];
          queueSpeechBubble(msgs[Math.floor(Math.random() * msgs.length)], 180);
          playGreetingSound();
          squishAmount = 0.5;
          isHappy = true;
          happyTimer = 45;
          addDiaryEntry("accessory", "👒", `Put on the ${acc.name}!`);
        } else if (oldAccessory !== "none") {
          addDiaryEntry("accessory", "👒", "Took off accessory — going natural!");
        }
      },
    });
  }
  const accRows = Math.ceil(accessoryList.length / accPerRow);
  curY += accRows * (accCellSize + accCellGap) + 8;

  // --- Toys ---
  curY = drawSectionHeader("🧸 TOY", curY);
  const toyGridX = panelX + 12;
  const toyCellW = 30;
  const toyCellH = 18;
  const toyCellGap = 4;

  for (let i = 0; i < TOYS.length; i++) {
    const toy = TOYS[i];
    const cellX = toyGridX + i * (toyCellW + toyCellGap);
    const cellY = curY;

    const isSelected = currentToy === toy.id;

    if (isSelected) {
      ctx.fillStyle = "rgba(255, 215, 0, 0.35)";
      ctx.beginPath();
      ctx.roundRect(cellX - 2, cellY - 2, toyCellW + 4, toyCellH + 4, 5);
      ctx.fill();
    }

    ctx.fillStyle = isSelected ? "rgba(80, 60, 120, 0.8)" : "rgba(60, 50, 90, 0.6)";
    ctx.beginPath();
    ctx.roundRect(cellX, cellY, toyCellW, toyCellH, 4);
    ctx.fill();

    ctx.strokeStyle = isSelected ? "rgba(255, 215, 0, 0.8)" : "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = isSelected ? 1.5 : 0.5;
    ctx.stroke();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "9px monospace";
    ctx.textAlign = "center";
    ctx.fillText(toy.icon, cellX + toyCellW / 2, cellY + toyCellH / 2 + 3);

    settingsClickAreas.push({
      x: cellX, y: cellY, w: toyCellW, h: toyCellH,
      action: () => {
        setToy(toy.id);
        checkAchievements();
      },
    });
  }
  curY += toyCellH + 14;

  // Restore clip
  ctx.restore();

  // Footer
  ctx.fillStyle = "rgba(160, 150, 200, 0.4)";
  ctx.font = "7px monospace";
  ctx.textAlign = "center";
  ctx.fillText("G to close — right-click to close", w / 2, panelY + panelH - 6);

  ctx.restore();
}

// --- Pet Photo Mode ---
let totalPhotos = 0;
let photoFlashAlpha = 0; // 0-1 white flash overlay when taking a photo
let photoFlashDecay = 0.06;

function playShutterSound(): void {
  // Camera shutter: sharp click followed by a mechanical slide
  playTone(2000, 0.03, "square", 0.1);
  setTimeout(() => playTone(800, 0.06, "square", 0.06), 30);
  setTimeout(() => playTone(400, 0.1, "sine", 0.04), 60);
}

function takePhoto(): void {
  if (minigameActive || memoryGameActive) return;
  if (statsPanelOpen || diaryPanelOpen || moodJournalOpen || settingsPanelOpen || shortcutHelpOpen) return;
  logDailyActivity("photo");

  // Flash effect
  photoFlashAlpha = 1.0;
  playShutterSound();

  // Brief delay so the flash looks natural, then capture
  setTimeout(() => {
    captureAndSavePhoto();
  }, 100);
}

function captureAndSavePhoto(): void {
  // Create offscreen canvas with polaroid-style frame
  const photoW = 280;
  const photoH = 340;
  const border = 20;
  const bottomBorder = 60;

  const offscreen = document.createElement("canvas");
  offscreen.width = photoW;
  offscreen.height = photoH;
  const oc = offscreen.getContext("2d")!;

  // Polaroid white frame with subtle shadow
  oc.fillStyle = "#FAFAFA";
  oc.shadowColor = "rgba(0, 0, 0, 0.2)";
  oc.shadowBlur = 12;
  oc.shadowOffsetY = 4;
  oc.beginPath();
  oc.roundRect(0, 0, photoW, photoH, 6);
  oc.fill();
  oc.shadowColor = "transparent";

  // Inner photo area — copy from the main canvas
  const innerW = photoW - border * 2;
  const innerH = photoH - border - bottomBorder;
  oc.drawImage(canvas, 0, 0, canvas.width, canvas.height, border, border, innerW, innerH);

  // Subtle inner border
  oc.strokeStyle = "rgba(0, 0, 0, 0.08)";
  oc.lineWidth = 1;
  oc.strokeRect(border, border, innerW, innerH);

  // Pet name and date at the bottom
  const now = new Date();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dateStr = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
  oc.fillStyle = "#666";
  oc.font = "italic 13px Georgia, serif";
  oc.textAlign = "center";
  const label = petName ? `${petName} — ${dateStr}` : `Tamashii — ${dateStr}`;
  oc.fillText(label, photoW / 2, photoH - bottomBorder / 2 + 6);

  // Small heart decoration
  oc.fillStyle = "#E88";
  oc.font = "11px sans-serif";
  oc.fillText("♥", photoW / 2 - oc.measureText(label).width / 2 - 12, photoH - bottomBorder / 2 + 6);

  // Export and save
  const dataUrl = offscreen.toDataURL("image/png");
  window.tamashii.savePhoto(dataUrl).then((filePath) => {
    if (filePath) {
      totalPhotos++;
      queueSpeechBubble("📸 Say cheese~!", 150, true);
      addDiaryEntry("milestone", "📸", `Photo saved! (Photo #${totalPhotos})`);

      // Sparkle burst for celebration
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + Math.random() * 0.3;
        particles.push({
          x: cx + Math.cos(angle) * 10,
          y: cy + Math.sin(angle) * 10,
          vx: Math.cos(angle) * 1.5,
          vy: Math.sin(angle) * 1.2,
          life: 40 + Math.random() * 20,
          maxLife: 40 + Math.random() * 20,
          size: 3 + Math.random() * 2,
          type: "sparkle",
        });
      }

      checkAchievements();
      saveGame();
    } else {
      queueSpeechBubble("Maybe next time~", 120, true);
    }
  });
}

// --- Gravity & Falling ---
let isFalling = false;
let velocityY = 0;
const GRAVITY = 0.6;       // pixels/frame² acceleration
const BOUNCE_DAMPING = 0.45; // energy retained per bounce
const GROUND_MARGIN = 50;   // pixels above bottom of work area for "ground"
let groundY = 0;            // calculated ground position (screen coords)
let landingSquish = 0;      // extra squish from landing impact

// --- Wandering ---
let wanderingEnabled = true;
type WanderState = "idle" | "walking" | "pausing";
let wanderState: WanderState = "pausing";
let wanderDirection = Math.random() < 0.5 ? -1 : 1; // -1 = left, 1 = right
let wanderTimer = 180; // frames until next state change
let wanderLean = 0; // visual tilt in walk direction (-1 to 1)
let screenBoundsCache = { screenWidth: 1920, screenHeight: 1080, windowX: 0, windowY: 0 };
let boundsFetchTimer = 0;

function getTimeMessages(): string[] {
  switch (currentTimeOfDay) {
    case "morning":
      return [
        "Good morning!",
        "Let's go!",
        "Rise and shine~",
        "What a nice day!",
        "I'm so energetic!",
        "Yay, morning!",
      ];
    case "afternoon":
      return [
        "Nice afternoon~",
        "How's it going?",
        "Keep it up!",
        "La la la~",
        "Doing great!",
        "Hey there!",
      ];
    case "evening":
      return [
        "Getting sleepy...",
        "What a long day~",
        "Winding down...",
        "*yaaawn*",
        "Almost bedtime...",
        "So cozy...",
      ];
    case "night":
      return [
        "zzz...",
        "So sleepy...",
        "Good night...",
        "*snore*",
        "Mmm... dreams...",
        "5 more minutes...",
      ];
  }
}

function getGrowthMessages(): string[] {
  switch (currentGrowthStage) {
    case "baby":
      return ["Everything is new!", "I'm just a baby~", "Pick me up?", "Waaah~!"];
    case "child":
      return ["I'm growing!", "Look how big I am!", "Let's play!", "I learned something!"];
    case "teen":
      return ["I'm almost grown up!", "Watch me go~", "So much energy!", "I feel stronger!"];
    case "adult":
      return ["Life is beautiful~", "I feel so wise...", "Thank you for everything ♥", "We've come so far~"];
  }
}

const stressMessages = [
  "So much work...",
  "CPU is on fire!",
  "I'm overheating!",
  "*panting*",
  "Need a break...",
  "Everything's busy!",
];

const shortcutGreetings = [
  "I'm back!",
  "You called?",
  "Miss me? ♥",
  "Here I am!",
  "Ta-da~!",
  "Reporting in!",
];

// When pet is shown via keyboard shortcut, greet with a speech bubble + happy reaction
window.tamashii.onShortcutToggled((shown) => {
  if (shown) {
    const msg = shortcutGreetings[Math.floor(Math.random() * shortcutGreetings.length)];
    queueSpeechBubble(msg, 150);
    playGreetingSound();
    // Happy reaction
    squishAmount = 0.7;
    isHappy = true;
    happyTimer = 45;
    // Spawn a few hearts
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    for (let i = 0; i < 3; i++) {
      particles.push({
        x: cx + (Math.random() - 0.5) * 30,
        y: cy - 10,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -(1.2 + Math.random() * 1),
        life: 50 + Math.random() * 20,
        maxLife: 50 + Math.random() * 20,
        size: 5 + Math.random() * 3,
        type: "heart",
      });
    }
  }
});

function spawnSpeechBubble(): void {
  // Stress messages override normal ones ~50% of the time when stressed
  const useStress = isStressed && Math.random() < 0.5;
  const messages = useStress ? stressMessages : getTimeMessages();
  let text = messages[Math.floor(Math.random() * messages.length)];

  // ~15% chance to use a growth-stage message
  if (!useStress && Math.random() < 0.15) {
    const growthMsgs = getGrowthMessages();
    text = growthMsgs[Math.floor(Math.random() * growthMsgs.length)];
  }

  // ~15% chance to use a seasonal message
  if (!useStress && Math.random() < 0.15) {
    const seasonalMsgs: Record<Season, string[]> = {
      spring: ["Cherry blossoms~! 🌸", "Spring is here!", "The flowers are blooming!", "What a lovely breeze~", "Petal shower~!"],
      summer: ["It's so warm! ☀️", "Summer vibes~", "Firefly season!", "What a hot day!", "Ice cream weather~!"],
      autumn: ["The leaves are falling 🍂", "So cozy and warm~", "Autumn colors!", "Sweater weather!", "Pumpkin season~!"],
      winter: ["Snowflakes! ❄️", "It's so cold~!", "Winter wonderland!", "Brrr... cuddle me?", "Hot cocoa time~!"],
    };
    text = seasonalMsgs[currentSeason][Math.floor(Math.random() * seasonalMsgs[currentSeason].length)];
  }

  // ~20% chance to use a personality-flavored message
  if (!useStress && petPersonality && Math.random() < 0.2) {
    const pMsgs = PERSONALITY_MESSAGES[petPersonality];
    text = pMsgs[Math.floor(Math.random() * pMsgs.length)];
  }

  // ~25% chance to use a name-aware message if the pet has a name
  if (petName && !useStress && Math.random() < 0.25) {
    const nameMessages = [
      `I'm ${petName}!`,
      `${petName} is happy~`,
      `${petName} loves you!`,
      `Call me ${petName}! ♥`,
      `${petName} reporting in!`,
      `Being ${petName} is great!`,
    ];
    text = nameMessages[Math.floor(Math.random() * nameMessages.length)];
  }

  queueSpeechBubble(text, 180);
}

// --- Drag ---
let isDragging = false;
let dragMoved = false;
let lastX = 0;
let lastY = 0;

canvas.addEventListener("mousedown", (e) => {
  // Settings panel click handling — intercept clicks on interactive elements
  if (settingsPanelOpen && settingsPanelFade > 0.5) {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    for (const area of settingsClickAreas) {
      if (clickX >= area.x && clickX <= area.x + area.w && clickY >= area.y && clickY <= area.y + area.h) {
        area.action();
        return; // consumed by settings panel
      }
    }
    return; // block dragging while settings is open
  }
  // Check for shooting star clicks
  if (shootingStars.length > 0) {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    if (tryClickShootingStar(clickX, clickY)) {
      return; // Clicked a shooting star, don't start drag
    }
  }
  // Check for constellation star clicks first
  if (constellationModeActive) {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    if (tryClickConstellationStar(clickX, clickY)) {
      return; // Clicked a constellation star, don't start drag
    }
  }
  // Check for firefly catches before bubbles
  if (fireflies.length > 0) {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    if (tryClickFirefly(clickX, clickY)) {
      return; // Caught a firefly, don't start drag
    }
  }
  // Check for message bottle clicks
  if (activeBottle && !activeBottle.opened) {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    if (tryClickBottle(clickX, clickY)) {
      return; // Opened a bottle, don't start drag
    }
  }
  // Check for dew drop clicks
  if (dewDrops.length > 0) {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    if (tryClickDewDrop(clickX, clickY)) {
      return; // Collected a dew drop, don't start drag
    }
  }
  // Check for bubble pops before anything else
  if (bubbles.length > 0) {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    if (tryPopBubble(clickX, clickY)) {
      return; // Popped a bubble, don't start drag
    }
  }
  // During mini-game, check for star clicks before drag
  if (minigameActive) {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    if (tryClickMinigameStar(clickX, clickY)) {
      return; // Caught a star, don't start drag
    }
  }
  // During memory game, check for orb clicks before drag
  if (memoryGameActive) {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    if (tryClickMemoryOrb(clickX, clickY)) {
      return; // Clicked an orb, don't start drag
    }
  }
  isDragging = true;
  dragMoved = false;
  lastInteractionTime = Date.now();
  idleAnim = "none"; // cancel any active idle animation
  isFalling = false; // Cancel any active fall when grabbed
  velocityY = 0;
  lastX = e.screenX;
  lastY = e.screenY;
  // Start charge-up timer (only triggers if held without moving)
  chargeStartTime = Date.now();
  isCharging = false;
  chargeLevel = 0;
});

window.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  const dx = e.screenX - lastX;
  const dy = e.screenY - lastY;
  if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
    dragMoved = true;
    // Cancel charge-up if dragging
    if (isCharging) {
      isCharging = false;
      chargeLevel = 0;
      stopChargeSound();
    }
  }
  lastX = e.screenX;
  lastY = e.screenY;
  window.tamashii.moveWindow(dx, dy);
});

window.addEventListener("mouseup", () => {
  if (isDragging && !dragMoved) {
    if (isCharging && chargeLevel > 0.05) {
      // Release the charge!
      releaseCharge();
    } else {
      onPetClicked();
    }
  }
  if (isDragging && dragMoved) {
    // Start falling — check if pet is above ground
    startFalling();
  }
  // Cancel any active charge
  if (isCharging) {
    isCharging = false;
    stopChargeSound();
  }
  isDragging = false;
});

function releaseCharge(): void {
  chargeReleaseLevel = chargeLevel;
  chargeReleased = true;
  isCharging = false;
  stopChargeSound();
  playChargeReleaseSound(chargeReleaseLevel);

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  // Determine charge tier
  let msg: string;
  let confettiCount: number;
  let sparkleCount: number;
  let heartCount: number;

  if (chargeReleaseLevel > 0.8) {
    // Full charge — massive celebration
    msg = "SUPER BLAST!!! ✨";
    confettiCount = 30;
    sparkleCount = 16;
    heartCount = 8;
    petHappiness = Math.min(100, petHappiness + 15);
  } else if (chargeReleaseLevel > 0.5) {
    // Medium charge — good burst
    msg = "Ka-BOOM~! 💥";
    confettiCount = 18;
    sparkleCount = 10;
    heartCount = 5;
    petHappiness = Math.min(100, petHappiness + 8);
  } else if (chargeReleaseLevel > 0.2) {
    // Small charge — modest pop
    msg = "Pop~!";
    confettiCount = 8;
    sparkleCount = 5;
    heartCount = 3;
    petHappiness = Math.min(100, petHappiness + 3);
  } else {
    // Tiny charge — little puff
    msg = "Pff~";
    confettiCount = 3;
    sparkleCount = 2;
    heartCount = 1;
    petHappiness = Math.min(100, petHappiness + 1);
  }

  queueSpeechBubble(msg, 150);
  squishAmount = 0.5 + chargeReleaseLevel * 0.5;
  isHappy = true;
  happyTimer = 60 + Math.floor(chargeReleaseLevel * 60);

  // Spawn confetti — colorful rectangles in all directions
  const confettiColors = ["#FF4488", "#44BBFF", "#FFDD44", "#44FF88", "#FF8844", "#AA66FF", "#FF6666", "#66DDAA"];
  for (let i = 0; i < confettiCount; i++) {
    const angle = (i / confettiCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
    const speed = 2 + Math.random() * 3 * chargeReleaseLevel;
    particles.push({
      x: cx + (Math.random() - 0.5) * 20,
      y: cy + (Math.random() - 0.5) * 15,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1.5,
      life: 60 + Math.random() * 40,
      maxLife: 60 + Math.random() * 40,
      size: 3 + Math.random() * 3,
      type: "confetti",
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    });
  }

  // Spawn sparkles in a ring
  for (let i = 0; i < sparkleCount; i++) {
    const angle = (i / sparkleCount) * Math.PI * 2;
    const speed = 1.5 + Math.random() * 2;
    particles.push({
      x: cx + Math.cos(angle) * 20,
      y: cy + Math.sin(angle) * 15,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 0.5,
      life: 50 + Math.random() * 30,
      maxLife: 50 + Math.random() * 30,
      size: 3 + Math.random() * 4,
      type: "sparkle",
    });
  }

  // Hearts floating up
  for (let i = 0; i < heartCount; i++) {
    particles.push({
      x: cx + (Math.random() - 0.5) * 50,
      y: cy - 10,
      vx: (Math.random() - 0.5) * 2,
      vy: -(2 + Math.random() * 2),
      life: 70 + Math.random() * 30,
      maxLife: 70 + Math.random() * 30,
      size: 7 + Math.random() * 5,
      type: "heart",
    });
  }

  chargeLevel = 0;
  chargeVibrate = 0;
}

function startFalling(): void {
  window.tamashii.getScreenBounds().then((bounds) => {
    screenBoundsCache = bounds;
    groundY = bounds.screenHeight - 200 - GROUND_MARGIN; // 200 = window size
    if (bounds.windowY < groundY) {
      isFalling = true;
      velocityY = 0; // start from rest (gravity will accelerate)
    }
  });
}

// --- Right-click Context Menu ---
canvas.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  // Close open panels on right-click instead of opening context menu
  if (diaryPanelOpen) {
    toggleDiaryPanel();
    return;
  }
  if (moodJournalOpen) {
    toggleMoodJournal();
    return;
  }
  if (settingsPanelOpen) {
    toggleSettingsPanel();
    return;
  }
  window.tamashii.showContextMenu({
    timeOfDay: currentTimeOfDay,
    wanderingEnabled,
    soundEnabled,
    notificationsEnabled,
    petName,
    accessory: currentAccessory,
    colorPalette: currentColorPalette,
    currentToy,
    trickProgress: { ...trickProgress },
  });
});

// Listen for toggle-wandering from main process
window.tamashii.onToggleWandering(() => {
  wanderingEnabled = !wanderingEnabled;
  if (!wanderingEnabled) {
    wanderState = "pausing";
    wanderTimer = 60;
  }
});

// Listen for toggle-sound from main process
window.tamashii.onToggleSound(() => {
  soundEnabled = !soundEnabled;
  if (soundEnabled) {
    playClickSound(); // Confirm sound is on
  }
});

// Listen for toggle-notifications from main process
window.tamashii.onToggleNotifications(() => {
  notificationsEnabled = !notificationsEnabled;
  const msg = notificationsEnabled ? "🔔 Notifications on!" : "🔕 Notifications off";
  queueSpeechBubble(msg, 120, true);
  saveGame();
});

// Listen for set-toy from main process
window.tamashii.onSetToy((toyId: string) => {
  const validToys: ToyType[] = ["none", "ball", "yarn", "plush", "bone"];
  if (validToys.includes(toyId as ToyType)) {
    setToy(toyId as ToyType);
    checkAchievements();
  }
});

// Listen for trick commands from main process context menu
window.tamashii.onPerformTrick((trickId: string) => {
  const validTricks: TrickId[] = ["wave", "dance", "backflip", "twirl"];
  if (validTricks.includes(trickId as TrickId)) {
    const tid = trickId as TrickId;
    const mastered = isTrickMastered(tid);
    performTrick(tid, !mastered);
  }
});

// --- Pet Name ---
let petName = "";

// --- Color Palettes ---
type ColorPaletteId = "default" | "rose" | "mint" | "sunset" | "lavender" | "golden" | "midnight" | "peach";
let currentColorPalette: ColorPaletteId = "default";

interface ColorPalette {
  id: ColorPaletteId;
  name: string;
  icon: string;
  // Base colors for each time of day: { morning, afternoon, evening, night }
  colors: Record<string, { body: string; stroke: string; belly: string; foot: string }>;
}

const COLOR_PALETTES: ColorPalette[] = [
  {
    id: "default", name: "Classic Blue", icon: "💙",
    colors: {
      morning:   { body: "#6B9DEF", stroke: "#4A7DD8", belly: "#99C4FF", foot: "#5A8AE0" },
      afternoon: { body: "#5B8DEE", stroke: "#3A6DD1", belly: "#89B4FA", foot: "#4A7ADB" },
      evening:   { body: "#5577CC", stroke: "#3A5AAA", belly: "#7799DD", foot: "#4466BB" },
      night:     { body: "#4A66AA", stroke: "#334D88", belly: "#6688CC", foot: "#3B5599" },
    },
  },
  {
    id: "rose", name: "Rose Pink", icon: "🌹",
    colors: {
      morning:   { body: "#EF8BA5", stroke: "#D06A88", belly: "#FFB8CC", foot: "#DD7A98" },
      afternoon: { body: "#EE7B9D", stroke: "#D15A80", belly: "#FFAAC2", foot: "#DB6A90" },
      evening:   { body: "#CC6688", stroke: "#AA4466", belly: "#DD8899", foot: "#BB5577" },
      night:     { body: "#AA5577", stroke: "#883355", belly: "#CC7799", foot: "#994466" },
    },
  },
  {
    id: "mint", name: "Mint Green", icon: "🌿",
    colors: {
      morning:   { body: "#7BCCA5", stroke: "#5AAA88", belly: "#A5EECA", foot: "#6ABB98" },
      afternoon: { body: "#6BBB9D", stroke: "#4A9980", belly: "#95DDBA", foot: "#5AAA90" },
      evening:   { body: "#559977", stroke: "#3A7755", belly: "#77BB99", foot: "#448866" },
      night:     { body: "#447766", stroke: "#335544", belly: "#669988", foot: "#336655" },
    },
  },
  {
    id: "sunset", name: "Sunset Orange", icon: "🌅",
    colors: {
      morning:   { body: "#EFA06B", stroke: "#D8844A", belly: "#FFC499", foot: "#E0935A" },
      afternoon: { body: "#EE905B", stroke: "#D1703A", belly: "#FAB489", foot: "#DB804A" },
      evening:   { body: "#CC7755", stroke: "#AA553A", belly: "#DD9977", foot: "#BB6644" },
      night:     { body: "#AA664A", stroke: "#884433", belly: "#CC8866", foot: "#995533" },
    },
  },
  {
    id: "lavender", name: "Lavender", icon: "💜",
    colors: {
      morning:   { body: "#A58BEF", stroke: "#886AD0", belly: "#C8B8FF", foot: "#987ADD" },
      afternoon: { body: "#9D7BEE", stroke: "#805AD1", belly: "#BAAAFE", foot: "#906ADB" },
      evening:   { body: "#8866CC", stroke: "#6644AA", belly: "#9988DD", foot: "#7755BB" },
      night:     { body: "#7755AA", stroke: "#553388", belly: "#8877CC", foot: "#664499" },
    },
  },
  {
    id: "golden", name: "Golden", icon: "✨",
    colors: {
      morning:   { body: "#E8C44A", stroke: "#CCA830", belly: "#F5DD7A", foot: "#DDBB3A" },
      afternoon: { body: "#DDC040", stroke: "#BBA020", belly: "#EEDD66", foot: "#CCB030" },
      evening:   { body: "#BBA033", stroke: "#998020", belly: "#CCBB55", foot: "#AA9022" },
      night:     { body: "#AA8828", stroke: "#886615", belly: "#BB9944", foot: "#997718" },
    },
  },
  {
    id: "midnight", name: "Midnight", icon: "🌑",
    colors: {
      morning:   { body: "#6A7A9E", stroke: "#4A5A7E", belly: "#8A9ABE", foot: "#5A6A8E" },
      afternoon: { body: "#5A6A8E", stroke: "#3A4A6E", belly: "#7A8AAE", foot: "#4A5A7E" },
      evening:   { body: "#445577", stroke: "#2A3A55", belly: "#667799", foot: "#334466" },
      night:     { body: "#334466", stroke: "#1A2A44", belly: "#556688", foot: "#223355" },
    },
  },
  {
    id: "peach", name: "Peach", icon: "🍑",
    colors: {
      morning:   { body: "#F0A88A", stroke: "#D88A6A", belly: "#FFCCB8", foot: "#E89A7A" },
      afternoon: { body: "#EE9880", stroke: "#D17A60", belly: "#FFBBAA", foot: "#DD8A70" },
      evening:   { body: "#CC8066", stroke: "#AA6044", belly: "#DDA088", foot: "#BB7055" },
      night:     { body: "#AA6655", stroke: "#884433", belly: "#CC8877", foot: "#995544" },
    },
  },
];

function getColorPalette(): ColorPalette {
  return COLOR_PALETTES.find(p => p.id === currentColorPalette) || COLOR_PALETTES[0];
}

// --- Accessories ---
type AccessoryType = "none" | "crown" | "bow" | "glasses" | "flower" | "party_hat" | "cat_ears" | "top_hat" | "headband_star";
let currentAccessory: AccessoryType = "none";

window.tamashii.onSetAccessory((accessory: string) => {
  const oldAccessory = currentAccessory;
  currentAccessory = accessory as AccessoryType;
  saveGame();
  // Happy reaction when putting on an accessory
  if (currentAccessory !== "none") {
    const accessoryMessages = [
      "How do I look?",
      "So stylish~!",
      "I love it! ♥",
      "Fashion icon!",
      "Looking good!",
    ];
    queueSpeechBubble(accessoryMessages[Math.floor(Math.random() * accessoryMessages.length)], 180);
    playGreetingSound();
    squishAmount = 0.5;
    isHappy = true;
    happyTimer = 45;
    // Diary entry for accessory
    const accessoryNames: Record<string, string> = {
      crown: "Crown", bow: "Bow", glasses: "Glasses", flower: "Flower",
      party_hat: "Party Hat", cat_ears: "Cat Ears", top_hat: "Top Hat", headband_star: "Star Headband",
    };
    addDiaryEntry("accessory", "👒", `Put on the ${accessoryNames[currentAccessory] || currentAccessory}!`);
  } else if (oldAccessory !== "none") {
    addDiaryEntry("accessory", "👒", "Took off accessory — going natural!");
  }
});

window.tamashii.onSetColor((colorId: string) => {
  const oldPalette = currentColorPalette;
  const palette = COLOR_PALETTES.find(p => p.id === colorId);
  if (!palette || colorId === oldPalette) return;
  currentColorPalette = colorId as ColorPaletteId;
  saveGame();
  const messages = [
    "New look, who dis?",
    "I love this color~!",
    "So pretty!",
    "Fashion forward!",
    "Looking fresh!",
  ];
  queueSpeechBubble(`${palette.icon} ${messages[Math.floor(Math.random() * messages.length)]}`, 180, true);
  playGreetingSound();
  squishAmount = 0.5;
  isHappy = true;
  happyTimer = 45;
  addDiaryEntry("accessory", "🎨", `Changed color to ${palette.name}!`);
});

window.tamashii.onPromptName(async () => {
  const result = await window.tamashii.promptPetName(petName);
  if (result !== null) {
    const oldName = petName;
    petName = result;
    saveGame();
    if (petName) {
      queueSpeechBubble(oldName ? `Call me ${petName} now!` : `I'm ${petName}! Nice to meet you!`, 200, true);
      playGreetingSound();
      squishAmount = 0.7;
      isHappy = true;
      happyTimer = 60;
      // Diary entry for name
      if (oldName) {
        addDiaryEntry("name", "✏️", `Renamed from "${oldName}" to "${petName}"`);
      } else {
        addDiaryEntry("name", "🏷️", `Given the name "${petName}" for the first time!`);
      }
    }
  }
});

// --- Pet Growth / Evolution ---
type GrowthStage = "baby" | "child" | "teen" | "adult";
let totalCarePoints = 0;
let currentGrowthStage: GrowthStage = "baby";
let previousGrowthStage: GrowthStage = "baby";
let evolutionCelebrating = false;
let evolutionCelebrationTimer = 0;
const EVOLUTION_CELEBRATION_DURATION = 180; // ~3 seconds
let evolutionGlowPhase = 0;

// --- Evolution Morph Transition ---
let evolutionMorphing = false;
let evolutionMorphProgress = 0;    // 0 = old stage, 1 = new stage
let evolutionMorphFrom: GrowthStage = "baby";
let evolutionMorphTo: GrowthStage = "baby";
const EVOLUTION_MORPH_DURATION = 120; // ~2 seconds at 60fps
let evolutionMorphTimer = 0;
// Easing function: smooth ease-in-out for organic feel
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

const GROWTH_THRESHOLDS: Record<GrowthStage, number> = {
  baby: 0,
  child: 100,
  teen: 500,
  adult: 1500,
};

const GROWTH_STAGE_NAMES: Record<GrowthStage, string> = {
  baby: "Baby",
  child: "Child",
  teen: "Teen",
  adult: "Adult",
};

function getGrowthStage(care: number): GrowthStage {
  if (care >= GROWTH_THRESHOLDS.adult) return "adult";
  if (care >= GROWTH_THRESHOLDS.teen) return "teen";
  if (care >= GROWTH_THRESHOLDS.child) return "child";
  return "baby";
}

function addCarePoints(amount: number): void {
  totalCarePoints += amount;
  const newStage = getGrowthStage(totalCarePoints);
  if (newStage !== currentGrowthStage) {
    previousGrowthStage = currentGrowthStage;
    currentGrowthStage = newStage;
    celebrateEvolution(newStage);
  }
}

function celebrateEvolution(stage: GrowthStage): void {
  evolutionCelebrating = true;
  evolutionCelebrationTimer = EVOLUTION_CELEBRATION_DURATION;

  // Start morph transition from previous to new stage
  evolutionMorphing = true;
  evolutionMorphFrom = previousGrowthStage;
  evolutionMorphTo = stage;
  evolutionMorphProgress = 0;
  evolutionMorphTimer = EVOLUTION_MORPH_DURATION;

  // Play a special ascending fanfare
  playEvolutionSound();

  // Speech bubble
  const name = petName || "I";
  const messages: Record<GrowthStage, string[]> = {
    baby: [],
    child: [`${name} evolved! I'm growing up~!`, `${name} is a ${GROWTH_STAGE_NAMES[stage]} now! ✨`],
    teen: [`${name} evolved again! Look at me! 💫`, `I feel so much stronger! ✨`],
    adult: [`${name} is fully grown!! 🌟`, `I've reached my final form! ♥`],
  };
  const msgs = messages[stage];
  if (msgs.length > 0) {
    queueSpeechBubble(msgs[Math.floor(Math.random() * msgs.length)], 240);
  }

  // Diary entry for evolution
  const diaryName = petName || "Pet";
  const evoEmojis: Record<GrowthStage, string> = { baby: "🥚", child: "🌱", teen: "🌟", adult: "👑" };
  addDiaryEntry("evolution", evoEmojis[stage], `${diaryName} evolved into a ${GROWTH_STAGE_NAMES[stage]}!`);

  // Desktop notification for evolution milestone
  const displayName = petName || "Your pet";
  window.tamashii.showNotification(
    `${displayName} evolved!`,
    `${displayName} grew into a ${GROWTH_STAGE_NAMES[stage]}! Keep caring for your pet to help it grow even more.`
  );

  // Happy reaction
  squishAmount = 0.8;
  isHappy = true;
  happyTimer = 120;

  // Burst of sparkles
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const sparkleCount = stage === "child" ? 12 : stage === "teen" ? 20 : 30;
  for (let i = 0; i < sparkleCount; i++) {
    const angle = (i / sparkleCount) * Math.PI * 2;
    particles.push({
      x: cx + Math.cos(angle) * 15,
      y: cy + Math.sin(angle) * 10,
      vx: Math.cos(angle) * (1.5 + Math.random()),
      vy: Math.sin(angle) * (1.2 + Math.random()) - 0.5,
      life: 60 + Math.random() * 40,
      maxLife: 60 + Math.random() * 40,
      size: 3 + Math.random() * 4,
      type: "sparkle",
    });
  }
  // Hearts too
  for (let i = 0; i < 8; i++) {
    particles.push({
      x: cx + (Math.random() - 0.5) * 40,
      y: cy - 10,
      vx: (Math.random() - 0.5) * 2,
      vy: -1.5 - Math.random() * 2,
      life: 50 + Math.random() * 30,
      maxLife: 50 + Math.random() * 30,
      size: 6 + Math.random() * 6,
      type: "heart",
    });
  }

  saveGame();
}

function playEvolutionSound(): void {
  if (!soundEnabled) return;
  if (audioCtx.state === "suspended") audioCtx.resume();
  // Magical ascending arpeggio — longer and more triumphant than achievement
  playTone(523, 0.15, "sine", 0.1);   // C5
  setTimeout(() => playTone(659, 0.15, "sine", 0.1), 100);  // E5
  setTimeout(() => playTone(784, 0.15, "sine", 0.1), 200);  // G5
  setTimeout(() => playTone(1047, 0.2, "sine", 0.12), 300); // C6
  setTimeout(() => playTone(1319, 0.2, "sine", 0.1), 420);  // E6
  setTimeout(() => playTone(1568, 0.35, "sine", 0.12), 540); // G6
}

// --- Pet Stats (Hunger, Happiness, Energy) ---
let petHunger = 80;     // 0-100, decays over time, boosted by feeding
let petHappiness = 80;  // 0-100, decays over time, boosted by clicks/spins/games
let petEnergy = 80;     // 0-100, decays during day, recharges at night
let lastStatDecayTime = Date.now();
const STAT_DECAY_INTERVAL = 60000; // check decay every 60 seconds
let lowStatSpeechCooldown = 0; // prevent spam of low-stat messages

// --- Notification Reminders ---
const NOTIFICATION_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes between notifications per stat
const NOTIFICATION_THRESHOLD = 15; // notify when stat drops below this
let lastHungerNotifTime = 0;
let lastHappinessNotifTime = 0;
let lastEnergyNotifTime = 0;
let lastNotifSentTime = 0; // timestamp of most recent notification (any stat)
let careAfterNotifCount = 0; // times user responded to low-stat notification with care

const hungryMessages = [
  "I'm hungry...",
  "Feed me please~",
  "My tummy's growling...",
  "Is it snack time?",
  "So hungry...",
];

const sadMessages = [
  "I'm a little sad...",
  "Play with me?",
  "I need attention...",
  "Feeling lonely...",
  "Pet me please~",
];

const tiredMessages = [
  "So tired...",
  "I need rest...",
  "*yaaaawn*",
  "Running low...",
  "Sleepy...",
];

function trackCareAfterNotification(): void {
  if (lastNotifSentTime > 0 && Date.now() - lastNotifSentTime < 60000) {
    careAfterNotifCount++;
    lastNotifSentTime = 0; // reset so a single notification only counts once
  }
}

function feedPet(): void {
  if (isSleeping || sleepTransitionType) {
    queueSpeechBubble("*mumble*... food later... zzz...", 120, true);
    return;
  }
  trackCareAfterNotification();
  lastInteractionTime = Date.now();
  logDailyActivity("fed");
  petHunger = Math.min(100, petHunger + 25);
  addCarePoints(3);
  addFriendshipXP(3);
  playFeedSound();
  squishAmount = 0.6;
  isHappy = true;
  happyTimer = 60;
  const feedMessages = ["Yummy!", "Nom nom~!", "Delicious! ♥", "Thank you!", "So tasty~!"];
  queueSpeechBubble(feedMessages[Math.floor(Math.random() * feedMessages.length)], 150, true);
  // Feeding also gives a small happiness boost
  petHappiness = Math.min(100, petHappiness + 5);
  spawnEmoteSet("food", 2);
  saveGame();
}

function petNap(): void {
  if (isSleeping || sleepTransitionType) {
    queueSpeechBubble("Already sleeping~ 💤", 120, true);
    return;
  }
  trackCareAfterNotification();
  lastInteractionTime = Date.now();
  petEnergy = Math.min(100, petEnergy + 20);
  addCarePoints(2);
  addFriendshipXP(2);
  playNapSound();
  squishAmount = 0.3;
  const napMessages = ["*zzz*... Refreshed!", "Power nap~!", "That was nice...", "Feel better now!"];
  queueSpeechBubble(napMessages[Math.floor(Math.random() * napMessages.length)], 150, true);
  spawnEmoteSet("sleepy", 1);
  saveGame();
}

function updatePetStats(): void {
  const now = Date.now();
  const elapsed = now - lastStatDecayTime;

  if (elapsed >= STAT_DECAY_INTERVAL) {
    const intervals = Math.floor(elapsed / STAT_DECAY_INTERVAL);
    lastStatDecayTime = now;

    // Personality-adjusted decay multipliers
    const pDecay = petPersonality ? PERSONALITY_DECAY[petPersonality] : { hunger: 1, happiness: 1, energy: 1 };

    // Hunger decays ~1 point per 3 minutes (1 per 3 intervals)
    petHunger = Math.max(0, petHunger - intervals * 0.33 * pDecay.hunger);

    // Happiness decays ~1 point per 5 minutes (1 per 5 intervals)
    petHappiness = Math.max(0, petHappiness - intervals * 0.2 * pDecay.happiness);

    // Energy: decays during day, recharges at night
    if (currentTimeOfDay === "night") {
      petEnergy = Math.min(100, petEnergy + intervals * 0.5); // recharge at night
    } else if (currentTimeOfDay === "morning") {
      petEnergy = Math.max(0, petEnergy - intervals * 0.15 * pDecay.energy); // slow drain in morning
    } else {
      petEnergy = Math.max(0, petEnergy - intervals * 0.25 * pDecay.energy); // faster drain afternoon/evening
    }
  }

  // Low-stat speech bubbles (only when no bubble is showing and cooldown is up)
  if (!speechBubble && lowStatSpeechCooldown <= 0) {
    let lowStatMsg: string | null = null;
    // Prioritize the lowest stat
    const lowestVal = Math.min(petHunger, petHappiness, petEnergy);
    if (lowestVal < 25) {
      if (petHunger <= petHappiness && petHunger <= petEnergy) {
        lowStatMsg = hungryMessages[Math.floor(Math.random() * hungryMessages.length)];
      } else if (petHappiness <= petHunger && petHappiness <= petEnergy) {
        lowStatMsg = sadMessages[Math.floor(Math.random() * sadMessages.length)];
      } else {
        lowStatMsg = tiredMessages[Math.floor(Math.random() * tiredMessages.length)];
      }
    }
    if (lowStatMsg && Math.random() < 0.3) { // 30% chance when eligible
      queueSpeechBubble(lowStatMsg, 150);
      lowStatSpeechCooldown = 600; // 10 second cooldown
    }
  }
  if (lowStatSpeechCooldown > 0) lowStatSpeechCooldown--;

  // --- Desktop notification reminders for critically low stats ---
  if (notificationsEnabled) {
    const now = Date.now();
    const petDisplayName = petName || "Your pet";

    if (petHunger < NOTIFICATION_THRESHOLD && now - lastHungerNotifTime > NOTIFICATION_COOLDOWN_MS) {
      window.tamashii.showNotification(
        `🍽️ ${petDisplayName} is hungry!`,
        `Hunger is at ${Math.round(petHunger)}%. Press F or right-click to feed.`
      );
      lastHungerNotifTime = now;
      lastNotifSentTime = now;
    }

    if (petHappiness < NOTIFICATION_THRESHOLD && now - lastHappinessNotifTime > NOTIFICATION_COOLDOWN_MS) {
      window.tamashii.showNotification(
        `😢 ${petDisplayName} is sad!`,
        `Happiness is at ${Math.round(petHappiness)}%. Click, pet, or play a game!`
      );
      lastHappinessNotifTime = now;
      lastNotifSentTime = now;
    }

    if (petEnergy < NOTIFICATION_THRESHOLD && currentTimeOfDay !== "night" && now - lastEnergyNotifTime > NOTIFICATION_COOLDOWN_MS) {
      window.tamashii.showNotification(
        `😴 ${petDisplayName} is exhausted!`,
        `Energy is at ${Math.round(petEnergy)}%. Press N for a power nap!`
      );
      lastEnergyNotifTime = now;
      lastNotifSentTime = now;
    }
  }
}

function drawStatBars(): void {
  const barWidth = 40;
  const barHeight = 4;
  const barSpacing = 7;
  const startX = canvas.width / 2 - barWidth / 2;
  const startY = canvas.height / 2 + 55; // below the pet's feet

  const stats = [
    { value: petHunger, color: "#FF9944", label: "🍎" },
    { value: petHappiness, color: "#FF6699", label: "♥" },
    { value: petEnergy, color: "#66CC66", label: "⚡" },
  ];

  ctx.save();
  for (let i = 0; i < stats.length; i++) {
    const y = startY + i * barSpacing;
    const stat = stats[i];

    // Background bar
    ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
    ctx.beginPath();
    ctx.roundRect(startX, y, barWidth, barHeight, 2);
    ctx.fill();

    // Fill bar
    const fillWidth = (stat.value / 100) * barWidth;
    // Color shifts toward red when low
    let barColor = stat.color;
    if (stat.value < 25) {
      barColor = "#DD4444";
    } else if (stat.value < 50) {
      // Blend toward warning
      const t = (50 - stat.value) / 25;
      barColor = stat.value < 35 ? "#EE6644" : stat.color;
    }
    ctx.fillStyle = barColor;
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.roundRect(startX, y, Math.max(fillWidth, 1), barHeight, 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;
  }
  ctx.restore();
}

// Listen for feed/nap from main process
window.tamashii.onFeedPet(() => {
  feedPet();
});

window.tamashii.onPetNap(() => {
  petNap();
});

// --- Star Catcher Mini-Game ---
interface FallingStar {
  x: number;
  y: number;
  vy: number;
  size: number;
  hue: number;
  twinkle: number; // phase for twinkle animation
  caught: boolean;
}

let minigameActive = false;
let minigameScore = 0;
let minigameTimeLeft = 0; // frames remaining (30 seconds = 1800 frames)
let minigameStars: FallingStar[] = [];
let minigameSpawnTimer = 0;
let minigameHighScore = 0;
let minigameCombo = 0; // consecutive catches without a miss
let minigameBestCombo = 0;
const MINIGAME_DURATION = 1800; // 30 seconds at 60fps

function startMinigame(): void {
  if (minigameActive || memoryGameActive) return;
  minigameActive = true;
  minigameScore = 0;
  minigameTimeLeft = MINIGAME_DURATION;
  minigameStars = [];
  minigameSpawnTimer = 0;
  minigameCombo = 0;
  minigameBestCombo = 0;
  queueSpeechBubble("Catch the stars!", 120, true);
  playGreetingSound();
  squishAmount = 0.5;
  isHappy = true;
  happyTimer = 60;
}

function endMinigame(): void {
  minigameActive = false;
  minigameStars = [];
  const isNewRecord = minigameScore > minigameHighScore;
  if (isNewRecord) {
    minigameHighScore = minigameScore;
  }
  saveGame();

  // Celebration reaction
  playMinigameEndSound();
  squishAmount = 0.8;
  isHappy = true;
  happyTimer = 90;
  petHappiness = Math.min(100, petHappiness + Math.min(minigameScore, 20)); // games boost happiness
  addCarePoints(10); // mini-games give substantial care

  // Score-based speech
  let msg: string;
  if (minigameScore === 0) {
    msg = "Maybe next time...";
  } else if (minigameScore < 5) {
    msg = `${minigameScore} stars! Not bad~`;
  } else if (minigameScore < 15) {
    msg = `${minigameScore} stars! Great job!`;
  } else {
    msg = `${minigameScore} stars! Amazing!!`;
  }
  if (isNewRecord && minigameScore > 0) {
    msg = `New record: ${minigameScore}! ⭐`;
    window.tamashii.showNotification("⭐ New Star Catcher Record!", `You caught ${minigameScore} stars! Can you beat it next time?`);
  }
  queueSpeechBubble(msg, 240);

  // Celebration sparkles
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  for (let i = 0; i < Math.min(minigameScore, 12); i++) {
    const angle = (i / Math.min(minigameScore, 12)) * Math.PI * 2;
    particles.push({
      x: cx + Math.cos(angle) * 25,
      y: cy + Math.sin(angle) * 20,
      vx: Math.cos(angle) * 2,
      vy: Math.sin(angle) * 1.5 - 1,
      life: 60 + Math.random() * 30,
      maxLife: 60 + Math.random() * 30,
      size: 3 + Math.random() * 3,
      type: "sparkle",
    });
  }
}

function updateMinigame(): void {
  if (!minigameActive) return;

  minigameTimeLeft--;
  if (minigameTimeLeft <= 0) {
    endMinigame();
    return;
  }

  // Spawn stars — rate increases over time
  minigameSpawnTimer++;
  const elapsed = MINIGAME_DURATION - minigameTimeLeft;
  const difficulty = Math.min(elapsed / MINIGAME_DURATION, 1); // 0 to 1
  const spawnInterval = Math.max(15, 45 - difficulty * 25); // starts at ~45, ends at ~20 frames
  if (minigameSpawnTimer >= spawnInterval) {
    minigameSpawnTimer = 0;
    const starX = 10 + Math.random() * (canvas.width - 20);
    minigameStars.push({
      x: starX,
      y: -10,
      vy: 1.0 + difficulty * 1.5 + Math.random() * 0.5, // faster as game progresses
      size: 8 + Math.random() * 6,
      hue: 40 + Math.random() * 30, // golden hues
      twinkle: Math.random() * Math.PI * 2,
      caught: false,
    });
  }

  // Update falling stars
  for (let i = minigameStars.length - 1; i >= 0; i--) {
    const star = minigameStars[i];
    star.y += star.vy;
    star.twinkle += 0.15;

    // Remove stars that fall off screen (missed)
    if (star.y > canvas.height + 10) {
      minigameStars.splice(i, 1);
      minigameCombo = 0; // reset combo on miss
    }
  }
}

function tryClickMinigameStar(clickX: number, clickY: number): boolean {
  if (!minigameActive) return false;

  // Check stars from top (most recently spawned) to catch the topmost one
  for (let i = minigameStars.length - 1; i >= 0; i--) {
    const star = minigameStars[i];
    const dx = clickX - star.x;
    const dy = clickY - star.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const hitRadius = star.size + 8; // generous hit area

    if (dist <= hitRadius) {
      // Caught!
      minigameScore++;
      minigameCombo++;
      if (minigameCombo > minigameBestCombo) minigameBestCombo = minigameCombo;
      playStarCatchSound();

      // Sparkle burst at catch position
      for (let j = 0; j < 4; j++) {
        const angle = (j / 4) * Math.PI * 2 + Math.random() * 0.5;
        particles.push({
          x: star.x,
          y: star.y,
          vx: Math.cos(angle) * 1.5,
          vy: Math.sin(angle) * 1.5 - 0.5,
          life: 30 + Math.random() * 15,
          maxLife: 30 + Math.random() * 15,
          size: 2 + Math.random() * 2,
          type: "sparkle",
        });
      }

      // Combo speech bubbles at milestones
      if (minigameCombo === 5) {
        queueSpeechBubble("5 combo!", 60);
      } else if (minigameCombo === 10) {
        queueSpeechBubble("10 combo! On fire!", 60);
      }

      minigameStars.splice(i, 1);
      return true;
    }
  }
  return false;
}

function drawMinigame(): void {
  if (!minigameActive) return;

  // Draw falling stars
  for (const star of minigameStars) {
    const twinkleScale = 0.85 + 0.15 * Math.sin(star.twinkle);
    const s = star.size * twinkleScale;
    ctx.save();
    ctx.translate(star.x, star.y);

    // Glow
    ctx.beginPath();
    ctx.arc(0, 0, s * 1.2, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${star.hue}, 90%, 70%, 0.25)`;
    ctx.fill();

    // Star shape (5 points)
    ctx.beginPath();
    for (let p = 0; p < 5; p++) {
      const outerAngle = (p / 5) * Math.PI * 2 - Math.PI / 2;
      const innerAngle = outerAngle + Math.PI / 5;
      const ox = Math.cos(outerAngle) * s;
      const oy = Math.sin(outerAngle) * s;
      const ix = Math.cos(innerAngle) * s * 0.4;
      const iy = Math.sin(innerAngle) * s * 0.4;
      if (p === 0) ctx.moveTo(ox, oy);
      else ctx.lineTo(ox, oy);
      ctx.lineTo(ix, iy);
    }
    ctx.closePath();
    ctx.fillStyle = `hsl(${star.hue}, 95%, 65%)`;
    ctx.fill();
    ctx.strokeStyle = `hsl(${star.hue}, 80%, 45%)`;
    ctx.lineWidth = 0.8;
    ctx.stroke();

    ctx.restore();
  }

  // HUD — score and timer
  const timeSeconds = Math.ceil(minigameTimeLeft / 60);
  const barWidth = canvas.width - 20;
  const barX = 10;
  const barY = 8;

  // Timer bar background
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.beginPath();
  ctx.roundRect(barX, barY, barWidth, 6, 3);
  ctx.fill();

  // Timer bar fill
  const fillRatio = minigameTimeLeft / MINIGAME_DURATION;
  const barHue = fillRatio > 0.3 ? 50 : 0; // golden, turns red when low
  ctx.fillStyle = `hsl(${barHue}, 90%, 60%)`;
  ctx.beginPath();
  ctx.roundRect(barX, barY, barWidth * fillRatio, 6, 3);
  ctx.fill();

  // Score text
  ctx.save();
  ctx.font = "bold 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
  ctx.fillText(`⭐ ${minigameScore}`, canvas.width / 2 + 1, 30 + 1);
  ctx.fillStyle = "#FFD700";
  ctx.strokeStyle = "rgba(0, 0, 0, 0.4)";
  ctx.lineWidth = 2.5;
  ctx.strokeText(`⭐ ${minigameScore}`, canvas.width / 2, 30);
  ctx.fillText(`⭐ ${minigameScore}`, canvas.width / 2, 30);

  // Timer text (small)
  ctx.font = "10px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.fillStyle = fillRatio > 0.3 ? "rgba(80, 60, 0, 0.7)" : "rgba(180, 30, 30, 0.8)";
  ctx.fillText(`${timeSeconds}s`, canvas.width / 2, 44);

  // Combo indicator
  if (minigameCombo >= 3) {
    ctx.font = "bold 10px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    ctx.fillStyle = "#FF6B35";
    ctx.fillText(`${minigameCombo}x combo!`, canvas.width / 2, 56);
  }
  ctx.restore();
}

window.tamashii.onStartMinigame(() => {
  startMinigame();
});

// --- Color Memory Mini-game (Simon Says) ---
let memoryGameActive = false;
let memoryGameSequence: number[] = []; // indices 0-3 for the four orbs
let memoryGamePlayerIndex = 0; // which step the player is on
let memoryGameRound = 0; // current round (sequence length)
let memoryGameScore = 0; // rounds completed
let memoryGameHighScore = 0;
let memoryGamePhase: "showing" | "waiting" | "flash_correct" | "flash_wrong" | "round_clear" = "showing";
let memoryGameShowIndex = 0; // which orb in the sequence is being shown
let memoryGameShowTimer = 0; // frames remaining for current show step
let memoryGamePauseTimer = 0; // pause between show steps
let memoryGameFlashTimer = 0; // feedback flash timer
let memoryGameFlashedOrb = -1; // which orb is currently flashing (player feedback)
let memoryGameOrbPulse = 0; // animation phase for orbs

const MEMORY_ORB_COLORS = [
  { base: "#FF6B8A", glow: "#FF3366", name: "pink" },    // top
  { base: "#4ECDC4", glow: "#00B4A6", name: "teal" },    // right
  { base: "#FFD93D", glow: "#FFB800", name: "yellow" },   // bottom
  { base: "#6C5CE7", glow: "#4834D4", name: "purple" },   // left
];

const MEMORY_SHOW_FRAMES = 30; // how long each orb lights up during sequence display
const MEMORY_PAUSE_FRAMES = 12; // pause between show steps
const MEMORY_FLASH_FRAMES = 15; // feedback flash duration

function startMemoryGame(): void {
  if (minigameActive || memoryGameActive) return;
  memoryGameActive = true;
  memoryGameSequence = [];
  memoryGamePlayerIndex = 0;
  memoryGameRound = 0;
  memoryGameScore = 0;
  memoryGameOrbPulse = 0;
  queueSpeechBubble("Watch closely!", 90, true);
  playGreetingSound();
  squishAmount = 0.5;
  isHappy = true;
  happyTimer = 60;
  // Start first round
  memoryGameNextRound();
}

function memoryGameNextRound(): void {
  memoryGameRound++;
  // Add a random orb to the sequence
  memoryGameSequence.push(Math.floor(Math.random() * 4));
  memoryGamePlayerIndex = 0;
  memoryGamePhase = "showing";
  memoryGameShowIndex = 0;
  memoryGameShowTimer = 0;
  memoryGamePauseTimer = 30; // brief pause before showing sequence
}

function endMemoryGame(): void {
  memoryGameActive = false;
  const isNewRecord = memoryGameScore > memoryGameHighScore;
  if (isNewRecord) {
    memoryGameHighScore = memoryGameScore;
  }
  saveGame();

  playMinigameEndSound();
  squishAmount = 0.8;
  isHappy = true;
  happyTimer = 90;
  petHappiness = Math.min(100, petHappiness + Math.min(memoryGameScore * 2, 20));
  addCarePoints(10);

  let msg: string;
  if (memoryGameScore === 0) {
    msg = "Maybe next time...";
  } else if (memoryGameScore < 3) {
    msg = `Round ${memoryGameScore}! Not bad~`;
  } else if (memoryGameScore < 7) {
    msg = `Round ${memoryGameScore}! Great memory!`;
  } else {
    msg = `Round ${memoryGameScore}! Incredible!!`;
  }
  if (isNewRecord && memoryGameScore > 0) {
    msg = `New record: round ${memoryGameScore}! 🧠`;
    window.tamashii.showNotification("🧠 New Memory Match Record!", `You reached round ${memoryGameScore}! Think you can go further?`);
  }
  queueSpeechBubble(msg, 240);

  // Celebration sparkles
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  for (let i = 0; i < Math.min(memoryGameScore * 2, 16); i++) {
    const angle = (i / Math.min(memoryGameScore * 2, 16)) * Math.PI * 2;
    particles.push({
      x: cx + Math.cos(angle) * 25,
      y: cy + Math.sin(angle) * 20,
      vx: Math.cos(angle) * 2,
      vy: Math.sin(angle) * 1.5 - 1,
      life: 60 + Math.random() * 30,
      maxLife: 60 + Math.random() * 30,
      size: 3 + Math.random() * 3,
      type: "sparkle",
    });
  }
}

function getMemoryOrbPositions(): { x: number; y: number }[] {
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const r = 55; // distance from center
  return [
    { x: cx, y: cy - r },         // top
    { x: cx + r, y: cy },         // right
    { x: cx, y: cy + r },         // bottom
    { x: cx - r, y: cy },         // left
  ];
}

function playMemoryOrbSound(orbIndex: number): void {
  // Each orb has a distinct pitch
  const freqs = [523, 659, 784, 880]; // C5, E5, G5, A5
  playTone(freqs[orbIndex], 0.2, "sine", 0.1);
}

function playMemoryWrongSound(): void {
  playTone(200, 0.3, "sawtooth", 0.08);
  setTimeout(() => playTone(160, 0.3, "sawtooth", 0.06), 100);
}

function updateMemoryGame(): void {
  if (!memoryGameActive) return;
  memoryGameOrbPulse += 0.05;

  if (memoryGamePhase === "showing") {
    if (memoryGamePauseTimer > 0) {
      memoryGamePauseTimer--;
      return;
    }
    if (memoryGameShowTimer > 0) {
      memoryGameShowTimer--;
      if (memoryGameShowTimer <= 0) {
        // Move to next in sequence
        memoryGameShowIndex++;
        if (memoryGameShowIndex >= memoryGameSequence.length) {
          // Done showing — player's turn
          memoryGamePhase = "waiting";
          memoryGamePlayerIndex = 0;
        } else {
          memoryGamePauseTimer = MEMORY_PAUSE_FRAMES;
          memoryGameShowTimer = 0;
        }
      }
    } else {
      // Start showing current orb
      memoryGameShowTimer = MEMORY_SHOW_FRAMES;
      playMemoryOrbSound(memoryGameSequence[memoryGameShowIndex]);
    }
  } else if (memoryGamePhase === "flash_correct") {
    memoryGameFlashTimer--;
    if (memoryGameFlashTimer <= 0) {
      memoryGameFlashedOrb = -1;
      if (memoryGamePlayerIndex >= memoryGameSequence.length) {
        // Round complete!
        memoryGamePhase = "round_clear";
        memoryGameFlashTimer = 40;
        memoryGameScore = memoryGameRound;
        const msgs = ["Nice!", "Good memory!", "Keep going~", "Perfect! ✨", "Impressive!"];
        queueSpeechBubble(msgs[Math.min(memoryGameRound - 1, msgs.length - 1)], 50);
      } else {
        memoryGamePhase = "waiting";
      }
    }
  } else if (memoryGamePhase === "flash_wrong") {
    memoryGameFlashTimer--;
    if (memoryGameFlashTimer <= 0) {
      endMemoryGame();
    }
  } else if (memoryGamePhase === "round_clear") {
    memoryGameFlashTimer--;
    if (memoryGameFlashTimer <= 0) {
      memoryGameNextRound();
    }
  }
}

function tryClickMemoryOrb(clickX: number, clickY: number): boolean {
  if (!memoryGameActive || memoryGamePhase !== "waiting") return false;

  const positions = getMemoryOrbPositions();
  const hitRadius = 18;

  for (let i = 0; i < 4; i++) {
    const dx = clickX - positions[i].x;
    const dy = clickY - positions[i].y;
    if (Math.sqrt(dx * dx + dy * dy) <= hitRadius) {
      const expected = memoryGameSequence[memoryGamePlayerIndex];
      if (i === expected) {
        // Correct!
        playMemoryOrbSound(i);
        memoryGameFlashedOrb = i;
        memoryGameFlashTimer = MEMORY_FLASH_FRAMES;
        memoryGamePhase = "flash_correct";
        memoryGamePlayerIndex++;
      } else {
        // Wrong!
        playMemoryWrongSound();
        memoryGameFlashedOrb = i;
        memoryGameFlashTimer = 40;
        memoryGamePhase = "flash_wrong";
      }
      return true;
    }
  }
  return false;
}

function drawMemoryGame(): void {
  if (!memoryGameActive) return;

  const positions = getMemoryOrbPositions();
  const orbRadius = 14;

  for (let i = 0; i < 4; i++) {
    const pos = positions[i];
    const color = MEMORY_ORB_COLORS[i];
    const isLit =
      (memoryGamePhase === "showing" && memoryGameShowTimer > 0 && memoryGameSequence[memoryGameShowIndex] === i) ||
      (memoryGameFlashedOrb === i && (memoryGamePhase === "flash_correct" || memoryGamePhase === "flash_wrong"));
    const isWrong = memoryGamePhase === "flash_wrong" && memoryGameFlashedOrb === i;

    ctx.save();

    // Outer glow when lit
    if (isLit) {
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, orbRadius * 2, 0, Math.PI * 2);
      const g = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, orbRadius * 2);
      g.addColorStop(0, isWrong ? "rgba(255, 50, 50, 0.4)" : `${color.glow}66`);
      g.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = g;
      ctx.fill();
    }

    // Orb body
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, orbRadius, 0, Math.PI * 2);
    if (isLit) {
      ctx.fillStyle = isWrong ? "#FF4444" : color.glow;
      ctx.shadowColor = isWrong ? "#FF0000" : color.glow;
      ctx.shadowBlur = 12;
    } else {
      // Dim but visible, subtle pulse when waiting
      const pulse = memoryGamePhase === "waiting" ? 0.4 + 0.1 * Math.sin(memoryGameOrbPulse + i * 1.5) : 0.35;
      ctx.globalAlpha = pulse;
      ctx.fillStyle = color.base;
    }
    ctx.fill();

    // Inner highlight
    ctx.globalAlpha = isLit ? 0.6 : 0.2;
    ctx.beginPath();
    ctx.arc(pos.x - 3, pos.y - 3, orbRadius * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    ctx.restore();
  }

  // HUD — round number
  ctx.save();
  ctx.font = "bold 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
  ctx.fillText(`🧠 Round ${memoryGameRound}`, canvas.width / 2 + 1, 18 + 1);
  ctx.fillStyle = "#6C5CE7";
  ctx.strokeStyle = "rgba(0, 0, 0, 0.4)";
  ctx.lineWidth = 2.5;
  ctx.strokeText(`🧠 Round ${memoryGameRound}`, canvas.width / 2, 18);
  ctx.fillText(`🧠 Round ${memoryGameRound}`, canvas.width / 2, 18);

  // Phase indicator
  ctx.font = "10px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  if (memoryGamePhase === "showing" || memoryGamePhase === "round_clear") {
    ctx.fillStyle = "rgba(100, 80, 150, 0.7)";
    ctx.fillText("Watch...", canvas.width / 2, 32);
  } else if (memoryGamePhase === "waiting") {
    ctx.fillStyle = "rgba(0, 150, 100, 0.8)";
    ctx.fillText(`Your turn! (${memoryGamePlayerIndex + 1}/${memoryGameSequence.length})`, canvas.width / 2, 32);
  } else if (memoryGamePhase === "flash_wrong") {
    ctx.fillStyle = "rgba(200, 50, 50, 0.8)";
    ctx.fillText("Wrong!", canvas.width / 2, 32);
  }
  ctx.restore();
}

window.tamashii.onStartMemoryGame(() => {
  startMemoryGame();
});

const spinMessages = [
  "Wheee~!",
  "Watch this!",
  "Ta-da~!",
  "Spin spin!",
  "I'm dizzy!",
  "Again again!",
];

// --- Achievement System ---
interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockMessage: string;
  condition: () => boolean;
  unlocked: boolean;
}

let totalClicks = 0;
let totalSpins = 0;
let totalBounces = 0; // gravity bounces
let stressSurvivedCount = 0; // times stress went above 0.7
let wasHighStress = false;
let sessionStartTime = Date.now();
let achievementCelebrating = false;
let achievementCelebrationTimer = 0;

const achievements: Achievement[] = [
  {
    id: "first_pat", name: "First Pat", description: "Click the pet for the first time",
    icon: "👆", unlockMessage: "My first pat! ♥",
    condition: () => totalClicks >= 1, unlocked: false,
  },
  {
    id: "first_trick", name: "First Trick", description: "Make the pet do a spin",
    icon: "🌀", unlockMessage: "I learned a trick!",
    condition: () => totalSpins >= 1, unlocked: false,
  },
  {
    id: "popular", name: "Popular Pet", description: "Click the pet 25 times",
    icon: "⭐", unlockMessage: "I'm so popular!",
    condition: () => totalClicks >= 25, unlocked: false,
  },
  {
    id: "spin_master", name: "Spin Master", description: "Do 10 spins",
    icon: "💫", unlockMessage: "Spin champion!",
    condition: () => totalSpins >= 10, unlocked: false,
  },
  {
    id: "clicker", name: "Click Frenzy", description: "Click the pet 100 times",
    icon: "🔥", unlockMessage: "100 clicks! I'm loved!",
    condition: () => totalClicks >= 100, unlocked: false,
  },
  {
    id: "spinner", name: "Tornado", description: "Do 50 spins",
    icon: "🌪️", unlockMessage: "50 spins! So dizzy~",
    condition: () => totalSpins >= 50, unlocked: false,
  },
  {
    id: "bouncy", name: "Bouncy Ball", description: "Bounce from gravity 10 times",
    icon: "🏀", unlockMessage: "Boing boing boing!",
    condition: () => totalBounces >= 10, unlocked: false,
  },
  {
    id: "stress_survivor", name: "Stress Survivor", description: "Survive 5 high-stress moments",
    icon: "💪", unlockMessage: "I can handle anything!",
    condition: () => stressSurvivedCount >= 5, unlocked: false,
  },
  {
    id: "veteran", name: "Old Friend", description: "Keep the pet open for 30 minutes",
    icon: "🕰️", unlockMessage: "We've been together so long!",
    condition: () => (Date.now() - sessionStartTime) >= 30 * 60 * 1000, unlocked: false,
  },
  {
    id: "dedicated", name: "Best Friends", description: "Keep the pet open for 2 hours",
    icon: "💕", unlockMessage: "Best friends forever!",
    condition: () => (Date.now() - sessionStartTime) >= 2 * 60 * 60 * 1000, unlocked: false,
  },
  {
    id: "mega_clicker", name: "Mega Fan", description: "Click the pet 500 times",
    icon: "👑", unlockMessage: "500 clicks! I'm royalty!",
    condition: () => totalClicks >= 500, unlocked: false,
  },
  {
    id: "super_bouncy", name: "Sky Diver", description: "Bounce from gravity 50 times",
    icon: "🪂", unlockMessage: "I love flying!",
    condition: () => totalBounces >= 50, unlocked: false,
  },
  {
    id: "combo_starter", name: "Combo Starter", description: "Reach a 10x click combo",
    icon: "⚡", unlockMessage: "MEGA COMBO!!",
    condition: () => bestCombo >= 10, unlocked: false,
  },
  {
    id: "combo_legend", name: "Combo Legend", description: "Reach a 20x click combo",
    icon: "🌟", unlockMessage: "LEGENDARY combo!!!",
    condition: () => bestCombo >= 20, unlocked: false,
  },
  {
    id: "first_growth", name: "Growing Up", description: "Reach the Child growth stage",
    icon: "🌱", unlockMessage: "I'm not a baby anymore!",
    condition: () => currentGrowthStage !== "baby", unlocked: false,
  },
  {
    id: "fully_grown", name: "Fully Grown", description: "Reach the Adult growth stage",
    icon: "🌳", unlockMessage: "I've reached my final form!",
    condition: () => currentGrowthStage === "adult", unlocked: false,
  },
  {
    id: "shortcut_master", name: "Shortcut Master", description: "Use keyboard shortcuts 10 times",
    icon: "⌨", unlockMessage: "Keyboard ninja!",
    condition: () => shortcutUsageCount >= 10, unlocked: false,
  },
  {
    id: "true_self", name: "True Self", description: "Discover your pet's personality",
    icon: "🪞", unlockMessage: "You really know me~!",
    condition: () => petPersonality !== null && statsPanelOpen, unlocked: false,
  },
  {
    id: "diary_keeper", name: "Diary Keeper", description: "Accumulate 10 diary entries",
    icon: "📖", unlockMessage: "So many memories~!",
    condition: () => petDiary.length >= 10, unlocked: false,
  },
  {
    id: "say_cheese", name: "Say Cheese!", description: "Take your first pet photo",
    icon: "📸", unlockMessage: "I'm photogenic~!",
    condition: () => totalPhotos >= 1, unlocked: false,
  },
  {
    id: "true_colors", name: "True Colors", description: "Customize your pet's color",
    icon: "🎨", unlockMessage: "Showing my true colors~!",
    condition: () => currentColorPalette !== "default", unlocked: false,
  },
  {
    id: "attentive_owner", name: "Attentive Owner", description: "Respond to 3 notification reminders",
    icon: "🔔", unlockMessage: "You always come when I call~!",
    condition: () => careAfterNotifCount >= 3, unlocked: false,
  },
  {
    id: "playtime", name: "Playtime!", description: "Watch your pet play with a toy 5 times",
    icon: "🧸", unlockMessage: "I love my toys~!",
    condition: () => totalToyPlays >= 5, unlocked: false,
  },
  {
    id: "trick_master", name: "Trick Master", description: "Learn all 4 pet tricks",
    icon: "🎪", unlockMessage: "I know ALL the tricks~!",
    condition: () => getMasteredTricks().length === TRICKS.length, unlocked: false,
  },
  {
    id: "mood_watcher", name: "Mood Watcher", description: "Log 24+ mood snapshots",
    icon: "📈", unlockMessage: "Tracking my feelings~!",
    condition: () => moodSnapshots.length >= 24, unlocked: false,
  },
  {
    id: "configurator", name: "Configurator", description: "Open the settings panel 5 times",
    icon: "⚙️", unlockMessage: "I love being customized~!",
    condition: () => settingsPanelOpenCount >= 5, unlocked: false,
  },
  {
    id: "emotive", name: "Emotive", description: "Trigger 20 pet emotes",
    icon: "😊", unlockMessage: "So many feelings~!",
    condition: () => totalEmotesTriggered >= 20, unlocked: false,
  },
  {
    id: "soulbound", name: "Soulbound", description: "Reach friendship level 50",
    icon: "💕", unlockMessage: "Our bond is unbreakable~! ✨",
    condition: () => getFriendshipLevel() >= 50, unlocked: false,
  },
  {
    id: "weather_watcher", name: "Weather Watcher", description: "Experience 5 different weather types",
    icon: "🌦️", unlockMessage: "I've seen all kinds of weather~!",
    condition: () => weatherTypesSeen.size >= 5, unlocked: false,
  },
  {
    id: "combo_artist", name: "Combo Artist", description: "Perform 5 trick combos",
    icon: "🎭", unlockMessage: "I'm a combo master~!",
    condition: () => totalTrickCombos >= 5, unlocked: false,
  },
  {
    id: "sweet_dreams", name: "Sweet Dreams", description: "Fall asleep 3 nights",
    icon: "🌙", unlockMessage: "Sweet dreams are made of this~ 💤✨",
    condition: () => totalNightsSlept >= 3, unlocked: false,
  },
  {
    id: "bubble_popper", name: "Bubble Popper", description: "Pop 50 bubbles",
    icon: "🫧", unlockMessage: "Pop pop pop~! I love bubbles! 🫧✨",
    condition: () => totalBubblesPopped >= 50, unlocked: false,
  },
  {
    id: "fortune_teller", name: "Fortune Teller", description: "Collect 15 unique fortunes",
    icon: "🥠", unlockMessage: "The future is full of wonders~! 🥠✨",
    condition: () => uniqueFortunesCollected.size >= 15, unlocked: false,
  },
  {
    id: "firefly_catcher", name: "Firefly Catcher", description: "Catch 25 fireflies",
    icon: "🪲", unlockMessage: "The night glows just for me~! 🪲✨",
    condition: () => totalFirefliesCaught >= 25, unlocked: false,
  },
  {
    id: "stargazer", name: "Stargazer", description: "Complete 5 constellations",
    icon: "🌌", unlockMessage: "The stars tell my story~! 🌌✨",
    condition: () => totalConstellationsCompleted >= 5, unlocked: false,
  },
  {
    id: "wish_maker", name: "Wish Maker", description: "Make 10 wishes on shooting stars",
    icon: "🌠", unlockMessage: "Every wish lights up the sky~! 🌠✨",
    condition: () => totalWishesMade >= 10, unlocked: false,
  },
  {
    id: "dew_collector", name: "Dew Collector", description: "Collect 20 morning dew drops",
    icon: "💧", unlockMessage: "Every morning sparkles just for me~! 💧✨",
    condition: () => totalDewDropsCollected >= 20, unlocked: false,
  },
  {
    id: "storyteller", name: "Storyteller", description: "Read 8 different bedtime stories",
    icon: "📖", unlockMessage: "Every story is a dream waiting to happen~! 📖✨",
    condition: () => uniqueStoriesRead.size >= 8, unlocked: false,
  },
  {
    id: "pen_pal", name: "Pen Pal", description: "Open 10 messages in bottles",
    icon: "🍾", unlockMessage: "Friends across the sea know my name~! 🍾✨",
    condition: () => totalBottlesOpened >= 10, unlocked: false,
  },
];

function checkAchievements(): void {
  for (const a of achievements) {
    if (!a.unlocked && a.condition()) {
      a.unlocked = true;
      celebrateAchievement(a);
    }
  }
}

function celebrateAchievement(a: Achievement): void {
  // Show achievement speech bubble
  playAchievementSound();
  queueSpeechBubble(`${a.icon} ${a.unlockMessage}`, 240, true);

  // Big sparkle + heart burst
  achievementCelebrating = true;
  achievementCelebrationTimer = 60;
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    particles.push({
      x: cx + Math.cos(angle) * 15,
      y: cy + Math.sin(angle) * 10,
      vx: Math.cos(angle) * 2,
      vy: Math.sin(angle) * 1.5,
      life: 60 + Math.random() * 30,
      maxLife: 60 + Math.random() * 30,
      size: 4 + Math.random() * 3,
      type: "sparkle",
    });
  }
  for (let i = 0; i < 5; i++) {
    particles.push({
      x: cx + (Math.random() - 0.5) * 40,
      y: cy - 10,
      vx: (Math.random() - 0.5) * 2.5,
      vy: -(2 + Math.random() * 1.5),
      life: 70 + Math.random() * 30,
      maxLife: 70 + Math.random() * 30,
      size: 7 + Math.random() * 4,
      type: "heart",
    });
  }

  // Happy reaction
  squishAmount = 0.8;
  isHappy = true;
  happyTimer = 80;

  // Diary entry for achievement
  addDiaryEntry("achievement", a.icon, `Unlocked "${a.name}" — ${a.description}`);

  // Desktop notification for achievement
  window.tamashii.showNotification(
    `${a.icon} Achievement Unlocked!`,
    `${a.name} — ${a.description}`
  );

  // Report to main process for context menu
  reportAchievements();
}

function getUnlockedAchievements(): { id: string; name: string; icon: string; description: string }[] {
  return achievements.filter(a => a.unlocked).map(a => ({
    id: a.id, name: a.name, icon: a.icon, description: a.description,
  }));
}

function getAchievementProgress(): { unlocked: number; total: number } {
  return { unlocked: achievements.filter(a => a.unlocked).length, total: achievements.length };
}

function reportAchievements(): void {
  const progress = getAchievementProgress();
  const unlocked = getUnlockedAchievements();
  window.tamashii.updateAchievements({ progress, unlocked });
}

// --- Lifetime Stats Panel ---
let statsPanelOpen = false;
let statsPanelFade = 0; // 0-1 animation
const STATS_PANEL_FADE_SPEED = 0.06;

function toggleStatsPanel(): void {
  if (minigameActive || memoryGameActive) return; // don't open during mini-game
  // Close other panels if open
  if (diaryPanelOpen) diaryPanelOpen = false;
  if (moodJournalOpen) moodJournalOpen = false;
  if (settingsPanelOpen) settingsPanelOpen = false;
  statsPanelOpen = !statsPanelOpen;
  if (statsPanelOpen) {
    playTone(600, 0.1, "sine", 0.08);
    setTimeout(() => playTone(800, 0.12, "sine", 0.08), 60);
  } else {
    playTone(800, 0.08, "sine", 0.06);
    setTimeout(() => playTone(600, 0.1, "sine", 0.06), 60);
  }
}

window.tamashii.onViewStats(() => {
  toggleStatsPanel();
});

window.tamashii.onViewDiary(() => {
  toggleDiaryPanel();
});

window.tamashii.onTakePhoto(() => {
  takePhoto();
});

window.tamashii.onViewMoodJournal(() => {
  toggleMoodJournal();
});

window.tamashii.onViewSettings(() => {
  toggleSettingsPanel();
});

function formatTime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function getNextStageThreshold(): number | null {
  if (currentGrowthStage === "adult") return null;
  const order: GrowthStage[] = ["baby", "child", "teen", "adult"];
  const idx = order.indexOf(currentGrowthStage);
  return GROWTH_THRESHOLDS[order[idx + 1]];
}

function drawStatsPanel(): void {
  // Animate fade
  if (statsPanelOpen && statsPanelFade < 1) {
    statsPanelFade = Math.min(1, statsPanelFade + STATS_PANEL_FADE_SPEED);
  } else if (!statsPanelOpen && statsPanelFade > 0) {
    statsPanelFade = Math.max(0, statsPanelFade - STATS_PANEL_FADE_SPEED);
  }
  if (statsPanelFade <= 0) return;

  ctx.save();
  ctx.globalAlpha = statsPanelFade;

  const w = canvas.width;
  const h = canvas.height;
  const pad = 8;
  const panelX = pad;
  const panelY = pad;
  const panelW = w - pad * 2;
  const panelH = h - pad * 2;
  const cornerR = 10;

  // Panel background — rounded rect with soft blur
  ctx.beginPath();
  ctx.moveTo(panelX + cornerR, panelY);
  ctx.lineTo(panelX + panelW - cornerR, panelY);
  ctx.quadraticCurveTo(panelX + panelW, panelY, panelX + panelW, panelY + cornerR);
  ctx.lineTo(panelX + panelW, panelY + panelH - cornerR);
  ctx.quadraticCurveTo(panelX + panelW, panelY + panelH, panelX + panelW - cornerR, panelY + panelH);
  ctx.lineTo(panelX + cornerR, panelY + panelH);
  ctx.quadraticCurveTo(panelX, panelY + panelH, panelX, panelY + panelH - cornerR);
  ctx.lineTo(panelX, panelY + cornerR);
  ctx.quadraticCurveTo(panelX, panelY, panelX + cornerR, panelY);
  ctx.closePath();

  // Gradient background
  const bgGrad = ctx.createLinearGradient(panelX, panelY, panelX, panelY + panelH);
  bgGrad.addColorStop(0, "rgba(20, 25, 50, 0.92)");
  bgGrad.addColorStop(1, "rgba(30, 15, 45, 0.92)");
  ctx.fillStyle = bgGrad;
  ctx.fill();

  // Border glow
  ctx.strokeStyle = "rgba(120, 180, 255, 0.5)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Title
  let y = panelY + 20;
  ctx.textAlign = "center";
  ctx.font = "bold 11px monospace";
  ctx.fillStyle = "#e8d48b";
  ctx.shadowColor = "rgba(232, 212, 139, 0.6)";
  ctx.shadowBlur = 6;
  ctx.fillText("LIFETIME STATS", w / 2, y);
  ctx.shadowBlur = 0;

  // Divider line
  y += 6;
  ctx.strokeStyle = "rgba(120, 180, 255, 0.3)";
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(panelX + 12, y);
  ctx.lineTo(panelX + panelW - 12, y);
  ctx.stroke();

  // Growth stage section
  y += 14;
  ctx.textAlign = "left";
  ctx.font = "bold 9px monospace";
  ctx.fillStyle = "#a8c8ff";
  ctx.fillText("GROWTH", panelX + 12, y);
  ctx.textAlign = "right";
  const stageEmojis: Record<GrowthStage, string> = { baby: "🥚", child: "🌱", teen: "🌟", adult: "👑" };
  ctx.fillStyle = "#fff";
  ctx.font = "9px monospace";
  ctx.fillText(`${stageEmojis[currentGrowthStage]} ${GROWTH_STAGE_NAMES[currentGrowthStage]}`, panelX + panelW - 12, y);

  // Progress bar to next stage
  y += 10;
  const barX = panelX + 12;
  const barW = panelW - 24;
  const barH = 6;
  const nextThreshold = getNextStageThreshold();
  const currentThreshold = GROWTH_THRESHOLDS[currentGrowthStage];

  ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
  ctx.fillRect(barX, y, barW, barH);

  if (nextThreshold !== null) {
    const progress = (totalCarePoints - currentThreshold) / (nextThreshold - currentThreshold);
    const fillW = Math.min(1, Math.max(0, progress)) * barW;
    const barGrad = ctx.createLinearGradient(barX, y, barX + barW, y);
    barGrad.addColorStop(0, "#4a9eff");
    barGrad.addColorStop(1, "#a855f7");
    ctx.fillStyle = barGrad;
    ctx.fillRect(barX, y, fillW, barH);
    // Progress label
    y += barH + 9;
    ctx.textAlign = "center";
    ctx.font = "7px monospace";
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.fillText(`${totalCarePoints} / ${nextThreshold} care points`, w / 2, y);
  } else {
    // Max stage — full bar with golden fill
    const barGrad = ctx.createLinearGradient(barX, y, barX + barW, y);
    barGrad.addColorStop(0, "#e8d48b");
    barGrad.addColorStop(1, "#f5c542");
    ctx.fillStyle = barGrad;
    ctx.fillRect(barX, y, barW, barH);
    y += barH + 9;
    ctx.textAlign = "center";
    ctx.font = "7px monospace";
    ctx.fillStyle = "#e8d48b";
    ctx.fillText(`${totalCarePoints} care points (MAX)`, w / 2, y);
  }

  // Divider
  y += 8;
  ctx.strokeStyle = "rgba(120, 180, 255, 0.15)";
  ctx.beginPath();
  ctx.moveTo(panelX + 12, y);
  ctx.lineTo(panelX + panelW - 12, y);
  ctx.stroke();

  // Stats rows
  y += 12;
  const currentSessionMs = Date.now() - sessionStartTime;
  const totalTime = totalSessionTime + currentSessionMs;
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  const stats: [string, string][] = [
    ["Clicks", `${totalClicks}`],
    ["Spins", `${totalSpins}`],
    ["Bounces", `${totalBounces}`],
    ["Best Combo", `${bestCombo}x`],
    ["Star Catcher", `${minigameHighScore}`],
    ["Memory Match", `Round ${memoryGameHighScore}`],
    ["Time Together", formatTime(totalTime)],
    ["Achievements", `${unlockedCount} / ${achievements.length}`],
  ];

  ctx.font = "8px monospace";
  const rowHeight = 13;
  for (const [label, value] of stats) {
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(200, 215, 255, 0.7)";
    ctx.fillText(label, panelX + 14, y);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.fillText(value, panelX + panelW - 14, y);
    y += rowHeight;
  }

  // Current mood row
  y += 2;
  ctx.textAlign = "left";
  ctx.font = "8px monospace";
  ctx.fillStyle = "rgba(200, 215, 255, 0.7)";
  ctx.fillText("Mood", panelX + 14, y);
  ctx.textAlign = "right";
  const moodStr = petHappiness >= 70 ? "Happy" : petHappiness >= 40 ? "Content" : "Sad";
  const moodColor = petHappiness >= 70 ? "#6ee77a" : petHappiness >= 40 ? "#e8d48b" : "#ff7a7a";
  ctx.fillStyle = moodColor;
  ctx.fillText(moodStr, panelX + panelW - 14, y);

  // Personality row
  if (petPersonality) {
    y += rowHeight;
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(200, 215, 255, 0.7)";
    ctx.fillText("Personality", panelX + 14, y);
    ctx.textAlign = "right";
    ctx.fillStyle = "#c4a0ff";
    ctx.fillText(`${PERSONALITY_ICONS[petPersonality]} ${PERSONALITY_NAMES[petPersonality]}`, panelX + panelW - 14, y);
    // Description on next line
    y += 9;
    ctx.textAlign = "center";
    ctx.font = "7px monospace";
    ctx.fillStyle = "rgba(200, 180, 255, 0.5)";
    ctx.fillText(PERSONALITY_DESCRIPTIONS[petPersonality], w / 2, y);
  }

  // Friendship section
  y += 10;
  ctx.strokeStyle = "rgba(120, 180, 255, 0.15)";
  ctx.beginPath();
  ctx.moveTo(panelX + 12, y);
  ctx.lineTo(panelX + panelW - 12, y);
  ctx.stroke();
  y += 12;
  ctx.textAlign = "left";
  ctx.font = "bold 9px monospace";
  ctx.fillStyle = "#ffb0d0";
  ctx.fillText("FRIENDSHIP", panelX + 12, y);
  const fLevel = getFriendshipLevel();
  ctx.textAlign = "right";
  ctx.font = "9px monospace";
  ctx.fillStyle = fLevel >= 50 ? "#FFD700" : fLevel >= 25 ? "#ff80b0" : "#fff";
  ctx.fillText(`💕 Level ${fLevel}`, panelX + panelW - 12, y);

  // Friendship progress bar
  y += 10;
  const fBarX = panelX + 12;
  const fBarW = panelW - 24;
  const fBarH = 6;
  ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
  ctx.fillRect(fBarX, y, fBarW, fBarH);
  if (fLevel < 100) {
    const currentXPForLevel = fLevel * fLevel * 5;
    const nextXPForLevel = (fLevel + 1) * (fLevel + 1) * 5;
    const fProgress = (friendshipXP - currentXPForLevel) / (nextXPForLevel - currentXPForLevel);
    const fFillW = Math.min(1, Math.max(0, fProgress)) * fBarW;
    const fBarGrad = ctx.createLinearGradient(fBarX, y, fBarX + fBarW, y);
    fBarGrad.addColorStop(0, "#ff69b4");
    fBarGrad.addColorStop(1, "#FFD700");
    ctx.fillStyle = fBarGrad;
    ctx.fillRect(fBarX, y, fFillW, fBarH);
  } else {
    const fBarGrad = ctx.createLinearGradient(fBarX, y, fBarX + fBarW, y);
    fBarGrad.addColorStop(0, "#FFD700");
    fBarGrad.addColorStop(1, "#FFA500");
    ctx.fillStyle = fBarGrad;
    ctx.fillRect(fBarX, y, fBarW, fBarH);
  }
  y += fBarH + 9;
  ctx.textAlign = "center";
  ctx.font = "7px monospace";
  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  if (fLevel < 100) {
    ctx.fillText(`${friendshipXP} / ${(fLevel + 1) * (fLevel + 1) * 5} XP`, w / 2, y);
  } else {
    ctx.fillText(`${friendshipXP} XP (MAX)`, w / 2, y);
  }
  // Streak info
  if (consecutiveDays > 1) {
    y += 10;
    ctx.fillStyle = "#e8d48b";
    ctx.fillText(`🔥 ${consecutiveDays}-day visit streak!`, w / 2, y);
  }

  // Weather section
  y += 14;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.beginPath();
  ctx.moveTo(panelX + 12, y);
  ctx.lineTo(panelX + panelW - 12, y);
  ctx.stroke();
  y += 12;
  ctx.textAlign = "left";
  ctx.font = "bold 9px monospace";
  ctx.fillStyle = "#90c8ff";
  ctx.fillText("WEATHER", panelX + 12, y);
  ctx.textAlign = "right";
  ctx.font = "9px monospace";
  ctx.fillStyle = "#fff";
  ctx.fillText(`${WEATHER_ICONS[currentWeather]} ${WEATHER_NAMES[currentWeather]}`, panelX + panelW - 12, y);
  y += 12;
  ctx.textAlign = "center";
  ctx.font = "7px monospace";
  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  ctx.fillText(`${weatherTypesSeen.size}/7 weather types seen`, w / 2, y);

  // Trick Combos section
  y += 14;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.beginPath();
  ctx.moveTo(panelX + 12, y);
  ctx.lineTo(panelX + panelW - 12, y);
  ctx.stroke();
  y += 12;
  ctx.textAlign = "left";
  ctx.font = "bold 9px monospace";
  ctx.fillStyle = "#ffcc70";
  ctx.fillText("TRICK COMBOS", panelX + 12, y);
  ctx.textAlign = "right";
  ctx.font = "9px monospace";
  ctx.fillStyle = "#fff";
  ctx.fillText(`${combosDiscovered.size}/${TRICK_COMBOS.length} found`, panelX + panelW - 12, y);
  y += 12;
  ctx.textAlign = "center";
  ctx.font = "7px monospace";
  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  ctx.fillText(`${totalTrickCombos} total combos performed`, w / 2, y);

  // Sleep schedule section
  y += 16;
  ctx.textAlign = "left";
  ctx.font = "bold 9px monospace";
  ctx.fillStyle = "#b0a0e0";
  ctx.fillText("SLEEP", panelX + 12, y);
  ctx.textAlign = "right";
  ctx.font = "9px monospace";
  ctx.fillStyle = "#fff";
  ctx.fillText(isSleeping ? "💤 Sleeping" : "☀️ Awake", panelX + panelW - 12, y);
  y += 12;
  ctx.textAlign = "center";
  ctx.font = "7px monospace";
  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  ctx.fillText(`${totalNightsSlept} nights slept`, w / 2, y);

  // Bubbles section
  y += 14;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.beginPath();
  ctx.moveTo(panelX + 12, y);
  ctx.lineTo(panelX + panelW - 12, y);
  ctx.stroke();
  y += 12;
  ctx.textAlign = "left";
  ctx.font = "bold 9px monospace";
  ctx.fillStyle = "#80d0f0";
  ctx.fillText("BUBBLES", panelX + 12, y);
  ctx.textAlign = "right";
  ctx.font = "9px monospace";
  ctx.fillStyle = "#fff";
  ctx.fillText(`🫧 ${totalBubblesPopped} popped`, panelX + panelW - 12, y);

  // Fortune Cookies section
  y += 14;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.beginPath();
  ctx.moveTo(panelX + 12, y);
  ctx.lineTo(panelX + panelW - 12, y);
  ctx.stroke();
  y += 12;
  ctx.textAlign = "left";
  ctx.font = "bold 9px monospace";
  ctx.fillStyle = "#e8b84b";
  ctx.fillText("FORTUNES", panelX + 12, y);
  ctx.textAlign = "right";
  ctx.font = "9px monospace";
  ctx.fillStyle = "#fff";
  ctx.fillText(`🥠 ${uniqueFortunesCollected.size}/${FORTUNE_MESSAGES.length} collected`, panelX + panelW - 12, y);
  y += 12;
  ctx.textAlign = "center";
  ctx.font = "7px monospace";
  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  ctx.fillText(`${totalFortuneCookies} cookies opened`, w / 2, y);

  // Fireflies section
  y += 14;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.beginPath();
  ctx.moveTo(panelX + 12, y);
  ctx.lineTo(panelX + panelW - 12, y);
  ctx.stroke();
  y += 12;
  ctx.textAlign = "left";
  ctx.font = "bold 9px monospace";
  ctx.fillStyle = "#b8e060";
  ctx.fillText("FIREFLIES", panelX + 12, y);
  ctx.textAlign = "right";
  ctx.font = "9px monospace";
  ctx.fillStyle = "#fff";
  ctx.fillText(`🪲 ${totalFirefliesCaught} caught`, panelX + panelW - 12, y);
  y += 12;
  ctx.textAlign = "center";
  ctx.font = "7px monospace";
  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  ctx.fillText(`${sessionFirefliesCaught} this session`, w / 2, y);

  // Constellations section
  y += 14;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.beginPath();
  ctx.moveTo(panelX + 12, y);
  ctx.lineTo(panelX + panelW - 12, y);
  ctx.stroke();
  y += 12;
  ctx.textAlign = "left";
  ctx.font = "bold 9px monospace";
  ctx.fillStyle = "#a0c0ff";
  ctx.fillText("CONSTELLATIONS", panelX + 12, y);
  ctx.textAlign = "right";
  ctx.font = "9px monospace";
  ctx.fillStyle = "#fff";
  ctx.fillText(`🌌 ${completedConstellations.size}/${CONSTELLATION_PATTERNS.length} discovered`, panelX + panelW - 12, y);

  // Shooting Stars / Wishes section
  y += 14;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.beginPath();
  ctx.moveTo(panelX + 12, y);
  ctx.lineTo(panelX + panelW - 12, y);
  ctx.stroke();
  y += 12;
  ctx.textAlign = "left";
  ctx.font = "bold 9px monospace";
  ctx.fillStyle = "#f0d060";
  ctx.fillText("SHOOTING STARS", panelX + 12, y);
  ctx.textAlign = "right";
  ctx.font = "9px monospace";
  ctx.fillStyle = "#fff";
  ctx.fillText(`🌠 ${totalWishesMade} wishes made`, panelX + panelW - 12, y);
  y += 12;
  ctx.textAlign = "center";
  ctx.font = "7px monospace";
  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  ctx.fillText(`${sessionShootingStarsSeen} seen this session`, w / 2, y);

  // Morning Dew Drops section
  y += 14;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.beginPath();
  ctx.moveTo(panelX + 12, y);
  ctx.lineTo(panelX + panelW - 12, y);
  ctx.stroke();
  y += 12;
  ctx.textAlign = "left";
  ctx.font = "bold 9px monospace";
  ctx.fillStyle = "#88ccee";
  ctx.fillText("MORNING DEW", panelX + 12, y);
  ctx.textAlign = "right";
  ctx.font = "9px monospace";
  ctx.fillStyle = "#fff";
  ctx.fillText(`💧 ${totalDewDropsCollected} collected`, panelX + panelW - 12, y);
  y += 12;
  ctx.textAlign = "center";
  ctx.font = "7px monospace";
  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  ctx.fillText(`${sessionDewDropsCollected} this session`, w / 2, y);

  // --- BEDTIME STORIES section ---
  ctx.beginPath();
  ctx.moveTo(panelX + 20, y + 6);
  ctx.lineTo(panelX + panelW - 20, y + 6);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.lineWidth = 0.5;
  ctx.stroke();
  y += 12;
  ctx.textAlign = "left";
  ctx.font = "bold 9px monospace";
  ctx.fillStyle = "#d4a0ff";
  ctx.fillText("BEDTIME STORIES", panelX + 12, y);
  ctx.textAlign = "right";
  ctx.font = "9px monospace";
  ctx.fillStyle = "#fff";
  ctx.fillText(`📖 ${totalStoriesRead} read`, panelX + panelW - 12, y);
  y += 12;
  ctx.textAlign = "center";
  ctx.font = "7px monospace";
  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  ctx.fillText(`${uniqueStoriesRead.size}/${BEDTIME_STORIES.length} unique stories discovered`, w / 2, y);

  // --- MESSAGE BOTTLES section ---
  ctx.beginPath();
  ctx.moveTo(panelX + 20, y + 6);
  ctx.lineTo(panelX + panelW - 20, y + 6);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.lineWidth = 0.5;
  ctx.stroke();
  y += 12;
  ctx.textAlign = "left";
  ctx.font = "bold 9px monospace";
  ctx.fillStyle = "#80d8a0";
  ctx.fillText("MESSAGE BOTTLES", panelX + 12, y);
  ctx.textAlign = "right";
  ctx.font = "9px monospace";
  ctx.fillStyle = "#fff";
  ctx.fillText(`🍾 ${totalBottlesOpened} opened`, panelX + panelW - 12, y);
  y += 12;
  ctx.textAlign = "center";
  ctx.font = "7px monospace";
  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  ctx.fillText(`${sessionBottlesOpened} found this session`, w / 2, y);

  // Close hint
  ctx.textAlign = "center";
  ctx.font = "7px monospace";
  ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
  ctx.fillText("right-click to close", w / 2, panelY + panelH - 6);

  ctx.restore();
}

// --- Diary Panel ---
function drawDiaryPanel(): void {
  // Animate fade
  if (diaryPanelOpen && diaryPanelFade < 1) {
    diaryPanelFade = Math.min(1, diaryPanelFade + DIARY_PANEL_FADE_SPEED);
  } else if (!diaryPanelOpen && diaryPanelFade > 0) {
    diaryPanelFade = Math.max(0, diaryPanelFade - DIARY_PANEL_FADE_SPEED);
  }
  if (diaryPanelFade <= 0) return;

  ctx.save();
  ctx.globalAlpha = diaryPanelFade;

  const w = canvas.width;
  const h = canvas.height;
  const pad = 8;
  const panelX = pad;
  const panelY = pad;
  const panelW = w - pad * 2;
  const panelH = h - pad * 2;
  const cornerR = 10;

  // Panel background — rounded rect
  ctx.beginPath();
  ctx.moveTo(panelX + cornerR, panelY);
  ctx.lineTo(panelX + panelW - cornerR, panelY);
  ctx.quadraticCurveTo(panelX + panelW, panelY, panelX + panelW, panelY + cornerR);
  ctx.lineTo(panelX + panelW, panelY + panelH - cornerR);
  ctx.quadraticCurveTo(panelX + panelW, panelY + panelH, panelX + panelW - cornerR, panelY + panelH);
  ctx.lineTo(panelX + cornerR, panelY + panelH);
  ctx.quadraticCurveTo(panelX, panelY + panelH, panelX, panelY + panelH - cornerR);
  ctx.lineTo(panelX, panelY + cornerR);
  ctx.quadraticCurveTo(panelX, panelY, panelX + cornerR, panelY);
  ctx.closePath();

  // Warm gradient background (different from stats panel)
  const bgGrad = ctx.createLinearGradient(panelX, panelY, panelX, panelY + panelH);
  bgGrad.addColorStop(0, "rgba(35, 20, 45, 0.94)");
  bgGrad.addColorStop(1, "rgba(20, 25, 40, 0.94)");
  ctx.fillStyle = bgGrad;
  ctx.fill();

  // Border glow — warm amber
  ctx.strokeStyle = "rgba(232, 180, 100, 0.5)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Clip to panel for entries
  ctx.save();
  ctx.clip();

  // Title
  let y = panelY + 20;
  ctx.textAlign = "center";
  ctx.font = "bold 11px monospace";
  ctx.fillStyle = "#e8c87b";
  ctx.shadowColor = "rgba(232, 200, 123, 0.6)";
  ctx.shadowBlur = 6;
  ctx.fillText("PET DIARY", w / 2, y);
  ctx.shadowBlur = 0;

  // Divider line
  y += 6;
  ctx.strokeStyle = "rgba(232, 180, 100, 0.3)";
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(panelX + 12, y);
  ctx.lineTo(panelX + panelW - 12, y);
  ctx.stroke();

  y += 8;

  // Entry area
  const entryAreaTop = y;
  const entryAreaBottom = panelY + panelH - 18;
  const entryHeight = 28; // height per diary entry
  const maxVisibleEntries = Math.floor((entryAreaBottom - entryAreaTop) / entryHeight);

  if (petDiary.length === 0) {
    ctx.textAlign = "center";
    ctx.font = "8px monospace";
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.fillText("No entries yet...", w / 2, entryAreaTop + 20);
    ctx.fillText("Your pet's story will be", w / 2, entryAreaTop + 34);
    ctx.fillText("written here!", w / 2, entryAreaTop + 48);
  } else {
    // Show entries in reverse chronological order (newest first)
    const entries = [...petDiary].reverse();
    // Clamp scroll offset
    const maxScroll = Math.max(0, entries.length - maxVisibleEntries);
    diaryScrollOffset = Math.max(0, Math.min(diaryScrollOffset, maxScroll));

    for (let i = 0; i < maxVisibleEntries && i + diaryScrollOffset < entries.length; i++) {
      const entry = entries[i + diaryScrollOffset];
      const entryY = entryAreaTop + i * entryHeight;

      // Date label
      ctx.textAlign = "left";
      ctx.font = "6px monospace";
      ctx.fillStyle = "rgba(200, 180, 140, 0.5)";
      ctx.fillText(formatDiaryDate(entry.timestamp), panelX + 14, entryY + 2);

      // Icon + text
      ctx.font = "8px monospace";
      ctx.fillStyle = "#fff";
      // Truncate text to fit panel width
      const maxTextWidth = panelW - 42;
      let displayText = `${entry.icon} ${entry.text}`;
      while (ctx.measureText(displayText).width > maxTextWidth && displayText.length > 10) {
        displayText = displayText.slice(0, -4) + "...";
      }
      ctx.fillText(displayText, panelX + 14, entryY + 14);

      // Subtle divider between entries
      if (i < maxVisibleEntries - 1 && i + diaryScrollOffset < entries.length - 1) {
        ctx.strokeStyle = "rgba(200, 180, 140, 0.1)";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(panelX + 20, entryY + entryHeight - 2);
        ctx.lineTo(panelX + panelW - 20, entryY + entryHeight - 2);
        ctx.stroke();
      }
    }

    // Scroll indicators
    if (diaryScrollOffset > 0) {
      ctx.textAlign = "center";
      ctx.font = "8px monospace";
      ctx.fillStyle = "rgba(232, 200, 123, 0.6)";
      ctx.fillText("▲ newer", w / 2, entryAreaTop - 2);
    }
    if (diaryScrollOffset < maxScroll) {
      ctx.textAlign = "center";
      ctx.font = "8px monospace";
      ctx.fillStyle = "rgba(232, 200, 123, 0.6)";
      ctx.fillText("▼ older", w / 2, entryAreaBottom + 2);
    }
  }

  ctx.restore(); // restore clip

  // Entry count and close hint
  ctx.textAlign = "center";
  ctx.font = "7px monospace";
  ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
  ctx.fillText(`${petDiary.length} entries — right-click to close`, w / 2, panelY + panelH - 6);

  ctx.restore();
}

// --- Mood Journal Panel ---
function drawMoodJournal(): void {
  // Animate fade
  if (moodJournalOpen && moodJournalFade < 1) {
    moodJournalFade = Math.min(1, moodJournalFade + MOOD_JOURNAL_FADE_SPEED);
  } else if (!moodJournalOpen && moodJournalFade > 0) {
    moodJournalFade = Math.max(0, moodJournalFade - MOOD_JOURNAL_FADE_SPEED);
  }
  if (moodJournalFade <= 0) return;

  ctx.save();
  ctx.globalAlpha = moodJournalFade;

  const w = canvas.width;
  const h = canvas.height;
  const panelX = 8;
  const panelY = 8;
  const panelW = w - 16;
  const panelH = h - 16;

  // Dark glass background with teal/green gradient
  const bgGrad = ctx.createLinearGradient(panelX, panelY, panelX, panelY + panelH);
  bgGrad.addColorStop(0, "rgba(15, 35, 40, 0.94)");
  bgGrad.addColorStop(1, "rgba(10, 20, 30, 0.96)");
  ctx.fillStyle = bgGrad;
  ctx.beginPath();
  ctx.roundRect(panelX, panelY, panelW, panelH, 10);
  ctx.fill();

  // Border glow
  ctx.strokeStyle = `rgba(100, 220, 180, ${0.5 * moodJournalFade})`;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Title
  ctx.fillStyle = "#64DCB4";
  ctx.font = "bold 11px monospace";
  ctx.textAlign = "center";
  ctx.shadowColor = "rgba(100, 220, 180, 0.4)";
  ctx.shadowBlur = 6;
  ctx.fillText("📈 MOOD JOURNAL", w / 2, panelY + 20);
  ctx.shadowBlur = 0;

  if (moodSnapshots.length < 2) {
    // Not enough data yet
    ctx.fillStyle = "rgba(200, 220, 210, 0.7)";
    ctx.font = "9px monospace";
    ctx.fillText("Collecting mood data...", w / 2, h / 2 - 10);
    ctx.font = "8px monospace";
    ctx.fillStyle = "rgba(160, 180, 170, 0.5)";
    ctx.fillText("Snapshots every 10 minutes", w / 2, h / 2 + 8);
    ctx.fillText(`${moodSnapshots.length}/2 needed for graph`, w / 2, h / 2 + 22);
    ctx.fillStyle = "rgba(160, 180, 170, 0.4)";
    ctx.font = "7px monospace";
    ctx.fillText("Press J or right-click to close", w / 2, panelY + panelH - 8);
    ctx.restore();
    return;
  }

  // Graph area
  const graphX = panelX + 28;
  const graphY = panelY + 34;
  const graphW = panelW - 38;
  const graphH = panelH - 74;

  // Determine visible window: show up to 24 data points (4 hours) at a time
  const visibleCount = Math.min(24, moodSnapshots.length);
  const maxScroll = Math.max(0, moodSnapshots.length - visibleCount);
  moodJournalScrollOffset = Math.max(0, Math.min(maxScroll, moodJournalScrollOffset));
  const startIdx = moodSnapshots.length - visibleCount - moodJournalScrollOffset;
  const endIdx = startIdx + visibleCount;
  const visibleSnapshots = moodSnapshots.slice(startIdx, endIdx);

  // Y-axis labels (0, 50, 100)
  ctx.fillStyle = "rgba(180, 200, 190, 0.4)";
  ctx.font = "7px monospace";
  ctx.textAlign = "right";
  ctx.fillText("100", graphX - 3, graphY + 4);
  ctx.fillText("50", graphX - 3, graphY + graphH / 2 + 2);
  ctx.fillText("0", graphX - 3, graphY + graphH + 4);

  // Grid lines
  ctx.strokeStyle = "rgba(100, 140, 130, 0.15)";
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= 4; i++) {
    const gy = graphY + (graphH * i) / 4;
    ctx.beginPath();
    ctx.moveTo(graphX, gy);
    ctx.lineTo(graphX + graphW, gy);
    ctx.stroke();
  }

  // Draw lines for each stat
  const stats: { key: keyof MoodSnapshot; color: string; label: string; icon: string }[] = [
    { key: "happiness", color: "#FF6B9D", label: "Happy", icon: "💖" },
    { key: "hunger", color: "#6BDB7B", label: "Hunger", icon: "🍎" },
    { key: "energy", color: "#FFD93D", label: "Energy", icon: "⚡" },
  ];

  for (const stat of stats) {
    ctx.strokeStyle = stat.color;
    ctx.lineWidth = 1.8;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    for (let i = 0; i < visibleSnapshots.length; i++) {
      const x = graphX + (i / (visibleSnapshots.length - 1)) * graphW;
      const val = visibleSnapshots[i][stat.key] as number;
      const y = graphY + graphH - (val / 100) * graphH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Glow effect
    ctx.save();
    ctx.strokeStyle = stat.color;
    ctx.globalAlpha = 0.2 * moodJournalFade;
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.restore();
    ctx.globalAlpha = moodJournalFade;

    // Draw dots at data points
    for (let i = 0; i < visibleSnapshots.length; i++) {
      const x = graphX + (i / (visibleSnapshots.length - 1)) * graphW;
      const val = visibleSnapshots[i][stat.key] as number;
      const y = graphY + graphH - (val / 100) * graphH;
      ctx.fillStyle = stat.color;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Time labels along bottom
  ctx.fillStyle = "rgba(180, 200, 190, 0.45)";
  ctx.font = "6px monospace";
  ctx.textAlign = "center";
  const labelCount = Math.min(5, visibleSnapshots.length);
  for (let i = 0; i < labelCount; i++) {
    const idx = Math.floor((i / (labelCount - 1)) * (visibleSnapshots.length - 1));
    const x = graphX + (idx / (visibleSnapshots.length - 1)) * graphW;
    const d = new Date(visibleSnapshots[idx].timestamp);
    const hh = d.getHours();
    const mm = d.getMinutes().toString().padStart(2, "0");
    const ampm = hh >= 12 ? "p" : "a";
    const h12 = hh % 12 || 12;
    ctx.fillText(`${h12}:${mm}${ampm}`, x, graphY + graphH + 11);
  }

  // Legend
  const legendY = graphY + graphH + 22;
  ctx.font = "7px monospace";
  let legendX = panelX + 18;
  for (const stat of stats) {
    ctx.fillStyle = stat.color;
    ctx.fillRect(legendX, legendY - 4, 8, 3);
    ctx.fillStyle = "rgba(200, 220, 210, 0.7)";
    ctx.textAlign = "left";
    ctx.fillText(`${stat.icon}${stat.label}`, legendX + 11, legendY);
    legendX += 52;
  }

  // Current values display
  const currentY = legendY + 13;
  ctx.font = "7px monospace";
  ctx.textAlign = "center";
  const latestSnap = visibleSnapshots[visibleSnapshots.length - 1];
  ctx.fillStyle = "#FF6B9D";
  ctx.fillText(`${latestSnap.happiness}%`, panelX + panelW * 0.2, currentY);
  ctx.fillStyle = "#6BDB7B";
  ctx.fillText(`${latestSnap.hunger}%`, panelX + panelW * 0.5, currentY);
  ctx.fillStyle = "#FFD93D";
  ctx.fillText(`${latestSnap.energy}%`, panelX + panelW * 0.8, currentY);

  // Scroll indicators
  if (moodJournalScrollOffset < maxScroll) {
    ctx.fillStyle = "rgba(100, 220, 180, 0.5)";
    ctx.font = "8px monospace";
    ctx.textAlign = "left";
    ctx.fillText("◀ older", panelX + 10, graphY + graphH / 2);
  }
  if (moodJournalScrollOffset > 0) {
    ctx.fillStyle = "rgba(100, 220, 180, 0.5)";
    ctx.font = "8px monospace";
    ctx.textAlign = "right";
    ctx.fillText("newer ▶", panelX + panelW - 10, graphY + graphH / 2);
  }

  // Footer
  ctx.fillStyle = "rgba(160, 180, 170, 0.4)";
  ctx.font = "7px monospace";
  ctx.textAlign = "center";
  ctx.fillText(`${moodSnapshots.length} snapshots — scroll to browse — J to close`, w / 2, panelY + panelH - 6);

  ctx.restore();
}

// --- Persistent Save/Load ---
interface SaveData {
  totalClicks: number;
  totalSpins: number;
  totalBounces: number;
  stressSurvivedCount: number;
  totalSessionTime: number; // accumulated ms across all sessions
  unlockedAchievements: string[]; // achievement IDs
  soundEnabled: boolean;
  petName: string;
  accessory: string;
  minigameHighScore: number;
  petHunger: number;
  petHappiness: number;
  petEnergy: number;
  lastStatSaveTime: number; // timestamp for calculating offline decay
  bestCombo: number;
  totalCarePoints: number;
  memoryGameHighScore: number;
  personality: string | null;
  diary: DiaryEntry[];
  totalPhotos: number;
  colorPalette: string;
  notificationsEnabled: boolean;
  careAfterNotifCount: number;
  currentToy: string;
  totalToyPlays: number;
  trickProgress: Record<string, number>;
  moodSnapshots: MoodSnapshot[];
  settingsPanelOpenCount: number;
  totalEmotesTriggered: number;
  friendshipXP: number;
  consecutiveDays: number;
  lastVisitDate: string;
  weatherTypesSeen: string[];
  currentWeather: string;
  totalTrickCombos: number;
  combosDiscovered: string[];
  totalNightsSlept: number;
  lastSleepDate: string;
  totalBubblesPopped: number;
  totalFortuneCookies: number;
  uniqueFortunesCollected: number[];
  totalFirefliesCaught: number;
  completedConstellations: number[];
  totalConstellationsCompleted: number;
  totalWishesMade: number;
  totalDewDropsCollected: number;
  totalStoriesRead: number;
  uniqueStoriesRead: number[];
  totalBottlesOpened: number;
  version: number;
}

let totalSessionTime = 0; // accumulated from previous sessions
let saveTimer = 0;
const SAVE_INTERVAL = 600; // save every ~10 seconds (600 frames at 60fps)

function buildSaveData(): SaveData {
  const currentSessionMs = Date.now() - sessionStartTime;
  return {
    totalClicks,
    totalSpins,
    totalBounces,
    stressSurvivedCount,
    totalSessionTime: totalSessionTime + currentSessionMs,
    unlockedAchievements: achievements.filter(a => a.unlocked).map(a => a.id),
    soundEnabled,
    petName,
    accessory: currentAccessory,
    minigameHighScore,
    petHunger,
    petHappiness,
    petEnergy,
    lastStatSaveTime: Date.now(),
    bestCombo,
    totalCarePoints,
    memoryGameHighScore,
    personality: petPersonality,
    diary: petDiary,
    totalPhotos,
    colorPalette: currentColorPalette,
    notificationsEnabled,
    careAfterNotifCount,
    currentToy,
    totalToyPlays,
    trickProgress: { ...trickProgress },
    moodSnapshots: moodSnapshots.slice(-MOOD_JOURNAL_MAX_SNAPSHOTS),
    settingsPanelOpenCount,
    totalEmotesTriggered,
    friendshipXP,
    consecutiveDays,
    lastVisitDate,
    weatherTypesSeen: Array.from(weatherTypesSeen),
    currentWeather,
    totalTrickCombos,
    combosDiscovered: Array.from(combosDiscovered),
    totalNightsSlept,
    lastSleepDate,
    totalBubblesPopped,
    totalFortuneCookies,
    uniqueFortunesCollected: Array.from(uniqueFortunesCollected),
    totalFirefliesCaught,
    completedConstellations: Array.from(completedConstellations),
    totalConstellationsCompleted,
    totalWishesMade,
    totalDewDropsCollected,
    totalStoriesRead,
    uniqueStoriesRead: Array.from(uniqueStoriesRead),
    totalBottlesOpened,
    version: 1,
  };
}

function applySaveData(data: SaveData): void {
  totalClicks = data.totalClicks || 0;
  totalSpins = data.totalSpins || 0;
  totalBounces = data.totalBounces || 0;
  stressSurvivedCount = data.stressSurvivedCount || 0;
  totalSessionTime = data.totalSessionTime || 0;

  // Restore sound preference
  if (typeof data.soundEnabled === "boolean") {
    soundEnabled = data.soundEnabled;
  }

  // Restore pet name
  if (data.petName) {
    petName = data.petName;
  }

  // Restore accessory
  if (data.accessory) {
    currentAccessory = data.accessory as AccessoryType;
  }

  // Restore mini-game high score
  if (data.minigameHighScore) {
    minigameHighScore = data.minigameHighScore;
  }

  // Restore best combo
  if (data.bestCombo) {
    bestCombo = data.bestCombo;
  }

  // Restore memory game high score
  if (data.memoryGameHighScore) {
    memoryGameHighScore = data.memoryGameHighScore;
  }

  // Restore care points and growth stage
  if (typeof data.totalCarePoints === "number") {
    totalCarePoints = data.totalCarePoints;
  } else {
    // Migrate from existing stats for players who already have progress
    totalCarePoints = (data.totalClicks || 0) + (data.totalSpins || 0) * 3 + (data.totalBounces || 0);
  }
  currentGrowthStage = getGrowthStage(totalCarePoints);
  previousGrowthStage = currentGrowthStage; // don't celebrate on load

  // Restore or assign personality
  const validPersonalities: Personality[] = ["shy", "energetic", "curious", "sleepy", "gluttonous"];
  if (data.personality && validPersonalities.includes(data.personality as Personality)) {
    petPersonality = data.personality as Personality;
  } else {
    // First time — assign a random personality
    petPersonality = assignPersonality();
  }

  // Restore pet stats with offline decay
  if (typeof data.petHunger === "number") {
    petHunger = data.petHunger;
    petHappiness = data.petHappiness || 80;
    petEnergy = data.petEnergy || 80;

    // Apply offline decay since last save
    if (data.lastStatSaveTime) {
      const offlineMinutes = (Date.now() - data.lastStatSaveTime) / 60000;
      // Cap offline decay so the pet doesn't fully starve while you're away (max ~8 hours worth)
      const cappedMinutes = Math.min(offlineMinutes, 480);
      petHunger = Math.max(5, petHunger - cappedMinutes * 0.33);
      petHappiness = Math.max(5, petHappiness - cappedMinutes * 0.2);
      // Energy: assume it partially recharged if it was nighttime
      petEnergy = Math.max(5, petEnergy - cappedMinutes * 0.1);
    }
    lastStatDecayTime = Date.now();
  }

  // Restore photo count
  if (typeof data.totalPhotos === "number") {
    totalPhotos = data.totalPhotos;
  }

  // Restore color palette
  if (data.colorPalette && COLOR_PALETTES.some(p => p.id === data.colorPalette)) {
    currentColorPalette = data.colorPalette as ColorPaletteId;
  }

  // Restore notifications preference
  if (typeof data.notificationsEnabled === "boolean") {
    notificationsEnabled = data.notificationsEnabled;
  }

  // Restore care-after-notification count
  if (typeof data.careAfterNotifCount === "number") {
    careAfterNotifCount = data.careAfterNotifCount;
  }

  // Restore toy
  const validToys: ToyType[] = ["none", "ball", "yarn", "plush", "bone"];
  if (data.currentToy && validToys.includes(data.currentToy as ToyType)) {
    currentToy = data.currentToy as ToyType;
    if (currentToy !== "none") {
      toyX = canvas.width / 2 + 50;
      toyY = canvas.height / 2 + 35;
      toyPlayTimer = TOY_PLAY_INTERVAL_MIN + Math.floor(Math.random() * (TOY_PLAY_INTERVAL_MAX - TOY_PLAY_INTERVAL_MIN));
    }
  }
  if (typeof data.totalToyPlays === "number") {
    totalToyPlays = data.totalToyPlays;
  }

  // Restore trick progress
  if (data.trickProgress && typeof data.trickProgress === "object") {
    const validTricks: TrickId[] = ["wave", "dance", "backflip", "twirl"];
    for (const tid of validTricks) {
      const val = (data.trickProgress as Record<string, number>)[tid];
      if (typeof val === "number") {
        trickProgress[tid] = Math.min(TRICK_PRACTICES_TO_MASTER, Math.max(0, val));
      }
    }
    // Initialize auto timer if any tricks are mastered
    if (getMasteredTricks().length > 0) {
      trickAutoTimer = TRICK_AUTO_MIN + Math.floor(Math.random() * (TRICK_AUTO_MAX - TRICK_AUTO_MIN));
    }
  }

  // Restore mood snapshots
  if (Array.isArray(data.moodSnapshots)) {
    moodSnapshots = data.moodSnapshots.slice(-MOOD_JOURNAL_MAX_SNAPSHOTS);
    if (moodSnapshots.length > 0) {
      lastMoodSnapshotTime = moodSnapshots[moodSnapshots.length - 1].timestamp;
    }
  }

  // Restore settings panel open count
  if (typeof data.settingsPanelOpenCount === "number") {
    settingsPanelOpenCount = data.settingsPanelOpenCount;
  }

  // Restore emotes triggered count
  if (typeof (data as SaveData).totalEmotesTriggered === "number") {
    totalEmotesTriggered = (data as SaveData).totalEmotesTriggered;
  }

  // Restore friendship meter
  if (typeof (data as SaveData).friendshipXP === "number") {
    friendshipXP = (data as SaveData).friendshipXP;
  }
  if (typeof (data as SaveData).consecutiveDays === "number") {
    consecutiveDays = (data as SaveData).consecutiveDays;
  }
  if (typeof (data as SaveData).lastVisitDate === "string") {
    lastVisitDate = (data as SaveData).lastVisitDate;
  }

  // Restore weather
  if (Array.isArray((data as SaveData).weatherTypesSeen)) {
    weatherTypesSeen = new Set((data as SaveData).weatherTypesSeen);
  }
  const validWeathers: WeatherType[] = ["sunny", "cloudy", "rainy", "stormy", "snowy", "windy", "foggy"];
  if ((data as SaveData).currentWeather && validWeathers.includes((data as SaveData).currentWeather as WeatherType)) {
    currentWeather = (data as SaveData).currentWeather as WeatherType;
  }

  // Restore trick combos
  if (typeof (data as SaveData).totalTrickCombos === "number") {
    totalTrickCombos = (data as SaveData).totalTrickCombos;
  }
  if (Array.isArray((data as SaveData).combosDiscovered)) {
    combosDiscovered = new Set((data as SaveData).combosDiscovered);
  }

  // Restore sleep schedule data
  if (typeof (data as SaveData).totalNightsSlept === "number") {
    totalNightsSlept = (data as SaveData).totalNightsSlept;
  }
  if (typeof (data as SaveData).lastSleepDate === "string") {
    lastSleepDate = (data as SaveData).lastSleepDate;
  }

  // Restore bubbles popped
  if (typeof (data as SaveData).totalBubblesPopped === "number") {
    totalBubblesPopped = (data as SaveData).totalBubblesPopped;
  }

  // Restore fortune cookies
  if (typeof (data as SaveData).totalFortuneCookies === "number") {
    totalFortuneCookies = (data as SaveData).totalFortuneCookies;
  }
  if (Array.isArray((data as SaveData).uniqueFortunesCollected)) {
    uniqueFortunesCollected = new Set((data as SaveData).uniqueFortunesCollected);
  }

  // Restore fireflies caught
  if (typeof (data as SaveData).totalFirefliesCaught === "number") {
    totalFirefliesCaught = (data as SaveData).totalFirefliesCaught;
  }

  // Restore constellations
  if (Array.isArray((data as SaveData).completedConstellations)) {
    completedConstellations = new Set((data as SaveData).completedConstellations);
  }
  if (typeof (data as SaveData).totalConstellationsCompleted === "number") {
    totalConstellationsCompleted = (data as SaveData).totalConstellationsCompleted;
  }

  // Restore wishes made
  if (typeof (data as SaveData).totalWishesMade === "number") {
    totalWishesMade = (data as SaveData).totalWishesMade;
  }

  // Restore dew drops collected
  if (typeof (data as SaveData).totalDewDropsCollected === "number") {
    totalDewDropsCollected = (data as SaveData).totalDewDropsCollected;
  }

  // Restore bedtime stories
  if (typeof (data as SaveData).totalStoriesRead === "number") {
    totalStoriesRead = (data as SaveData).totalStoriesRead;
  }
  if (Array.isArray((data as SaveData).uniqueStoriesRead)) {
    uniqueStoriesRead = new Set((data as SaveData).uniqueStoriesRead);
  }

  // Restore bottles opened
  if (typeof (data as SaveData).totalBottlesOpened === "number") {
    totalBottlesOpened = (data as SaveData).totalBottlesOpened;
  }

  // Restore diary
  if (Array.isArray(data.diary)) {
    petDiary = data.diary.slice(-DIARY_MAX_ENTRIES);
  }

  // Restore unlocked achievements
  if (data.unlockedAchievements) {
    for (const id of data.unlockedAchievements) {
      const a = achievements.find(ach => ach.id === id);
      if (a) a.unlocked = true;
    }
  }

  // Update session start so time-based achievements account for accumulated time
  sessionStartTime = Date.now() - totalSessionTime;

  // Sync achievement state to main process
  reportAchievements();
}

function saveGame(): void {
  window.tamashii.saveData(buildSaveData());
}

// Load on startup
window.tamashii.loadSaveData().then((raw) => {
  if (raw && typeof raw === "object") {
    applySaveData(raw as SaveData);
    // Welcome back message if returning player
    const data = raw as SaveData;
    if (data.totalClicks > 0 || data.totalSpins > 0) {
      const greeting = petName ? `Hi! It's me, ${petName}! ♥` : "I remember you! ♥";
      queueSpeechBubble(greeting, 180);
      squishAmount = 0.5;
      isHappy = true;
      happyTimer = 60;
    }

    // Daily visit streak tracking for friendship
    const today = getTodayDate();
    if (lastVisitDate && lastVisitDate !== today) {
      // Check if yesterday — consecutive day
      const lastDate = new Date(lastVisitDate + "T00:00:00");
      const todayDate = new Date(today + "T00:00:00");
      const diffDays = Math.round((todayDate.getTime() - lastDate.getTime()) / 86400000);
      if (diffDays === 1) {
        consecutiveDays++;
        const streakBonus = Math.min(25, 10 + consecutiveDays * 3);
        addFriendshipXP(50 + streakBonus);
        addDiaryEntry("general", "📅", `Day ${consecutiveDays} streak! Friendship bonus +${50 + streakBonus} XP!`);
        if (consecutiveDays >= 3) {
          queueSpeechBubble(`${consecutiveDays} day streak! You always come back~! ♥`, 200, true);
        }
      } else {
        // Streak broken — reset but still award daily visit XP
        consecutiveDays = 1;
        addFriendshipXP(50);
      }
    } else if (!lastVisitDate) {
      // First ever visit
      consecutiveDays = 1;
      addFriendshipXP(50);
    }
    lastVisitDate = today;
    saveGame();
  } else {
    // Brand new pet — assign personality
    petPersonality = assignPersonality();
    addDiaryEntry("personality", PERSONALITY_ICONS[petPersonality], `Born with a ${PERSONALITY_NAMES[petPersonality]} personality!`);
    addDiaryEntry("general", "🐣", "A new Tamashii was born! The adventure begins~");
  }
  // Initialize weather system
  weatherTypesSeen.add(currentWeather);
  weatherTimer = WEATHER_CHANGE_MIN + Math.floor(Math.random() * (WEATHER_CHANGE_MAX - WEATHER_CHANGE_MIN));

  // Resume sleeping state if it's nighttime and pet was sleeping
  if (currentTimeOfDay === "night") {
    isSleeping = true;
    sleepBreathProgress = 0;
  }
});

function startSpin(): void {
  totalSpins++;
  addCarePoints(3);
  playSpinSound();
  isSpinning = true;
  spinProgress = 0;
  spinFrame = 0;
  isHappy = true;
  happyTimer = SPIN_DURATION + 20;
  squishAmount = 0.5;
  petHappiness = Math.min(100, petHappiness + 5); // tricks boost happiness more

  // Speech bubble
  const msg = spinMessages[Math.floor(Math.random() * spinMessages.length)];
  queueSpeechBubble(msg, 120);

  // Burst of sparkles around the pet
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    particles.push({
      x: cx + Math.cos(angle) * 20,
      y: cy + Math.sin(angle) * 15,
      vx: Math.cos(angle) * 1.5,
      vy: Math.sin(angle) * 1.2,
      life: 50 + Math.random() * 30,
      maxLife: 50 + Math.random() * 30,
      size: 3 + Math.random() * 3,
      type: "sparkle",
    });
  }
}

function onPetClicked(): void {
  trackCareAfterNotification();
  const now = Date.now();
  const timeSinceLastClick = now - lastClickTime;
  lastClickTime = now;

  // Gently wake the pet if sleeping
  if (isSleeping) {
    const groggyMessages = [
      "Mmm... 5 more minutes... 💤",
      "*mumble*... not yet...",
      "Zzz... huh? ...zzz...",
      "Still... sleepy...",
      "*yawn*... leave me be~",
      "Mmnh... dreaming...",
    ];
    queueSpeechBubble(groggyMessages[Math.floor(Math.random() * groggyMessages.length)], 150, true);
    playTone(300, 0.1, "sine", 0.04); // soft grumble
    squishAmount = 0.2; // gentle squish
    spawnEmoteSet("sleepy", 1);
    lastInteractionTime = Date.now();
    addFriendshipXP(1);
    return;
  }

  // Don't allow normal interactions during sleep transitions
  if (sleepTransitionType) return;

  // Double-click detection — trigger spin trick
  if (timeSinceLastClick < DOUBLE_CLICK_THRESHOLD && !isSpinning) {
    startSpin();
    return;
  }

  // Regular single click — squish + hearts + combo
  lastInteractionTime = Date.now();
  logDailyActivity("petted");
  totalClicks++;
  addCarePoints(1);
  addFriendshipXP(1);
  squishAmount = 1.0;
  isHappy = true;
  happyTimer = 60; // ~1 second of happy face
  petHappiness = Math.min(100, petHappiness + 3); // petting boosts happiness

  // Emote reaction on clicks (occasional)
  if (Math.random() < 0.3) {
    spawnEmoteSet("love", 1);
  }

  // Combo tracking
  comboCount++;
  comboTimer = 0;
  comboScale = 1.5; // pulse the counter

  if (comboCount >= 3) {
    playComboSound(comboCount);
  } else {
    playClickSound();
  }

  // Combo milestones
  if (comboCount === 5) {
    queueSpeechBubble("Nice combo~!", 120);
    spawnComboSparkles(8);
    comboShakeAmount = 2;
  } else if (comboCount === 10) {
    queueSpeechBubble("MEGA COMBO!!", 150);
    playComboMilestoneSound();
    spawnComboSparkles(16);
    petHappiness = Math.min(100, petHappiness + 5);
    comboShakeAmount = 4;
  } else if (comboCount === 15) {
    queueSpeechBubble("UNSTOPPABLE!!!", 150);
    playComboMilestoneSound();
    spawnComboSparkles(24);
    petHappiness = Math.min(100, petHappiness + 8);
    comboShakeAmount = 6;
  } else if (comboCount === 20) {
    queueSpeechBubble("LEGENDARY!!!! ♥♥♥", 180);
    playComboMilestoneSound();
    spawnComboSparkles(32);
    petHappiness = Math.min(100, petHappiness + 10);
    comboShakeAmount = 8;
  } else if (comboCount > 20 && comboCount % 10 === 0) {
    queueSpeechBubble(`${comboCount}x COMBO!!!`, 150);
    playComboMilestoneSound();
    spawnComboSparkles(24);
    comboShakeAmount = 6;
  }

  // Update best combo
  if (comboCount > bestCombo) {
    bestCombo = comboCount;
  }

  // Spawn heart particles (more hearts at higher combos)
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const heartCount = Math.min(5 + Math.floor(comboCount / 3), 12);
  for (let i = 0; i < heartCount; i++) {
    particles.push({
      x: cx + (Math.random() - 0.5) * 40,
      y: cy - 10,
      vx: (Math.random() - 0.5) * 2,
      vy: -(1.5 + Math.random() * 1.5),
      life: 60 + Math.random() * 30,
      maxLife: 60 + Math.random() * 30,
      size: 6 + Math.random() * 4,
      type: "heart",
    });
  }
}

function spawnComboSparkles(count: number): void {
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3;
    const speed = 1.5 + Math.random() * 2;
    particles.push({
      x: cx + Math.cos(angle) * 15,
      y: cy + Math.sin(angle) * 10,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 40 + Math.random() * 30,
      maxLife: 40 + Math.random() * 30,
      size: 3 + Math.random() * 4,
      type: "sparkle",
    });
  }
}

// --- Drawing ---
function lerpColor(hex: string, target: string, t: number): string {
  const r1 = parseInt(hex.slice(1, 3), 16);
  const g1 = parseInt(hex.slice(3, 5), 16);
  const b1 = parseInt(hex.slice(5, 7), 16);
  const r2 = parseInt(target.slice(1, 3), 16);
  const g2 = parseInt(target.slice(3, 5), 16);
  const b2 = parseInt(target.slice(5, 7), 16);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

// --- Growth Stage Visual Proportions ---
interface StageProportions {
  bodyWidth: number;   // multiplier for body ellipse width
  bodyHeight: number;  // multiplier for body ellipse height
  bodyOffsetY: number; // vertical offset for body center
  eyeScale: number;    // multiplier for eye sizes
  eyeSpacing: number;  // multiplier for eye spacing
  footScale: number;   // multiplier for foot size
  footSpread: number;  // multiplier for foot horizontal spread
  headRatio: number;   // how much the head "sticks up" (body pushed down)
}

function getStageProportionsFor(stage: GrowthStage): StageProportions {
  switch (stage) {
    case "baby":
      return { bodyWidth: 0.40, bodyHeight: 0.35, bodyOffsetY: 8, eyeScale: 1.1, eyeSpacing: 0.13, footScale: 0.7, footSpread: 0.7, headRatio: 0.92 };
    case "child":
      return { bodyWidth: 0.44, bodyHeight: 0.38, bodyOffsetY: 6, eyeScale: 1.0, eyeSpacing: 0.15, footScale: 0.9, footSpread: 0.85, headRatio: 0.96 };
    case "teen":
      return { bodyWidth: 0.45, bodyHeight: 0.42, bodyOffsetY: 4, eyeScale: 1.0, eyeSpacing: 0.16, footScale: 1.0, footSpread: 1.0, headRatio: 1.0 };
    case "adult":
      return { bodyWidth: 0.48, bodyHeight: 0.44, bodyOffsetY: 3, eyeScale: 1.05, eyeSpacing: 0.16, footScale: 1.1, footSpread: 1.1, headRatio: 1.02 };
  }
}

function lerpProps(a: StageProportions, b: StageProportions, t: number): StageProportions {
  return {
    bodyWidth: a.bodyWidth + (b.bodyWidth - a.bodyWidth) * t,
    bodyHeight: a.bodyHeight + (b.bodyHeight - a.bodyHeight) * t,
    bodyOffsetY: a.bodyOffsetY + (b.bodyOffsetY - a.bodyOffsetY) * t,
    eyeScale: a.eyeScale + (b.eyeScale - a.eyeScale) * t,
    eyeSpacing: a.eyeSpacing + (b.eyeSpacing - a.eyeSpacing) * t,
    footScale: a.footScale + (b.footScale - a.footScale) * t,
    footSpread: a.footSpread + (b.footSpread - a.footSpread) * t,
    headRatio: a.headRatio + (b.headRatio - a.headRatio) * t,
  };
}

// Personality-based proportion adjustments
function applyPersonalityProportions(props: StageProportions): StageProportions {
  if (!petPersonality) return props;
  const p = { ...props };
  switch (petPersonality) {
    case "shy":
      // Shy pets have slightly larger, rounder eyes
      p.eyeScale *= 1.12;
      break;
    case "gluttonous":
      // Gluttonous pets are a bit wider/rounder
      p.bodyWidth *= 1.08;
      p.bodyHeight *= 1.04;
      break;
    case "curious":
      // Curious pets have slightly wider eye spacing (alert, scanning)
      p.eyeSpacing *= 1.06;
      break;
  }
  return p;
}

function getStageProportions(): StageProportions {
  let props: StageProportions;
  if (evolutionMorphing) {
    const from = getStageProportionsFor(evolutionMorphFrom);
    const to = getStageProportionsFor(evolutionMorphTo);
    props = lerpProps(from, to, easeInOutCubic(evolutionMorphProgress));
  } else {
    props = getStageProportionsFor(currentGrowthStage);
  }
  return applyPersonalityProportions(props);
}

function applyStageColorShift(colors: { body: string; stroke: string; belly: string; foot: string }, stage: GrowthStage): { body: string; stroke: string; belly: string; foot: string } {
  const c = { ...colors };
  if (stage === "baby") {
    c.body = lerpColor(c.body, "#A8C8FF", 0.25);
    c.stroke = lerpColor(c.stroke, "#7BA8E8", 0.2);
    c.belly = lerpColor(c.belly, "#C8DFFF", 0.3);
    c.foot = lerpColor(c.foot, "#90B8F0", 0.2);
  } else if (stage === "teen") {
    c.body = lerpColor(c.body, "#4A7AE8", 0.15);
    c.stroke = lerpColor(c.stroke, "#2A5ABB", 0.15);
    c.belly = lerpColor(c.belly, "#7AA0F0", 0.1);
    c.foot = lerpColor(c.foot, "#3A6ACC", 0.15);
  } else if (stage === "adult") {
    c.body = lerpColor(c.body, "#4466CC", 0.2);
    c.stroke = lerpColor(c.stroke, "#2244AA", 0.2);
    c.belly = lerpColor(c.belly, "#7090E8", 0.15);
    c.foot = lerpColor(c.foot, "#3355BB", 0.2);
  }
  return c;
}

function getBodyColors(): { body: string; stroke: string; belly: string; foot: string } {
  const palette = getColorPalette();
  const baseColors = palette.colors[currentTimeOfDay] || palette.colors["afternoon"];
  // Growth stage color shifts — interpolate between stages during morph
  let colors: { body: string; stroke: string; belly: string; foot: string };
  if (evolutionMorphing) {
    const fromColors = applyStageColorShift(baseColors, evolutionMorphFrom);
    const toColors = applyStageColorShift(baseColors, evolutionMorphTo);
    const t = easeInOutCubic(evolutionMorphProgress);
    colors = {
      body: lerpColor(fromColors.body, toColors.body, t),
      stroke: lerpColor(fromColors.stroke, toColors.stroke, t),
      belly: lerpColor(fromColors.belly, toColors.belly, t),
      foot: lerpColor(fromColors.foot, toColors.foot, t),
    };
  } else {
    colors = applyStageColorShift(baseColors, currentGrowthStage);
  }
  // When stressed, shift body color toward warm/red
  if (stressLevel > 0.3) {
    const t = Math.min((stressLevel - 0.3) * 1.4, 0.4); // max 40% shift
    colors.body = lerpColor(colors.body, "#CC7788", t);
    colors.stroke = lerpColor(colors.stroke, "#AA5566", t);
    colors.belly = lerpColor(colors.belly, "#DDAABB", t);
    colors.foot = lerpColor(colors.foot, "#BB6677", t);
  }
  // When hungry, desaturate body colors (pet looks washed out / pale)
  if (petHunger < 40) {
    const t = Math.min((40 - petHunger) / 40, 0.5); // max 50% desaturation
    const gray = "#8899AA";
    colors.body = lerpColor(colors.body, gray, t);
    colors.stroke = lerpColor(colors.stroke, "#667788", t);
    colors.belly = lerpColor(colors.belly, "#AABBCC", t);
    colors.foot = lerpColor(colors.foot, "#778899", t);
  }
  return colors;
}

function drawBody(cx: number, cy: number, size: number): void {
  const colors = getBodyColors();
  const props = getStageProportions();

  // Adult stage: subtle radiant body outline glow
  if (currentGrowthStage === "adult") {
    ctx.save();
    ctx.globalAlpha = 0.12 + 0.05 * Math.sin(frame * 0.03);
    ctx.beginPath();
    ctx.ellipse(cx, cy + props.bodyOffsetY, size * props.bodyWidth + 4, size * props.bodyHeight + 3, 0, 0, Math.PI * 2);
    const glowGrad = ctx.createRadialGradient(cx, cy + props.bodyOffsetY, size * props.bodyWidth * 0.5, cx, cy + props.bodyOffsetY, size * props.bodyWidth + 4);
    glowGrad.addColorStop(0, "rgba(100, 140, 255, 0)");
    glowGrad.addColorStop(1, "rgba(100, 140, 255, 0.6)");
    ctx.fillStyle = glowGrad;
    ctx.fill();
    ctx.restore();
  }

  // Body (shape varies by growth stage)
  ctx.beginPath();
  ctx.ellipse(cx, cy + props.bodyOffsetY, size * props.bodyWidth, size * props.bodyHeight, 0, 0, Math.PI * 2);
  ctx.fillStyle = colors.body;
  ctx.fill();
  ctx.strokeStyle = colors.stroke;
  ctx.lineWidth = currentGrowthStage === "adult" ? 2.5 : 2;
  ctx.stroke();

  // Belly highlight (scales with body)
  const bellyScale = currentGrowthStage === "baby" ? 0.65 : currentGrowthStage === "adult" ? 0.58 : 0.56;
  const bellyY = cy + props.bodyOffsetY + size * props.bodyHeight * 0.3;
  ctx.beginPath();
  ctx.ellipse(cx, bellyY, size * props.bodyWidth * bellyScale, size * props.bodyHeight * 0.5, 0, 0, Math.PI * 2);
  ctx.fillStyle = colors.belly;
  ctx.fill();
}

function isSleepy(): boolean {
  return currentTimeOfDay === "night" || currentTimeOfDay === "evening";
}

function drawSleepyEyes(cx: number, eyeY: number, eyeSpacing: number): void {
  const droopiness = currentTimeOfDay === "night" ? 0.6 : 0.3;
  // Half-closed eyes — top eyelid droops down
  for (const side of [-1, 1]) {
    const ex = cx + side * eyeSpacing;
    // Eye white (shorter due to droopy lid)
    ctx.beginPath();
    ctx.ellipse(ex, eyeY + 2, 8, 9 * (1 - droopiness), 0, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    // Pupil
    ctx.beginPath();
    ctx.ellipse(ex + 1, eyeY + 2, 4, 5 * (1 - droopiness * 0.5), 0, 0, Math.PI * 2);
    ctx.fillStyle = "#1a1a2e";
    ctx.fill();
    // Eyelid line
    ctx.beginPath();
    ctx.moveTo(ex - 9, eyeY - 2 + droopiness * 6);
    ctx.quadraticCurveTo(ex, eyeY - 6 + droopiness * 10, ex + 9, eyeY - 2 + droopiness * 6);
    ctx.strokeStyle = "#1a1a2e";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();
  }
}

function drawFace(cx: number, cy: number, size: number): void {
  const props = getStageProportions();
  const eyeY = cy - 5;
  const eyeSpacing = size * props.eyeSpacing;
  const es = props.eyeScale; // eye scale factor

  // Determine stat-driven visual states
  const isSadFromStats = !isHappy && petHappiness < 25;
  const isDrainedFromStats = !isHappy && !isYawning && petEnergy < 20;

  // Sleeping face — fully closed eyes with peaceful expression
  if (isSleeping || sleepTransitionType === "falling_asleep") {
    const sleepLevel = isSleeping ? 1 : sleepTransitionProgress;
    for (const side of [-1, 1]) {
      const ex = cx + side * eyeSpacing;
      // Partially open during transition
      const openness = 1 - sleepLevel;
      if (openness > 0.1) {
        ctx.beginPath();
        ctx.ellipse(ex, eyeY + 2, 8 * es, 9 * es * openness * 0.3, 0, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(ex, eyeY + 2, 4 * es, 5 * es * openness * 0.3, 0, 0, Math.PI * 2);
        ctx.fillStyle = "#1a1a2e";
        ctx.fill();
      }
      // Peaceful closed-eye curve
      ctx.beginPath();
      const curve = 0.15 + sleepLevel * 0.15;
      ctx.arc(ex, eyeY + 1, 7 * es, Math.PI * (1 + curve), Math.PI * (2 - curve));
      ctx.strokeStyle = "#1a1a2e";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.stroke();
    }
    // Peaceful blush marks when fully asleep
    if (sleepLevel > 0.5) {
      const blushAlpha = (sleepLevel - 0.5) * 2 * 0.3;
      ctx.save();
      ctx.globalAlpha = blushAlpha;
      ctx.fillStyle = "#FF9999";
      ctx.beginPath();
      ctx.ellipse(cx - eyeSpacing - 6, eyeY + 10, 5, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx + eyeSpacing + 6, eyeY + 10, 5, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    // Peaceful sleeping mouth — tiny content smile
    const mouthY = cy + size * 0.08;
    ctx.beginPath();
    ctx.arc(cx, mouthY - 2, 4, 0.1, Math.PI - 0.1);
    ctx.strokeStyle = "#1a1a2e";
    ctx.lineWidth = 1.5;
    ctx.lineCap = "round";
    ctx.stroke();
    return; // skip the rest of face drawing
  } else if (sleepTransitionType === "waking_up") {
    // Waking up — eyes gradually opening with groggy look
    const wakeLevel = sleepTransitionProgress;
    for (const side of [-1, 1]) {
      const ex = cx + side * eyeSpacing;
      if (wakeLevel > 0.3) {
        const openness = (wakeLevel - 0.3) / 0.7;
        ctx.beginPath();
        ctx.ellipse(ex, eyeY + 1, 8 * es, 9 * es * openness * 0.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(ex + 1, eyeY + 2, 4 * es, 5 * es * openness * 0.4, 0, 0, Math.PI * 2);
        ctx.fillStyle = "#1a1a2e";
        ctx.fill();
      }
      const lidDroop = 1 - wakeLevel;
      ctx.beginPath();
      ctx.moveTo(ex - 9, eyeY - 2 + lidDroop * 6);
      ctx.quadraticCurveTo(ex, eyeY - 6 + lidDroop * 10, ex + 9, eyeY - 2 + lidDroop * 6);
      ctx.strokeStyle = "#1a1a2e";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.stroke();
    }
    // Groggy little mouth
    const mouthY = cy + size * 0.08;
    ctx.beginPath();
    ctx.ellipse(cx, mouthY, 3 + wakeLevel * 2, 2 + wakeLevel, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#1a1a2e";
    ctx.fill();
    return;
  } else if (isStressed && !isHappy && !isYawning) {
    // Stressed eyes — small, worried, with raised inner brows
    for (const side of [-1, 1]) {
      const ex = cx + side * eyeSpacing;
      // White (slightly smaller, tense)
      ctx.beginPath();
      ctx.ellipse(ex, eyeY, 7, 8, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      // Pupil (smaller, darting)
      const dartX = Math.sin(frame * 0.15) * 1.5;
      ctx.beginPath();
      ctx.ellipse(ex + dartX, eyeY + 1, 3, 4, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#1a1a2e";
      ctx.fill();
      // Eye shine
      ctx.beginPath();
      ctx.ellipse(ex + dartX + 2, eyeY - 2, 1.5, 1.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      // Worried brow — inner end raised
      ctx.beginPath();
      ctx.moveTo(ex - side * 9, eyeY - 10);
      ctx.quadraticCurveTo(ex, eyeY - 14 - stressLevel * 3, ex + side * 9, eyeY - 10 + 3);
      ctx.strokeStyle = "#1a1a2e";
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.stroke();
    }
  } else if (isDrainedFromStats && !isYawning) {
    // Drained eyes — heavily drooping lids, almost falling asleep
    const drainLevel = 1 - petEnergy / 20; // 0-1 (1 = most drained)
    for (const side of [-1, 1]) {
      const ex = cx + side * eyeSpacing;
      const droopiness = 0.5 + drainLevel * 0.3;
      // Eye white (very narrow due to heavy lids)
      ctx.beginPath();
      ctx.ellipse(ex, eyeY + 2, 8, 9 * (1 - droopiness), 0, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      // Pupil (tiny, looking down)
      ctx.beginPath();
      ctx.ellipse(ex, eyeY + 3, 3, 4 * (1 - droopiness * 0.6), 0, 0, Math.PI * 2);
      ctx.fillStyle = "#1a1a2e";
      ctx.fill();
      // Heavy eyelid line
      ctx.beginPath();
      ctx.moveTo(ex - 9, eyeY - 1 + droopiness * 5);
      ctx.quadraticCurveTo(ex, eyeY - 5 + droopiness * 9, ex + 9, eyeY - 1 + droopiness * 5);
      ctx.strokeStyle = "#1a1a2e";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.stroke();
    }
  } else if (isSadFromStats && !isYawning) {
    // Sad eyes — downturned, with subtle frown brows
    for (const side of [-1, 1]) {
      const ex = cx + side * eyeSpacing;
      // Eye white (slightly droopy)
      ctx.beginPath();
      ctx.ellipse(ex, eyeY + 1, 8, 8, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      // Pupil (looking down)
      ctx.beginPath();
      ctx.ellipse(ex, eyeY + 3, 4, 4.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#1a1a2e";
      ctx.fill();
      // Eye shine (smaller)
      ctx.beginPath();
      ctx.ellipse(ex + 2, eyeY + 1, 1.5, 1.5, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      // Sad brow — outer end droops down
      ctx.beginPath();
      ctx.moveTo(ex - side * 9, eyeY - 11);
      ctx.quadraticCurveTo(ex, eyeY - 13, ex + side * 9, eyeY - 8);
      ctx.strokeStyle = "#1a1a2e";
      ctx.lineWidth = 1.8;
      ctx.lineCap = "round";
      ctx.stroke();
    }
  } else if (isYawning) {
    // Yawning: closed squeezed eyes
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.arc(cx + side * eyeSpacing, eyeY, 6, Math.PI * 1.15, Math.PI * 1.85);
      ctx.strokeStyle = "#1a1a2e";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.stroke();
    }
  } else if (isHappy) {
    // Happy eyes (^_^ arcs)
    ctx.beginPath();
    ctx.arc(cx - eyeSpacing, eyeY, 7 * es, Math.PI * 1.1, Math.PI * 1.9);
    ctx.strokeStyle = "#1a1a2e";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + eyeSpacing, eyeY, 7 * es, Math.PI * 1.1, Math.PI * 1.9);
    ctx.strokeStyle = "#1a1a2e";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.stroke();
  } else if (isBlinking) {
    // Closed eyes (lines)
    ctx.beginPath();
    ctx.moveTo(cx - eyeSpacing - 6, eyeY);
    ctx.lineTo(cx - eyeSpacing + 6, eyeY);
    ctx.moveTo(cx + eyeSpacing - 6, eyeY);
    ctx.lineTo(cx + eyeSpacing + 6, eyeY);
    ctx.strokeStyle = "#1a1a2e";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.stroke();
  } else if (isSleepy()) {
    drawSleepyEyes(cx, eyeY, eyeSpacing);
  } else {
    // Open eyes (scaled by growth stage)
    // White
    ctx.beginPath();
    ctx.ellipse(cx - eyeSpacing, eyeY, 8 * es, 9 * es, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + eyeSpacing, eyeY, 8 * es, 9 * es, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    // Pupils — shift when doing look_around idle animation
    const pupilShift = idleAnim === "look_around" ? Math.sin(idleAnimProgress * Math.PI) * 3 * idleLookDirection : 0;
    // Shy personality: pupils avert gaze (shift outward, looking away)
    const shyAvert = petPersonality === "shy" ? 1.5 : 0;
    // Curious personality: dilated pupils (bigger)
    const curiousPupilScale = petPersonality === "curious" ? 1.15 : 1;
    ctx.beginPath();
    ctx.ellipse(cx - eyeSpacing + 1 + pupilShift - shyAvert, eyeY + 1, 4 * es * curiousPupilScale, 5 * es * curiousPupilScale, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#1a1a2e";
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + eyeSpacing + 1 + pupilShift + shyAvert, eyeY + 1, 4 * es * curiousPupilScale, 5 * es * curiousPupilScale, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#1a1a2e";
    ctx.fill();

    // Eye shine
    const shineSize = 2 * es;
    ctx.beginPath();
    ctx.ellipse(cx - eyeSpacing + 3 + pupilShift, eyeY - 2, shineSize, shineSize, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + eyeSpacing + 3 + pupilShift, eyeY - 2, shineSize, shineSize, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    // Adult gets a second smaller eye shine for extra sparkle
    if (currentGrowthStage === "adult") {
      ctx.beginPath();
      ctx.ellipse(cx - eyeSpacing - 1 + pupilShift, eyeY + 2, 1.2, 1.2, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx + eyeSpacing - 1 + pupilShift, eyeY + 2, 1.2, 1.2, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.fill();
    }

    // Sleepy personality: light droopy eyelids even during daytime
    if (petPersonality === "sleepy" && !isSleepy()) {
      const droopiness = 0.2;
      for (const side of [-1, 1]) {
        const ex = cx + side * eyeSpacing;
        ctx.beginPath();
        ctx.moveTo(ex - 9 * es, eyeY - 3 + droopiness * 5);
        ctx.quadraticCurveTo(ex, eyeY - 7 + droopiness * 9, ex + 9 * es, eyeY - 3 + droopiness * 5);
        ctx.strokeStyle = "#1a1a2e";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.stroke();
      }
    }
  }

  // Mouth
  ctx.beginPath();
  if (isStressed && !isHappy && !isYawning) {
    // Stressed mouth — wavy worried line
    ctx.beginPath();
    ctx.moveTo(cx - 8, cy + 10);
    ctx.quadraticCurveTo(cx - 4, cy + 7, cx, cy + 11);
    ctx.quadraticCurveTo(cx + 4, cy + 15, cx + 8, cy + 10);
    ctx.strokeStyle = "#1a1a2e";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();
  } else if (isSadFromStats && !isYawning) {
    // Sad mouth — small downturned frown
    ctx.beginPath();
    ctx.arc(cx, cy + 15, 6, Math.PI * 1.15, Math.PI * 1.85);
    ctx.strokeStyle = "#1a1a2e";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();
  } else if (isDrainedFromStats && !isYawning) {
    // Exhausted mouth — flat, slightly drooped line
    ctx.beginPath();
    ctx.moveTo(cx - 5, cy + 11);
    ctx.quadraticCurveTo(cx, cy + 13, cx + 5, cy + 11);
    ctx.strokeStyle = "#1a1a2e";
    ctx.lineWidth = 1.8;
    ctx.lineCap = "round";
    ctx.stroke();
  } else if (isYawning) {
    // Yawn mouth — open oval
    const yawnSize = Math.sin(yawnProgress * Math.PI) * 8;
    ctx.beginPath();
    ctx.ellipse(cx, cy + 10, 6 + yawnSize * 0.3, 3 + yawnSize, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#1a1a2e";
    ctx.fill();
  } else if (isHappy) {
    // Big open smile
    ctx.arc(cx, cy + 8, 9, 0.05 * Math.PI, 0.95 * Math.PI);
    ctx.strokeStyle = "#1a1a2e";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();
  } else if (isSleepy()) {
    // Gentle flat line — neutral sleepy mouth
    ctx.arc(cx, cy + 12, 5, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.strokeStyle = "#1a1a2e";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();
  } else {
    // Small smile
    ctx.arc(cx, cy + 10, 6, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.strokeStyle = "#1a1a2e";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();
  }

  // Gluttonous personality: drool drop when hungry
  if (petPersonality === "gluttonous" && petHunger < 60) {
    const droolAlpha = Math.min((60 - petHunger) / 60, 0.7);
    const droolBob = Math.sin(frame * 0.05) * 1.5;
    ctx.beginPath();
    ctx.ellipse(cx + 6, cy + 17 + droolBob, 2, 3 + droolBob * 0.3, 0, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(140, 200, 255, ${droolAlpha})`;
    ctx.fill();
  }

  // Cheeks (blush — brighter when happy, dimmer at night, faded when sad/drained, scales with stage)
  let blushAlpha = isHappy ? 0.55 : 0.35;
  if (currentTimeOfDay === "night") blushAlpha *= 0.6;
  if (isSadFromStats) blushAlpha *= 0.4; // barely blushing when sad
  if (isDrainedFromStats) blushAlpha *= 0.5; // pale when drained
  // Baby has rosier cheeks, adult has subtler blush
  if (currentGrowthStage === "baby") blushAlpha = Math.min(blushAlpha * 1.3, 0.7);
  // Shy personality: permanently rosier cheeks
  if (petPersonality === "shy") blushAlpha = Math.min(blushAlpha * 1.5, 0.75);
  const blushSize = (isHappy ? 7 : 6) * es;
  ctx.beginPath();
  ctx.ellipse(cx - eyeSpacing - 10 * es, cy + 5, blushSize, 4 * es, 0, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255, 130, 130, ${blushAlpha})`;
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + eyeSpacing + 10 * es, cy + 5, blushSize, 4 * es, 0, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255, 130, 130, ${blushAlpha})`;
  ctx.fill();
}

function drawFeet(cx: number, cy: number, size: number): void {
  const colors = getBodyColors();
  const props = getStageProportions();
  const footY = cy + size * 0.35;
  const footW = 12 * props.footScale;
  const footH = 6 * props.footScale;
  const spread = 15 * props.footSpread;
  // Left foot
  ctx.beginPath();
  ctx.ellipse(cx - spread, footY, footW, footH, 0, 0, Math.PI * 2);
  ctx.fillStyle = colors.foot;
  ctx.fill();
  // Right foot
  ctx.beginPath();
  ctx.ellipse(cx + spread, footY, footW, footH, 0, 0, Math.PI * 2);
  ctx.fillStyle = colors.foot;
  ctx.fill();
}

// --- Heart Drawing ---
function drawHeart(x: number, y: number, size: number, alpha: number): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "#FF6B8A";
  ctx.beginPath();
  const topY = y - size * 0.4;
  ctx.moveTo(x, y + size * 0.3);
  ctx.bezierCurveTo(x - size * 0.5, y - size * 0.1, x - size * 0.5, topY, x, topY + size * 0.2);
  ctx.bezierCurveTo(x + size * 0.5, topY, x + size * 0.5, y - size * 0.1, x, y + size * 0.3);
  ctx.fill();
  ctx.restore();
}

// --- Zzz Drawing ---
function drawZzz(x: number, y: number, size: number, alpha: number): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.font = `bold ${size}px sans-serif`;
  ctx.fillStyle = "#8888CC";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("z", x, y);
  ctx.restore();
}

// --- Dust Drawing ---
function drawDust(x: number, y: number, size: number, alpha: number): void {
  ctx.save();
  ctx.globalAlpha = alpha * 0.6;
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fillStyle = "#C8B898";
  ctx.fill();
  ctx.restore();
}

// --- Sparkle Drawing (morning) ---
function drawSparkle(x: number, y: number, size: number, alpha: number, life: number): void {
  ctx.save();
  ctx.globalAlpha = alpha * (0.5 + 0.5 * Math.sin(life * 0.3)); // twinkle
  ctx.translate(x, y);
  ctx.rotate(life * 0.05);
  // 4-pointed star
  const outer = size;
  const inner = size * 0.3;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const angle = (i * Math.PI) / 4;
    if (i === 0) ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
    else ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
  }
  ctx.closePath();
  ctx.fillStyle = "#FFD700";
  ctx.fill();
  ctx.restore();
}

// --- Pollen Drawing (afternoon) ---
function drawPollen(x: number, y: number, size: number, alpha: number): void {
  ctx.save();
  ctx.globalAlpha = alpha * 0.4;
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fillStyle = "#FFFACD";
  ctx.fill();
  // Soft glow
  ctx.beginPath();
  ctx.arc(x, y, size * 2, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255, 250, 205, ${alpha * 0.15})`;
  ctx.fill();
  ctx.restore();
}

// --- Firefly Drawing (evening) ---
function drawFirefly(x: number, y: number, size: number, alpha: number, life: number): void {
  ctx.save();
  const pulse = 0.4 + 0.6 * Math.sin(life * 0.15) ** 2; // soft pulsing glow
  ctx.globalAlpha = alpha * pulse;
  // Outer glow
  ctx.beginPath();
  ctx.arc(x, y, size * 3, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(200, 255, 100, ${alpha * pulse * 0.2})`;
  ctx.fill();
  // Inner glow
  ctx.beginPath();
  ctx.arc(x, y, size * 1.5, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(220, 255, 150, ${alpha * pulse * 0.4})`;
  ctx.fill();
  // Core
  ctx.beginPath();
  ctx.arc(x, y, size * 0.7, 0, Math.PI * 2);
  ctx.fillStyle = "#EEFFAA";
  ctx.fill();
  ctx.restore();
}

// --- Star Drawing (night) ---
function drawStar(x: number, y: number, size: number, alpha: number, life: number): void {
  ctx.save();
  const twinkle = 0.3 + 0.7 * Math.sin(life * 0.2) ** 2;
  ctx.globalAlpha = alpha * twinkle;
  ctx.translate(x, y);
  // Tiny 4-pointed star
  const outer = size * 0.8;
  const inner = size * 0.2;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const angle = (i * Math.PI) / 4 - Math.PI / 2;
    if (i === 0) ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
    else ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
  }
  ctx.closePath();
  ctx.fillStyle = "#E8E8FF";
  ctx.fill();
  // Soft glow around
  ctx.beginPath();
  ctx.arc(0, 0, size * 1.5, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(200, 200, 255, ${alpha * twinkle * 0.15})`;
  ctx.fill();
  ctx.restore();
}

// --- Sweat Drop Drawing ---
function drawSweat(x: number, y: number, size: number, alpha: number): void {
  ctx.save();
  ctx.globalAlpha = alpha * 0.8;
  // Teardrop shape
  ctx.beginPath();
  ctx.moveTo(x, y - size * 0.8);
  ctx.quadraticCurveTo(x + size * 0.6, y, x, y + size * 0.5);
  ctx.quadraticCurveTo(x - size * 0.6, y, x, y - size * 0.8);
  ctx.closePath();
  ctx.fillStyle = "#88CCFF";
  ctx.fill();
  ctx.strokeStyle = "rgba(100, 180, 255, 0.6)";
  ctx.lineWidth = 0.8;
  ctx.stroke();
  // Highlight
  ctx.beginPath();
  ctx.ellipse(x - size * 0.15, y - size * 0.2, size * 0.12, size * 0.2, -0.3, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  ctx.fill();
  ctx.restore();
}

// --- Stomach Growl Drawing ---
function drawGrowl(x: number, y: number, size: number, alpha: number, life: number): void {
  ctx.save();
  ctx.globalAlpha = alpha * 0.6;
  // Squiggly line to represent stomach rumbling
  ctx.beginPath();
  const segments = 4;
  const segLen = size * 0.8;
  ctx.moveTo(x - segments * segLen / 2, y);
  for (let i = 0; i < segments; i++) {
    const sx = x - segments * segLen / 2 + i * segLen;
    const dir = i % 2 === 0 ? -1 : 1;
    const wobble = Math.sin(life * 0.3) * 1.5;
    ctx.quadraticCurveTo(sx + segLen * 0.5, y + dir * (size * 0.5 + wobble), sx + segLen, y);
  }
  ctx.strokeStyle = "#DD8844";
  ctx.lineWidth = 1.5;
  ctx.lineCap = "round";
  ctx.stroke();
  ctx.restore();
}

// --- Confetti Drawing ---
function drawConfetti(x: number, y: number, size: number, alpha: number, life: number, color: string): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  // Tumbling rotation based on life
  ctx.rotate(life * 0.2);
  // Rectangular confetti piece
  ctx.fillStyle = color;
  ctx.fillRect(-size * 0.6, -size * 0.3, size * 1.2, size * 0.6);
  ctx.restore();
}

function drawRaindrop(x: number, y: number, size: number, alpha: number): void {
  ctx.save();
  ctx.globalAlpha = alpha * 0.7;
  // Teardrop shape — elongated blue drop
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.quadraticCurveTo(x + size * 0.6, y, x, y + size * 0.5);
  ctx.quadraticCurveTo(x - size * 0.6, y, x, y - size);
  ctx.fillStyle = "#6CB4EE";
  ctx.fill();
  // Tiny highlight
  ctx.beginPath();
  ctx.arc(x - size * 0.15, y - size * 0.3, size * 0.15, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.fill();
  ctx.restore();
}

function drawHappyTrail(x: number, y: number, size: number, alpha: number, life: number): void {
  ctx.save();
  ctx.globalAlpha = alpha * 0.8;
  // Rainbow-tinted sparkle that shifts hue based on life
  const hue = (life * 5) % 360;
  // Four-pointed star shape
  const r = size;
  const inner = size * 0.35;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
    const radius = i % 2 === 0 ? r : inner;
    if (i === 0) {
      ctx.moveTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
    } else {
      ctx.lineTo(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius);
    }
  }
  ctx.closePath();
  ctx.fillStyle = `hsla(${hue}, 80%, 70%, 1)`;
  ctx.fill();
  // Soft glow around the sparkle
  ctx.beginPath();
  ctx.arc(x, y, size * 1.5, 0, Math.PI * 2);
  ctx.fillStyle = `hsla(${hue}, 80%, 70%, ${alpha * 0.15})`;
  ctx.fill();
  ctx.restore();
}

function drawBlossom(x: number, y: number, size: number, alpha: number, life: number): void {
  ctx.save();
  ctx.globalAlpha = alpha * 0.85;
  ctx.translate(x, y);
  // Rotate gently as it falls
  ctx.rotate((life * 0.03) + (x * 0.1));
  // Five-petal cherry blossom
  const petalSize = size * 0.6;
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    const px = Math.cos(angle) * petalSize;
    const py = Math.sin(angle) * petalSize;
    ctx.beginPath();
    ctx.ellipse(px, py, petalSize * 0.7, petalSize * 0.4, angle, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, ${180 + Math.floor(life % 40)}, ${200 + Math.floor(life % 30)}, 1)`;
    ctx.fill();
  }
  // Center dot
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.2, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255, 220, 100, ${alpha})`;
  ctx.fill();
  ctx.restore();
}

function drawLeaf(x: number, y: number, size: number, alpha: number, life: number): void {
  ctx.save();
  ctx.globalAlpha = alpha * 0.8;
  ctx.translate(x, y);
  // Tumble as it falls — rotation based on life and position
  ctx.rotate(Math.sin(life * 0.04) * 0.8 + life * 0.02);
  // Leaf shape using bezier curves
  const w = size * 0.8;
  const h = size * 1.2;
  // Pick a warm autumn color based on particle position (deterministic per leaf)
  const colorIndex = Math.floor(Math.abs(x * 7 + y * 3)) % 4;
  const colors = ["#E8722A", "#D4451A", "#F0A030", "#C83030"];
  ctx.beginPath();
  ctx.moveTo(0, -h / 2);
  ctx.bezierCurveTo(w, -h / 4, w, h / 4, 0, h / 2);
  ctx.bezierCurveTo(-w, h / 4, -w, -h / 4, 0, -h / 2);
  ctx.fillStyle = colors[colorIndex];
  ctx.fill();
  // Center vein
  ctx.beginPath();
  ctx.moveTo(0, -h / 2 + 1);
  ctx.lineTo(0, h / 2 - 1);
  ctx.strokeStyle = `rgba(100, 50, 20, ${alpha * 0.4})`;
  ctx.lineWidth = 0.5;
  ctx.stroke();
  ctx.restore();
}

function drawSnowflake(x: number, y: number, size: number, alpha: number, life: number): void {
  ctx.save();
  ctx.globalAlpha = alpha * 0.9;
  ctx.translate(x, y);
  // Gentle slow rotation
  ctx.rotate(life * 0.01);
  // Six-armed snowflake
  ctx.strokeStyle = `rgba(220, 235, 255, 1)`;
  ctx.lineWidth = 0.8;
  ctx.lineCap = "round";
  const armLen = size * 0.9;
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const ax = Math.cos(angle) * armLen;
    const ay = Math.sin(angle) * armLen;
    // Main arm
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(ax, ay);
    ctx.stroke();
    // Small branches at 60% along each arm
    const bx = Math.cos(angle) * armLen * 0.6;
    const by = Math.sin(angle) * armLen * 0.6;
    const branchLen = armLen * 0.35;
    for (const dir of [-1, 1]) {
      const ba = angle + dir * Math.PI / 4;
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(bx + Math.cos(ba) * branchLen, by + Math.sin(ba) * branchLen);
      ctx.stroke();
    }
  }
  // Center dot glow
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(200, 220, 255, ${alpha * 0.5})`;
  ctx.fill();
  ctx.restore();
}

function drawSadCloud(x: number, y: number): void {
  ctx.save();
  // Dark grey rain cloud made of overlapping circles
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = "#778899";
  // Cloud body — overlapping circles
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x - 9, y + 2, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 9, y + 2, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x - 5, y - 4, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 5, y - 4, 7, 0, Math.PI * 2);
  ctx.fill();
  // Darker underside
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = "#556677";
  ctx.beginPath();
  ctx.ellipse(x, y + 5, 14, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// --- Dream Bubble Drawing ---
function drawDreamIcon(x: number, y: number, icon: string, size: number): void {
  ctx.save();
  ctx.translate(x, y);
  const s = size * 0.35;

  switch (icon) {
    case "star": {
      // Tiny golden star
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? s : s * 0.4;
        const angle = (i * Math.PI) / 5 - Math.PI / 2;
        if (i === 0) ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
        else ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
      }
      ctx.closePath();
      ctx.fillStyle = "#FFD700";
      ctx.fill();
      break;
    }
    case "heart": {
      // Tiny pink heart
      const hs = s * 0.8;
      ctx.beginPath();
      ctx.moveTo(0, hs * 0.3);
      ctx.bezierCurveTo(-hs * 0.5, -hs * 0.1, -hs * 0.5, -hs * 0.5, 0, -hs * 0.2);
      ctx.bezierCurveTo(hs * 0.5, -hs * 0.5, hs * 0.5, -hs * 0.1, 0, hs * 0.3);
      ctx.fillStyle = "#FF6B8A";
      ctx.fill();
      break;
    }
    case "food": {
      // Tiny apple — circle with stem
      ctx.beginPath();
      ctx.arc(0, 1, s * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = "#FF4444";
      ctx.fill();
      // Stem
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.3);
      ctx.lineTo(1, -s * 0.7);
      ctx.strokeStyle = "#886633";
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      ctx.stroke();
      // Tiny leaf
      ctx.beginPath();
      ctx.ellipse(2, -s * 0.5, s * 0.25, s * 0.12, 0.4, 0, Math.PI * 2);
      ctx.fillStyle = "#66AA44";
      ctx.fill();
      break;
    }
    case "butterfly": {
      // Tiny butterfly silhouette
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.ellipse(side * s * 0.35, -s * 0.1, s * 0.35, s * 0.25, side * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = "#CC88DD";
        ctx.fill();
      }
      // Body
      ctx.beginPath();
      ctx.ellipse(0, 0, s * 0.08, s * 0.3, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#885599";
      ctx.fill();
      break;
    }
    case "moon": {
      // Crescent moon
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.55, 0, Math.PI * 2);
      ctx.fillStyle = "#FFEE88";
      ctx.fill();
      // Cutout
      ctx.beginPath();
      ctx.arc(s * 0.2, -s * 0.15, s * 0.45, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0,0,0,0)";
      ctx.globalCompositeOperation = "destination-out";
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
      break;
    }
    case "fish": {
      // Tiny fish
      ctx.beginPath();
      ctx.ellipse(0, 0, s * 0.55, s * 0.3, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#66BBEE";
      ctx.fill();
      // Tail
      ctx.beginPath();
      ctx.moveTo(s * 0.4, 0);
      ctx.lineTo(s * 0.8, -s * 0.3);
      ctx.lineTo(s * 0.8, s * 0.3);
      ctx.closePath();
      ctx.fillStyle = "#66BBEE";
      ctx.fill();
      // Eye
      ctx.beginPath();
      ctx.arc(-s * 0.2, -s * 0.05, s * 0.1, 0, Math.PI * 2);
      ctx.fillStyle = "#111";
      ctx.fill();
      break;
    }
    case "flower": {
      // Tiny daisy
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        ctx.beginPath();
        ctx.ellipse(
          Math.cos(angle) * s * 0.35,
          Math.sin(angle) * s * 0.35,
          s * 0.25, s * 0.15,
          angle, 0, Math.PI * 2
        );
        ctx.fillStyle = "#FFAACC";
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.15, 0, Math.PI * 2);
      ctx.fillStyle = "#FFDD44";
      ctx.fill();
      break;
    }
    case "music": {
      // Musical note
      ctx.beginPath();
      ctx.arc(-s * 0.15, s * 0.2, s * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = "#AA88DD";
      ctx.fill();
      // Stem
      ctx.beginPath();
      ctx.moveTo(s * 0.1, s * 0.2);
      ctx.lineTo(s * 0.1, -s * 0.5);
      ctx.strokeStyle = "#AA88DD";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // Flag
      ctx.beginPath();
      ctx.moveTo(s * 0.1, -s * 0.5);
      ctx.quadraticCurveTo(s * 0.4, -s * 0.3, s * 0.1, -s * 0.1);
      ctx.strokeStyle = "#AA88DD";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      break;
    }
  }
  ctx.restore();
}

function drawDreamBubble(db: DreamBubble): void {
  const alpha = db.life / db.maxLife;
  // Fade in for first 20% of life
  const fadeIn = (db.maxLife - db.life) / db.maxLife;
  const effectiveAlpha = alpha * Math.min(fadeIn / 0.2, 1);

  if (effectiveAlpha < 0.01) return;

  ctx.save();
  ctx.globalAlpha = effectiveAlpha * 0.85;

  // Wobble
  const wobbleX = Math.sin(db.wobblePhase) * 3;

  const bx = db.x + wobbleX;
  const by = db.y;
  const r = db.size;

  // Thought bubble — main circle
  ctx.beginPath();
  ctx.arc(bx, by, r, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
  ctx.fill();
  ctx.strokeStyle = "rgba(180, 180, 220, 0.5)";
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // Small trailing circles (thought bubble dots leading down to pet)
  const dot1r = r * 0.3;
  const dot2r = r * 0.18;
  ctx.beginPath();
  ctx.arc(bx - r * 0.4, by + r + dot1r + 2, dot1r, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  ctx.fill();
  ctx.strokeStyle = "rgba(180, 180, 220, 0.4)";
  ctx.lineWidth = 0.6;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(bx - r * 0.7, by + r + dot1r * 2 + dot2r + 4, dot2r, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
  ctx.fill();
  ctx.strokeStyle = "rgba(180, 180, 220, 0.3)";
  ctx.lineWidth = 0.5;
  ctx.stroke();

  // Draw the dream icon inside the bubble
  ctx.globalAlpha = effectiveAlpha;
  drawDreamIcon(bx, by, db.icon, r);

  ctx.restore();
}

// --- Ambient Background Glow ---
function drawFootprints(): void {
  for (const fp of footprints) {
    const alpha = (fp.life / fp.maxLife) * 0.35; // max 35% opacity, fading out
    const x = fp.x + fp.drift;
    const y = fp.y;
    // Skip if off-canvas
    if (x < -10 || x > canvas.width + 10) continue;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);
    // Mirror left paw
    if (fp.isLeft) ctx.scale(-1, 1);

    // Draw a tiny paw print: one oval pad + three small toe beans
    ctx.fillStyle = "rgba(100, 130, 180, 0.6)"; // soft blue-grey to match pet

    // Main pad (oval)
    ctx.beginPath();
    ctx.ellipse(0, 1.5, 3.2, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Toe beans (three small circles above the pad)
    const toePositions = [
      { tx: -2.2, ty: -2 },
      { tx: 0, ty: -3 },
      { tx: 2.2, ty: -2 },
    ];
    for (const toe of toePositions) {
      ctx.beginPath();
      ctx.arc(toe.tx, toe.ty, 1.3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

function drawAmbientGlow(cx: number, cy: number): void {
  // Subtle radial gradient behind the pet that shifts with time of day
  const glowRadius = 110;
  let r: number, g: number, b: number, alpha: number;
  // Pulse gently with a slow sine wave for a living, breathing feel
  const breathe = 0.85 + 0.15 * Math.sin(frame * 0.015);

  switch (currentTimeOfDay) {
    case "morning":
      // Warm golden glow — sunrise warmth
      r = 255; g = 220; b = 120; alpha = 0.12 * breathe;
      break;
    case "afternoon":
      // Soft warm white — gentle daylight
      r = 255; g = 245; b = 200; alpha = 0.08 * breathe;
      break;
    case "evening":
      // Amber/orange — sunset warmth
      r = 255; g = 170; b = 80; alpha = 0.10 * breathe;
      break;
    case "night":
      // Cool blue/purple — moonlight
      r = 130; g = 160; b = 255; alpha = 0.10 * breathe;
      break;
  }

  // Seasonal tint — subtly shift the ambient glow color based on calendar season
  if (currentSeason === "spring") {
    // Soft pink-cherry tint
    r = Math.round(r * 0.8 + 255 * 0.2);
    g = Math.round(g * 0.8 + 180 * 0.2);
    b = Math.round(b * 0.8 + 200 * 0.2);
  } else if (currentSeason === "summer") {
    // Warm golden-yellow boost
    r = Math.round(r * 0.85 + 255 * 0.15);
    g = Math.round(g * 0.85 + 230 * 0.15);
    b = Math.round(b * 0.9 + 100 * 0.1);
  } else if (currentSeason === "autumn") {
    // Amber-orange warmth
    r = Math.round(r * 0.8 + 230 * 0.2);
    g = Math.round(g * 0.8 + 140 * 0.2);
    b = Math.round(b * 0.85 + 50 * 0.15);
  } else if (currentSeason === "winter") {
    // Cool icy blue-white
    r = Math.round(r * 0.85 + 200 * 0.15);
    g = Math.round(g * 0.85 + 220 * 0.15);
    b = Math.round(b * 0.8 + 255 * 0.2);
  }

  // Mood modulates glow: happy pet glows brighter, sad pet is dimmer
  if (petHappiness > 70) {
    alpha *= 1.0 + (petHappiness - 70) / 30 * 0.3; // up to 30% brighter when very happy
  } else if (petHappiness < 30) {
    alpha *= 0.5 + (petHappiness / 30) * 0.5; // dims when sad
  }

  const gradient = ctx.createRadialGradient(cx, cy + 5, 0, cx, cy + 5, glowRadius);
  gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`);
  gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${alpha * 0.4})`);
  gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

  ctx.beginPath();
  ctx.arc(cx, cy + 5, glowRadius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
}

// --- Day/Night Transition Animation ---
function updateTimeTransition(): void {
  if (!isTimeTransitioning) return;

  transitionFrame++;
  transitionProgress = Math.min(transitionFrame / TRANSITION_DURATION, 1);

  // Spawn transition particles based on destination time
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const spawnRate = transitionProgress < 0.7 ? 3 : 1; // more particles during buildup

  for (let i = 0; i < spawnRate; i++) {
    if (Math.random() < 0.4) {
      if (transitionTo === "morning") {
        // Golden light rays rising from below
        transitionParticles.push({
          x: cx + (Math.random() - 0.5) * canvas.width,
          y: canvas.height + 5,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -1.5 - Math.random() * 1.5,
          life: 80 + Math.random() * 40,
          maxLife: 80 + Math.random() * 40,
          size: 2 + Math.random() * 3,
          hue: 40 + Math.random() * 20, // golden
          type: "ray",
        });
      } else if (transitionTo === "afternoon") {
        // Warm pollen drifting gently
        transitionParticles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -0.3 - Math.random() * 0.5,
          life: 60 + Math.random() * 40,
          maxLife: 60 + Math.random() * 40,
          size: 1.5 + Math.random() * 2,
          hue: 45 + Math.random() * 15, // warm yellow
          type: "drift",
        });
      } else if (transitionTo === "evening") {
        // Orange/pink sunset rays sweeping from the side
        transitionParticles.push({
          x: canvas.width + 5,
          y: Math.random() * canvas.height * 0.7,
          vx: -1.5 - Math.random() * 1,
          vy: 0.3 + Math.random() * 0.5,
          life: 70 + Math.random() * 40,
          maxLife: 70 + Math.random() * 40,
          size: 2 + Math.random() * 3,
          hue: 15 + Math.random() * 25, // orange-pink
          type: "ray",
        });
      } else {
        // Twinkling stars appearing
        transitionParticles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.6,
          vx: 0,
          vy: 0,
          life: 90 + Math.random() * 50,
          maxLife: 90 + Math.random() * 50,
          size: 1 + Math.random() * 2,
          hue: 220 + Math.random() * 40, // blue-purple
          type: "twinkle",
        });
      }
    }
  }

  // Update transition particles
  for (let i = transitionParticles.length - 1; i >= 0; i--) {
    const p = transitionParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life--;
    if (p.life <= 0 || p.x < -10 || p.x > canvas.width + 10 || p.y < -10 || p.y > canvas.height + 10) {
      transitionParticles.splice(i, 1);
    }
  }

  // End transition
  if (transitionProgress >= 1) {
    isTimeTransitioning = false;
    transitionParticles = [];
  }
}

function drawTimeTransition(cx: number, cy: number): void {
  // Smooth ease curve for the transition
  const t = transitionProgress;
  const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; // ease-in-out quad
  // Intensity peaks at the middle of the transition, then fades
  const intensity = Math.sin(t * Math.PI);

  // Full-canvas color wash overlay
  let r: number, g: number, b: number;
  if (transitionTo === "morning") {
    // Golden sunrise wash
    r = 255; g = 200; b = 80;
  } else if (transitionTo === "afternoon") {
    // Warm white wash
    r = 255; g = 240; b = 180;
  } else if (transitionTo === "evening") {
    // Amber/rose sunset wash
    r = 255; g = 140; b = 60;
  } else {
    // Deep blue/purple night wash
    r = 80; g = 100; b = 200;
  }

  // Draw gradient wash — radiates from origin point based on transition type
  const washAlpha = intensity * 0.15; // subtle — never more than 15% opacity
  if (washAlpha > 0.005) {
    ctx.save();
    let originX = cx;
    let originY = cy;
    if (transitionTo === "morning") {
      originY = canvas.height + 20; // sunrise from below
    } else if (transitionTo === "evening") {
      originX = canvas.width + 20; // sunset from the right
    } else if (transitionTo === "night") {
      originY = -20; // night descends from above
    }

    const grad = ctx.createRadialGradient(originX, originY, 0, originX, originY, canvas.width * 0.8);
    grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${washAlpha})`);
    grad.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, ${washAlpha * 0.4})`);
    grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  // Draw transition particles
  for (const p of transitionParticles) {
    const alpha = (p.life / p.maxLife);
    ctx.save();

    if (p.type === "ray") {
      // Light ray — elongated glowing ellipse
      const stretch = 2 + ease * 2;
      ctx.globalAlpha = alpha * intensity * 0.5;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.size * 0.5, p.size * stretch, Math.atan2(p.vy, p.vx) + Math.PI / 2, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${p.hue}, 80%, 75%)`;
      ctx.fill();
      // Soft glow halo
      ctx.globalAlpha = alpha * intensity * 0.2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${p.hue}, 70%, 85%)`;
      ctx.fill();
    } else if (p.type === "twinkle") {
      // Twinkling star — four-pointed sparkle that pulses
      const twinkle = 0.5 + 0.5 * Math.sin(p.life * 0.15);
      const starAlpha = alpha * twinkle * intensity * 0.6;
      ctx.globalAlpha = starAlpha;
      ctx.translate(p.x, p.y);
      // Four-pointed star shape
      ctx.beginPath();
      const s = p.size * (0.8 + twinkle * 0.4);
      ctx.moveTo(0, -s * 2);
      ctx.lineTo(s * 0.3, -s * 0.3);
      ctx.lineTo(s * 2, 0);
      ctx.lineTo(s * 0.3, s * 0.3);
      ctx.lineTo(0, s * 2);
      ctx.lineTo(-s * 0.3, s * 0.3);
      ctx.lineTo(-s * 2, 0);
      ctx.lineTo(-s * 0.3, -s * 0.3);
      ctx.closePath();
      ctx.fillStyle = `hsl(${p.hue}, 60%, 85%)`;
      ctx.fill();
      // Center glow
      ctx.globalAlpha = starAlpha * 0.5;
      ctx.beginPath();
      ctx.arc(0, 0, s, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${p.hue}, 50%, 95%)`;
      ctx.fill();
    } else if (p.type === "drift") {
      // Soft floating mote
      ctx.globalAlpha = alpha * intensity * 0.4;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${p.hue}, 70%, 80%)`;
      ctx.fill();
      // Soft glow
      ctx.globalAlpha = alpha * intensity * 0.15;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${p.hue}, 60%, 90%)`;
      ctx.fill();
    }

    ctx.restore();
  }
}

// --- Charge Ring Drawing ---
function drawChargeRing(cx: number, cy: number, size: number): void {
  if (!isCharging || chargeLevel <= 0) return;

  ctx.save();

  // Vibration offset
  const vibeX = chargeVibrate > 0 ? (Math.random() - 0.5) * chargeVibrate : 0;
  const vibeY = chargeVibrate > 0 ? (Math.random() - 0.5) * chargeVibrate : 0;

  const ringCx = cx + vibeX;
  const ringCy = cy + vibeY;

  // Base ring radius — grows with charge
  const baseRadius = size * 0.5 + chargeLevel * size * 0.15;
  const pulseRadius = baseRadius + Math.sin(chargeRingPulse) * 3;

  // Ring color shifts from soft blue to bright gold to white at max
  let ringColor: string;
  let glowAlpha: number;
  if (chargeLevel < 0.3) {
    ringColor = `rgba(100, 180, 255, ${0.3 + chargeLevel})`;
    glowAlpha = 0.1 + chargeLevel * 0.3;
  } else if (chargeLevel < 0.7) {
    ringColor = `rgba(255, 200, 50, ${0.4 + chargeLevel * 0.4})`;
    glowAlpha = 0.2 + chargeLevel * 0.3;
  } else {
    ringColor = `rgba(255, 255, 200, ${0.6 + chargeLevel * 0.3})`;
    glowAlpha = 0.3 + chargeLevel * 0.3;
  }

  // Outer glow
  ctx.beginPath();
  ctx.arc(ringCx, ringCy + 5, pulseRadius + 8, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255, 220, 100, ${glowAlpha * 0.3})`;
  ctx.fill();

  // Charge ring arc (fills up clockwise as charge builds)
  ctx.beginPath();
  ctx.arc(ringCx, ringCy + 5, pulseRadius, -Math.PI / 2, -Math.PI / 2 + chargeLevel * Math.PI * 2);
  ctx.strokeStyle = ringColor;
  ctx.lineWidth = 3 + chargeLevel * 2;
  ctx.lineCap = "round";
  ctx.stroke();

  // Small energy sparks around the ring at higher charges
  if (chargeLevel > 0.3) {
    const sparkCount = Math.floor(chargeLevel * 6);
    for (let i = 0; i < sparkCount; i++) {
      const angle = chargeRingPulse * 0.5 + (i / sparkCount) * Math.PI * 2;
      const sparkR = pulseRadius + 3 + Math.sin(chargeRingPulse * 2 + i) * 4;
      const sparkX = ringCx + Math.cos(angle) * sparkR;
      const sparkY = ringCy + 5 + Math.sin(angle) * sparkR;
      ctx.beginPath();
      ctx.arc(sparkX, sparkY, 1.5 + chargeLevel, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 200, ${0.4 + chargeLevel * 0.4})`;
      ctx.fill();
    }
  }

  ctx.restore();
}

// --- Speech Bubble Drawing ---
function drawSpeechBubble(cx: number, petTopY: number): void {
  if (!speechBubble) return;

  // Fade in for first 20 frames, fade out for last 30 frames
  let alpha = 1;
  const fadeIn = speechBubble.maxLife - speechBubble.life;
  if (fadeIn < 20) alpha = fadeIn / 20;
  if (speechBubble.life < 30) alpha = speechBubble.life / 30;

  ctx.save();
  ctx.globalAlpha = alpha;

  // Measure text
  ctx.font = "bold 11px sans-serif";
  const metrics = ctx.measureText(speechBubble.text);
  const textWidth = metrics.width;
  const padding = 8;
  const bubbleW = textWidth + padding * 2;
  const bubbleH = 22;
  const bubbleX = cx - bubbleW / 2;
  const bubbleY = petTopY - bubbleH - 10 - speechBubble.slideOffset;
  const radius = 8;

  // Bubble background
  ctx.beginPath();
  ctx.moveTo(bubbleX + radius, bubbleY);
  ctx.lineTo(bubbleX + bubbleW - radius, bubbleY);
  ctx.quadraticCurveTo(bubbleX + bubbleW, bubbleY, bubbleX + bubbleW, bubbleY + radius);
  ctx.lineTo(bubbleX + bubbleW, bubbleY + bubbleH - radius);
  ctx.quadraticCurveTo(bubbleX + bubbleW, bubbleY + bubbleH, bubbleX + bubbleW - radius, bubbleY + bubbleH);
  // Small tail pointing down toward pet
  ctx.lineTo(cx + 6, bubbleY + bubbleH);
  ctx.lineTo(cx, bubbleY + bubbleH + 7);
  ctx.lineTo(cx - 6, bubbleY + bubbleH);
  ctx.lineTo(bubbleX + radius, bubbleY + bubbleH);
  ctx.quadraticCurveTo(bubbleX, bubbleY + bubbleH, bubbleX, bubbleY + bubbleH - radius);
  ctx.lineTo(bubbleX, bubbleY + radius);
  ctx.quadraticCurveTo(bubbleX, bubbleY, bubbleX + radius, bubbleY);
  ctx.closePath();

  ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
  ctx.fill();
  ctx.strokeStyle = "rgba(100, 100, 120, 0.5)";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Text
  ctx.fillStyle = "#333344";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(speechBubble.text, cx, bubbleY + bubbleH / 2);

  // Queue indicator dots — show how many messages are waiting
  if (speechBubbleQueue.length > 0) {
    const dotCount = Math.min(speechBubbleQueue.length, 3);
    const dotY = bubbleY + bubbleH + 12;
    const dotSpacing = 5;
    const startX = cx - ((dotCount - 1) * dotSpacing) / 2;
    ctx.fillStyle = `rgba(100, 100, 120, ${alpha * 0.4})`;
    for (let i = 0; i < dotCount; i++) {
      ctx.beginPath();
      ctx.arc(startX + i * dotSpacing, dotY, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

// --- Animation Loop ---
function getBounceSpeed(): number {
  // Almost no bounce when sleeping
  if (isSleeping) return 0.008;
  let speed: number;
  switch (currentTimeOfDay) {
    case "morning": speed = 0.12; break;
    case "afternoon": speed = 0.08; break;
    case "evening": speed = 0.05; break;
    case "night": speed = 0.03; break;
  }
  // Low happiness → sluggish bounce
  if (petHappiness < 40) {
    speed *= 0.5 + (petHappiness / 40) * 0.5; // at 0 happiness, half speed
  }
  // Low energy → even slower
  if (petEnergy < 30) {
    speed *= 0.4 + (petEnergy / 30) * 0.6;
  }
  return speed;
}

function getBounceAmplitude(): number {
  if (isSleeping) return 0.5; // barely perceptible when sleeping
  let amp: number;
  switch (currentTimeOfDay) {
    case "morning": amp = 4; break;
    case "afternoon": amp = 3; break;
    case "evening": amp = 2; break;
    case "night": amp = 1.5; break;
  }
  // Low happiness → smaller bounce (droopier)
  if (petHappiness < 40) {
    amp *= 0.5 + (petHappiness / 40) * 0.5;
  }
  // Low energy → minimal bounce
  if (petEnergy < 30) {
    amp *= 0.5 + (petEnergy / 30) * 0.5;
  }
  return amp;
}

function getWanderSpeed(): number {
  let speed: number;
  switch (currentTimeOfDay) {
    case "morning": speed = 0.5; break;
    case "afternoon": speed = 0.35; break;
    case "evening": speed = 0.2; break;
    case "night": speed = 0; break;
  }
  // Low energy → sluggish wandering
  if (petEnergy < 30 && speed > 0) {
    speed *= 0.3 + (petEnergy / 30) * 0.7;
  }
  // Very low happiness → wanders less eagerly
  if (petHappiness < 20 && speed > 0) {
    speed *= 0.5;
  }
  return speed;
}

function update(): void {
  frame++;

  // Blink logic (skip blinking when happy or yawning — eyes are different)
  if (!isHappy && !isYawning) {
    blinkTimer++;
    // Blink more frequently when sleepy
    const blinkInterval = isSleepy() ? 60 + Math.random() * 60 : 120 + Math.random() * 120;
    if (!isBlinking && blinkTimer > blinkInterval) {
      isBlinking = true;
      blinkTimer = 0;
    }
    // Longer blinks when sleepy
    const blinkDuration = isSleepy() ? 14 : 8;
    if (isBlinking && blinkTimer > blinkDuration) {
      isBlinking = false;
      blinkTimer = 0;
    }
  } else {
    isBlinking = false;
  }

  // Yawn logic (only when sleepy and not happy)
  if (isSleepy() && !isHappy && !isYawning) {
    yawnTimer++;
    // Yawn every ~8-15 seconds at night, ~15-25 seconds in evening
    const yawnInterval = currentTimeOfDay === "night"
      ? 480 + Math.random() * 420
      : 900 + Math.random() * 600;
    if (yawnTimer > yawnInterval) {
      isYawning = true;
      yawnProgress = 0;
      yawnTimer = 0;
    }
  }
  if (isYawning) {
    yawnProgress += 0.015; // ~67 frames = ~1.1 seconds
    if (yawnProgress >= 1) {
      isYawning = false;
      yawnProgress = 0;
    }
  }

  // Happy timer
  if (isHappy) {
    happyTimer--;
    if (happyTimer <= 0) {
      isHappy = false;
    }
  }

  // Squish decay
  if (squishAmount > 0) {
    squishAmount *= 0.88;
    if (squishAmount < 0.01) squishAmount = 0;
  }

  // Combo timer — reset combo after timeout
  if (comboCount > 0) {
    comboTimer++;
    if (comboTimer >= COMBO_TIMEOUT) {
      // Combo ended — show final count briefly
      if (comboCount >= 3) {
        comboDisplayValue = comboCount;
        comboDisplayTimer = 60; // show for ~1 second
      }
      comboCount = 0;
      comboTimer = 0;
    }
  }
  if (comboDisplayTimer > 0) {
    comboDisplayTimer--;
  }

  // Combo counter scale pulse decay
  if (comboScale > 1) {
    comboScale *= 0.9;
    if (comboScale < 1.02) comboScale = 1;
  }

  // Combo screen shake decay
  if (comboShakeAmount > 0) {
    comboShakeAmount *= 0.85;
    if (comboShakeAmount < 0.1) comboShakeAmount = 0;
  }

  // Idle animation logic
  if (idleAnim !== "none") {
    const duration = getIdleAnimDuration();
    idleAnimProgress += 1 / duration;
    if (idleAnimProgress >= 1) {
      idleAnim = "none";
      idleAnimProgress = 0;
    }
  } else {
    // Check if it's time to try an idle animation
    const timeSinceInteraction = Date.now() - lastInteractionTime;
    if (timeSinceInteraction > IDLE_ANIM_IDLE_THRESHOLD && !isHappy && !isYawning && !isSpinning && !isDragging && !isCharging && !minigameActive && !memoryGameActive && activeTrick === null) {
      idleAnimTimer++;
      const idleFreqMult = petPersonality ? PERSONALITY_IDLE_FREQUENCY[petPersonality] : 1;
      if (idleAnimTimer >= IDLE_ANIM_COOLDOWN / idleFreqMult) {
        idleAnimTimer = 0;
        // 40% base chance per check, scaled by personality
        if (Math.random() < 0.4 * idleFreqMult) {
          startIdleAnimation();
        }
      }
    } else {
      idleAnimTimer = 0;
    }
  }

  // Hold-click charge-up logic
  if (isDragging && !dragMoved && !minigameActive && !memoryGameActive && !isSpinning) {
    const holdTime = Date.now() - chargeStartTime;
    if (holdTime >= CHARGE_MIN_TIME) {
      if (!isCharging) {
        isCharging = true;
        startChargeSound();
      }
      // Calculate charge level (0 to 1)
      const chargeTime = holdTime - CHARGE_MIN_TIME;
      chargeLevel = Math.min(chargeTime / (CHARGE_MAX_TIME - CHARGE_MIN_TIME), 1);
      chargeVibrate = chargeLevel * 3; // vibration intensity scales with charge
      chargeRingPulse += 0.1 + chargeLevel * 0.15; // ring animation speeds up
      updateChargeSound(chargeLevel);

      // Speech bubbles at charge thresholds
      if (chargeLevel > 0.2 && chargeLevel < 0.25 && !speechBubble) {
        queueSpeechBubble("Charging~!", 60);
      } else if (chargeLevel > 0.5 && chargeLevel < 0.55 && !speechBubble) {
        queueSpeechBubble("More power...!", 60);
      } else if (chargeLevel >= 0.99 && !speechBubble) {
        queueSpeechBubble("MAX CHARGE!! ✨", 60);
      }
    }
  } else if (!isDragging && isCharging) {
    // Mouse released outside mouseup (safety cleanup)
    isCharging = false;
    chargeLevel = 0;
    stopChargeSound();
  }

  // Charge release flash decay
  if (chargeReleased) {
    chargeReleased = false;
  }

  // Spin trick update
  if (isSpinning) {
    spinFrame++;
    spinProgress = spinFrame / SPIN_DURATION;
    if (spinProgress >= 1) {
      isSpinning = false;
      spinProgress = 0;
      spinFrame = 0;
      // Landing squish after spin
      squishAmount = 0.6;
    }
  }

  // Spawn zzz particles when sleepy (nighttime, or sleepy personality during day)
  const shouldSpawnZzz = currentTimeOfDay === "night" || (petPersonality === "sleepy" && idleAnim === "none" && !isHappy);
  if (shouldSpawnZzz) {
    zzzSpawnTimer++;
    // Sleepy personality spawns less frequently during daytime
    const zzzInterval = (currentTimeOfDay === "night") ? 90 : 200;
    if (zzzSpawnTimer > zzzInterval + Math.random() * 60) {
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const zzzSize = (currentTimeOfDay === "night") ? 10 + Math.random() * 6 : 7 + Math.random() * 4;
      particles.push({
        x: cx + 25,
        y: cy - 25,
        vx: 0.3 + Math.random() * 0.3,
        vy: -(0.5 + Math.random() * 0.3),
        life: 90,
        maxLife: 90,
        size: zzzSize,
        type: "zzz",
      });
      zzzSpawnTimer = 0;
    }
  }

  // Ambient particle spawning (time-of-day effects)
  ambientSpawnTimer++;
  const cx2 = canvas.width / 2;
  const cy2 = canvas.height / 2;
  if (currentTimeOfDay === "morning") {
    // Golden sparkles — every ~40-70 frames
    if (ambientSpawnTimer > 40 + Math.random() * 30) {
      ambientSpawnTimer = 0;
      particles.push({
        x: cx2 + (Math.random() - 0.5) * 120,
        y: cy2 + (Math.random() - 0.5) * 80,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -(0.2 + Math.random() * 0.3),
        life: 80 + Math.random() * 40,
        maxLife: 80 + Math.random() * 40,
        size: 3 + Math.random() * 3,
        type: "sparkle",
      });
    }
  } else if (currentTimeOfDay === "afternoon") {
    // Floating pollen — every ~60-100 frames
    if (ambientSpawnTimer > 60 + Math.random() * 40) {
      ambientSpawnTimer = 0;
      particles.push({
        x: cx2 + (Math.random() - 0.5) * 140,
        y: cy2 - 40 - Math.random() * 30,
        vx: 0.1 + Math.random() * 0.2,
        vy: 0.1 + Math.random() * 0.15,
        life: 120 + Math.random() * 60,
        maxLife: 120 + Math.random() * 60,
        size: 1.5 + Math.random() * 1.5,
        type: "pollen",
      });
    }
  } else if (currentTimeOfDay === "evening") {
    // Fireflies — every ~80-140 frames
    if (ambientSpawnTimer > 80 + Math.random() * 60) {
      ambientSpawnTimer = 0;
      particles.push({
        x: cx2 + (Math.random() - 0.5) * 150,
        y: cy2 + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.3,
        life: 150 + Math.random() * 80,
        maxLife: 150 + Math.random() * 80,
        size: 2 + Math.random() * 2,
        type: "firefly",
      });
    }
  } else if (currentTimeOfDay === "night") {
    // Twinkling stars — every ~100-160 frames
    if (ambientSpawnTimer > 100 + Math.random() * 60) {
      ambientSpawnTimer = 0;
      particles.push({
        x: cx2 + (Math.random() - 0.5) * 160,
        y: cy2 - 20 - Math.random() * 60,
        vx: 0,
        vy: 0,
        life: 180 + Math.random() * 120,
        maxLife: 180 + Math.random() * 120,
        size: 2 + Math.random() * 2.5,
        type: "star",
      });
    }
  }

  // Seasonal particle spawning (calendar-based ambient effects)
  seasonalSpawnTimer++;
  if (currentSeason === "spring") {
    // Cherry blossom petals — every ~50-90 frames
    if (seasonalSpawnTimer > 50 + Math.random() * 40) {
      seasonalSpawnTimer = 0;
      particles.push({
        x: cx2 + (Math.random() - 0.3) * 160,
        y: cy2 - 80 - Math.random() * 20,
        vx: 0.2 + Math.random() * 0.3,
        vy: 0.15 + Math.random() * 0.15,
        life: 160 + Math.random() * 80,
        maxLife: 160 + Math.random() * 80,
        size: 3 + Math.random() * 2.5,
        type: "blossom",
      });
    }
  } else if (currentSeason === "summer") {
    // Summer enhances fireflies at evening/night, adds extra sparkles during day
    if (currentTimeOfDay === "evening" || currentTimeOfDay === "night") {
      if (seasonalSpawnTimer > 40 + Math.random() * 30) {
        seasonalSpawnTimer = 0;
        particles.push({
          x: cx2 + (Math.random() - 0.5) * 160,
          y: cy2 + (Math.random() - 0.5) * 100,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.2,
          life: 180 + Math.random() * 100,
          maxLife: 180 + Math.random() * 100,
          size: 2.5 + Math.random() * 2,
          type: "firefly",
        });
      }
    } else {
      // Daytime summer: extra golden sparkles
      if (seasonalSpawnTimer > 60 + Math.random() * 50) {
        seasonalSpawnTimer = 0;
        particles.push({
          x: cx2 + (Math.random() - 0.5) * 130,
          y: cy2 + (Math.random() - 0.5) * 80,
          vx: (Math.random() - 0.5) * 0.2,
          vy: -(0.1 + Math.random() * 0.2),
          life: 70 + Math.random() * 40,
          maxLife: 70 + Math.random() * 40,
          size: 2 + Math.random() * 2,
          type: "sparkle",
        });
      }
    }
  } else if (currentSeason === "autumn") {
    // Falling leaves — every ~60-100 frames
    if (seasonalSpawnTimer > 60 + Math.random() * 40) {
      seasonalSpawnTimer = 0;
      particles.push({
        x: cx2 + (Math.random() - 0.5) * 160,
        y: cy2 - 80 - Math.random() * 20,
        vx: (Math.random() - 0.3) * 0.4,
        vy: 0.2 + Math.random() * 0.2,
        life: 180 + Math.random() * 80,
        maxLife: 180 + Math.random() * 80,
        size: 4 + Math.random() * 3,
        type: "leaf",
      });
    }
  } else if (currentSeason === "winter") {
    // Snowflakes — every ~35-65 frames
    if (seasonalSpawnTimer > 35 + Math.random() * 30) {
      seasonalSpawnTimer = 0;
      particles.push({
        x: cx2 + (Math.random() - 0.5) * 170,
        y: cy2 - 85 - Math.random() * 15,
        vx: (Math.random() - 0.5) * 0.2,
        vy: 0.1 + Math.random() * 0.15,
        life: 200 + Math.random() * 100,
        maxLife: 200 + Math.random() * 100,
        size: 3 + Math.random() * 3,
        type: "snowflake",
      });
    }
  }

  // Speech bubble logic
  if (speechBubble) {
    speechBubble.life--;
    // Animate slide offset toward 0 (smooth entrance)
    if (speechBubble.slideOffset > 0) {
      speechBubble.slideOffset *= 0.85;
      if (speechBubble.slideOffset < 0.5) speechBubble.slideOffset = 0;
    }
    if (speechBubble.life <= 0) {
      // Check queue for next bubble
      if (speechBubbleQueue.length > 0) {
        const next = speechBubbleQueue.shift()!;
        speechBubble = { text: next.text, life: next.life, maxLife: next.life, slideOffset: 15 };
      } else {
        speechBubble = null;
        // Cooldown before next bubble: 15-30 seconds
        speechCooldown = 900 + Math.floor(Math.random() * 900);
      }
    }
  } else {
    speechCooldown--;
    if (speechCooldown <= 0) {
      spawnSpeechBubble();
    }
  }

  // Particle update
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    if (p.type === "heart") {
      p.vy -= 0.01;
    } else if (p.type === "zzz") {
      // zzz floats with gentle wave
      p.vx = Math.sin(p.life * 0.05) * 0.3;
    } else if (p.type === "dust") {
      // Dust puffs slow down and settle
      p.vy += 0.03;
      p.vx *= 0.96;
    } else if (p.type === "sparkle") {
      // Sparkles drift upward with gentle sway
      p.vx = Math.sin(p.life * 0.08) * 0.3;
    } else if (p.type === "pollen") {
      // Pollen drifts lazily with sine wave
      p.vx = Math.sin(p.life * 0.04) * 0.2 + 0.1;
      p.vy = Math.sin(p.life * 0.06) * 0.1 + 0.05;
    } else if (p.type === "firefly") {
      // Fireflies wander erratically
      p.vx += (Math.random() - 0.5) * 0.08;
      p.vy += (Math.random() - 0.5) * 0.06;
      p.vx *= 0.98;
      p.vy *= 0.98;
    } else if (p.type === "star") {
      // Stars stay still — they just twinkle in place
    } else if (p.type === "sweat") {
      // Sweat drops fall and accelerate slightly
      p.vy += 0.08;
      p.vx *= 0.97;
    } else if (p.type === "growl") {
      // Stomach growl squiggles — wobble side to side as they drift out
      p.vy += Math.sin(p.life * 0.4) * 0.08;
      p.vx *= 0.97;
    } else if (p.type === "confetti") {
      // Confetti — tumbles with gravity and flutter
      p.vy += 0.06; // gravity
      p.vx += Math.sin(p.life * 0.2) * 0.08; // flutter side to side
      p.vx *= 0.98;
    } else if (p.type === "raindrop") {
      // Raindrops fall and accelerate slightly
      p.vy += 0.05;
    } else if (p.type === "happy_trail") {
      // Happy trail sparkles float up and drift with gentle sway
      p.vx += Math.sin(p.life * 0.1) * 0.05;
      p.vy -= 0.01;
    } else if (p.type === "blossom") {
      // Cherry blossom petals — gentle swaying descent
      p.vx = Math.sin(p.life * 0.035) * 0.4 + 0.15;
      p.vy += 0.005; // very slow gravity
      p.vy = Math.min(p.vy, 0.6); // terminal velocity
    } else if (p.type === "leaf") {
      // Autumn leaves — tumbling, swaying fall with gusts
      p.vx += Math.sin(p.life * 0.05) * 0.12;
      p.vy += 0.015; // gentle gravity
      p.vy = Math.min(p.vy, 0.8);
      // Occasional gust
      if (Math.random() < 0.02) p.vx += (Math.random() - 0.3) * 0.5;
    } else if (p.type === "snowflake") {
      // Snowflakes — slow drifting descent with gentle sway
      p.vx = Math.sin(p.life * 0.025 + p.x * 0.05) * 0.25;
      p.vy += 0.003;
      p.vy = Math.min(p.vy, 0.4); // very slow terminal velocity
    }
    p.vx *= 0.99;
    p.life--;
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }

  // Emote update
  updateEmotes();

  // Bubble update
  updateBubbles();

  // Fortune cookie update
  updateFortuneCookie();

  // Morning dew drops update
  updateDewDrops();

  // Message in a bottle update
  updateMessageBottle();

  // Bedtime story update
  updateBedtimeStory();

  // Firefly update
  updateFireflies();

  // Constellation update
  updateConstellations();

  // Shooting star update
  updateShootingStars();

  // Autonomous emotes — pet spontaneously shows emoji reactions
  autonomousEmoteTimer++;
  if (autonomousEmoteTimer >= nextAutonomousEmoteAt && !minigameActive && !memoryGameActive && !isDragging && !isSleeping) {
    spawnRandomEmote();
    autonomousEmoteTimer = 0;
    nextAutonomousEmoteAt = AUTONOMOUS_EMOTE_INTERVAL_MIN + Math.random() * (AUTONOMOUS_EMOTE_INTERVAL_MAX - AUTONOMOUS_EMOTE_INTERVAL_MIN);
  }

  // --- Wandering logic ---
  const wanderSpeed = getWanderSpeed();
  if (!isDragging && wanderSpeed > 0 && wanderingEnabled && !isSleeping) {
    // Fetch screen bounds periodically (every ~2 seconds)
    boundsFetchTimer++;
    if (boundsFetchTimer > 120) {
      boundsFetchTimer = 0;
      window.tamashii.getScreenBounds().then((b) => { screenBoundsCache = b; });
    }

    wanderTimer--;

    if (wanderState === "pausing") {
      // Lean back to neutral while paused
      wanderLean *= 0.92;
      if (wanderTimer <= 0) {
        wanderState = "walking";
        wanderDirection = Math.random() < 0.5 ? -1 : 1;
        // Walk for 3-8 seconds
        wanderTimer = 180 + Math.floor(Math.random() * 300);
      }
    } else if (wanderState === "walking") {
      // Move the window
      const dx = wanderDirection * wanderSpeed;
      window.tamashii.moveWindow(dx, 0);

      // Lean into walk direction (smooth approach)
      wanderLean += (wanderDirection * 0.6 - wanderLean) * 0.05;

      // Check screen boundaries — reverse if near edge
      const margin = 20;
      const { screenWidth, windowX } = screenBoundsCache;
      if (windowX <= margin && wanderDirection === -1) {
        wanderDirection = 1;
      } else if (windowX >= screenWidth - 200 - margin && wanderDirection === 1) {
        wanderDirection = -1;
      }

      // Spawn footprints while walking
      footprintTimer++;
      if (footprintTimer >= 18) { // one footprint every ~18 frames (~0.3s)
        footprintTimer = 0;
        const petCx = canvas.width / 2;
        const petCy = canvas.height / 2 + bounceOffset;
        const footY = petCy + 52; // near the pet's feet
        const pawOffset = footprintLeft ? -6 : 6; // left/right paw offset
        footprints.push({
          x: petCx + pawOffset,
          y: footY,
          life: 180, // ~3 seconds at 60fps
          maxLife: 180,
          isLeft: footprintLeft,
          drift: 0,
        });
        footprintLeft = !footprintLeft;
      }

      if (wanderTimer <= 0) {
        wanderState = "pausing";
        // Pause for 4-10 seconds
        wanderTimer = 240 + Math.floor(Math.random() * 360);
      }
    }
  } else {
    // Not wandering (dragging or nighttime) — lean back to neutral
    wanderLean *= 0.92;
    if (isDragging) {
      wanderState = "pausing";
      wanderTimer = 120; // Short pause after being dropped
    }
  }

  // --- Footprint update ---
  const currentWanderSpeed = getWanderSpeed();
  for (let i = footprints.length - 1; i >= 0; i--) {
    const fp = footprints[i];
    fp.life--;
    // Drift footprints opposite to walk direction so they appear left behind
    if (wanderState === "walking" && wanderingEnabled) {
      fp.drift -= wanderDirection * currentWanderSpeed;
    }
    if (fp.life <= 0) {
      footprints.splice(i, 1);
    }
  }

  // --- Gravity / Falling ---
  if (isFalling && !isDragging) {
    velocityY += GRAVITY;
    window.tamashii.moveWindow(0, Math.round(velocityY));

    // Update cached position
    screenBoundsCache.windowY += velocityY;

    // Check if we hit the ground
    if (screenBoundsCache.windowY >= groundY) {
      screenBoundsCache.windowY = groundY;
      // Snap to ground position
      window.tamashii.getScreenBounds().then((b) => {
        const overshoot = b.windowY - groundY;
        if (overshoot > 0) {
          window.tamashii.moveWindow(0, -overshoot);
        }
      });

      if (Math.abs(velocityY) < 2) {
        // Stopped bouncing
        isFalling = false;
        velocityY = 0;
      } else {
        // Bounce! Reverse velocity with damping
        totalBounces++;
        addCarePoints(1);
        const preBounceSpeed = Math.abs(velocityY) / BOUNCE_DAMPING;
        playBounceSound(preBounceSpeed);
        velocityY = -velocityY * BOUNCE_DAMPING;

        // Landing squish proportional to impact speed
        const impactSpeed = Math.abs(velocityY) / BOUNCE_DAMPING; // pre-bounce speed
        landingSquish = Math.min(impactSpeed / 15, 1.0);

        // Spawn dust particles on impact
        if (impactSpeed > 4) {
          const cx = canvas.width / 2;
          const cy = canvas.height / 2 + 30;
          const dustCount = Math.min(Math.floor(impactSpeed / 3), 6);
          for (let i = 0; i < dustCount; i++) {
            const dir = i % 2 === 0 ? -1 : 1;
            particles.push({
              x: cx + dir * (5 + Math.random() * 15),
              y: cy + 10,
              vx: dir * (1 + Math.random() * 2),
              vy: -(0.5 + Math.random() * 1),
              life: 30 + Math.random() * 20,
              maxLife: 30 + Math.random() * 20,
              size: 3 + Math.random() * 3,
              type: "dust",
            });
          }
        }
      }
    }
  }

  // Landing squish decay
  if (landingSquish > 0) {
    landingSquish *= 0.85;
    if (landingSquish < 0.01) landingSquish = 0;
  }

  // --- System stress update ---
  // Combine CPU and memory into a stress value (CPU weighted more heavily)
  const rawStress = Math.min((cpuUsage * 0.7 + memUsage * 0.3) / 100, 1);
  // Smooth transition (slow ramp up, slow ramp down)
  stressLevel += (rawStress - stressLevel) * 0.05;
  isStressed = stressLevel > 0.4;

  // Track high-stress survival for achievements
  if (stressLevel > 0.7 && !wasHighStress) {
    wasHighStress = true;
  } else if (stressLevel < 0.3 && wasHighStress) {
    wasHighStress = false;
    stressSurvivedCount++;
  }

  // Achievement celebration timer
  if (achievementCelebrating) {
    achievementCelebrationTimer--;
    if (achievementCelebrationTimer <= 0) {
      achievementCelebrating = false;
    }
  }

  // Evolution celebration timer
  if (evolutionCelebrating) {
    evolutionCelebrationTimer--;
    if (evolutionCelebrationTimer <= 0) {
      evolutionCelebrating = false;
    }
  }

  // Evolution morph transition — smooth body/color interpolation
  if (evolutionMorphing) {
    evolutionMorphTimer--;
    evolutionMorphProgress = 1 - evolutionMorphTimer / EVOLUTION_MORPH_DURATION;
    if (evolutionMorphTimer <= 0) {
      evolutionMorphing = false;
      evolutionMorphProgress = 1;
    }
  }

  // Passive care: +1 care point every 5 minutes of session time
  if (frame % 18000 === 0 && frame > 0) { // 18000 frames ≈ 5 min at 60fps
    addCarePoints(1);
  }

  // Check achievements every 30 frames (~0.5s)
  if (frame % 30 === 0) {
    checkAchievements();
  }

  // Weather system
  updateWeather();

  // Mood journal snapshot
  updateMoodJournal();

  // Auto-save periodically
  saveTimer++;
  if (saveTimer >= SAVE_INTERVAL) {
    saveTimer = 0;
    saveGame();
  }

  // Spawn sweat particles when stressed
  if (isStressed && !isDragging) {
    sweatSpawnTimer++;
    // More sweat at higher stress — interval shrinks from ~50 to ~12 frames
    const spawnInterval = Math.max(12, 50 - stressLevel * 40);
    if (sweatSpawnTimer > spawnInterval) {
      sweatSpawnTimer = 0;
      const sweatCx = canvas.width / 2;
      const sweatCy = canvas.height / 2;
      const side = Math.random() < 0.5 ? -1 : 1;
      particles.push({
        x: sweatCx + side * (20 + Math.random() * 15),
        y: sweatCy - 20 - Math.random() * 10,
        vx: side * (0.3 + Math.random() * 0.4),
        vy: 0.5 + Math.random() * 0.5,
        life: 40 + Math.random() * 20,
        maxLife: 40 + Math.random() * 20,
        size: 4 + Math.random() * 3 + stressLevel * 2,
        type: "sweat",
      });
    }
  } else {
    sweatSpawnTimer = 0;
  }

  // Spawn stomach growl particles when very hungry
  if (petHunger < 20 && !isDragging && !minigameActive) {
    growlSpawnTimer++;
    const growlInterval = Math.max(60, 120 - (20 - petHunger) * 3); // more frequent when hungrier
    if (growlSpawnTimer > growlInterval) {
      growlSpawnTimer = 0;
      const growlCx = canvas.width / 2;
      const growlCy = canvas.height / 2;
      // Small squiggly lines emanate from the pet's belly area
      const side = Math.random() < 0.5 ? -1 : 1;
      particles.push({
        x: growlCx + side * (10 + Math.random() * 10),
        y: growlCy + 15 + Math.random() * 5,
        vx: side * (0.4 + Math.random() * 0.3),
        vy: (Math.random() - 0.5) * 0.3,
        life: 35 + Math.random() * 15,
        maxLife: 35 + Math.random() * 15,
        size: 3 + Math.random() * 2,
        type: "growl",
      });
    }
  } else {
    growlSpawnTimer = 0;
  }

  // --- Mood particle trails ---
  const moodCx = canvas.width / 2;
  const moodCy = canvas.height / 2 + bounceOffset;

  // Happy sparkle trail — when happiness > 70 and pet is wandering
  if (petHappiness > 70 && wanderState === "walking" && wanderingEnabled && !isDragging && !minigameActive) {
    happyTrailTimer++;
    // Spawn rate scales with happiness: every ~8-15 frames
    const trailInterval = Math.max(8, 20 - (petHappiness - 70) * 0.4);
    if (happyTrailTimer > trailInterval) {
      happyTrailTimer = 0;
      // Sparkles appear behind the pet (opposite to walk direction)
      const trailOffsetX = -wanderDirection * (15 + Math.random() * 10);
      particles.push({
        x: moodCx + trailOffsetX + (Math.random() - 0.5) * 12,
        y: moodCy + 10 + (Math.random() - 0.5) * 20,
        vx: -wanderDirection * (0.2 + Math.random() * 0.3),
        vy: -(0.3 + Math.random() * 0.4),
        life: 50 + Math.random() * 30,
        maxLife: 50 + Math.random() * 30,
        size: 2 + Math.random() * 2.5,
        type: "happy_trail",
      });
    }
  } else {
    happyTrailTimer = 0;
  }

  // Sad rain cloud — when happiness < 30
  if (petHappiness < 30 && !isDragging && !minigameActive && !isSpinning) {
    sadCloudActive = true;
    // Cloud follows pet smoothly, hovering above head
    const targetCloudX = moodCx;
    const targetCloudY = moodCy - 55;
    sadCloudX += (targetCloudX - sadCloudX) * 0.08;
    sadCloudY += (targetCloudY - sadCloudY) * 0.08;
    // Gentle horizontal drift
    sadCloudX += Math.sin(frame * 0.02) * 0.3;

    // Spawn raindrops from the cloud
    sadRainTimer++;
    // More rain when sadder: interval from ~18 (very sad) to ~30 (mildly sad)
    const rainInterval = Math.max(10, 30 - (30 - petHappiness) * 0.7);
    if (sadRainTimer > rainInterval) {
      sadRainTimer = 0;
      particles.push({
        x: sadCloudX + (Math.random() - 0.5) * 24,
        y: sadCloudY + 8,
        vx: (Math.random() - 0.5) * 0.3,
        vy: 1 + Math.random() * 0.8,
        life: 35 + Math.random() * 15,
        maxLife: 35 + Math.random() * 15,
        size: 2 + Math.random() * 1.5,
        type: "raindrop",
      });
    }
  } else {
    sadCloudActive = false;
    sadRainTimer = 0;
  }

  // --- Sleep Schedule ---
  // Auto-sleep when night arrives after a delay
  if (currentTimeOfDay === "night" && !isSleeping && !sleepTransitionType && !minigameActive && !memoryGameActive && !isDragging && !isSpinning && !isCharging && activeTrick === null) {
    // Start falling asleep 5 seconds after night begins (or immediately if already night on load)
    if (frame > 300) { // give a small delay before auto-sleep kicks in
      startFallingAsleep();
    }
  }

  // Wake up when morning arrives
  if (currentTimeOfDay === "morning" && isSleeping && !sleepTransitionType) {
    startWakingUp();
  }

  // Sleep transition animations
  if (sleepTransitionType === "falling_asleep") {
    sleepTransitionProgress = Math.min(1, sleepTransitionProgress + 0.008); // ~2 seconds
    if (sleepTransitionProgress >= 1) {
      completeFallingAsleep();
    }
  } else if (sleepTransitionType === "waking_up") {
    sleepTransitionProgress = Math.min(1, sleepTransitionProgress + 0.012); // ~1.4 seconds
    if (sleepTransitionProgress >= 1) {
      completeWakingUp();
    }
  }

  // Breathing animation while sleeping
  if (isSleeping) {
    sleepBreathProgress += 0.025; // slow, gentle breathing cycle
    if (sleepBreathProgress > Math.PI * 2) sleepBreathProgress -= Math.PI * 2;
    sleepNightcapBob += 0.015;
  }

  // --- Pet Dreams (night only, when sleeping or sleepy) ---
  const dreamCx = canvas.width / 2;
  const dreamCy = canvas.height / 2 + bounceOffset;
  if (currentTimeOfDay === "night" && !isDragging && !isSpinning && !minigameActive && !isCharging) {
    dreamSpawnTimer++;
    // Spawn dream bubbles more frequently when sleeping, contextual icons
    const dreamInterval = isSleeping ? (120 + Math.floor(Math.random() * 80)) : (180 + Math.floor(Math.random() * 120));
    if (dreamSpawnTimer >= dreamInterval) {
      dreamSpawnTimer = 0;
      // Use contextual dream icons when sleeping
      const iconPool = isSleeping ? getContextualDreamIcons() : DREAM_ICONS;
      const icon = iconPool[Math.floor(Math.random() * iconPool.length)];
      dreamBubbles.push({
        x: dreamCx + (Math.random() - 0.5) * 20,
        y: dreamCy - 45,
        vx: (Math.random() - 0.5) * 0.15,
        vy: -(0.25 + Math.random() * 0.2),
        life: 180 + Math.floor(Math.random() * 60), // ~3-4 seconds
        maxLife: 180 + Math.floor(Math.random() * 60),
        icon,
        size: 12 + Math.random() * 4,
        wobblePhase: Math.random() * Math.PI * 2,
      });
    }
  } else {
    dreamSpawnTimer = 0;
  }
  // Update dream bubbles
  for (let i = dreamBubbles.length - 1; i >= 0; i--) {
    const db = dreamBubbles[i];
    db.x += db.vx;
    db.y += db.vy;
    db.wobblePhase += 0.04;
    db.life--;
    if (db.life <= 0) {
      dreamBubbles.splice(i, 1);
    }
  }
  // Clear dream bubbles when it's not night (smooth cleanup)
  if (currentTimeOfDay !== "night" && dreamBubbles.length > 0) {
    for (const db of dreamBubbles) {
      db.life = Math.min(db.life, 15); // fade out quickly
    }
  }

  // Idle bounce (speed and amplitude vary by time of day)
  if (!isDragging) {
    const amplitude = getBounceAmplitude();
    bounceOffset += getBounceSpeed() * bounceDirection;
    if (bounceOffset > amplitude) bounceDirection = -1;
    if (bounceOffset < -amplitude) bounceDirection = 1;
  }

  // Butterfly companion
  updateButterfly();

  // Day/night transition animation
  updateTimeTransition();

  // Mini-games
  updateMinigame();
  updateMemoryGame();

  // Pet stats decay
  updatePetStats();

  // Toy interactions
  updateToy();

  // Trick animations
  updateTricks();
}

function drawGrowthMark(cx: number, cy: number, size: number): void {
  if (currentGrowthStage === "baby") return; // no mark at baby stage

  const markY = cy - size * 0.22; // forehead area
  evolutionGlowPhase += 0.03;
  const pulse = 0.7 + 0.3 * Math.sin(evolutionGlowPhase);

  ctx.save();

  if (currentGrowthStage === "child") {
    // Small 4-pointed star on forehead — soft golden
    const starSize = 4;
    const alpha = 0.6 * pulse;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const r = i % 2 === 0 ? starSize : starSize * 0.35;
      const angle = (i * Math.PI) / 4 - Math.PI / 2;
      if (i === 0) ctx.moveTo(cx + Math.cos(angle) * r, markY + Math.sin(angle) * r);
      else ctx.lineTo(cx + Math.cos(angle) * r, markY + Math.sin(angle) * r);
    }
    ctx.closePath();
    ctx.fill();
    // Tiny glow
    ctx.globalAlpha = alpha * 0.3;
    ctx.beginPath();
    ctx.arc(cx, markY, starSize * 2, 0, Math.PI * 2);
    const g = ctx.createRadialGradient(cx, markY, 0, cx, markY, starSize * 2);
    g.addColorStop(0, "rgba(255, 215, 0, 0.4)");
    g.addColorStop(1, "rgba(255, 215, 0, 0)");
    ctx.fillStyle = g;
    ctx.fill();
  } else if (currentGrowthStage === "teen") {
    // Larger glowing 6-pointed star — brighter, with shimmer
    const starSize = 6;
    const alpha = 0.75 * pulse;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#FFB347";
    ctx.beginPath();
    for (let i = 0; i < 12; i++) {
      const r = i % 2 === 0 ? starSize : starSize * 0.4;
      const angle = (i * Math.PI) / 6 - Math.PI / 2 + Math.sin(evolutionGlowPhase * 0.5) * 0.1;
      if (i === 0) ctx.moveTo(cx + Math.cos(angle) * r, markY + Math.sin(angle) * r);
      else ctx.lineTo(cx + Math.cos(angle) * r, markY + Math.sin(angle) * r);
    }
    ctx.closePath();
    ctx.fill();
    // Inner bright core
    ctx.globalAlpha = alpha * 0.8;
    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    ctx.arc(cx, markY, starSize * 0.3, 0, Math.PI * 2);
    ctx.fill();
    // Glow
    ctx.globalAlpha = alpha * 0.25;
    ctx.beginPath();
    ctx.arc(cx, markY, starSize * 2.5, 0, Math.PI * 2);
    const g = ctx.createRadialGradient(cx, markY, 0, cx, markY, starSize * 2.5);
    g.addColorStop(0, "rgba(255, 179, 71, 0.5)");
    g.addColorStop(1, "rgba(255, 179, 71, 0)");
    ctx.fillStyle = g;
    ctx.fill();
  } else if (currentGrowthStage === "adult") {
    // Radiant golden crest — multi-layered star with bright aura
    const starSize = 8;
    const alpha = 0.85 * pulse;
    const slowSpin = evolutionGlowPhase * 0.3;

    // Outer soft aura
    ctx.globalAlpha = alpha * 0.15;
    ctx.beginPath();
    ctx.arc(cx, markY, starSize * 3.5, 0, Math.PI * 2);
    const auraG = ctx.createRadialGradient(cx, markY, 0, cx, markY, starSize * 3.5);
    auraG.addColorStop(0, "rgba(255, 215, 0, 0.6)");
    auraG.addColorStop(0.5, "rgba(255, 180, 50, 0.2)");
    auraG.addColorStop(1, "rgba(255, 215, 0, 0)");
    ctx.fillStyle = auraG;
    ctx.fill();

    // Outer rotating 8-pointed star (slightly transparent)
    ctx.globalAlpha = alpha * 0.4;
    ctx.fillStyle = "#FFC94D";
    ctx.beginPath();
    for (let i = 0; i < 16; i++) {
      const r = i % 2 === 0 ? starSize * 1.1 : starSize * 0.35;
      const angle = (i * Math.PI) / 8 + slowSpin;
      if (i === 0) ctx.moveTo(cx + Math.cos(angle) * r, markY + Math.sin(angle) * r);
      else ctx.lineTo(cx + Math.cos(angle) * r, markY + Math.sin(angle) * r);
    }
    ctx.closePath();
    ctx.fill();

    // Inner solid 6-pointed star
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    for (let i = 0; i < 12; i++) {
      const r = i % 2 === 0 ? starSize * 0.7 : starSize * 0.25;
      const angle = (i * Math.PI) / 6 - Math.PI / 2;
      if (i === 0) ctx.moveTo(cx + Math.cos(angle) * r, markY + Math.sin(angle) * r);
      else ctx.lineTo(cx + Math.cos(angle) * r, markY + Math.sin(angle) * r);
    }
    ctx.closePath();
    ctx.fill();

    // Bright white center
    ctx.globalAlpha = alpha * 0.9;
    ctx.fillStyle = "#FFFDE0";
    ctx.beginPath();
    ctx.arc(cx, markY, starSize * 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// Evolution celebration glow — a radiant expanding ring around the pet
function drawEvolutionGlow(cx: number, cy: number): void {
  if (!evolutionCelebrating) return;
  const progress = 1 - evolutionCelebrationTimer / EVOLUTION_CELEBRATION_DURATION;
  const alpha = Math.sin(progress * Math.PI); // fade in and out

  // Expanding golden ring
  const ringRadius = 40 + progress * 30;
  ctx.save();
  ctx.globalAlpha = alpha * 0.4;
  ctx.strokeStyle = "#FFD700";
  ctx.lineWidth = 3 - progress * 2;
  ctx.beginPath();
  ctx.arc(cx, cy + 5, ringRadius, 0, Math.PI * 2);
  ctx.stroke();

  // Inner warm glow
  ctx.globalAlpha = alpha * 0.2;
  const g = ctx.createRadialGradient(cx, cy + 5, 0, cx, cy + 5, ringRadius);
  g.addColorStop(0, "rgba(255, 215, 0, 0.4)");
  g.addColorStop(0.6, "rgba(255, 200, 50, 0.1)");
  g.addColorStop(1, "rgba(255, 215, 0, 0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(cx, cy + 5, ringRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawNightcap(cx: number, cy: number, size: number): void {
  if (!isSleeping && sleepTransitionType !== "falling_asleep") return;
  const alpha = isSleeping ? 1 : sleepTransitionProgress;
  if (alpha < 0.05) return;

  ctx.save();
  ctx.globalAlpha = alpha;

  const headY = cy - size * 0.2;
  const capTilt = Math.sin(sleepNightcapBob) * 0.08;
  ctx.translate(cx, headY - 20);
  ctx.rotate(capTilt);

  // Nightcap body — soft purple cone shape drooping to the right
  ctx.beginPath();
  ctx.moveTo(-12, 2);     // left base
  ctx.quadraticCurveTo(-8, -12, 0, -14); // curve up
  ctx.quadraticCurveTo(10, -16, 22, 5);  // droop to right
  ctx.quadraticCurveTo(18, 12, 8, 8);    // curve down
  ctx.quadraticCurveTo(0, 6, -12, 2);    // back to base
  ctx.closePath();

  // Fill with gradient
  const capGrad = ctx.createLinearGradient(-12, -14, 22, 8);
  capGrad.addColorStop(0, "#8866CC");
  capGrad.addColorStop(1, "#6644AA");
  ctx.fillStyle = capGrad;
  ctx.fill();
  ctx.strokeStyle = "#554488";
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // White rim at base
  ctx.beginPath();
  ctx.moveTo(-14, 2);
  ctx.quadraticCurveTo(0, 6, 8, 5);
  ctx.quadraticCurveTo(2, 8, -14, 4);
  ctx.closePath();
  ctx.fillStyle = "#EEDDFF";
  ctx.fill();

  // Pompom at the tip
  const pompX = 22;
  const pompY = 5;
  ctx.beginPath();
  ctx.arc(pompX, pompY, 4, 0, Math.PI * 2);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.strokeStyle = "#DDCCEE";
  ctx.lineWidth = 0.8;
  ctx.stroke();

  // Small stars on the cap
  ctx.fillStyle = "#FFD700";
  ctx.globalAlpha = alpha * 0.7;
  for (const star of [{x: 2, y: -8, s: 2}, {x: 12, y: -4, s: 1.5}, {x: 8, y: -10, s: 1.8}]) {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? star.s : star.s * 0.4;
      const angle = (i * Math.PI) / 5 - Math.PI / 2;
      if (i === 0) ctx.moveTo(star.x + Math.cos(angle) * r, star.y + Math.sin(angle) * r);
      else ctx.lineTo(star.x + Math.cos(angle) * r, star.y + Math.sin(angle) * r);
    }
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

function drawAccessory(cx: number, cy: number, size: number): void {
  // Draw nightcap over any accessory when sleeping
  drawNightcap(cx, cy, size);
  if (currentAccessory === "none") return;

  const headY = cy - size * 0.2; // top of head area

  ctx.save();
  switch (currentAccessory) {
    case "crown": {
      // Golden crown sitting on top of head
      const crownY = headY - 22;
      const crownW = 28;
      const crownH = 16;
      // Base
      ctx.beginPath();
      ctx.rect(cx - crownW / 2, crownY, crownW, crownH * 0.4);
      ctx.fillStyle = "#FFD700";
      ctx.fill();
      ctx.strokeStyle = "#DAA520";
      ctx.lineWidth = 1;
      ctx.stroke();
      // Points
      ctx.beginPath();
      ctx.moveTo(cx - crownW / 2, crownY);
      ctx.lineTo(cx - crownW / 2 + 2, crownY - crownH * 0.6);
      ctx.lineTo(cx - crownW / 4, crownY - crownH * 0.2);
      ctx.lineTo(cx, crownY - crownH);
      ctx.lineTo(cx + crownW / 4, crownY - crownH * 0.2);
      ctx.lineTo(cx + crownW / 2 - 2, crownY - crownH * 0.6);
      ctx.lineTo(cx + crownW / 2, crownY);
      ctx.closePath();
      ctx.fillStyle = "#FFD700";
      ctx.fill();
      ctx.strokeStyle = "#DAA520";
      ctx.lineWidth = 1;
      ctx.stroke();
      // Jewels
      ctx.beginPath();
      ctx.arc(cx, crownY - crownH * 0.6, 2, 0, Math.PI * 2);
      ctx.fillStyle = "#FF4444";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx - crownW / 4, crownY - 1, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = "#44AAFF";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + crownW / 4, crownY - 1, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = "#44FF88";
      ctx.fill();
      break;
    }
    case "bow": {
      // Cute pink bow on top of head
      const bowY = headY - 18;
      const bowSize = 12;
      // Left loop
      ctx.beginPath();
      ctx.ellipse(cx - bowSize * 0.7, bowY, bowSize * 0.7, bowSize * 0.4, -0.3, 0, Math.PI * 2);
      ctx.fillStyle = "#FF69B4";
      ctx.fill();
      ctx.strokeStyle = "#FF1493";
      ctx.lineWidth = 1;
      ctx.stroke();
      // Right loop
      ctx.beginPath();
      ctx.ellipse(cx + bowSize * 0.7, bowY, bowSize * 0.7, bowSize * 0.4, 0.3, 0, Math.PI * 2);
      ctx.fillStyle = "#FF69B4";
      ctx.fill();
      ctx.strokeStyle = "#FF1493";
      ctx.lineWidth = 1;
      ctx.stroke();
      // Center knot
      ctx.beginPath();
      ctx.arc(cx, bowY, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#FF1493";
      ctx.fill();
      // Ribbon tails
      ctx.beginPath();
      ctx.moveTo(cx - 2, bowY + 2);
      ctx.quadraticCurveTo(cx - 5, bowY + 10, cx - 3, bowY + 14);
      ctx.strokeStyle = "#FF69B4";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + 2, bowY + 2);
      ctx.quadraticCurveTo(cx + 5, bowY + 10, cx + 3, bowY + 14);
      ctx.stroke();
      break;
    }
    case "glasses": {
      // Round glasses on the face
      const glassY = cy - 5;
      const glassR = 10;
      const spacing = 14;
      // Left lens
      ctx.beginPath();
      ctx.arc(cx - spacing, glassY, glassR, 0, Math.PI * 2);
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 2;
      ctx.stroke();
      // Right lens
      ctx.beginPath();
      ctx.arc(cx + spacing, glassY, glassR, 0, Math.PI * 2);
      ctx.stroke();
      // Bridge
      ctx.beginPath();
      ctx.moveTo(cx - spacing + glassR, glassY);
      ctx.lineTo(cx + spacing - glassR, glassY);
      ctx.stroke();
      // Earpieces (small lines going outward)
      ctx.beginPath();
      ctx.moveTo(cx - spacing - glassR, glassY);
      ctx.lineTo(cx - spacing - glassR - 6, glassY - 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + spacing + glassR, glassY);
      ctx.lineTo(cx + spacing + glassR + 6, glassY - 2);
      ctx.stroke();
      // Lens shine
      ctx.beginPath();
      ctx.arc(cx - spacing + 3, glassY - 3, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + spacing + 3, glassY - 3, 2.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "flower": {
      // Flower tucked on the side of the head
      const flowerX = cx + 25;
      const flowerY = headY - 12;
      const petalR = 5;
      // Petals
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
        ctx.beginPath();
        ctx.ellipse(
          flowerX + Math.cos(angle) * petalR,
          flowerY + Math.sin(angle) * petalR,
          petalR * 0.8, petalR * 0.5,
          angle, 0, Math.PI * 2
        );
        ctx.fillStyle = "#FF8888";
        ctx.fill();
        ctx.strokeStyle = "#FF6666";
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
      // Center
      ctx.beginPath();
      ctx.arc(flowerX, flowerY, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = "#FFDD44";
      ctx.fill();
      // Stem peeking down
      ctx.beginPath();
      ctx.moveTo(flowerX, flowerY + petalR);
      ctx.quadraticCurveTo(flowerX + 3, flowerY + petalR + 8, flowerX + 1, flowerY + petalR + 12);
      ctx.strokeStyle = "#66AA44";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // Tiny leaf
      ctx.beginPath();
      ctx.ellipse(flowerX + 4, flowerY + petalR + 6, 3, 1.5, 0.5, 0, Math.PI * 2);
      ctx.fillStyle = "#66AA44";
      ctx.fill();
      break;
    }
    case "party_hat": {
      // Cone-shaped party hat with stripes
      const hatY = headY - 20;
      const hatW = 22;
      const hatH = 28;
      // Cone
      ctx.beginPath();
      ctx.moveTo(cx, hatY - hatH);
      ctx.lineTo(cx - hatW / 2, hatY);
      ctx.lineTo(cx + hatW / 2, hatY);
      ctx.closePath();
      ctx.fillStyle = "#FF6699";
      ctx.fill();
      ctx.strokeStyle = "#DD4477";
      ctx.lineWidth = 1;
      ctx.stroke();
      // Stripes
      for (let i = 1; i < 4; i++) {
        const t = i / 4;
        const stripeY = hatY - hatH * t;
        const stripeW = hatW * (1 - t) / 2;
        ctx.beginPath();
        ctx.moveTo(cx - stripeW, stripeY);
        ctx.lineTo(cx + stripeW, stripeY);
        ctx.strokeStyle = "#FFDD44";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      // Pom-pom on top
      ctx.beginPath();
      ctx.arc(cx, hatY - hatH, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#FFDD44";
      ctx.fill();
      // Elastic band
      ctx.beginPath();
      ctx.ellipse(cx, hatY, hatW / 2, 3, 0, 0, Math.PI);
      ctx.strokeStyle = "#DD4477";
      ctx.lineWidth = 1;
      ctx.stroke();
      break;
    }
    case "cat_ears": {
      // Cat ears on top of head
      const earY = headY - 18;
      const earSpacing = 18;
      const earH = 18;
      for (const side of [-1, 1]) {
        const earX = cx + side * earSpacing;
        // Outer ear
        ctx.beginPath();
        ctx.moveTo(earX - 8, earY + earH * 0.3);
        ctx.lineTo(earX + side * 2, earY - earH);
        ctx.lineTo(earX + 8, earY + earH * 0.3);
        ctx.closePath();
        ctx.fillStyle = "#555566";
        ctx.fill();
        ctx.strokeStyle = "#333344";
        ctx.lineWidth = 1;
        ctx.stroke();
        // Inner ear (pink)
        ctx.beginPath();
        ctx.moveTo(earX - 4, earY + earH * 0.2);
        ctx.lineTo(earX + side * 1.5, earY - earH * 0.6);
        ctx.lineTo(earX + 4, earY + earH * 0.2);
        ctx.closePath();
        ctx.fillStyle = "#FFAABB";
        ctx.fill();
      }
      break;
    }
    case "top_hat": {
      // Dapper top hat
      const hatY = headY - 20;
      const brimW = 32;
      const topW = 20;
      const hatH = 24;
      // Brim
      ctx.beginPath();
      ctx.ellipse(cx, hatY, brimW / 2, 4, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#222233";
      ctx.fill();
      ctx.strokeStyle = "#111122";
      ctx.lineWidth = 1;
      ctx.stroke();
      // Cylinder
      ctx.beginPath();
      ctx.rect(cx - topW / 2, hatY - hatH, topW, hatH);
      ctx.fillStyle = "#222233";
      ctx.fill();
      ctx.strokeStyle = "#111122";
      ctx.lineWidth = 1;
      ctx.stroke();
      // Top ellipse
      ctx.beginPath();
      ctx.ellipse(cx, hatY - hatH, topW / 2, 3, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#333344";
      ctx.fill();
      ctx.stroke();
      // Band
      ctx.beginPath();
      ctx.rect(cx - topW / 2, hatY - 6, topW, 4);
      ctx.fillStyle = "#884444";
      ctx.fill();
      break;
    }
    case "headband_star": {
      // Headband with a bouncing star
      const bandY = headY - 16;
      // Headband arc
      ctx.beginPath();
      ctx.ellipse(cx, bandY + 4, 28, 6, 0, Math.PI, Math.PI * 2);
      ctx.strokeStyle = "#FFAA00";
      ctx.lineWidth = 2.5;
      ctx.stroke();
      // Antenna wire
      const bobble = Math.sin(frame * 0.1) * 3;
      ctx.beginPath();
      ctx.moveTo(cx, bandY);
      ctx.quadraticCurveTo(cx + 3, bandY - 12 + bobble, cx, bandY - 20 + bobble);
      ctx.strokeStyle = "#FFAA00";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // Star on top
      const starX = cx;
      const starY = bandY - 20 + bobble;
      const starR = 5;
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? starR : starR * 0.4;
        const angle = (i * Math.PI) / 5 - Math.PI / 2;
        if (i === 0) ctx.moveTo(starX + Math.cos(angle) * r, starY + Math.sin(angle) * r);
        else ctx.lineTo(starX + Math.cos(angle) * r, starY + Math.sin(angle) * r);
      }
      ctx.closePath();
      ctx.fillStyle = "#FFDD00";
      ctx.fill();
      ctx.strokeStyle = "#FFAA00";
      ctx.lineWidth = 0.5;
      ctx.stroke();
      break;
    }
  }
  ctx.restore();
}

function drawComboCounter(cx: number, y: number): void {
  // Show active combo (3+) or fading final count
  let displayCount = 0;
  let alpha = 1;

  if (comboCount >= 3) {
    displayCount = comboCount;
    alpha = 1;
  } else if (comboDisplayTimer > 0 && comboDisplayValue >= 3) {
    displayCount = comboDisplayValue;
    alpha = comboDisplayTimer / 60;
  }

  if (displayCount === 0) return;

  ctx.save();

  // Shake effect for big combos
  const shakeX = comboShakeAmount > 0 ? (Math.random() - 0.5) * comboShakeAmount * 2 : 0;
  const shakeY = comboShakeAmount > 0 ? (Math.random() - 0.5) * comboShakeAmount * 2 : 0;

  const drawX = cx + shakeX;
  const drawY = y + shakeY;

  // Scale pulse
  const scale = comboCount >= 3 ? comboScale : 1;
  ctx.translate(drawX, drawY);
  ctx.scale(scale, scale);

  // Color escalation based on combo count
  let color: string;
  let glowColor: string;
  if (displayCount >= 20) {
    color = "#FF2266";      // legendary pink-red
    glowColor = "rgba(255, 34, 102, ";
  } else if (displayCount >= 15) {
    color = "#FF4400";      // unstoppable orange-red
    glowColor = "rgba(255, 68, 0, ";
  } else if (displayCount >= 10) {
    color = "#FF8800";      // mega orange
    glowColor = "rgba(255, 136, 0, ";
  } else if (displayCount >= 5) {
    color = "#FFCC00";      // nice yellow
    glowColor = "rgba(255, 204, 0, ";
  } else {
    color = "#FFFFFF";      // basic white
    glowColor = "rgba(255, 255, 255, ";
  }

  ctx.globalAlpha = alpha;

  // Glow behind text for high combos
  if (displayCount >= 5) {
    ctx.beginPath();
    ctx.arc(0, 0, 18 + displayCount * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = glowColor + (0.15 * alpha) + ")";
    ctx.fill();
  }

  // Counter text
  const fontSize = Math.min(14 + displayCount * 0.5, 22);
  ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Text outline for readability
  ctx.strokeStyle = "rgba(0, 0, 0, " + (0.5 * alpha) + ")";
  ctx.lineWidth = 3;
  ctx.strokeText(`${displayCount}x`, 0, 0);

  ctx.fillStyle = color;
  ctx.fillText(`${displayCount}x`, 0, 0);

  ctx.restore();
}

function draw(): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const cx = canvas.width / 2;
  const cy = canvas.height / 2 + bounceOffset;
  const size = 120;

  // Ambient background glow (behind everything — subtle time-of-day atmosphere)
  drawAmbientGlow(cx, cy);

  // Day/night transition overlay (behind pet, after ambient glow)
  if (isTimeTransitioning) {
    drawTimeTransition(cx, cy);
  }

  // Weather overlay (atmosphere effects — behind pet)
  drawWeatherOverlay();

  // Footprints (on the ground, behind everything else)
  drawFootprints();

  // Toy (on the ground, behind the pet body)
  drawToy(cx, cy);

  // Shadow (wider when squished — combine click squish and landing squish)
  const totalSquish = Math.min(squishAmount + landingSquish, 1.2);
  const shadowStretch = 1 + totalSquish * 0.3;
  ctx.beginPath();
  ctx.ellipse(canvas.width / 2, canvas.height / 2 + size * 0.42, 30 * shadowStretch, 8, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fill();

  // Charge-up ring (drawn behind the pet body)
  drawChargeRing(cx, cy, size);

  // Friendship aura (drawn behind the pet body)
  drawFriendshipAura(cx, cy);

  // Apply squish + wander lean + spin transform
  ctx.save();
  const feetY = canvas.height / 2 + size * 0.35;
  if (totalSquish > 0 && !isSpinning) {
    const scaleX = 1 + totalSquish * 0.15;
    const scaleY = 1 - totalSquish * 0.15;
    ctx.translate(cx, feetY);
    ctx.scale(scaleX, scaleY);
    ctx.translate(-cx, -feetY);
  }
  // Spin trick — full 360° backflip rotation around center
  if (isSpinning) {
    const spinAngle = spinProgress * Math.PI * 2;
    // Ease-in-out: slow start and end, fast in the middle
    const eased = 0.5 - 0.5 * Math.cos(spinProgress * Math.PI);
    const easedAngle = eased * Math.PI * 2;
    // Slight vertical hop during spin (parabolic arc)
    const hopHeight = Math.sin(spinProgress * Math.PI) * 15;
    ctx.translate(cx, cy - hopHeight);
    ctx.rotate(easedAngle);
    ctx.translate(-cx, -cy);
  }
  // Trick animation transform
  const trickTx = getTrickTransform();
  if (trickTx) {
    ctx.translate(cx + trickTx.offsetX, cy + trickTx.offsetY);
    ctx.rotate(trickTx.rotation);
    ctx.scale(trickTx.scaleX, trickTx.scaleY);
    ctx.translate(-cx, -cy);
  }
  // Lean tilt when wandering (rotate around feet)
  if (Math.abs(wanderLean) > 0.01 && !isSpinning) {
    ctx.translate(cx, feetY);
    ctx.rotate(wanderLean * 0.06); // subtle tilt, ~3.4 degrees max
    ctx.translate(-cx, -feetY);
  }
  // Sleeping breathing animation — gentle rhythmic scale
  if ((isSleeping || sleepTransitionType === "falling_asleep") && !isSpinning) {
    const breathAmount = isSleeping ? 1 : sleepTransitionProgress;
    const breathScale = Math.sin(sleepBreathProgress) * 0.02 * breathAmount;
    ctx.translate(cx, feetY);
    ctx.scale(1 + breathScale, 1 - breathScale * 0.5);
    ctx.translate(-cx, -feetY);
  }

  // Droopy posture when happiness or energy is critically low
  if (!isSpinning && !isHappy && !isSleeping) {
    const droopFactor = Math.max(
      petHappiness < 25 ? (25 - petHappiness) / 25 * 0.04 : 0,
      petEnergy < 20 ? (20 - petEnergy) / 20 * 0.05 : 0,
    );
    if (droopFactor > 0.001) {
      // Slight vertical compression + downward shift — looks like sagging
      ctx.translate(cx, feetY);
      ctx.scale(1.0, 1.0 - droopFactor);
      ctx.translate(-cx, -feetY);
    }
  }

  // Charge vibration — pet shakes as it charges up
  if (isCharging && chargeVibrate > 0) {
    const vx = (Math.random() - 0.5) * chargeVibrate * 2;
    const vy = (Math.random() - 0.5) * chargeVibrate * 2;
    ctx.translate(vx, vy);
  }

  // Evolution morph pulse — subtle scale breathing during transition
  if (evolutionMorphing) {
    const morphPulse = Math.sin(evolutionMorphProgress * Math.PI * 3) * 0.04 * (1 - evolutionMorphProgress);
    ctx.translate(cx, feetY);
    ctx.scale(1 + morphPulse, 1 - morphPulse * 0.5);
    ctx.translate(-cx, -feetY);
  }

  // Personality visual transforms
  if (petPersonality === "energetic" && !isSpinning && !isDragging && idleAnim === "none") {
    // Energetic pets have a subtle micro-jitter when standing still
    const jitterX = (Math.sin(frame * 0.8) + Math.sin(frame * 1.3)) * 0.4;
    const jitterY = (Math.cos(frame * 0.9) + Math.cos(frame * 1.1)) * 0.3;
    ctx.translate(jitterX, jitterY);
  }
  if (petPersonality === "curious" && !isSpinning && idleAnim === "none") {
    // Curious pets have a subtle persistent head tilt
    const tilt = Math.sin(frame * 0.015) * 0.04;
    ctx.translate(cx, feetY);
    ctx.rotate(tilt);
    ctx.translate(-cx, -feetY);
  }

  // Idle animation transforms
  if (idleAnim !== "none" && !isSpinning) {
    const t = idleAnimProgress;
    const ease = Math.sin(t * Math.PI); // bell curve: 0→1→0

    if (idleAnim === "stretch") {
      // Stretch tall then snap back — vertical elongation
      const stretchY = ease * 0.08;
      const stretchX = ease * -0.03;
      ctx.translate(cx, feetY);
      ctx.scale(1 + stretchX, 1 + stretchY);
      ctx.translate(-cx, -feetY);
    } else if (idleAnim === "wiggle") {
      // Sway side to side — quick oscillating rotation
      const wiggle = Math.sin(t * Math.PI * 4) * ease * 0.07;
      ctx.translate(cx, feetY);
      ctx.rotate(wiggle);
      ctx.translate(-cx, -feetY);
    } else if (idleAnim === "curious_peek") {
      // Lean to one side curiously
      const lean = ease * 0.08 * idlePeekDirection;
      const shift = ease * 6 * idlePeekDirection;
      ctx.translate(cx, feetY);
      ctx.rotate(lean);
      ctx.translate(-cx + shift, -feetY);
    } else if (idleAnim === "hop") {
      // Quick little hop — vertical translation
      const hopHeight = Math.sin(t * Math.PI) * 8;
      ctx.translate(0, -hopHeight);
    }
    // look_around doesn't need transforms — it modifies eye drawing
  }

  drawFeet(cx, cy, size);
  drawBody(cx, cy, size);
  drawFace(cx, cy, size);
  drawGrowthMark(cx, cy, size);
  drawAccessory(cx, cy, size);
  ctx.restore();

  // Evolution celebration glow (outside transform context)
  drawEvolutionGlow(canvas.width / 2, canvas.height / 2);

  // Draw particles on top (not affected by squish)
  for (const p of particles) {
    const alpha = p.life / p.maxLife;
    if (p.type === "heart") {
      drawHeart(p.x, p.y, p.size, alpha);
    } else if (p.type === "zzz") {
      drawZzz(p.x, p.y, p.size, alpha);
    } else if (p.type === "dust") {
      drawDust(p.x, p.y, p.size, alpha);
    } else if (p.type === "sparkle") {
      drawSparkle(p.x, p.y, p.size, alpha, p.life);
    } else if (p.type === "pollen") {
      drawPollen(p.x, p.y, p.size, alpha);
    } else if (p.type === "firefly") {
      drawFirefly(p.x, p.y, p.size, alpha, p.life);
    } else if (p.type === "star") {
      drawStar(p.x, p.y, p.size, alpha, p.life);
    } else if (p.type === "sweat") {
      drawSweat(p.x, p.y, p.size, alpha);
    } else if (p.type === "growl") {
      drawGrowl(p.x, p.y, p.size, alpha, p.life);
    } else if (p.type === "confetti") {
      drawConfetti(p.x, p.y, p.size, alpha, p.life, p.color || "#FF4488");
    } else if (p.type === "raindrop") {
      drawRaindrop(p.x, p.y, p.size, alpha);
    } else if (p.type === "happy_trail") {
      drawHappyTrail(p.x, p.y, p.size, alpha, p.life);
    } else if (p.type === "blossom") {
      drawBlossom(p.x, p.y, p.size, alpha, p.life);
    } else if (p.type === "leaf") {
      drawLeaf(p.x, p.y, p.size, alpha, p.life);
    } else if (p.type === "snowflake") {
      drawSnowflake(p.x, p.y, p.size, alpha, p.life);
    }
  }

  // Pet emotes (floating emoji, above particles)
  drawEmotes();

  // Floating bubbles (above emotes, below speech bubble)
  for (const b of bubbles) {
    drawBubble(b);
  }

  // Shooting stars (sky background layer)
  drawShootingStars();

  // Constellations (sky layer, behind fireflies)
  drawConstellations();

  // Fireflies (above bubbles, atmospheric layer)
  drawFireflies();
  drawFireflyJar();

  // Morning dew drops (ground-level, above particles)
  drawDewDrops();

  // Message in a bottle (ground-level, drifting)
  drawMessageBottle();

  // Fortune cookie (above bubbles, below speech bubble)
  drawFortuneCookie();

  // Sad rain cloud (drawn above particles, below speech bubble)
  if (sadCloudActive) {
    drawSadCloud(sadCloudX, sadCloudY);
  }

  // Butterfly companion (drawn above particles, below speech bubble)
  drawButterfly();

  // Dream bubbles (above butterfly, below speech bubble)
  for (const db of dreamBubbles) {
    drawDreamBubble(db);
  }

  // Achievement celebration glow
  if (achievementCelebrating) {
    const glowAlpha = achievementCelebrationTimer / 60;
    const glowRadius = 55 + (1 - glowAlpha) * 20;
    ctx.save();
    ctx.globalAlpha = glowAlpha * 0.3;
    ctx.beginPath();
    ctx.arc(cx, cy + 5, glowRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#FFD700";
    ctx.fill();
    ctx.restore();
  }

  // Pet stat bars (below the pet)
  if (!minigameActive && !memoryGameActive) {
    drawStatBars();
  }

  // Weather widget (top-left corner)
  drawWeatherWidget();

  // Mini-game stars and HUD (above pet, below speech bubble)
  drawMinigame();
  drawMemoryGame();

  // Combo counter (above pet, near speech bubble area)
  drawComboCounter(cx, cy - size * 0.55);

  // Speech bubble (above everything)
  drawSpeechBubble(cx, cy - size * 0.4);

  // Stats panel overlay (topmost layer)
  drawStatsPanel();

  // Diary panel overlay
  drawDiaryPanel();

  // Mood journal overlay
  drawMoodJournal();

  // Settings panel overlay
  drawSettingsPanel();

  // Photo flash overlay
  if (photoFlashAlpha > 0) {
    ctx.save();
    ctx.globalAlpha = photoFlashAlpha;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    photoFlashAlpha = Math.max(0, photoFlashAlpha - photoFlashDecay);
  }

  // Shortcut help overlay (above everything)
  // Animate fade
  if (shortcutHelpOpen && shortcutHelpFade < 1) {
    shortcutHelpFade = Math.min(1, shortcutHelpFade + SHORTCUT_HELP_FADE_SPEED);
  } else if (!shortcutHelpOpen && shortcutHelpFade > 0) {
    shortcutHelpFade = Math.max(0, shortcutHelpFade - SHORTCUT_HELP_FADE_SPEED);
  }
  drawShortcutHelp();
}

function loop(): void {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();

// Report initial achievement state
reportAchievements();

// --- Butterfly Companion ---
interface Butterfly {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  wingAngle: number;    // 0-1 for wing flap cycle
  wingSpeed: number;
  state: "flying" | "resting" | "approaching";
  stateTimer: number;
  restTimer: number;
  hue: number;          // color hue (degrees)
  size: number;
  wobblePhase: number;
}

const butterfly: Butterfly = {
  x: canvas.width / 2 + 30,
  y: canvas.height / 2 - 40,
  targetX: canvas.width / 2 + 30,
  targetY: canvas.height / 2 - 40,
  wingAngle: 0,
  wingSpeed: 0.15,
  state: "flying",
  stateTimer: 120 + Math.floor(Math.random() * 180),
  restTimer: 0,
  hue: 280, // purple-ish
  size: 6,
  wobblePhase: Math.random() * Math.PI * 2,
};

function updateButterfly(): void {
  const petCx = canvas.width / 2;
  const petCy = canvas.height / 2 + bounceOffset;

  // Wing flapping
  const flapSpeed = butterfly.state === "resting" ? 0.02 : butterfly.wingSpeed;
  butterfly.wingAngle += flapSpeed;
  if (butterfly.wingAngle > 1) butterfly.wingAngle -= 1;

  // Wobble phase for gentle oscillation
  butterfly.wobblePhase += 0.04;

  butterfly.stateTimer--;

  // Time-of-day behavior
  const isNightTime = currentTimeOfDay === "night";
  const activityMult = isNightTime ? 0.3 : currentTimeOfDay === "morning" ? 1.2 : 1.0;

  if (butterfly.state === "flying") {
    // Pick a new wander target near the pet
    if (butterfly.stateTimer <= 0 || distTo(butterfly.x, butterfly.y, butterfly.targetX, butterfly.targetY) < 5) {
      // Chance to land on the pet
      const restChance = isNightTime ? 0.6 : 0.2;
      if (Math.random() < restChance) {
        butterfly.state = "approaching";
        // Land on top of pet's head
        butterfly.targetX = petCx + (Math.random() - 0.5) * 20;
        butterfly.targetY = petCy - 35;
        butterfly.stateTimer = 200;
      } else {
        // New flying target
        const angle = Math.random() * Math.PI * 2;
        const dist = 30 + Math.random() * 50;
        butterfly.targetX = petCx + Math.cos(angle) * dist;
        butterfly.targetY = petCy - 20 + Math.sin(angle) * dist * 0.5;
        // Keep within canvas bounds
        butterfly.targetX = Math.max(10, Math.min(canvas.width - 10, butterfly.targetX));
        butterfly.targetY = Math.max(10, Math.min(canvas.height - 30, butterfly.targetY));
        butterfly.stateTimer = 60 + Math.floor(Math.random() * 120 * activityMult);
      }
    }

    // Move toward target with gentle sine wobble
    const dx = butterfly.targetX - butterfly.x;
    const dy = butterfly.targetY - butterfly.y;
    const speed = 0.8 * activityMult;
    butterfly.x += dx * 0.03 * speed;
    butterfly.y += dy * 0.03 * speed + Math.sin(butterfly.wobblePhase) * 0.5;
    butterfly.wingSpeed = 0.12 + activityMult * 0.05;

  } else if (butterfly.state === "approaching") {
    // Fly toward landing spot
    const dx = butterfly.targetX - butterfly.x;
    const dy = butterfly.targetY - butterfly.y;
    butterfly.x += dx * 0.06;
    butterfly.y += dy * 0.06;
    butterfly.wingSpeed = 0.1;

    if (distTo(butterfly.x, butterfly.y, butterfly.targetX, butterfly.targetY) < 3 || butterfly.stateTimer <= 0) {
      butterfly.state = "resting";
      butterfly.x = butterfly.targetX;
      butterfly.y = butterfly.targetY;
      playButterflyLandSound();
      // Rest for 3-8 seconds (longer at night)
      const restDuration = isNightTime ? 300 + Math.random() * 300 : 180 + Math.random() * 300;
      butterfly.restTimer = Math.floor(restDuration);
      butterfly.stateTimer = butterfly.restTimer;
    }

  } else if (butterfly.state === "resting") {
    // Sit on the pet's head, follow bounce
    butterfly.x = petCx + (butterfly.targetX - petCx) * 0.3;
    butterfly.y = petCy - 35 + Math.sin(butterfly.wobblePhase * 0.5) * 0.5;

    if (butterfly.stateTimer <= 0 || isDragging || isSpinning) {
      // Take off!
      butterfly.state = "flying";
      butterfly.stateTimer = 90 + Math.floor(Math.random() * 120);
      butterfly.targetY = butterfly.y - 20;
    }
  }
}

function distTo(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function drawButterfly(): void {
  const { x, y, wingAngle, hue, size, state } = butterfly;
  const wingOpen = Math.abs(Math.sin(wingAngle * Math.PI * 2)); // 0-1

  ctx.save();
  ctx.translate(x, y);

  // Slight tilt based on movement direction
  if (state !== "resting") {
    const tilt = (butterfly.targetX - x) * 0.005;
    ctx.rotate(Math.max(-0.3, Math.min(0.3, tilt)));
  }

  // Wings — two pairs, mirrored
  const wingSpan = size * (0.6 + wingOpen * 1.2);
  const wingH = size * (0.4 + wingOpen * 0.6);

  // Upper wings
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(side * wingSpan * 0.5, -wingH * 0.2, wingSpan * 0.55, wingH * 0.7, side * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${hue}, 70%, 65%, ${0.7 + wingOpen * 0.2})`;
    ctx.fill();
    ctx.strokeStyle = `hsla(${hue}, 60%, 45%, 0.5)`;
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Wing pattern dot
    ctx.beginPath();
    ctx.arc(side * wingSpan * 0.45, -wingH * 0.15, size * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${(hue + 40) % 360}, 80%, 80%, ${0.5 + wingOpen * 0.3})`;
    ctx.fill();
  }

  // Lower wings (smaller)
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(side * wingSpan * 0.35, wingH * 0.3, wingSpan * 0.35, wingH * 0.5, side * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${(hue + 20) % 360}, 65%, 60%, ${0.6 + wingOpen * 0.2})`;
    ctx.fill();
  }

  // Body (tiny oval)
  ctx.beginPath();
  ctx.ellipse(0, 0, size * 0.15, size * 0.4, 0, 0, Math.PI * 2);
  ctx.fillStyle = `hsl(${hue}, 40%, 30%)`;
  ctx.fill();

  // Antennae
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.3);
    ctx.quadraticCurveTo(side * size * 0.3, -size * 0.8, side * size * 0.4, -size * 0.9);
    ctx.strokeStyle = `hsl(${hue}, 40%, 30%)`;
    ctx.lineWidth = 0.7;
    ctx.stroke();
    // Antenna tip
    ctx.beginPath();
    ctx.arc(side * size * 0.4, -size * 0.9, 0.8, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${hue}, 40%, 30%)`;
    ctx.fill();
  }

  ctx.restore();
}

// --- Keyboard Shortcuts ---
let shortcutHelpOpen = false;
let shortcutHelpFade = 0; // 0-1 animation
const SHORTCUT_HELP_FADE_SPEED = 0.08;
let shortcutUsageCount = 0; // track how many times shortcuts are used

function toggleShortcutHelp(): void {
  shortcutHelpOpen = !shortcutHelpOpen;
  if (shortcutHelpOpen) {
    playTone(700, 0.08, "sine", 0.06);
    setTimeout(() => playTone(900, 0.1, "sine", 0.06), 50);
  } else {
    playTone(900, 0.06, "sine", 0.04);
    setTimeout(() => playTone(700, 0.08, "sine", 0.04), 50);
  }
}

function drawShortcutHelp(): void {
  if (shortcutHelpFade <= 0) return;

  const w = canvas.width;
  const h = canvas.height;
  const alpha = shortcutHelpFade;

  ctx.save();
  ctx.globalAlpha = alpha;

  // Dark glass background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
  bgGrad.addColorStop(0, "rgba(20, 15, 40, 0.92)");
  bgGrad.addColorStop(1, "rgba(10, 8, 25, 0.95)");
  ctx.fillStyle = bgGrad;
  ctx.beginPath();
  ctx.roundRect(6, 6, w - 12, h - 12, 10);
  ctx.fill();

  // Border glow
  ctx.strokeStyle = `rgba(120, 180, 255, ${0.4 * alpha})`;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Title
  ctx.fillStyle = "#FFD700";
  ctx.font = "bold 11px monospace";
  ctx.textAlign = "center";
  ctx.fillText("⌨ Keyboard Shortcuts", w / 2, 26);

  // Shortcut entries
  const shortcuts = [
    ["Space", "Pet / Click"],
    ["F", "Feed Pet"],
    ["N", "Power Nap"],
    ["S", "Toggle Stats"],
    ["D", "Pet Diary"],
    ["M", "Toggle Sound"],
    ["W", "Toggle Wandering"],
    ["1", "Star Catcher"],
    ["2", "Memory Match"],
    ["P", "Take Photo"],
    ["C", "Cycle Color"],
    ["T", "Cycle Toy"],
    ["K", "Practice/Do Trick"],
    ["J", "Mood Journal"],
    ["G", "Settings Panel"],
    ["E", "Pet Emote"],
    ["B", "Blow Bubbles"],
    ["O", "Fortune Cookie"],
    ["R", "Release Fireflies"],
    ["L", "Constellations"],
    ["Y", "Bedtime Story"],
    ["Esc", "Close Overlay"],
    ["?", "This Help"],
  ];

  ctx.font = "9px monospace";
  const startY = 42;
  const lineH = 14;
  const keyX = 22;
  const descX = 58;

  for (let i = 0; i < shortcuts.length; i++) {
    const y = startY + i * lineH;
    const [key, desc] = shortcuts[i];

    // Key box
    const keyW = ctx.measureText(key).width + 8;
    ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
    ctx.beginPath();
    ctx.roundRect(keyX - 4, y - 8, keyW, 12, 3);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Key text
    ctx.fillStyle = "#E0E8FF";
    ctx.textAlign = "left";
    ctx.fillText(key, keyX, y);

    // Description
    ctx.fillStyle = "rgba(200, 210, 230, 0.85)";
    ctx.fillText(desc, descX, y);
  }

  // Footer hint
  ctx.fillStyle = "rgba(160, 170, 200, 0.6)";
  ctx.font = "8px monospace";
  ctx.textAlign = "center";
  ctx.fillText("Press ? to close", w / 2, h - 10);

  ctx.restore();
}

window.addEventListener("keydown", (e) => {
  // Don't capture keys if a mini-game needs specific input
  // or if the pet is being dragged
  if (isDragging) return;

  const key = e.key.toLowerCase();

  // Escape closes any open overlay
  if (e.key === "Escape") {
    if (shortcutHelpOpen) {
      toggleShortcutHelp();
      return;
    }
    if (diaryPanelOpen) {
      toggleDiaryPanel();
      return;
    }
    if (statsPanelOpen) {
      toggleStatsPanel();
      return;
    }
    if (moodJournalOpen) {
      toggleMoodJournal();
      return;
    }
    if (settingsPanelOpen) {
      toggleSettingsPanel();
      return;
    }
    if (constellationModeActive) {
      constellationModeActive = false;
      constellationClickedStars.clear();
      constellationCompletedEdges.clear();
      return;
    }
    if (minigameActive || memoryGameActive) {
      // Don't force-close games with Escape — let them finish
      return;
    }
    return;
  }

  // ? toggles shortcut help
  if (key === "?" || (e.shiftKey && key === "/")) {
    toggleShortcutHelp();
    return;
  }

  // Don't process shortcuts while help overlay is open (except Esc and ?)
  if (shortcutHelpOpen) return;

  // Don't process shortcuts during mini-games (except Esc)
  if (minigameActive || memoryGameActive) return;

  // Don't process shortcuts while diary panel is open (except Esc and D)
  if (diaryPanelOpen && key !== "d") return;

  // Don't process shortcuts while stats panel is open (except Esc and S)
  if (statsPanelOpen && key !== "s") return;

  // Don't process shortcuts while mood journal is open (except Esc and J)
  if (moodJournalOpen && key !== "j") return;

  // Don't process shortcuts while settings panel is open (except Esc and G)
  if (settingsPanelOpen && key !== "g") return;

  switch (key) {
    case " ":
      e.preventDefault();
      onPetClicked();
      shortcutUsageCount++;
      checkAchievements();
      break;
    case "f":
      feedPet();
      shortcutUsageCount++;
      checkAchievements();
      break;
    case "n":
      petNap();
      shortcutUsageCount++;
      checkAchievements();
      break;
    case "s":
      toggleStatsPanel();
      shortcutUsageCount++;
      checkAchievements();
      break;
    case "d":
      toggleDiaryPanel();
      shortcutUsageCount++;
      checkAchievements();
      break;
    case "m":
      soundEnabled = !soundEnabled;
      if (soundEnabled) playClickSound();
      shortcutUsageCount++;
      checkAchievements();
      break;
    case "w":
      wanderingEnabled = !wanderingEnabled;
      if (!wanderingEnabled) {
        wanderState = "pausing";
        wanderTimer = 60;
      }
      shortcutUsageCount++;
      checkAchievements();
      break;
    case "1":
      startMinigame();
      shortcutUsageCount++;
      checkAchievements();
      break;
    case "2":
      startMemoryGame();
      shortcutUsageCount++;
      checkAchievements();
      break;
    case "p":
      takePhoto();
      shortcutUsageCount++;
      checkAchievements();
      break;
    case "t": {
      // Cycle to next toy
      const toyIds = TOYS.map(t => t.id);
      const currentToyIdx = toyIds.indexOf(currentToy);
      const nextToyIdx = (currentToyIdx + 1) % toyIds.length;
      setToy(TOYS[nextToyIdx].id);
      shortcutUsageCount++;
      checkAchievements();
      break;
    }
    case "k":
      handleTrickShortcut();
      shortcutUsageCount++;
      checkAchievements();
      break;
    case "j":
      toggleMoodJournal();
      shortcutUsageCount++;
      checkAchievements();
      break;
    case "g":
      toggleSettingsPanel();
      shortcutUsageCount++;
      checkAchievements();
      break;
    case "b":
      blowBubbles();
      shortcutUsageCount++;
      checkAchievements();
      break;
    case "e":
      spawnRandomEmote();
      playClickSound();
      shortcutUsageCount++;
      checkAchievements();
      break;
    case "o":
      giveFortuneCookie();
      shortcutUsageCount++;
      checkAchievements();
      break;
    case "r":
      releaseFireflies();
      shortcutUsageCount++;
      checkAchievements();
      break;
    case "l":
      toggleConstellationMode();
      shortcutUsageCount++;
      checkAchievements();
      break;
    case "y":
      startBedtimeStory();
      shortcutUsageCount++;
      checkAchievements();
      break;
    case "c": {
      // Cycle to next color palette
      const paletteIds = COLOR_PALETTES.map(p => p.id);
      const currentIdx = paletteIds.indexOf(currentColorPalette);
      const nextIdx = (currentIdx + 1) % paletteIds.length;
      const nextPalette = COLOR_PALETTES[nextIdx];
      currentColorPalette = nextPalette.id;
      saveGame();
      queueSpeechBubble(`${nextPalette.icon} ${nextPalette.name}!`, 120, true);
      playClickSound();
      squishAmount = 0.3;
      if (currentColorPalette !== "default") {
        addDiaryEntry("accessory", "🎨", `Changed color to ${nextPalette.name}!`);
      }
      shortcutUsageCount++;
      checkAchievements();
      break;
    }
  }
});

// Scroll diary panel or mood journal with mouse wheel
canvas.addEventListener("wheel", (e) => {
  if (diaryPanelOpen) {
    e.preventDefault();
    diaryScrollOffset += e.deltaY > 0 ? 1 : -1;
    diaryScrollOffset = Math.max(0, diaryScrollOffset);
  }
  if (moodJournalOpen) {
    e.preventDefault();
    // Scroll left (older) with scroll down, right (newer) with scroll up
    moodJournalScrollOffset += e.deltaY > 0 ? 3 : -3;
    moodJournalScrollOffset = Math.max(0, moodJournalScrollOffset);
  }
  if (settingsPanelOpen) {
    e.preventDefault();
    settingsScrollOffset += e.deltaY > 0 ? 12 : -12;
    settingsScrollOffset = Math.max(0, settingsScrollOffset);
  }
}, { passive: false });

// Save when window is about to close
window.addEventListener("beforeunload", () => {
  saveGame();
});

export {};
