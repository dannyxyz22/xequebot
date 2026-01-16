# XequeBot 🤖♟️

Bot para envio automatizado de mensagens via WhatsApp utilizando [WAHA (WhatsApp HTTP API)](https://github.com/devlikeapro/waha).

## 📋 Funcionalidades

- **Envio de mensagens individuais** - Envie mensagens para contatos específicos
- **Envio em lote** - Envie mensagens para múltiplos contatos a partir de um CSV
- **Notificação de partidas** - Notifique jogadores sobre partidas pendentes de torneios de xadrez
- **Integração com Supabase** - Busca dados de partidas via Edge Functions
- **Integração com Google Sheets** - Leitura de dados de partidas diretamente de planilhas

## 🗂️ Estrutura do Projeto

| Arquivo | Descrição |
|---------|-----------|
| `waha.js` | Módulo principal com funções de integração com WAHA e Supabase |
| `sendMessage.js` | Envio de mensagem individual |
| `sendMatches.js` | Envio de mensagens em lote a partir de CSV |
| `sendPendingMatches.js` | Notifica jogadores sobre partidas pendentes |
| `getLatestMatches.js` | Busca e formata resultados de partidas do dia |
| `getPendingMatches.js` | Busca partidas pendentes do Google Sheets |
| `loadContacts.js` | Carrega contatos de arquivo CSV |
| `data/` | Pasta com arquivos CSV de contatos e rodadas |

## 🚀 Instalação

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v18+)
- [Docker](https://www.docker.com/)

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/xequebot.git
cd xequebot
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o WAHA

#### Gerar credenciais

Execute o comando abaixo para gerar as credenciais do WAHA:

```bash
docker run --rm -v "$(pwd)":/app/env devlikeapro/waha init-waha /app/env
```

Isso irá gerar um arquivo `.env` com as credenciais:
- **Username** e **Password** para acessar o Dashboard
- **API Key** para autenticação nas requisições

#### Iniciar o WAHA (modo interativo)

```bash
docker run -it --env-file ".env" -v "$(pwd)/sessions:/app/.sessions" --rm -p 3000:3000 --name waha devlikeapro/waha
```

#### Iniciar o WAHA (modo background com Docker Compose)

Crie um arquivo `docker-compose.yml`:

```yaml
version: '3.8'
services:
  waha:
    image: devlikeapro/waha
    container_name: waha
    env_file:
      - .env
    volumes:
      - ./sessions:/app/.sessions
    ports:
      - "3000:3000"
    restart: unless-stopped
```

Depois, suba o container:

```bash
docker compose up -d
```

### 4. Configure as variáveis de ambiente

Crie ou edite o arquivo `.env` com as seguintes variáveis:

```env
# WAHA
WAHA_HOST=localhost
WAHA_PORT=3000
WAHA_API_KEY=sua_api_key_aqui

# Supabase (opcional)
SUPABASE_PROJECT_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua_anon_key_aqui
```

### 5. Conecte o WhatsApp

1. Acesse o Dashboard em `http://localhost:3000`
2. Faça login com as credenciais geradas
3. Escaneie o QR Code com o WhatsApp do celular

## 📖 Uso

### Enviar mensagem individual

```bash
node sendMessage.js "Sua mensagem aqui" "5511999999999@c.us"
```

### Enviar mensagens em lote

Prepare um arquivo CSV em `data/matches-round.csv` com as colunas `Telefone` e `Message`, depois execute:

```bash
node sendMatches.js
```

### Notificar partidas pendentes

```bash
node sendPendingMatches.js
```

### Buscar resultados do dia

```bash
node getLatestMatches.js
```


### Como enviar os pareamentos

Abra o WAHA Scheduler em http://localhost:4000/

Rode o script scripts/xequebot/findPlayerMatches.js . Ele lê o arquivo data/contatos-3o-torneio.csv para obter os contatos e data/rodadaatual.csv para pegar os matches. O rodadaatual.csv é gerado baixando a aba da rodada no Google Spreadsheets e excluindo a primeira linha vazia. Isso irá gerar o arquivo data/matches-round.csv . Confira esse arquivo e veja se precisa alterar algo.

Rode então o script scripts/xequebot/sendMatchesFake.js para verificar se as mensagens serão enviadas corretamente. Este script não envia as mensagens, ele só simula.

Então, para finalizar, rode o scripts/xequebot/sendMatches.js (ele demora um pouco, pois tem um delay de perto de 1 s entre os envios)

## 📁 Formato dos arquivos CSV

### Contatos (`data/contatos-3o-torneio.csv`)

```csv
Nome,Apelido,Telefone
João Silva,João,5511999999999
Maria Santos,Mari,5511888888888
```

### Mensagens (`data/matches-round.csv`)

```csv
Telefone,Message
5511999999999,"Olá! Sua partida está marcada para hoje."
5511888888888,"Lembrete: partida às 19h."
```

## 🔗 Links úteis

- [WAHA Documentation](https://waha.devlike.pro/docs/)
- [WAHA Dashboard Guide](https://waha.devlike.pro/docs/how-to/dashboard/)
- [WAHA GitHub](https://github.com/devlikeapro/waha)

## 📝 Licença

ISC
