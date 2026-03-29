import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("tamashii", {
  moveWindow: (deltaX: number, deltaY: number) => {
    ipcRenderer.send("move-window", deltaX, deltaY);
  },
  getScreenBounds: (): Promise<{ screenWidth: number; screenHeight: number; windowX: number; windowY: number }> => {
    return ipcRenderer.invoke("get-screen-bounds");
  },
  showContextMenu: (menuData: { timeOfDay: string; wanderingEnabled: boolean; soundEnabled: boolean; petName: string; accessory: string }): Promise<void> => {
    return ipcRenderer.invoke("show-context-menu", menuData);
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
});
