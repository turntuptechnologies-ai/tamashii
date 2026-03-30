import { app, BrowserWindow, screen, ipcMain, Menu, Tray, nativeImage, dialog, globalShortcut } from "electron";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let currentMood = "☀️ Energetic (Morning)";
let achievementData: { progress: { unlocked: number; total: number }; unlocked: { id: string; name: string; icon: string; description: string }[] } = {
  progress: { unlocked: 0, total: 12 },
  unlocked: [],
};

function createWindow(): void {
  const { width: screenWidth, height: screenHeight } =
    screen.getPrimaryDisplay().workAreaSize;

  const petSize = 200;

  mainWindow = new BrowserWindow({
    width: petSize,
    height: petSize,
    x: screenWidth - petSize - 50,
    y: screenHeight - petSize - 50,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.setIgnoreMouseEvents(false);
  mainWindow.loadFile(path.join(__dirname, "index.html"));

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

ipcMain.on("move-window", (_event, deltaX: number, deltaY: number) => {
  if (!mainWindow) return;
  const [x, y] = mainWindow.getPosition();
  mainWindow.setPosition(x + deltaX, y + deltaY);
});

ipcMain.handle("get-screen-bounds", () => {
  const { width: screenWidth, height: screenHeight } =
    screen.getPrimaryDisplay().workAreaSize;
  const [windowX, windowY] = mainWindow ? mainWindow.getPosition() : [0, 0];
  return { screenWidth, screenHeight, windowX, windowY };
});

ipcMain.handle("prompt-pet-name", async (_event, currentName: string) => {
  if (!mainWindow) return null;
  // Use a simple BrowserWindow-based prompt since Electron doesn't have a native input dialog
  return new Promise<string | null>((resolve) => {
    const promptWin = new BrowserWindow({
      width: 320,
      height: 180,
      parent: mainWindow!,
      modal: true,
      frame: false,
      transparent: true,
      resizable: false,
      alwaysOnTop: true,
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: false,
      },
    });
    const escapedName = currentName.replace(/'/g, "\\'").replace(/"/g, "&quot;");
    const html = `<!DOCTYPE html><html><head><style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: rgba(255,255,255,0.97); border-radius: 12px; border: 1px solid #ddd; overflow: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; padding: 20px; }
      h3 { color: #333; margin-bottom: 12px; font-size: 14px; }
      input { width: 200px; padding: 8px 12px; border: 2px solid #5B8DEE; border-radius: 8px; font-size: 14px; outline: none; text-align: center; }
      input:focus { border-color: #3A6DD1; box-shadow: 0 0 0 3px rgba(91,141,238,0.2); }
      .btns { margin-top: 12px; display: flex; gap: 8px; }
      button { padding: 6px 18px; border: none; border-radius: 6px; font-size: 13px; cursor: pointer; }
      .ok { background: #5B8DEE; color: white; } .ok:hover { background: #4A7DD8; }
      .cancel { background: #eee; color: #666; } .cancel:hover { background: #ddd; }
    </style></head><body>
      <h3>Name your pet</h3>
      <input id="n" maxlength="20" value="${escapedName}" placeholder="Enter a name..." autofocus />
      <div class="btns"><button class="cancel" onclick="window.close()">Cancel</button><button class="ok" id="ok">OK</button></div>
      <script>
        const inp = document.getElementById('n');
        inp.select();
        document.getElementById('ok').onclick = () => { document.title = 'NAME:' + inp.value.trim(); window.close(); };
        inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') document.getElementById('ok').click(); if (e.key === 'Escape') window.close(); });
      </script>
    </body></html>`;
    promptWin.loadURL("data:text/html;charset=utf-8," + encodeURIComponent(html));
    promptWin.on("page-title-updated", (_e, title) => {
      if (title.startsWith("NAME:")) {
        const name = title.slice(5);
        resolve(name || null);
      }
    });
    promptWin.on("closed", () => {
      resolve(null);
    });
  });
});

ipcMain.handle("show-context-menu", (_event, menuData: { timeOfDay: string; wanderingEnabled: boolean; soundEnabled: boolean; petName: string; accessory: string }) => {
  if (!mainWindow) return;
  const { timeOfDay, wanderingEnabled, soundEnabled, petName, accessory } = menuData;

  const moodLabels: Record<string, string> = {
    morning: "☀️ Energetic (Morning)",
    afternoon: "🌤️ Content (Afternoon)",
    evening: "🌅 Winding Down (Evening)",
    night: "🌙 Sleepy (Night)",
  };
  const moodLabel = moodLabels[timeOfDay] || "Unknown";

  // Build achievements submenu
  const achievementItems: Electron.MenuItemConstructorOptions[] = achievementData.unlocked.length > 0
    ? achievementData.unlocked.map(a => ({
        label: `${a.icon} ${a.name} — ${a.description}`,
        enabled: false,
      }))
    : [{ label: "No achievements yet — keep playing!", enabled: false }];

  const template: Electron.MenuItemConstructorOptions[] = [
    { label: `Mood: ${moodLabel}`, enabled: false },
    { type: "separator" },
    {
      label: wanderingEnabled ? "🚶 Disable Wandering" : "🧍 Enable Wandering",
      click: () => { mainWindow?.webContents.send("toggle-wandering"); },
    },
    {
      label: soundEnabled ? "🔊 Disable Sounds" : "🔇 Enable Sounds",
      click: () => { mainWindow?.webContents.send("toggle-sound"); },
    },
    {
      label: petName ? `✏️ Rename Pet (${petName})` : "✏️ Name Your Pet",
      click: () => { mainWindow?.webContents.send("prompt-name"); },
    },
    {
      label: "👒 Accessories",
      submenu: [
        { label: "None", type: "radio" as const, checked: accessory === "none", click: () => { mainWindow?.webContents.send("set-accessory", "none"); } },
        { type: "separator" as const },
        { label: "👑 Crown", type: "radio" as const, checked: accessory === "crown", click: () => { mainWindow?.webContents.send("set-accessory", "crown"); } },
        { label: "🎀 Bow", type: "radio" as const, checked: accessory === "bow", click: () => { mainWindow?.webContents.send("set-accessory", "bow"); } },
        { label: "👓 Glasses", type: "radio" as const, checked: accessory === "glasses", click: () => { mainWindow?.webContents.send("set-accessory", "glasses"); } },
        { label: "🌸 Flower", type: "radio" as const, checked: accessory === "flower", click: () => { mainWindow?.webContents.send("set-accessory", "flower"); } },
        { label: "🎉 Party Hat", type: "radio" as const, checked: accessory === "party_hat", click: () => { mainWindow?.webContents.send("set-accessory", "party_hat"); } },
        { label: "😺 Cat Ears", type: "radio" as const, checked: accessory === "cat_ears", click: () => { mainWindow?.webContents.send("set-accessory", "cat_ears"); } },
        { label: "🎩 Top Hat", type: "radio" as const, checked: accessory === "top_hat", click: () => { mainWindow?.webContents.send("set-accessory", "top_hat"); } },
        { label: "⭐ Star Headband", type: "radio" as const, checked: accessory === "headband_star", click: () => { mainWindow?.webContents.send("set-accessory", "headband_star"); } },
      ],
    },
    { type: "separator" },
    {
      label: "🍎 Feed Pet",
      click: () => { mainWindow?.webContents.send("feed-pet"); },
    },
    {
      label: "💤 Power Nap",
      click: () => { mainWindow?.webContents.send("pet-nap"); },
    },
    { type: "separator" },
    {
      label: "⭐ Play Star Catcher",
      click: () => { mainWindow?.webContents.send("start-minigame"); },
    },
    { type: "separator" },
    {
      label: `🏆 Achievements (${achievementData.progress.unlocked}/${achievementData.progress.total})`,
      submenu: achievementItems,
    },
    { type: "separator" },
    {
      label: "About Tamashii",
      click: () => {
        dialog.showMessageBox(mainWindow!, {
          type: "info",
          title: "About Tamashii",
          message: "Tamashii — Desktop Pet",
          detail: "Version 0.20.0\nA cute autonomous desktop companion.\nBuilt with ❤️ by Claude Code & NOTO Ai.",
          buttons: ["OK"],
        });
      },
    },
    { type: "separator" },
    { label: "Quit", click: () => { app.quit(); } },
  ];

  const menu = Menu.buildFromTemplate(template);
  menu.popup({ window: mainWindow });
});

function createTrayIcon(): Electron.NativeImage {
  // Draw a 16x16 tray icon programmatically — a tiny blue circle matching the pet
  const size = 32;
  const canvas = Buffer.alloc(size * size * 4);
  const cx = size / 2;
  const cy = size / 2;
  const r = 13;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const idx = (y * size + x) * 4;
      if (dist <= r) {
        // Blue body color (#5B8DEE) with anti-aliased edge
        const edge = Math.max(0, Math.min(1, r - dist));
        canvas[idx] = 0x5B;     // R
        canvas[idx + 1] = 0x8D; // G
        canvas[idx + 2] = 0xEE; // B
        canvas[idx + 3] = Math.round(edge * 255); // A
      } else {
        canvas[idx] = 0;
        canvas[idx + 1] = 0;
        canvas[idx + 2] = 0;
        canvas[idx + 3] = 0;
      }
    }
  }
  return nativeImage.createFromBuffer(canvas, { width: size, height: size });
}

function buildTrayMenu(): Menu {
  const trayAchievementItems: Electron.MenuItemConstructorOptions[] = achievementData.unlocked.length > 0
    ? achievementData.unlocked.map(a => ({
        label: `${a.icon} ${a.name}`,
        enabled: false,
      }))
    : [{ label: "None yet — keep playing!", enabled: false }];

  return Menu.buildFromTemplate([
    { label: `Mood: ${currentMood}`, enabled: false },
    { type: "separator" },
    {
      label: mainWindow?.isVisible() ? "Hide Pet" : "Show Pet",
      accelerator: TOGGLE_SHORTCUT,
      click: () => {
        togglePetVisibility();
      },
    },
    { type: "separator" },
    {
      label: `🏆 Achievements (${achievementData.progress.unlocked}/${achievementData.progress.total})`,
      submenu: trayAchievementItems,
    },
    { type: "separator" },
    {
      label: "About Tamashii",
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          dialog.showMessageBox(mainWindow, {
            type: "info",
            title: "About Tamashii",
            message: "Tamashii — Desktop Pet",
            detail: "Version 0.20.0\nA cute autonomous desktop companion.\nBuilt with ❤️ by Claude Code & NOTO Ai.",
            buttons: ["OK"],
          });
        }
      },
    },
    { type: "separator" },
    { label: "Quit", click: () => { app.quit(); } },
  ]);
}

function createTray(): void {
  const icon = createTrayIcon();
  tray = new Tray(icon);
  tray.setToolTip("Tamashii — Desktop Pet");
  tray.setContextMenu(buildTrayMenu());

  // Click tray icon to toggle visibility
  tray.on("click", () => {
    togglePetVisibility();
  });
}

// IPC: renderer reports mood changes so tray menu stays updated
ipcMain.on("update-mood", (_event, mood: string) => {
  currentMood = mood;
  tray?.setContextMenu(buildTrayMenu());
});

// IPC: renderer reports achievement updates
ipcMain.on("update-achievements", (_event, data: typeof achievementData) => {
  achievementData = data;
  tray?.setContextMenu(buildTrayMenu());
});

// --- CPU/Memory Monitoring ---
let previousCpuTimes: { idle: number; total: number }[] = [];

function getCpuTimes(): { idle: number; total: number }[] {
  return os.cpus().map((cpu) => {
    const times = cpu.times;
    const total = times.user + times.nice + times.sys + times.irq + times.idle;
    return { idle: times.idle, total };
  });
}

function getCpuUsage(): number {
  const currentTimes = getCpuTimes();
  if (previousCpuTimes.length === 0) {
    previousCpuTimes = currentTimes;
    return 0;
  }
  let totalDelta = 0;
  let idleDelta = 0;
  for (let i = 0; i < currentTimes.length; i++) {
    totalDelta += currentTimes[i].total - previousCpuTimes[i].total;
    idleDelta += currentTimes[i].idle - previousCpuTimes[i].idle;
  }
  previousCpuTimes = currentTimes;
  if (totalDelta === 0) return 0;
  return ((totalDelta - idleDelta) / totalDelta) * 100;
}

function getMemoryUsage(): number {
  const total = os.totalmem();
  const free = os.freemem();
  return ((total - free) / total) * 100;
}

function startSystemMonitor(): void {
  // Initial CPU sample
  previousCpuTimes = getCpuTimes();

  // Send stats every 3 seconds
  setInterval(() => {
    if (!mainWindow) return;
    const cpu = getCpuUsage();
    const mem = getMemoryUsage();
    mainWindow.webContents.send("system-stats", { cpu: Math.round(cpu), mem: Math.round(mem) });
  }, 3000);
}

// --- Global Keyboard Shortcut ---
const TOGGLE_SHORTCUT = "CmdOrCtrl+Shift+T";

function togglePetVisibility(): void {
  if (!mainWindow) return;
  if (mainWindow.isVisible()) {
    mainWindow.hide();
  } else {
    mainWindow.show();
    mainWindow.focus();
    // Notify renderer that pet was shown via shortcut
    mainWindow.webContents.send("shortcut-toggled", true);
  }
  tray?.setContextMenu(buildTrayMenu());
}

function registerGlobalShortcut(): void {
  const registered = globalShortcut.register(TOGGLE_SHORTCUT, () => {
    togglePetVisibility();
  });
  if (!registered) {
    console.warn(`Failed to register global shortcut: ${TOGGLE_SHORTCUT}`);
  }
}

// --- Persistent Save Data ---
function getSavePath(): string {
  return path.join(app.getPath("userData"), "tamashii-save.json");
}

ipcMain.handle("load-save-data", () => {
  const savePath = getSavePath();
  try {
    if (fs.existsSync(savePath)) {
      const raw = fs.readFileSync(savePath, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn("Failed to load save data:", err);
  }
  return null;
});

ipcMain.on("save-data", (_event, data: unknown) => {
  const savePath = getSavePath();
  try {
    fs.writeFileSync(savePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.warn("Failed to save data:", err);
  }
});

app.whenReady().then(() => {
  createWindow();
  createTray();
  startSystemMonitor();
  registerGlobalShortcut();
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

app.on("window-all-closed", () => {
  // Don't quit — pet lives in tray
});
