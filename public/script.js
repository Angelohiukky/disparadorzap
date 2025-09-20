// public/script.js
const messageInput = document.getElementById('message');
const selectFileBtn = document.getElementById('selectFileBtn');
const filePathSpan = document.getElementById('filePath');
const startBtn = document.getElementById('startBtn');
const statusText = document.getElementById('status-text');
const qrCodeImage = document.getElementById('qrcode');
const mainForm = document.getElementById('main-form');
const sendingControls = document.getElementById('sending-controls');
const pauseBtn = document.getElementById('pauseBtn');
const stopBtn = document.getElementById('stopBtn');

let selectedFilePath = '';
let isPaused = false;

function showSendingControls() {
    mainForm.style.display = 'none';
    sendingControls.style.display = 'flex';
}

function showMainForm() {
    mainForm.style.display = 'block';
    sendingControls.style.display = 'none';
    startBtn.disabled = false;
    startBtn.textContent = 'Iniciar Envios';
}

selectFileBtn.addEventListener('click', async () => {
    selectedFilePath = await window.electronAPI.selectFile();
    filePathSpan.textContent = selectedFilePath ? selectedFilePath.split(/[\\/]/).pop() : 'Nenhum arquivo selecionado';
});

startBtn.addEventListener('click', () => {
    if (!selectedFilePath) {
        statusText.textContent = 'Por favor, selecione um arquivo CSV primeiro.';
        return;
    }
    showSendingControls();
    
    window.electronAPI.startWhatsapp({
        filePath: selectedFilePath,
        messageTemplate: messageInput.value
    });
});

pauseBtn.addEventListener('click', () => {
    isPaused = !isPaused;
    if (isPaused) {
        window.electronAPI.pause();
        pauseBtn.textContent = 'Retomar';
        statusText.textContent = 'Envio pausado pelo utilizador.';
    } else {
        window.electronAPI.resume();
        pauseBtn.textContent = 'Pausar';
        statusText.textContent = 'Retomando o envio...';
    }
});

stopBtn.addEventListener('click', () => {
    window.electronAPI.stop();
});

window.electronAPI.onQrCode((qrDataUrl) => {
    statusText.textContent = 'Escaneie o QR Code com o WhatsApp do seu celular!';
    qrCodeImage.src = qrDataUrl;
    qrCodeImage.style.display = 'block';
});

window.electronAPI.onStatusUpdate((message) => {
    statusText.textContent = message;
});

window.electronAPI.onSessionReady(() => {
    statusText.textContent = 'Conectado! O envio de mensagens começará...';
    qrCodeImage.style.display = 'none';
});

window.electronAPI.onProcessFinished(() => {
    showMainForm();
    isPaused = false;
    pauseBtn.textContent = 'Pausar';
});
