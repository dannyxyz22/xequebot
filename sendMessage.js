// scripts/xequebot/enviar-manual.js
import {
  cortarTextoParaLimite,
  enviarMensagemWAHA,
} from "./waha.js";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const DEFAULT_MESSAGE = "Hi new test!";
export const DEFAULT_CONTACT = "5512997706453@c.us";

function normaliseInput(value, fallback) {
  if (!value) return fallback;
  return value.replace(/\\n/g, "\n");
}

async function run(messageArg, contactArg) {
  const rawMessage = normaliseInput(messageArg, DEFAULT_MESSAGE);
  const rawContact = normaliseInput(contactArg, DEFAULT_CONTACT);

  const texto = cortarTextoParaLimite(rawMessage);
  const contato = rawContact || DEFAULT_CONTACT;

  console.log("ℹ️ Enviando mensagem personalizada:", { contato, textoPreview: texto.slice(0, 80) });
  await enviarMensagemWAHA(texto, contato);
}

const modulePath = fileURLToPath(import.meta.url);
const executedPath = process.argv[1] ? resolve(process.argv[1]) : null;
const isCliExecution = executedPath ? modulePath === executedPath : false;

if (isCliExecution) {
  const [, , messageArg, contactArg] = process.argv;
  run(messageArg, contactArg).catch(err => {
    console.error("Falha ao executar script auxiliar:", err);
    process.exitCode = 1;
  });
}

export default run;