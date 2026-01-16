import fs from 'fs';
import Papa from 'papaparse';
import sendMessage from './sendMessage.js';

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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendAllMessages() {
    const messages = loadMessages('data//matches-round.csv');

    for (const messageData of messages) {
        const { Telefone, Message } = messageData;
        if (Telefone && Message) {
            const formattedMessage = Message.replace(/\\n/g, '\n');

            console.log(`Sending message to ${Telefone}`);
            await sendMessage(formattedMessage, `${Telefone}@c.us`);
            const delay = Math.floor(Math.random() * (1000 + 1)) + 1500; // Random delay between 500ms and 1500ms
            console.log(`Waiting for ${delay}ms`);
            await sleep(delay);
        }
    }
}



sendAllMessages().catch(console.error);
