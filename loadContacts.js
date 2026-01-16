import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

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
            values.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    values.push(current);

    return values.map(v => v.trim());
}

function loadContacts(csvFilePath) {
    const csvData = fs.readFileSync(csvFilePath, 'utf8');
    const lines = csvData.trim().split(/\r\n|\n/);
    const headerLine = lines.shift();
    if (!headerLine) {
        return [];
    }
    // Regex to handle simple cases and then fallback to manual parsing for headers
    const headers = headerLine.split(',').map(header => {
        return header.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    });

    const contacts = [];
    for (const line of lines) {
        if (line.trim() === '') continue;
        const values = parseCSVLine(line);
        const contact = {};
        for (let j = 0; j < headers.length; j++) {
            contact[headers[j]] = values[j] || '';
        }
        contacts.push(contact);
    }
    return contacts;
}

// To easily print all contacts, run this script directly using 'node loadContacts.js'
// The following code will execute only when the script is run directly.
const __filename = fileURLToPath(import.meta.url);
const scriptPath = path.resolve(process.argv[1]);
if (scriptPath === __filename) {
    const contacts = loadContacts('data/contatos-3o-torneio.csv');

    //console.log(contacts[0].Telefone);
    //console.log(JSON.stringify(contacts, null, 2));
}

export { loadContacts };
