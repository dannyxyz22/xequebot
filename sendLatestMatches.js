import { getLatestMatches, cortarTextoParaLimite, enviarMensagemWAHAGrupo, formatMatches } from "./waha.js";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

async function main() {
  try {
    const today = new Date();
    const offset = today.getTimezoneOffset() * 60000; // offset in ms
    const saoPauloOffset = -3 * 60 * 60 * 1000; // GMT-3
    const saoPauloTime = today.getTime() + offset + saoPauloOffset ;//-24*60*60*1000;
    const saoPauloDate = new Date(saoPauloTime);
    const todayStr = saoPauloDate.toISOString().split('T')[0];
    const data = await getLatestMatches(todayStr);
    console.log("Dados recebidos:", data);
    const dateStr = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const formattedMatches = formatMatches(data);
    const texto = cortarTextoParaLimite(`Resultados de *${dateStr}*\n\n${formattedMatches}`);
    console.log("Texto formatado:", texto);
    //Grupo teste Sassá
    //await enviarMensagemWAHAGrupo(texto, "120363420045123869@g.us");
    //Grupo da Comissão 3o Torneio
    //await enviarMensagemWAHAGrupo(texto, "120363294017799601@g.us");

    //Meu número
    //await enviarMensagemWAHAGrupo(texto, "5512997706453");
    //Grupo Bostejo
    await enviarMensagemWAHAGrupo(texto, "120363183228371806@g.us");
    
    
    console.log("Mensagem enviada com sucesso!");
  } catch (err) {
    console.error("Erro ao enviar latest matches:", err.message);
    process.exitCode = 1;
  }
}

const modulePath = fileURLToPath(import.meta.url);
const executedPath = process.argv[1] ? resolve(process.argv[1]) : null;
const isCliExecution = executedPath ? modulePath === executedPath : false;

if (isCliExecution) {
  main();
}
