const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');

let mainWindow;
let client;
let isPaused = false;
let isStopped = false;
let falhasCSV = ''; // Armazenará o conteúdo CSV das falhas

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 850,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
        },
        icon: path.join(__dirname, 'public/icon.ico'),
        autoHideMenuBar: true,
    });
    mainWindow.loadFile('public/index.html');
}

app.whenReady().then(createWindow);

const delay = ms => new Promise(res => setTimeout(res, ms));

ipcMain.on('start-whatsapp', (event, { filePath, messageTemplate }) => {
    isPaused = false;
    isStopped = false;
    falhasCSV = 'Nome;Telefone;Erro\n'; // Reinicia o cabeçalho do CSV de falhas
    
    client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: { headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox'] }
    });

    client.on('qr', async (qr) => {
        const qrDataUrl = await qrcode.toDataURL(qr);
        mainWindow.webContents.send('qr_code', qrDataUrl);
    });

    client.on('ready', async () => {
        mainWindow.webContents.send('session_ready');
        
        const contatosComFalha = [];
        const contatosComSucesso = [];
        let linhas;
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            linhas = data.split(/\r?\n/); // Lê todas as linhas, incluindo as vazias
            mainWindow.webContents.send('status_update', `Arquivo lido. ${linhas.filter(l => l.trim() !== '').length} contatos encontrados. Iniciando envios...`);
        } catch (err) {
            mainWindow.webContents.send('status_update', `Erro ao ler o arquivo: ${err.message}`);
            return;
        }

        let contadorSucesso = 0;
        let linhasEmBrancoConsecutivas = 0;

        for (let i = 0; i < linhas.length; i++) {
            if (isStopped) {
                mainWindow.webContents.send('status_update', 'Processo interrompido pelo usuário.');
                break;
            }

            // Lógica para parar após 5 linhas em branco
            if (linhas[i].trim() === '') {
                linhasEmBrancoConsecutivas++;
                if (linhasEmBrancoConsecutivas >= 5) {
                    mainWindow.webContents.send('status_update', 'Detetadas 5 linhas em branco consecutivas. Finalizando processo.');
                    break;
                }
                continue; // Pula para a próxima linha
            }
            linhasEmBrancoConsecutivas = 0; // Reseta o contador se a linha não está em branco

            while (isPaused) await delay(1000);

            const linha = linhas[i];
            let nome = `Linha ${i + 1}`;
            let telefone = '';

            try {
                const colunas = linha.split(';');
                if (colunas.length >= 2) {
                    nome = colunas[0].trim();
                    telefone = colunas[1].trim().replace(/\D/g, '');

                    if (!telefone) throw new Error("Número de telefone vazio.");

                    const numeroFormatado = `55${telefone}@c.us`;
                    const mensagemFinal = messageTemplate.replace(/{nome}/g, nome);
                    const statusMsg = `(${contadorSucesso + contatosComFalha.length + 1}/${linhas.filter(l => l.trim() !== '').length}) Enviando para: ${nome}`;
                    mainWindow.webContents.send('status_update', statusMsg);

                    await client.sendMessage(numeroFormatado, mensagemFinal);
                    contadorSucesso++;
                    contatosComSucesso.push({ nome, telefone });

                    if (contadorSucesso > 0 && contadorSucesso % 50 === 0 && (i + 1) < linhas.length) {
                        mainWindow.webContents.send('status_update', `PAUSA DE 60 SEGUNDOS... (${contadorSucesso} enviados)`);
                        await delay(60000);
                    } else {
                        await delay(15000);
                    }
                }
            } catch (err) {
                const erroMsg = err.message || 'Erro desconhecido';
                console.error(`ERRO ao enviar para ${nome}: ${erroMsg}`);
                contatosComFalha.push({ nome, telefone, erro: erroMsg });
                falhasCSV += `"${nome}";"${telefone}";"${erroMsg}"\n`; // Adiciona ao CSV de falhas
                mainWindow.webContents.send('status_update', `Erro ao enviar para ${nome}. Pulando...`);
                await delay(5000);
            }
        }

        if (client) {
            await client.destroy();
            client = null;
        }
        
        // Envia os dados do relatório para a interface
        mainWindow.webContents.send('show-report', {
            sucesso: contadorSucesso,
            falhas: contatosComFalha.length,
            total: contadorSucesso + contatosComFalha.length,
            temFalhas: contatosComFalha.length > 0
        });
    });

    client.initialize();
});

// Handler para salvar o relatório de falhas
ipcMain.on('download-report', async () => {
    const { canceled, filePath } = await dialog.showSaveDialog({
        title: 'Salvar Relatório de Falhas',
        defaultPath: `relatorio_falhas_${Date.now()}.csv`,
        filters: [{ name: 'Arquivos CSV', extensions: ['csv'] }]
    });

    if (!canceled && filePath) {
        fs.writeFile(filePath, falhasCSV, 'utf8', (err) => {
            if (err) {
                mainWindow.webContents.send('status_update', `Erro ao salvar o relatório: ${err.message}`);
            } else {
                mainWindow.webContents.send('status_update', `Relatório de falhas salvo em: ${filePath}`);
            }
        });
    }
});


// Controles e seletor de arquivo (sem alterações)
ipcMain.on('pause-sending', () => { isPaused = true; });
ipcMain.on('resume-sending', () => { isPaused = false; });
ipcMain.on('stop-sending', async () => {
    isStopped = true;
    mainWindow.webContents.send('status_update', 'Parando o processo...');
    if (client) {
        await client.destroy();
        client = null;
    }
});
ipcMain.handle('dialog:openFile', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'Arquivos CSV', extensions: ['csv'] }]
    });
    return canceled ? null : filePaths[0];
});
