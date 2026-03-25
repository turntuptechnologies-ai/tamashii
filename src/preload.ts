import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("tamashii", {
  moveWindow: (deltaX: number, deltaY: number) => {
    ipcRenderer.send("move-window", deltaX, deltaY);
  },
});
