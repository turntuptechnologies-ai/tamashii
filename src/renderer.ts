declare global {
  interface Window {
    tamashii: {
      moveWindow: (deltaX: number, deltaY: number) => void;
    };
  }
}

const canvas = document.getElementById("pet") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

// --- State ---
let frame = 0;
let blinkTimer = 0;
let isBlinking = false;
let bounceOffset = 0;
let bounceDirection = 1;

// --- Drag ---
let isDragging = false;
let lastX = 0;
let lastY = 0;

canvas.addEventListener("mousedown", (e) => {
  isDragging = true;
  lastX = e.screenX;
  lastY = e.screenY;
});

window.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  const dx = e.screenX - lastX;
  const dy = e.screenY - lastY;
  lastX = e.screenX;
  lastY = e.screenY;
  window.tamashii.moveWindow(dx, dy);
});

window.addEventListener("mouseup", () => {
  isDragging = false;
});

// --- Drawing ---
function drawBody(cx: number, cy: number, size: number): void {
  // Body (round blob)
  ctx.beginPath();
  ctx.ellipse(cx, cy + 5, size * 0.45, size * 0.4, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#5B8DEE";
  ctx.fill();
  ctx.strokeStyle = "#3A6DD1";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Belly highlight
  ctx.beginPath();
  ctx.ellipse(cx, cy + 12, size * 0.25, size * 0.2, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#89B4FA";
  ctx.fill();
}

function drawFace(cx: number, cy: number, size: number): void {
  const eyeY = cy - 5;
  const eyeSpacing = size * 0.15;

  if (isBlinking) {
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

  // Mouth (small smile)
  ctx.beginPath();
  ctx.arc(cx, cy + 10, 6, 0.1 * Math.PI, 0.9 * Math.PI);
  ctx.strokeStyle = "#1a1a2e";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.stroke();

  // Cheeks (blush)
  ctx.beginPath();
  ctx.ellipse(cx - eyeSpacing - 10, cy + 5, 6, 4, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255, 130, 130, 0.35)";
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx + eyeSpacing + 10, cy + 5, 6, 4, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255, 130, 130, 0.35)";
  ctx.fill();
}

function drawFeet(cx: number, cy: number, size: number): void {
  const footY = cy + size * 0.35;
  // Left foot
  ctx.beginPath();
  ctx.ellipse(cx - 15, footY, 12, 6, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#4A7ADB";
  ctx.fill();
  // Right foot
  ctx.beginPath();
  ctx.ellipse(cx + 15, footY, 12, 6, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#4A7ADB";
  ctx.fill();
}

// --- Animation Loop ---
function update(): void {
  frame++;

  // Blink logic
  blinkTimer++;
  if (!isBlinking && blinkTimer > 120 + Math.random() * 120) {
    isBlinking = true;
    blinkTimer = 0;
  }
  if (isBlinking && blinkTimer > 8) {
    isBlinking = false;
    blinkTimer = 0;
  }

  // Idle bounce
  if (!isDragging) {
    bounceOffset += 0.08 * bounceDirection;
    if (bounceOffset > 3) bounceDirection = -1;
    if (bounceOffset < -3) bounceDirection = 1;
  }
}

function draw(): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const cx = canvas.width / 2;
  const cy = canvas.height / 2 + bounceOffset;
  const size = 120;

  // Shadow
  ctx.beginPath();
  ctx.ellipse(canvas.width / 2, canvas.height / 2 + size * 0.42, 30, 8, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fill();

  drawFeet(cx, cy, size);
  drawBody(cx, cy, size);
  drawFace(cx, cy, size);
}

function loop(): void {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();

export {};
