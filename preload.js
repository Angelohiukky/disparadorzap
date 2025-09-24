const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    selectFile: () => ipcRenderer.invoke('dialog:openFile'),
    startWhatsapp: (data) => ipcRenderer.send('start-whatsapp', data),
    
    // Controles
    pause: () => ipcRenderer.send('pause-sending'),
    resume: () => ipcRenderer.send('resume-sending'),
    stop: () => ipcRenderer.send('stop-sending'),

    // Solicitar download do relatório
    downloadReport: () => ipcRenderer.send('download-report'),

    // Funções para receber dados do backend
    onQrCode: (callback) => ipcRenderer.on('qr_code', (event, ...args) => callback(...args)),
    onStatusUpdate: (callback) => ipcRenderer.on('status_update', (event, ...args) => callback(...args)),
    onSessionReady: (callback) => ipcRenderer.on('session_ready', (event, ...args) => callback(...args)),
    onProcessFinished: (callback) => ipcRenderer.on('process-finished', (event, ...args) => callback(...args)),

    // Receber os dados do relatório
    onShowReport: (callback) => ipcRenderer.on('show-report', (event, ...args) => callback(...args)),
});
