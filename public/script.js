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

// Novos elementos do relatório
const reportArea = document.getElementById('report-area');
const reportStats = document.getElementById('report-stats');
const downloadReportBtn = document.getElementById('downloadReportBtn');
const backToMainBtn = document.getElementById('backToMainBtn');


let selectedFilePath = '';
let isPaused = false;

function showSendingControls() {
    mainForm.style.display = 'none';
    sendingControls.style.display = 'flex';
    reportArea.style.display = 'none'; // Garante que o relatório esteja escondido
}

function showMainForm() {
    mainForm.style.display = 'block';
    sendingControls.style.display = 'none';
    reportArea.style.display = 'none'; // Esconde o relatório ao voltar
    startBtn.disabled = false;
    startBtn.textContent = 'Iniciar Envios';
    statusText.textContent = 'Pronto para começar!';
    qrCodeImage.style.display = 'none';
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

// Listener para o botão de download
downloadReportBtn.addEventListener('click', () => {
    window.electronAPI.downloadReport();
});

// Listener para voltar ao início
backToMainBtn.addEventListener('click', () => {
    showMainForm();
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

// Modificado: Este evento agora é usado para um reset geral, o relatório tem o seu próprio.
window.electronAPI.onProcessFinished(() => {
    // A lógica de voltar para a tela principal foi movida para o evento onShowReport e botão
    isPaused = false;
    pauseBtn.textContent = 'Pausar';
});

// Listener para exibir o relatório
window.electronAPI.onShowReport((report) => {
    statusText.textContent = 'Processo finalizado!';
    sendingControls.style.display = 'none'; // Esconde os controles de pausa/parada
    reportArea.style.display = 'block'; // Mostra a área do relatório

    reportStats.innerHTML = `
        Total de contatos processados: <strong>${report.total}</strong><br>
        Enviados com sucesso: <strong style="color: green;">${report.sucesso}</strong><br>
        Falhas: <strong style="color: red;">${report.falhas}</strong>
    `;

    // Mostra ou esconde o botão de download
    downloadReportBtn.style.display = report.temFalhas ? 'inline-block' : 'none';
});
