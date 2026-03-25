declare global {
  interface Window {
    tamashii: {
      moveWindow: (deltaX: number, deltaY: number) => void;
    };
  }
}

const canvas = document.getElementById("pet") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

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
// Re-check time every 60 seconds
setInterval(() => { currentTimeOfDay = getTimeOfDay(); }, 60000);

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

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  type: "heart" | "zzz";
}

const particles: Particle[] = [];
let zzzSpawnTimer = 0;

// --- Drag ---
let isDragging = false;
let dragMoved = false;
let lastX = 0;
let lastY = 0;

canvas.addEventListener("mousedown", (e) => {
  isDragging = true;
  dragMoved = false;
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
  isDragging = false;
});

function onPetClicked(): void {
  // Trigger squish
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
function getBodyColors(): { body: string; stroke: string; belly: string; foot: string } {
  switch (currentTimeOfDay) {
    case "morning":
      return { body: "#6B9DEF", stroke: "#4A7DD8", belly: "#99C4FF", foot: "#5A8AE0" };
    case "afternoon":
      return { body: "#5B8DEE", stroke: "#3A6DD1", belly: "#89B4FA", foot: "#4A7ADB" };
    case "evening":
      return { body: "#5577CC", stroke: "#3A5AAA", belly: "#7799DD", foot: "#4466BB" };
    case "night":
      return { body: "#4A66AA", stroke: "#334D88", belly: "#6688CC", foot: "#3B5599" };
  }
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

  if (isYawning) {
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
  if (isYawning) {
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

  // Particle update
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    if (p.type === "heart") {
      p.vy -= 0.01;
    } else {
      // zzz floats with gentle wave
      p.vx = Math.sin(p.life * 0.05) * 0.3;
    }
    p.vx *= 0.99;
    p.life--;
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }

  // Idle bounce (speed and amplitude vary by time of day)
  if (!isDragging) {
    const amplitude = getBounceAmplitude();
    bounceOffset += getBounceSpeed() * bounceDirection;
    if (bounceOffset > amplitude) bounceDirection = -1;
    if (bounceOffset < -amplitude) bounceDirection = 1;
  }
}

function draw(): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const cx = canvas.width / 2;
  const cy = canvas.height / 2 + bounceOffset;
  const size = 120;

  // Shadow (wider when squished)
  const shadowStretch = 1 + squishAmount * 0.3;
  ctx.beginPath();
  ctx.ellipse(canvas.width / 2, canvas.height / 2 + size * 0.42, 30 * shadowStretch, 8, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fill();

  // Apply squish transform
  ctx.save();
  if (squishAmount > 0) {
    const scaleX = 1 + squishAmount * 0.15;
    const scaleY = 1 - squishAmount * 0.15;
    ctx.translate(cx, canvas.height / 2 + size * 0.35);
    ctx.scale(scaleX, scaleY);
    ctx.translate(-cx, -(canvas.height / 2 + size * 0.35));
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
    } else {
      drawZzz(p.x, p.y, p.size, alpha);
    }
  }
}

function loop(): void {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();

export {};
