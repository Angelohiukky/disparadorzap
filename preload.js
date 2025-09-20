// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    selectFile: () => ipcRenderer.invoke('dialog:openFile'),
    startWhatsapp: (data) => ipcRenderer.send('start-whatsapp', data),
    
    // Novas funções de controlo
    pause: () => ipcRenderer.send('pause-sending'),
    resume: () => ipcRenderer.send('resume-sending'),
    stop: () => ipcRenderer.send('stop-sending'),

    // Funções para receber dados do backend
    onQrCode: (callback) => ipcRenderer.on('qr_code', (event, ...args) => callback(...args)),
    onStatusUpdate: (callback) => ipcRenderer.on('status_update', (event, ...args) => callback(...args)),
    onSessionReady: (callback) => ipcRenderer.on('session_ready', (event, ...args) => callback(...args)),
    onProcessFinished: (callback) => ipcRenderer.on('process-finished', (event, ...args) => callback(...args)),
});
