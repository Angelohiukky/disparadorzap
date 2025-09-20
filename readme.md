# 📱 Disparador WhatsApp Desktop

> **Uma aplicação desktop poderosa para envio de mensagens personalizadas em massa via WhatsApp Web**

![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)
![Electron](https://img.shields.io/badge/Electron-191970?style=for-the-badge&logo=Electron&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Windows](https://img.shields.io/badge/Windows-0078D6?style=for-the-badge&logo=windows&logoColor=white)

## 🚀 Características Principais

- ✅ **Interface Intuitiva**: Design moderno e amigável inspirado no WhatsApp
- ✅ **Mensagens Personalizadas**: Use `{nome}` para personalizar cada mensagem
- ✅ **Processamento CSV**: Suporte completo a arquivos CSV com formato simples
- ✅ **Controles Inteligentes**: Pausar, retomar e parar envios a qualquer momento
- ✅ **Relatórios Detalhados**: Acompanhe sucessos e falhas em tempo real
- ✅ **Prevenção de Bloqueios**: Pausas automáticas para evitar restrições do WhatsApp
- ✅ **QR Code Integrado**: Autenticação fácil via WhatsApp Web
- ✅ **Instalador Windows**: Distribuição profissional com assistente de instalação

## 📋 Pré-requisitos

- **Windows 10/11** (64-bit)
- **WhatsApp** instalado no celular
- **Conexão com internet** estável
- **Arquivo CSV** com contatos no formato: `Nome;Telefone`

## 🔧 Instalação

### Opção 1: Usar o Instalador (Recomendado)
1. Baixe o arquivo `Disparador WhatsApp Setup.exe`
2. Execute o instalador como administrador
3. Siga as instruções do assistente de instalação
4. Inicie a aplicação pelo ícone na área de trabalho

### Opção 2: Executar do Código Fonte
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/disparador-whatsapp

# Entre no diretório
cd disparador-whatsapp

# Instale as dependências
npm install

# Execute a aplicação
npm start
```

## 📊 Como Usar

### 1. Preparar o Arquivo CSV
Crie um arquivo CSV com o seguinte formato:
```csv
João Silva;11999999999
Maria Santos;11888888888
Pedro Costa;11777777777
Ana Oliveira;11666666666
```

### 2. Configurar a Mensagem
- Digite sua mensagem no campo de texto
- Use `{nome}` para personalização automática
- Exemplo: `Olá {nome}! Como você está hoje?`

### 3. Iniciar o Processo
1. **Selecione o arquivo CSV** com seus contatos
2. **Clique em "Iniciar Envios"**
3. **Escaneie o QR Code** com seu WhatsApp
4. **Acompanhe o progresso** em tempo real

### 4. Controlar o Envio
- **Pausar**: Interrompe temporariamente os envios
- **Retomar**: Continua de onde parou
- **Parar**: Finaliza completamente o processo

## ⚙️ Configurações Inteligentes

| Recurso | Descrição | Valor |
|---------|-----------|-------|
| **Delay entre mensagens** | Intervalo para evitar spam | 15 segundos |
| **Pausa automática** | A cada X mensagens | 50 mensagens |
| **Tempo de pausa** | Duração da pausa automática | 60 segundos |
| **Formato do número** | Código do país + número | +55 (Brasil) |

## 🛡️ Recursos de Segurança

- **Autenticação Local**: Suas credenciais ficam no seu computador
- **Sem Armazenamento**: Não salvamos seus contatos ou mensagens
- **Pausas Inteligentes**: Previne bloqueios automáticos do WhatsApp
- **Relatórios de Erro**: Identifica números inválidos automaticamente

## 📱 Capturas de Tela

### Interface Principal
![Interface Principal](docs/screenshot-main.png)

### QR Code de Autenticação
![QR Code](docs/screenshot-qr.png)

### Processo de Envio
![Envio](docs/screenshot-sending.png)

## 🔧 Desenvolvimento

### Tecnologias Utilizadas
- **Electron** - Framework para aplicações desktop
- **Node.js** - Runtime JavaScript
- **whatsapp-web.js** - Biblioteca para integração com WhatsApp Web
- **QRCode** - Geração de códigos QR
- **Electron Builder** - Empacotamento e distribuição

### Estrutura do Projeto
```
disparador-whatsapp/
├── main.js              # Processo principal do Electron
├── preload.js           # Script de pré-carregamento
├── package.json         # Configurações e dependências
├── public/
│   ├── index.html       # Interface da aplicação
│   ├── script.js        # JavaScript do frontend
│   └── icon.ico         # Ícone da aplicação
├── docs/                # Documentação e capturas
└── dist/                # Arquivos de distribuição
```

### Comandos de Build
```bash
# Desenvolvimento
npm start

# Gerar instalador Windows
npm run dist-win

# Empacotar sem instalador
npm run pack

# Instalar dependências nativas
npm run postinstall
```

## 🚨 Limitações e Avisos

- ⚠️ **Use com responsabilidade**: Respeite as políticas do WhatsApp
- ⚠️ **Não spam**: Evite envios excessivos que possam ser considerados spam
- ⚠️ **Números válidos**: Certifique-se de que os números estão corretos
- ⚠️ **Conexão estável**: Mantenha internet estável durante os envios

## 🐛 Solução de Problemas

### Problemas Comuns

**❓ QR Code não aparece**
- Verifique sua conexão com internet
- Reinicie a aplicação
- Certifique-se de que o WhatsApp Web está funcionando

**❓ Mensagens não são enviadas**
- Verifique se o número está no formato correto (apenas números)
- Confirme se o contato existe no WhatsApp
- Verifique se não há bloqueios temporários

**❓ Aplicação trava durante envios**
- Reduza a quantidade de contatos por lote
- Verifique se há memória RAM suficiente
- Reinicie a aplicação se necessário

## 📞 Suporte

Encontrou um bug ou tem uma sugestão? 

- 📧 **Email**: suporte@disparadorwhatsapp.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/seu-usuario/disparador-whatsapp/issues)
- 💬 **Discussões**: [GitHub Discussions](https://github.com/seu-usuario/disparador-whatsapp/discussions)

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Desenvolvedor

**Rodrigo Angelo**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/RA-Evangelista)
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/angelo.hiukky/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/rodrigo-angelo-evangelista-091406171/)

---

## ⭐ Contribuições

Contribuições são sempre bem-vindas! Veja como você pode ajudar:

1. 🍴 Faça um Fork do projeto
2. 🔀 Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. 💾 Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. 📤 Push para a branch (`git push origin feature/AmazingFeature`)
5. 🔃 Abra um Pull Request

## 📈 Roadmap

- [ ] **v2.0**: Suporte a imagens e documentos
- [ ] **v2.1**: Agendamento de mensagens
- [ ] **v2.2**: Templates de mensagens
- [ ] **v2.3**: Integração com Google Sheets
- [ ] **v2.4**: Relatórios em PDF
- [ ] **v3.0**: Suporte a múltiplas contas

---

<div align="center">

**⚡ Feito com ❤️ e muito ☕ por [Rodrigo Angelo](https://github.com/RA-Evangelista)**

*Se este projeto te ajudou, considere dar uma ⭐!*

</div>