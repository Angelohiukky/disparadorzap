// main.js

const { app, BrowserWindow, ipcMain, dialog } = require('electron');

const path = require('path');

const fs = require('fs');

const { Client, LocalAuth } = require('whatsapp-web.js');

const qrcode = require('qrcode');



let mainWindow;



function createWindow() {

    mainWindow = new BrowserWindow({

        width: 800,

        height: 850, // Aumentei um pouco para caber o relatório

        webPreferences: {

            preload: path.join(__dirname, 'preload.js'),

            contextIsolation: true,

        },

        icon: path.join(__dirname, 'public/icon.ico'), // Usando o ícone correto

        autoHideMenuBar: true, // Oculta o menu da aplicação

    });



    mainWindow.loadFile('public/index.html');

}



app.whenReady().then(createWindow);



const delay = ms => new Promise(res => setTimeout(res, ms));



// A lógica do WhatsApp começa quando a interface envia o sinal

ipcMain.on('start-whatsapp', (event, { filePath, messageTemplate }) => {

    

    const client = new Client({

        authStrategy: new LocalAuth(),

        puppeteer: {

            headless: false, // Inicia com o navegador visível

            args: ['--no-sandbox', '--disable-setuid-sandbox']

        }

    });



    client.on('qr', async (qr) => {

        const qrDataUrl = await qrcode.toDataURL(qr);

        mainWindow.webContents.send('qr_code', qrDataUrl);

    });



    client.on('ready', async () => {

        mainWindow.webContents.send('session_ready');

        

        const contatosComFalha = [];

        let linhas;

        try {

            const data = fs.readFileSync(filePath, 'utf8');

            // Leitura de arquivo mais robusta para evitar erros com linhas vazias

            linhas = data.split(/\r?\n/).filter(linha => linha.trim() !== '');

            mainWindow.webContents.send('status_update', `Arquivo lido. ${linhas.length} contatos encontrados. Iniciando envios...`);

        } catch (err) {

            mainWindow.webContents.send('status_update', `Erro ao ler o arquivo: ${err.message}`);

            return;

        }



        let contadorSucesso = 0;

        for (let i = 0; i < linhas.length; i++) {

            const linha = linhas[i];

            let nome = `Linha ${i + 1}`;

            let telefone = '';



            try {

                // Verifica se a linha não é nula antes de processar

                if (linha) {

                    const colunas = linha.split(';');

                    if (colunas.length >= 2) {

                        nome = colunas[0].trim();

                        telefone = colunas[1].trim();

                        if (!telefone) throw new Error("Número de telefone vazio.");



                        const numeroFormatado = `55${telefone}@c.us`;

                        const mensagemFinal = messageTemplate.replace(/{nome}/g, nome);



                        const statusMsg = `(${i + 1}/${linhas.length}) Enviando para: ${nome}`;

                        mainWindow.webContents.send('status_update', statusMsg);



                        await client.sendMessage(numeroFormatado, mensagemFinal);

                        contadorSucesso++;



                        if (contadorSucesso > 0 && contadorSucesso % 50 === 0 && (i + 1) < linhas.length) {

                            mainWindow.webContents.send('status_update', `PAUSA DE 60 SEGUNDOS... (${contadorSucesso} enviados)`);

                            await delay(60000);

                        } else {

                            await delay(15000);

                        }

                    }

                }

            } catch (err) {

                console.error(`ERRO ao enviar para ${nome}: ${err.message}`);

                contatosComFalha.push({ nome, telefone, erro: err.message });

                mainWindow.webContents.send('status_update', `Erro ao enviar para ${nome}. Pulando...`);

                await delay(5000);

            }

        }



        // Relatório Final

        let finalReport = `Processo finalizado! ${contadorSucesso} mensagens enviadas com sucesso.`;

        if (contatosComFalha.length > 0) {

            finalReport += `\n\n--- RELATÓRIO DE FALHAS ---\n` + contatosComFalha.map(c => `- ${c.nome} (${c.telefone}): Número inválido ou não encontrado`).join('\n');

        }

        mainWindow.webContents.send('status_update', finalReport);

    });



    client.initialize();

});



// **ESTA PARTE É RESPONSÁVEL POR ABRIR A JANELA PARA SELECIONAR O ARQUIVO**

ipcMain.handle('dialog:openFile', async () => {

    const { canceled, filePaths } = await dialog.showOpenDialog({

        properties: ['openFile'],

        filters: [{ name: 'Arquivos CSV', extensions: ['csv'] }]

    });

    return canceled ? null : filePaths[0];

});