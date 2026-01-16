import fs from 'fs';
import Papa from 'papaparse';

function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"' && i + 1 < line.length && line[i+1] === '"') {
            current += '"';
            i++; // Skip next quote
        } else if (char === '"' ) {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    values.push(current.trim());

    return values.map(v => v.startsWith('"') && v.endsWith('"') ? v.slice(1, -1) : v);
}


function loadMessages(csvFilePath) {
  const csvData = fs.readFileSync(csvFilePath, 'utf8');

  const result = Papa.parse(csvData, {
    header: true,          // usa a primeira linha como cabeçalho
    skipEmptyLines: true,  // ignora linhas vazias
    quoteChar: '"',        // garante que mensagens entre aspas sejam lidas corretamente
  });

  return result.data; // cada linha é um objeto { Nome, Telefone, Message }
}



async function sendAllMessages() {
    const messages = loadMessages('data//matches-round.csv');

    for (const messageData of messages) {
        const { Telefone, Message } = messageData;
        if (Telefone && Message) {
            const formattedMessage = Message.replace(/\\n/g, '\n');
            console.log(`FAKE SENDING to ${Telefone}: ${formattedMessage}`);
        }
    }
}

sendAllMessages().catch(console.error);
