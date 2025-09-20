Como Gerar o Instalador Windows
Pré-requisitos
Node.js instalado (versão 16 ou superior)
Windows (para gerar o instalador .exe)
Passos para gerar o instalador:
1. Instalar dependências
npm install
2. Gerar o instalador
npm run dist-win
3. Localizar o instalador
O arquivo .exe será gerado na pasta dist/ com o nome similar a: Disparador WhatsApp Setup 1.0.0.exe

Comandos disponíveis:
npm start - Executa a aplicação em modo desenvolvimento
npm run pack - Gera os arquivos empacotados (sem instalador)
npm run dist - Gera instalador para a plataforma atual
npm run dist-win - Gera instalador específico para Windows
Estrutura do projeto:
disparador-desktop/
├── main.js              # Processo principal do Electron
├── preload.js           # Script de pré-carregamento
├── package.json         # Configurações e dependências
├── public/
│   ├── index.html       # Interface da aplicação
│   ├── script.js        # JavaScript do frontend
│   └── icon.ico         # Ícone da aplicação
└── dist/                # Pasta gerada com os instaladores
Funcionalidades da aplicação:
Envio de mensagens personalizadas via WhatsApp Web
Suporte a arquivos CSV com formato: Nome;Telefone
Interface gráfica amigável
Controles de pausa/retomada/parada
QR Code para autenticação do WhatsApp
Relatório de envios e falhas
Formato do arquivo CSV:
João Silva;11999999999
Maria Santos;11888888888
Pedro Costa;11777777777
Observações importantes:
A aplicação usa WhatsApp Web, então é necessário ter o WhatsApp instalado no celular
O primeiro uso requer escaneamento do QR Code
Recomenda-se pausas entre envios para evitar bloqueios
A aplicação já inclui pausas automáticas a cada 50 mensagens