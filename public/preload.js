const { contextBridge } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  newRoom: () => {
    // This will be called from the main process menu
    console.log('New room requested from menu');
  },
  joinRoom: () => {
    // This will be called from the main process menu
    console.log('Join room requested from menu');
  },
  platform: process.platform,
  isElectron: true
});
