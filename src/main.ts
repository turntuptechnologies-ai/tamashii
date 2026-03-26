import { app, BrowserWindow, screen, ipcMain, Menu, dialog } from "electron";
import * as path from "path";

let mainWindow: BrowserWindow | null = null;

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
          detail: "Version 0.7.0\nA cute autonomous desktop companion.\nBuilt with ❤️ by Claude Code & NOTO Ai.",
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

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  app.quit();
});
