import fs from 'fs';
import { loadContacts } from './loadContacts.js';

function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"' && i + 1 < line.length && line[i+1] === '"') {
            current += '"';
            i++; // Skip next quote
        } else if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    values.push(current.trim());

    return values;
}

function loadMatches(csvFilePath) {
    const csvData = fs.readFileSync(csvFilePath, 'utf8');
    const lines = csvData.trim().split(/\r\n|\n/);
    const headerLine = lines.shift();
    if (!headerLine) {
        return [];
    }
    const headers = headerLine.split(',').map(header => header.trim());

    const matches = [];
    for (const line of lines) {
        if (line.trim() === '') continue;
        const values = parseCSVLine(line);
        const match = {};
        for (let j = 0; j < headers.length; j++) {
            // There are two 'Pontuação', 'Nome', 'Apelido', 'Equipe' columns.
            // Let's differentiate them.
            let key = headers[j];
            if (j >= 6) { // After the 'vs' column
                key = `Opponent_${key}`;
            }
            match[key] = values[j] || '';
        }
        matches.push(match);
    }
    return matches;
}



function createMessages(playerMatches) {
    const messages = [];
    for (const playerMatch of playerMatches) {
        const message = 
`♟️♟️♟️♟️♟️♟️♟️♟️♟️♟️♟️♟️

*Rodada 8*

Olá, ${playerMatch.contact.Apelido}!
Sua próxima partida será: 
- na *mesa ${playerMatch.match.Mesa}* 
- contra ${playerMatch.opponent.Nome}, *${playerMatch.opponent.Apelido} (${playerMatch.opponent.Turma})*, 
- número +${playerMatch.opponent.Telefone}
- você joga de *${playerMatch.color}*
- o login do seu adversário no Chess.com é *${playerMatch.opponent.loginChess}*

Agende um horário com seu oponente. Basta clicar no número do celular e falar com ele no zap.

*Boa partida!*`;
        messages.push({
            Nome: playerMatch.contact.Nome,
            Telefone: playerMatch.contact.Telefone,
            Message: message
        });
    }
    return messages;
}

const contacts = loadContacts('data/contatos-3o-torneio.csv');
const matches = loadMatches('data/rodadaatual.csv');

const playerMatches = [];

for (const contact of contacts) {
    const contactName = contact.Nome;
    if (!contactName) continue;

    for (const match of matches) {
        const player1Name = match.Nome;
        const player2Name = match.Opponent_Nome;

        let opponentName = null;
        let color = null;
        if (contactName.toLowerCase() === player1Name.toLowerCase()) {
            opponentName = player2Name;
            color = 'brancas';
        } else if (contactName.toLowerCase() === player2Name.toLowerCase()) {
            opponentName = player1Name;
            color = 'pretas';
        }

        if (opponentName) {
            const opponentContact = contacts.find(c => c.Nome.toLowerCase() === opponentName.toLowerCase());
            playerMatches.push({
                contact: {
                    Nome: contact.Nome,
                    Telefone: contact.Telefone,
                    Apelido: contact.Apelido
                },
                opponent: {
                    Nome: opponentName,
                    Telefone: opponentContact ? opponentContact.Telefone : 'N/A',
                    Apelido: opponentContact ? opponentContact.Apelido : 'N/A',
                    Turma: opponentContact ? opponentContact.Turma : 'N/A',
                    loginChess: opponentContact ? opponentContact.LoginChess : 'N/A'
                },
                match: match,
                color: color
            });
        }
    }
}

function messagesToCSV(messages) {
    const header = 'Nome,Telefone,Message';
    const rows = messages.map(m => {
    const safeMessage = m.Message.replace(/\n/g, '\\n'); // escapa as quebras
        return `"${m.Nome}","${m.Telefone}","${safeMessage}"`;
    });
    return [header, ...rows].join('\n');
}

const messages = createMessages(playerMatches);
const csvData = messagesToCSV(messages);
fs.writeFileSync('data//matches-round.csv', csvData);

console.log('data//matches-round.csv created successfully.');
