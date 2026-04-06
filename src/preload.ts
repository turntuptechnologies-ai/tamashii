import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("tamashii", {
  moveWindow: (deltaX: number, deltaY: number) => {
    ipcRenderer.send("move-window", deltaX, deltaY);
  },
  getScreenBounds: (): Promise<{ screenWidth: number; screenHeight: number; windowX: number; windowY: number }> => {
    return ipcRenderer.invoke("get-screen-bounds");
  },
  showContextMenu: (menuData: { timeOfDay: string; wanderingEnabled: boolean; soundEnabled: boolean; notificationsEnabled: boolean; petName: string; accessory: string; colorPalette: string; currentToy: string; trickProgress: Record<string, number> }): Promise<void> => {
    return ipcRenderer.invoke("show-context-menu", menuData);
  },
  onSetColor: (callback: (colorId: string) => void) => {
    ipcRenderer.on("set-color", (_event, colorId) => callback(colorId));
  },
  promptPetName: (currentName: string): Promise<string | null> => {
    return ipcRenderer.invoke("prompt-pet-name", currentName);
  },
  onPromptName: (callback: () => void) => {
    ipcRenderer.on("prompt-name", () => callback());
  },
  onToggleWandering: (callback: () => void) => {
    ipcRenderer.on("toggle-wandering", () => callback());
  },
  onToggleSound: (callback: () => void) => {
    ipcRenderer.on("toggle-sound", () => callback());
  },
  onToggleNotifications: (callback: () => void) => {
    ipcRenderer.on("toggle-notifications", () => callback());
  },
  onSetAccessory: (callback: (accessory: string) => void) => {
    ipcRenderer.on("set-accessory", (_event, accessory) => callback(accessory));
  },
  updateMood: (mood: string) => {
    ipcRenderer.send("update-mood", mood);
  },
  onSystemStats: (callback: (stats: { cpu: number; mem: number }) => void) => {
    ipcRenderer.on("system-stats", (_event, stats) => callback(stats));
  },
  onShortcutToggled: (callback: (shown: boolean) => void) => {
    ipcRenderer.on("shortcut-toggled", (_event, shown) => callback(shown));
  },
  updateAchievements: (data: { progress: { unlocked: number; total: number }; unlocked: { id: string; name: string; icon: string; description: string }[] }) => {
    ipcRenderer.send("update-achievements", data);
  },
  loadSaveData: (): Promise<unknown> => {
    return ipcRenderer.invoke("load-save-data");
  },
  saveData: (data: unknown) => {
    ipcRenderer.send("save-data", data);
  },
  onStartMinigame: (callback: () => void) => {
    ipcRenderer.on("start-minigame", () => callback());
  },
  onFeedPet: (callback: () => void) => {
    ipcRenderer.on("feed-pet", () => callback());
  },
  onPetNap: (callback: () => void) => {
    ipcRenderer.on("pet-nap", () => callback());
  },
  onViewStats: (callback: () => void) => {
    ipcRenderer.on("view-stats", () => callback());
  },
  onStartMemoryGame: (callback: () => void) => {
    ipcRenderer.on("start-memory-game", () => callback());
  },
  showNotification: (title: string, body: string) => {
    ipcRenderer.send("show-notification", { title, body });
  },
  onViewDiary: (callback: () => void) => {
    ipcRenderer.on("view-diary", () => callback());
  },
  onTakePhoto: (callback: () => void) => {
    ipcRenderer.on("take-photo", () => callback());
  },
  savePhoto: (dataUrl: string): Promise<string | null> => {
    return ipcRenderer.invoke("save-photo", dataUrl);
  },
  onSetToy: (callback: (toyId: string) => void) => {
    ipcRenderer.on("set-toy", (_event, toyId) => callback(toyId));
  },
  onPerformTrick: (callback: (trickId: string) => void) => {
    ipcRenderer.on("perform-trick", (_event, trickId) => callback(trickId));
  },
  onViewMoodJournal: (callback: () => void) => {
    ipcRenderer.on("view-mood-journal", () => callback());
  },
  onViewSettings: (callback: () => void) => {
    ipcRenderer.on("view-settings", () => callback());
  },
});
