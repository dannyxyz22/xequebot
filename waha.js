// 📦 Instale primeiro o axios, se ainda não tiver:
// npm install axios

import axios from "axios";
import { loadContacts } from "./loadContacts.js";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

// ==============================
// 🔐 Configurações
// ==============================

const WAHA_SERVER_HOST = process.env.WAHA_HOST || "waha";
const WAHA_PORT = Number(process.env.WAHA_PORT) || 3000;
const WAHA_BASE_URL = process.env.WAHA_URL || `http://${WAHA_SERVER_HOST}:${WAHA_PORT}`;
const WAHA_API_URL = process.env.WAHA_API_URL || `${WAHA_BASE_URL}/api/sendText`;
const WAHA_SESSION = process.env.WAHA_SESSION || "default";

const WAHA_API_KEY = process.env.WAHA_API_KEY || "15dbf01df6fa4a128af03fa96e0be548";

const SUPABASE_PROJECT_URL = "https://hlyvqgzsidswpjjppqyi.supabase.co"; // substitua pelo seu projeto
const SUPABASE_EDGE_FUNCTION = "get-latest-insight";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhseXZxZ3pzaWRzd3BqanBwcXlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNzQ2NDgsImV4cCI6MjA3NDY1MDY0OH0.qVHsCp9EOqvVXFjefnxjFEB0sxALeOVKCMwUWOQwKeI";

// ==============================
// 🚀 Funções principais
// ==============================

async function testeEnviarMensagem(texto) {
  await enviarMensagemWAHA(texto, "5512997706453@c.us");
}




/**
 * Busca o insight mais recente do Supabase.
 * Esta é uma função assíncrona que usa a Fetch API (padrão de Navegadores e Node.js 18+).
 * * NOTA: As constantes SUPABASE_PROJECT_URL, SUPABASE_EDGE_FUNCTION, 
 * e SUPABASE_ANON_KEY devem estar definidas no escopo onde esta função for chamada.
 */
async function getLatestInsight() {
  // 1. Monta a URL (igual ao seu código)
  const url = `${SUPABASE_PROJECT_URL}/functions/v1/${SUPABASE_EDGE_FUNCTION}`;

  // 2. Define as opções da requisição
  // Nota: 'method: "get"' é o padrão da fetch, mas o incluímos para clareza.
  const options = {
    method: "GET", // Em Apps Script era "get", o padrão web é "GET" (maiúsculo)
    headers: {
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "apikey": SUPABASE_ANON_KEY,
      "Content-Type": "application/json"
    }
    // "muteHttpExceptions: true" não existe na fetch.
    // Em vez disso, verificamos a propriedade "response.ok" manualmente.
  };

  try {
    // 3. Executa a requisição e aguarda a resposta (assíncrono)
    const response = await fetch(url, options);

    // 4. Verifica se a requisição foi bem-sucedida (status 200-299)
    if (!response.ok) {
      // Se falhou, tenta ler o corpo da resposta como texto para dar mais detalhes
      const errorText = await response.text();
      throw new Error(`Erro Supabase: ${response.status} - ${errorText}`);
    }

    // 5. Se foi sucesso, converte o corpo da resposta de JSON para um objeto JavaScript
    const data = await response.json();
    return data;

  } catch (error) {
    // Captura erros de rede (ex: DNS não encontrado, sem conexão) ou o erro que lançamos acima
    console.error("Falha ao buscar insight do Supabase:", error);
    throw error; // Propaga o erro para quem chamou a função
  }
}


 /**
 * Busca o insight mais recente do Supabase.
 * Esta é uma função assíncrona que usa a Fetch API (padrão de Navegadores e Node.js 18+).
 * * NOTA: As constantes SUPABASE_PROJECT_URL, SUPABASE_EDGE_FUNCTION, 
 * e SUPABASE_ANON_KEY devem estar definidas no escopo onde esta função for chamada.
 */
export async function getLatestMatches(date) {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("Parâmetro 'date' obrigatório no formato YYYY-MM-DD");
  }
  // 1. Monta a URL (igual ao seu código)
  const url = `${SUPABASE_PROJECT_URL}/functions/v1/get-matches-by-day?day=${encodeURIComponent(date)}`;
console.log ("URL montada:", url);
  // 2. Define as opções da requisição
  // Nota: 'method: "get"' é o padrão da fetch, mas o incluímos para clareza.
  const options = {
    method: "GET", // Em Apps Script era "get", o padrão web é "GET" (maiúsculo)
    headers: {
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "apikey": SUPABASE_ANON_KEY,
      "Content-Type": "application/json"
    }
    // "muteHttpExceptions: true" não existe na fetch.
    // Em vez disso, verificamos a propriedade "response.ok" manualmente.
  };

  try {
    // 3. Executa a requisição e aguarda a resposta (assíncrono)
    const response = await fetch(url, options);

    // 4. Verifica se a requisição foi bem-sucedida (status 200-299)
    if (!response.ok) {
      // Se falhou, tenta ler o corpo da resposta como texto para dar mais detalhes
      const errorText = await response.text();
      throw new Error(`Erro Supabase: ${response.status} - ${errorText}`);
    }

    // 5. Se foi sucesso, converte o corpo da resposta de JSON para um objeto JavaScript
    const data = await response.json();
    return data;

  } catch (error) {
    // Captura erros de rede (ex: DNS não encontrado, sem conexão) ou o erro que lançamos acima
    console.error("Falha ao buscar matches do Supabase:", error);
    throw error; // Propaga o erro para quem chamou a função
  }
}

export async function enviarMensagemWAHAGrupo(texto, groupId) {
  if (!groupId) {
    throw new Error("Parâmetro 'groupId' obrigatório para enviar mensagem em grupo.");
  }
  return enviarMensagemWAHA(texto, groupId);
}


/**
 * Envia uma mensagem de texto para a API do WhatsApp (WAHA).
 */
export async function enviarMensagemWAHAFake(texto, chatID) {
//export async function enviarMensagemWAHA(texto, chatID) {
  console.log(`Enviando mensagem via WAHA para ${chatID}...\n ${texto}`);
}
//export async function enviarMensagemWAHAReal(texto, chatID) {
export async function enviarMensagemWAHA(texto, chatID) {
  console.log(`ℹ️ Iniciando envio via WAHA. Sessão: ${WAHA_SESSION}, Destino: ${chatID}`);
  await ensureSessionReady(WAHA_SESSION);

  // Gera um token aleatório (ex: "a4f8k1")
  const tokenAleatorio = Math.random().toString(36).substring(2, 10);
  
  // var caractereInvisivel = "\u200B"; 
  // var textoFinal = mensagemBase + caractereInvisivel + tokenAleatorio;
  //const idOculto = tokenAleatorio.split("").join("\u200B");
  const textoFinal = `*ITAEx Xeque Bot* 🤖\n${texto}`;// \n\n(ID: ${tokenAleatorio})`;

  // Corpo (payload)
  const payloadData = {
    chatId: chatID,
    reply_to: null,
    text: textoFinal,
    linkPreview: true,
    linkPreviewHighQuality: false,
    session: WAHA_SESSION,
  };

  // Cabeçalhos HTTP
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Api-Key": WAHA_API_KEY,
  };

  try {
    console.log("ℹ️ Disparando POST para WAHA:", {
      url: WAHA_API_URL,
      session: WAHA_SESSION,
      payload: payloadData,
    });
    const response = await axios.post(WAHA_API_URL, payloadData, { headers });

    const asString = typeof response.data === "string"
      ? response.data
      : JSON.stringify(response.data);
    const normalizedBody = asString ? asString.toUpperCase() : "";

    if (normalizedBody.includes("SCAN_QR_CODE")) {
      const qrError = new Error("WAHA retornou SCAN_QR_CODE. Escaneie o QR Code antes de enviar mensagens.");
      qrError.code = "WAHA_SCAN_QR_CODE";
      console.error("❌ Erro WAHA:", qrError.message);
      console.error("📨 Resposta:", response.data);
      throw qrError;
    }

    if (normalizedBody.includes("STOPPED")) {
      const stoppedError = new Error("WAHA retornou STOPPED. Inicie a sessão do WhatsApp antes de enviar mensagens.");
      stoppedError.code = "WAHA_STOPPED";
      console.error("❌ Erro WAHA:", stoppedError.message);
      console.error("📨 Resposta:", response.data);
      throw stoppedError;
    }

    if (response.status === 200 || response.status === 201) {
      console.log("✅ Mensagem enviada com sucesso!");
      console.log("📨 Resposta:", response.data);
      return response.data;
    }

    const failure = new Error(`Falha ao enviar mensagem (status ${response.status}).`);
    failure.code = "WAHA_SEND_FAILED";
    failure.response = response.data;
    console.error("⚠️ Falha ao enviar mensagem.");
    console.error("Código:", response.status);
    console.error("Detalhes:", response.data);
    throw failure;
  } catch (error) {
    const detail = error?.response?.data;
    const baseMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Erro na requisição:", baseMessage);
    if (error?.config) {
      console.error("🔍 Configuração da requisição:", {
        url: error.config.url,
        method: error.config.method,
        data: error.config.data,
      });
    }
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Body:", detail);
    }
    throw error;
  }
}

/**
 * Corta uma string para que ela não exceda 4096 caracteres.
 * Se a string for menor ou igual a 4096 caracteres, retorna a string original.
 *
 * @param {string} texto O texto a ser cortado.
 * @returns {string} O texto cortado nos primeiros 4096 caracteres.
 */
export function cortarTextoParaLimite(texto) {
  texto = processarMarkdown(texto);
  // Verifica se a entrada é uma string e não nula
  if (typeof texto !== 'string' || texto === null || texto === undefined) {
    // Pode-se optar por retornar uma string vazia ou lançar um erro,
    // mas retornar a entrada como está é geralmente mais seguro.
    return ''; 
  }

  const limite = 4096;

  // O método slice(início, fim) retorna a parte da string entre o início 
  // e o fim (exclusivo). Se 'fim' for maior que o comprimento da string, 
  // ele simplesmente retorna a string inteira, o que é o comportamento desejado.
  return texto.slice(0, limite);
}

/**
 * Processa uma string de texto, substituindo todas as ocorrências de 
 * negrito (**) por itálico (*).
 * * @param {string} texto O texto contendo as marcações **.
 * @returns {string} O texto com ** substituído por *.
 */
function processarMarkdown(texto) {
  // Verifica se a entrada é uma string e não nula
  if (typeof texto !== 'string' || texto === null || texto === undefined) {
    return String(texto); // Tenta converter para string ou retorna o valor original
  }

  // O método .replace() com uma Expressão Regular global (/g) é a forma 
  // mais eficiente de substituir todas as ocorrências.
  // A expressão regular /g (global) garante que *todas* as ocorrências 
  // de '**' sejam substituídas.
  return texto.replace(/\*\*/g, '*');
}

/**
 * Formata os dados de matches para exibição.
 * @param {object} data - Objeto contendo array de matches.
 * @returns {string} Texto formatado das partidas.
 */
export function formatMatches(data) {
  if (!data || !Array.isArray(data.matches) || data.matches.length === 0) {
    return "Não houve partidas reportadas.";
  }

  // Importa e carrega os contatos uma vez
  let contacts = [];
  try {
    contacts = loadContacts('data/contatos-3o-torneio.csv');
  } catch (e) {
    contacts = [];
  }

  const matchesFormatado = data.matches.map(match => {
    const localTime = new Date(match.created_at).toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' });
    let turmaA = '';
    let turmaB = '';
    if (contacts && Array.isArray(contacts)) {
      const foundA = contacts.find(c => c.Nome && c.Nome.trim().toLowerCase() === String(match.player_a_name).trim().toLowerCase());
      turmaA = foundA && foundA.Turma ? ` (${foundA.Turma})` : '';
      const foundB = contacts.find(c => c.Nome && c.Nome.trim().toLowerCase() === String(match.player_b_name).trim().toLowerCase());
      turmaB = foundB && foundB.Turma ? ` (${foundB.Turma})` : '';
    }
    let resultString;
    const playerA = `*${match.player_a_nickname}*${turmaA}`;
    const playerB = `*${match.player_b_nickname}*${turmaB}`;

    if (match.result === 'Brancas') {
      resultString = `${playerA} 1 x 0 ${playerB}`;
    } else if (match.result === 'Pretas') {
      resultString = `${playerA} 0 x 1 ${playerB}`;
    } else if (match.result === 'Empate') {
      resultString = `${playerA} 1/2 x 1/2 ${playerB}`;
    } else {
      resultString = `${playerA} x ${playerB} - Resultado: *${match.result}*`;
    }
    return `*M${match.table_number}* - ${localTime}\n${resultString}`;
  }).join('\n\n');

  return `Rodada ${data.matches[0].round_number}\n\n${matchesFormatado}`;
}

// ==============================
// ▶️ Executar
// ==============================

async function main() {
  const insight = await getLatestInsight();
  const teste = cortarTextoParaLimite(insight.insight.analysis);
  console.log("Insight recebido:", insight.insight.analysis);
  //await enviarMensagemWAHAGrupo(teste, "120363420045123869@g.us");
  //await enviarMensagemWAHA(teste, "5512997706453@c.us");

  //Grupo Bostejo
  await enviarMensagemWAHAGrupo(teste, "120363183228371806@g.us");
}

const modulePath = fileURLToPath(import.meta.url);
const executedPath = process.argv[1] ? resolve(process.argv[1]) : null;
const isCliExecution = executedPath ? modulePath === executedPath : false;

if (isCliExecution) {
  try {
    await main();
  } catch (err) {
    console.error("Não foi possível obter o insight:", err.message);
    process.exitCode = 1;
  }
}

async function ensureSessionReady(sessionId) {
  console.log(`ℹ️ Verificando status da sessão WAHA '${sessionId}'...`);
  try {
    const statusResponse = await axios.get(`${WAHA_BASE_URL}/api/sessions/${sessionId}`, {
      headers: {
        "X-Api-Key": WAHA_API_KEY,
      },
      timeout: 5000,
    });

    console.log("ℹ️ Resposta de status da sessão:", statusResponse.data);

    const rawStatus = statusResponse?.data?.state || statusResponse?.data?.status;
    if (!rawStatus) {
      console.warn(`⚠️ Resposta de status sem campo 'state' ou 'status'. Prosseguindo.`);
      return;
    }

    const normalizedStatus = String(rawStatus).toUpperCase();

    if (normalizedStatus.includes("SCAN")) {
      const qrError = new Error(`Sessão WAHA (${sessionId}) aguardando leitura do QR Code.`);
      qrError.code = "WAHA_SCAN_QR_CODE";
      qrError.wahaStatus = rawStatus;
      throw qrError;
    }

    if (normalizedStatus.includes("STOP")) {
      const stoppedError = new Error(`Sessão WAHA (${sessionId}) está parada (status ${rawStatus}).`);
      stoppedError.code = "WAHA_STOPPED";
      stoppedError.wahaStatus = rawStatus;
      throw stoppedError;
    }

    const READY_KEYWORDS = ["RUN", "WORK", "CONN", "AUTH", "READY"];
    const isReady = READY_KEYWORDS.some(keyword => normalizedStatus.includes(keyword));
    if (!isReady) {
      console.warn(`⚠️ Sessão WAHA (${sessionId}) em estado inesperado (${rawStatus}). Prosseguindo com cautela.`);
    }
    console.log(`ℹ️ Sessão WAHA (${sessionId}) considerada pronta (estado ${rawStatus}).`);
  } catch (error) {
    if (error.code === "WAHA_SCAN_QR_CODE" || error.code === "WAHA_STOPPED") {
      console.error("❌ Sessão WAHA não está pronta:", error.message);
      throw error;
    }

    if (error.response) {
      const statusText = error.response.statusText || "";
      const statusCode = error.response.status;
      const bodyText = JSON.stringify(error.response.data);
      const failure = new Error(`Falha ao verificar status da sessão WAHA (HTTP ${statusCode} ${statusText}).`);
      failure.code = "WAHA_STATUS_CHECK_FAILED";
      failure.details = bodyText;
      console.error("❌ Erro ao consultar status da sessão WAHA:", failure.message, bodyText);
      throw failure;
    }

    const generic = new Error(`Não foi possível consultar o status da sessão WAHA: ${error.message}`);
    generic.code = "WAHA_STATUS_CHECK_FAILED";
    console.error("❌ Erro ao consultar status da sessão WAHA:", error.message);
    throw generic;
  }
}