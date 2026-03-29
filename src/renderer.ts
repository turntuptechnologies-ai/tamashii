declare global {
  interface Window {
    tamashii: {
      moveWindow: (deltaX: number, deltaY: number) => void;
      getScreenBounds: () => Promise<{ screenWidth: number; screenHeight: number; windowX: number; windowY: number }>;
      showContextMenu: (menuData: { timeOfDay: string; wanderingEnabled: boolean; soundEnabled: boolean; petName: string }) => Promise<void>;
      promptPetName: (currentName: string) => Promise<string | null>;
      onPromptName: (callback: () => void) => void;
      onToggleWandering: (callback: () => void) => void;
      onToggleSound: (callback: () => void) => void;
      updateMood: (mood: string) => void;
      onSystemStats: (callback: (stats: { cpu: number; mem: number }) => void) => void;
      onShortcutToggled: (callback: (shown: boolean) => void) => void;
      updateAchievements: (data: { progress: { unlocked: number; total: number }; unlocked: { id: string; name: string; icon: string; description: string }[] }) => void;
      loadSaveData: () => Promise<unknown>;
      saveData: (data: unknown) => void;
    };
  }
}

const canvas = document.getElementById("pet") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

// --- Sound Effects (Web Audio API) ---
let soundEnabled = true;
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

// --- Time of Day ---
type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "afternoon";
  if (hour >= 18 && hour < 22) return "evening";
  return "night";
}

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

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  type: "heart" | "zzz" | "dust" | "sparkle" | "pollen" | "firefly" | "star" | "sweat";
}

const particles: Particle[] = [];
let zzzSpawnTimer = 0;
let ambientSpawnTimer = 0;

// --- System Stress ---
let cpuUsage = 0;
let memUsage = 0;
let stressLevel = 0; // 0-1 smoothed stress indicator
let sweatSpawnTimer = 0;
let isStressed = false; // true when stress > 0.5

window.tamashii.onSystemStats((stats) => {
  cpuUsage = stats.cpu;
  memUsage = stats.mem;
});

// --- Speech Bubble ---
interface SpeechBubble {
  text: string;
  life: number;
  maxLife: number;
}

let speechBubble: SpeechBubble | null = null;
let speechCooldown = 300; // Start with a short cooldown so first bubble comes soon

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
    speechBubble = { text: msg, life: 150, maxLife: 150 };
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

  speechBubble = { text, life: 180, maxLife: 180 }; // ~3 seconds
}

// --- Drag ---
let isDragging = false;
let dragMoved = false;
let lastX = 0;
let lastY = 0;

canvas.addEventListener("mousedown", (e) => {
  isDragging = true;
  dragMoved = false;
  isFalling = false; // Cancel any active fall when grabbed
  velocityY = 0;
  lastX = e.screenX;
  lastY = e.screenY;
});

window.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  const dx = e.screenX - lastX;
  const dy = e.screenY - lastY;
  if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
    dragMoved = true;
  }
  lastX = e.screenX;
  lastY = e.screenY;
  window.tamashii.moveWindow(dx, dy);
});

window.addEventListener("mouseup", () => {
  if (isDragging && !dragMoved) {
    onPetClicked();
  }
  if (isDragging && dragMoved) {
    // Start falling — check if pet is above ground
    startFalling();
  }
  isDragging = false;
});

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
  window.tamashii.showContextMenu({
    timeOfDay: currentTimeOfDay,
    wanderingEnabled,
    soundEnabled,
    petName,
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

// --- Pet Name ---
let petName = "";

window.tamashii.onPromptName(async () => {
  const result = await window.tamashii.promptPetName(petName);
  if (result !== null) {
    const oldName = petName;
    petName = result;
    saveGame();
    if (petName) {
      speechBubble = { text: oldName ? `Call me ${petName} now!` : `I'm ${petName}! Nice to meet you!`, life: 200, maxLife: 200 };
      playGreetingSound();
      squishAmount = 0.7;
      isHappy = true;
      happyTimer = 60;
    }
  }
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
  speechBubble = { text: `${a.icon} ${a.unlockMessage}`, life: 240, maxLife: 240 };

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
      speechBubble = { text: greeting, life: 180, maxLife: 180 };
      squishAmount = 0.5;
      isHappy = true;
      happyTimer = 60;
    }
  }
});

function startSpin(): void {
  totalSpins++;
  playSpinSound();
  isSpinning = true;
  spinProgress = 0;
  spinFrame = 0;
  isHappy = true;
  happyTimer = SPIN_DURATION + 20;
  squishAmount = 0.5;

  // Speech bubble
  const msg = spinMessages[Math.floor(Math.random() * spinMessages.length)];
  speechBubble = { text: msg, life: 120, maxLife: 120 };

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
  const now = Date.now();
  const timeSinceLastClick = now - lastClickTime;
  lastClickTime = now;

  // Double-click detection — trigger spin trick
  if (timeSinceLastClick < DOUBLE_CLICK_THRESHOLD && !isSpinning) {
    startSpin();
    return;
  }

  // Regular single click — squish + hearts
  totalClicks++;
  playClickSound();
  squishAmount = 1.0;
  isHappy = true;
  happyTimer = 60; // ~1 second of happy face

  // Spawn heart particles
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  for (let i = 0; i < 5; i++) {
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

function getBodyColors(): { body: string; stroke: string; belly: string; foot: string } {
  let colors: { body: string; stroke: string; belly: string; foot: string };
  switch (currentTimeOfDay) {
    case "morning":
      colors = { body: "#6B9DEF", stroke: "#4A7DD8", belly: "#99C4FF", foot: "#5A8AE0" }; break;
    case "afternoon":
      colors = { body: "#5B8DEE", stroke: "#3A6DD1", belly: "#89B4FA", foot: "#4A7ADB" }; break;
    case "evening":
      colors = { body: "#5577CC", stroke: "#3A5AAA", belly: "#7799DD", foot: "#4466BB" }; break;
    case "night":
      colors = { body: "#4A66AA", stroke: "#334D88", belly: "#6688CC", foot: "#3B5599" }; break;
  }
  // When stressed, shift body color toward warm/red
  if (stressLevel > 0.3) {
    const t = Math.min((stressLevel - 0.3) * 1.4, 0.4); // max 40% shift
    colors.body = lerpColor(colors.body, "#CC7788", t);
    colors.stroke = lerpColor(colors.stroke, "#AA5566", t);
    colors.belly = lerpColor(colors.belly, "#DDAABB", t);
    colors.foot = lerpColor(colors.foot, "#BB6677", t);
  }
  return colors;
}

function drawBody(cx: number, cy: number, size: number): void {
  const colors = getBodyColors();
  // Body (round blob)
  ctx.beginPath();
  ctx.ellipse(cx, cy + 5, size * 0.45, size * 0.4, 0, 0, Math.PI * 2);
  ctx.fillStyle = colors.body;
  ctx.fill();
  ctx.strokeStyle = colors.stroke;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Belly highlight
  ctx.beginPath();
  ctx.ellipse(cx, cy + 12, size * 0.25, size * 0.2, 0, 0, Math.PI * 2);
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
  const eyeY = cy - 5;
  const eyeSpacing = size * 0.15;

  if (isStressed && !isHappy && !isYawning) {
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
    ctx.arc(cx - eyeSpacing, eyeY, 7, Math.PI * 1.1, Math.PI * 1.9);
    ctx.strokeStyle = "#1a1a2e";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + eyeSpacing, eyeY, 7, Math.PI * 1.1, Math.PI * 1.9);
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
    // Open eyes
    // White
    ctx.beginPath();
    ctx.ellipse(cx - eyeSpacing, eyeY, 8, 9, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + eyeSpacing, eyeY, 8, 9, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    // Pupils
    ctx.beginPath();
    ctx.ellipse(cx - eyeSpacing + 1, eyeY + 1, 4, 5, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#1a1a2e";
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + eyeSpacing + 1, eyeY + 1, 4, 5, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#1a1a2e";
    ctx.fill();

    // Eye shine
    ctx.beginPath();
    ctx.ellipse(cx - eyeSpacing + 3, eyeY - 2, 2, 2, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + eyeSpacing + 3, eyeY - 2, 2, 2, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
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

  // Cheeks (blush — brighter when happy, dimmer at night)
  let blushAlpha = isHappy ? 0.55 : 0.35;
  if (currentTimeOfDay === "night") blushAlpha *= 0.6;
  const blushSize = isHappy ? 7 : 6;
  ctx.beginPath();
  ctx.ellipse(cx - eyeSpacing - 10, cy + 5, blushSize, 4, 0, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255, 130, 130, ${blushAlpha})`;
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + eyeSpacing + 10, cy + 5, blushSize, 4, 0, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255, 130, 130, ${blushAlpha})`;
  ctx.fill();
}

function drawFeet(cx: number, cy: number, size: number): void {
  const colors = getBodyColors();
  const footY = cy + size * 0.35;
  // Left foot
  ctx.beginPath();
  ctx.ellipse(cx - 15, footY, 12, 6, 0, 0, Math.PI * 2);
  ctx.fillStyle = colors.foot;
  ctx.fill();
  // Right foot
  ctx.beginPath();
  ctx.ellipse(cx + 15, footY, 12, 6, 0, 0, Math.PI * 2);
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
  const bubbleY = petTopY - bubbleH - 10;
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

  ctx.restore();
}

// --- Animation Loop ---
function getBounceSpeed(): number {
  switch (currentTimeOfDay) {
    case "morning": return 0.12;  // Energetic!
    case "afternoon": return 0.08; // Normal
    case "evening": return 0.05;  // Winding down
    case "night": return 0.03;    // Barely moving, sleepy
  }
}

function getBounceAmplitude(): number {
  switch (currentTimeOfDay) {
    case "morning": return 4;
    case "afternoon": return 3;
    case "evening": return 2;
    case "night": return 1.5;
  }
}

function getWanderSpeed(): number {
  switch (currentTimeOfDay) {
    case "morning": return 0.5;    // Energetic exploring
    case "afternoon": return 0.35; // Casual strolling
    case "evening": return 0.2;    // Slow shuffle
    case "night": return 0;        // Too sleepy to wander
  }
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

  // Spawn zzz particles when sleepy
  if (currentTimeOfDay === "night") {
    zzzSpawnTimer++;
    if (zzzSpawnTimer > 90 + Math.random() * 60) {
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      particles.push({
        x: cx + 25,
        y: cy - 25,
        vx: 0.3 + Math.random() * 0.3,
        vy: -(0.5 + Math.random() * 0.3),
        life: 90,
        maxLife: 90,
        size: 10 + Math.random() * 6,
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

  // Speech bubble logic
  if (speechBubble) {
    speechBubble.life--;
    if (speechBubble.life <= 0) {
      speechBubble = null;
      // Cooldown before next bubble: 15-30 seconds
      speechCooldown = 900 + Math.floor(Math.random() * 900);
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
    }
    p.vx *= 0.99;
    p.life--;
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }

  // --- Wandering logic ---
  const wanderSpeed = getWanderSpeed();
  if (!isDragging && wanderSpeed > 0 && wanderingEnabled) {
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

  // Check achievements every 30 frames (~0.5s)
  if (frame % 30 === 0) {
    checkAchievements();
  }

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

  // Idle bounce (speed and amplitude vary by time of day)
  if (!isDragging) {
    const amplitude = getBounceAmplitude();
    bounceOffset += getBounceSpeed() * bounceDirection;
    if (bounceOffset > amplitude) bounceDirection = -1;
    if (bounceOffset < -amplitude) bounceDirection = 1;
  }

  // Butterfly companion
  updateButterfly();
}

function draw(): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const cx = canvas.width / 2;
  const cy = canvas.height / 2 + bounceOffset;
  const size = 120;

  // Shadow (wider when squished — combine click squish and landing squish)
  const totalSquish = Math.min(squishAmount + landingSquish, 1.2);
  const shadowStretch = 1 + totalSquish * 0.3;
  ctx.beginPath();
  ctx.ellipse(canvas.width / 2, canvas.height / 2 + size * 0.42, 30 * shadowStretch, 8, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fill();

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
  // Lean tilt when wandering (rotate around feet)
  if (Math.abs(wanderLean) > 0.01 && !isSpinning) {
    ctx.translate(cx, feetY);
    ctx.rotate(wanderLean * 0.06); // subtle tilt, ~3.4 degrees max
    ctx.translate(-cx, -feetY);
  }

  drawFeet(cx, cy, size);
  drawBody(cx, cy, size);
  drawFace(cx, cy, size);
  ctx.restore();

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
    }
  }

  // Butterfly companion (drawn above particles, below speech bubble)
  drawButterfly();

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

  // Speech bubble (above everything)
  drawSpeechBubble(cx, cy - size * 0.4);
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

// Save when window is about to close
window.addEventListener("beforeunload", () => {
  saveGame();
});

export {};
