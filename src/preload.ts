import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("tamashii", {
  moveWindow: (deltaX: number, deltaY: number) => {
    ipcRenderer.send("move-window", deltaX, deltaY);
  },
  getScreenBounds: (): Promise<{ screenWidth: number; screenHeight: number; windowX: number; windowY: number }> => {
    return ipcRenderer.invoke("get-screen-bounds");
  },
  showContextMenu: (menuData: { timeOfDay: string; wanderingEnabled: boolean }): Promise<void> => {
    return ipcRenderer.invoke("show-context-menu", menuData);
  },
  onToggleWandering: (callback: () => void) => {
    ipcRenderer.on("toggle-wandering", () => callback());
  },
  updateMood: (mood: string) => {
    ipcRenderer.send("update-mood", mood);
  },
});
