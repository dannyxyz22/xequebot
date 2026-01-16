import { getPendingMatches } from "./getPendingMatches.js";
import { loadContacts } from "./loadContacts.js";
import { enviarMensagemWAHAGrupo } from "./waha.js";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

function findContact(contacts, playerName) {
  if (!playerName) {
    return null;
  }
  const normalizedPlayerName = playerName.trim().toLowerCase();
  return contacts.find(contact => contact.Nome.trim().toLowerCase() === normalizedPlayerName);
}

async function main() {
  try {
    const contacts = loadContacts('data/contatos-3o-torneio.csv');
    const pendingMatches = await getPendingMatches();

    if (!pendingMatches || pendingMatches.length === 0) {
      console.log("Nenhum jogo pendente encontrado.");
      return;
    }

    const formattedMessages = pendingMatches.map((match) => {
      const player1Name = match['Nome do Jogador 1'];
      const player2Name = match['Nome do Jogador 2'];
      const mesa = match['Mesa'];

      const contact1 = findContact(contacts, player1Name);
      const contact2 = findContact(contacts, player2Name);

      const apelido1 = contact1 ? contact1.Apelido : player1Name;
      const turma1 = contact1 ? contact1.Turma : '';
      const apelido2 = contact2 ? contact2.Apelido : player2Name;
      const turma2 = contact2 ? contact2.Turma : '';

      return `Mesa ${mesa}:\n ${apelido1} (${turma1}) X\n ${apelido2} (${turma2})\n\n`;
    });

    const texto = `Jogos Pendentes:\n\n${formattedMessages.join('\n')}`;

    console.log("Texto a ser enviado:", texto);


    //Grupo da Comissão 3o Torneio
    await enviarMensagemWAHAGrupo(texto, "120363294017799601@g.us");
    
    
    console.log("Mensagem enviada com sucesso!");
  } catch (err) {
    console.error("Erro ao enviar mensagens de jogos pendentes:", err.message);
    process.exitCode = 1;
  }
}

const modulePath = fileURLToPath(import.meta.url);
const executedPath = process.argv[1] ? resolve(process.argv[1]) : null;
const isCliExecution = executedPath ? modulePath === executedPath : false;

if (isCliExecution) {
  main();
}
