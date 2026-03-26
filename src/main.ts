import { app, BrowserWindow, screen, ipcMain } from "electron";
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

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  app.quit();
});
