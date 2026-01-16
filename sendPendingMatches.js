import { getPendingMatches } from './getPendingMatches.js';
import { loadContacts } from './loadContacts.js';
import sendMessage from './sendMessage.js';

async function sendPendingMatchesFake() {
    try {
        // 1. Load contacts
        const contacts = loadContacts('data/contatos-3o-torneio.csv');
        const contactsMap = new Map();
        for (const contact of contacts) {
            // Assuming the contact CSV has 'Nome', 'Apelido' and 'Telefone' columns
            if (contact.Nome && contact.Telefone) {
                contactsMap.set(contact.Nome.trim(), contact); // Store the whole contact object
            }
        }

        // 2. Get pending matches
        const pendingMatches = await getPendingMatches();

        if (pendingMatches.length === 0) {
            console.log("Não há partidas pendentes.");
            return;
        }

        console.log(`Encontradas ${pendingMatches.length} partidas pendentes. Simulando envio de mensagens...`);

        // 3. Iterate and log messages
        for (const match of pendingMatches) {
            const player1Name = match['Nome do Jogador 1'].trim();
            const player2Name = match['Nome do Jogador 2'].trim();
            const mesa = match['Mesa'];

            const player1Contact = contactsMap.get(player1Name);
            const player2Contact = contactsMap.get(player2Name);

            if (player1Contact) {
                const player1Nickname = player1Contact.Apelido || player1Name; // Use nickname if available, else full name
                const player2Phone = player2Contact ? player2Contact.Telefone : 'N/A'; // Get opponent's phone number
                const message = `Olá, ${player1Nickname}. Você tem uma partida pendente contra ${player2Name} na mesa ${mesa}. O seu contato é +${player2Phone}.`;
                //console.log(`FAKE SENDING to ${player1Contact.Telefone}: ${message}`);
                await sendMessage(message, `${player1Contact.Telefone}@c.us`);
            } else {
                console.log(`WARN: Telefone não encontrado para o jogador: ${player1Name}`);
            }

            if (player2Contact) {
                const player2Nickname = player2Contact.Apelido || player2Name; // Use nickname if available, else full name
                const player1Phone = player1Contact ? player1Contact.Telefone : 'N/A'; // Get opponent's phone number
                const message = `Olá, ${player2Nickname}. Você tem uma partida pendente contra ${player1Name} na mesa ${mesa}. O seu contato é +${player1Phone}.`;
                //console.log(`FAKE SENDING to ${player2Contact.Telefone}: ${message}`);
                await sendMessage(message, `${player2Contact.Telefone}@c.us`);
            } else {
                console.log(`WARN: Telefone não encontrado para o jogador: ${player2Name}`);
            }
        }
    } catch (error) {
        console.error("Erro ao simular envio de partidas pendentes:", error);
    }
}

sendPendingMatchesFake();
