import fs from 'fs';
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
    const lines = csvData.trim().split(/\r\n|\n/);
    const headerLine = lines.shift();
    if (!headerLine) {
        return [];
    }
    const headers = headerLine.split(',');

    const messages = [];
    for (const line of lines) {
        if (line.trim() === '') continue;
        const values = parseCSVLine(line);
        const messageData = {};
        for (let j = 0; j < headers.length; j++) {
            messageData[headers[j]] = values[j] || '';
        }
        messages.push(messageData);
    }
    return messages;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendAllMessages() {
    const messages = loadMessages('data//matches-round.csv');
    console.log(messages);

    for (const messageData of messages) {
        const { Telefone, Message } = messageData;
        if (Telefone && Message) {
            console.log(`Sending message to ${Telefone}`);
            await sendMessage(Message, `${Telefone}@c.us`);
            const delay = Math.floor(Math.random() * (1000 + 1)) + 500; // Random delay between 500ms and 1500ms
            console.log(`Waiting for ${delay}ms`);
            await sleep(delay);
        }
    }
}

sendAllMessages().catch(console.error);
