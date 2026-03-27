import { app, BrowserWindow, screen, ipcMain, Menu, Tray, nativeImage, dialog } from "electron";
import * as path from "path";

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let currentMood = "☀️ Energetic (Morning)";

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

ipcMain.handle("show-context-menu", (_event, menuData: { timeOfDay: string; wanderingEnabled: boolean }) => {
  if (!mainWindow) return;
  const { timeOfDay, wanderingEnabled } = menuData;

  const moodLabels: Record<string, string> = {
    morning: "☀️ Energetic (Morning)",
    afternoon: "🌤️ Content (Afternoon)",
    evening: "🌅 Winding Down (Evening)",
    night: "🌙 Sleepy (Night)",
  };
  const moodLabel = moodLabels[timeOfDay] || "Unknown";

  const template: Electron.MenuItemConstructorOptions[] = [
    { label: `Mood: ${moodLabel}`, enabled: false },
    { type: "separator" },
    {
      label: wanderingEnabled ? "🚶 Disable Wandering" : "🧍 Enable Wandering",
      click: () => { mainWindow?.webContents.send("toggle-wandering"); },
    },
    { type: "separator" },
    {
      label: "About Tamashii",
      click: () => {
        dialog.showMessageBox(mainWindow!, {
          type: "info",
          title: "About Tamashii",
          message: "Tamashii — Desktop Pet",
          detail: "Version 0.9.0\nA cute autonomous desktop companion.\nBuilt with ❤️ by Claude Code & NOTO Ai.",
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
  return Menu.buildFromTemplate([
    { label: `Mood: ${currentMood}`, enabled: false },
    { type: "separator" },
    {
      label: mainWindow?.isVisible() ? "Hide Pet" : "Show Pet",
      click: () => {
        if (mainWindow?.isVisible()) {
          mainWindow.hide();
        } else {
          mainWindow?.show();
          mainWindow?.focus();
        }
      },
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
            detail: "Version 0.9.0\nA cute autonomous desktop companion.\nBuilt with ❤️ by Claude Code & NOTO Ai.",
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
    if (mainWindow?.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow?.show();
      mainWindow?.focus();
    }
    tray?.setContextMenu(buildTrayMenu());
  });
}

// IPC: renderer reports mood changes so tray menu stays updated
ipcMain.on("update-mood", (_event, mood: string) => {
  currentMood = mood;
  tray?.setContextMenu(buildTrayMenu());
});

app.whenReady().then(() => {
  createWindow();
  createTray();
});

app.on("window-all-closed", () => {
  // Don't quit — pet lives in tray
});
