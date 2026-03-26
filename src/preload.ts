import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("tamashii", {
  moveWindow: (deltaX: number, deltaY: number) => {
    ipcRenderer.send("move-window", deltaX, deltaY);
  },
  getScreenBounds: (): Promise<{ screenWidth: number; screenHeight: number; windowX: number; windowY: number }> => {
    return ipcRenderer.invoke("get-screen-bounds");
  },
});
