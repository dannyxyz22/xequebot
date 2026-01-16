import axios from 'axios';
import csv from 'csv-parser';
import { Readable } from 'stream';

function getPendingMatches() {
  return new Promise(async (resolve, reject) => {
    const url = 'https://docs.google.com/spreadsheets/d/1ndYystsrYAAKNUUw1yEZWucv7xt9MtB8-tNrj5-uRFA/export?format=csv&gid=1303249490';
    try {
      const response = await axios.get(url);
      const results = [];

      const stream = Readable.from(response.data);

      stream
        .pipe(csv({ 
          skipLines: 2,
          headers: ['Mesa', 'Pontuacao_1', 'Nome_1', 'Apelido_1', 'Equipe_1', 'vs', 'Pontuacao_2', 'Nome_2', 'Apelido_2', 'Equipe_2', 'Horario', 'Resultado', 'Link']
        }))
        .on('data', (data) => {
          if (!data['Resultado'] && !data['Horario'] && data['Nome_1']) {
            results.push({
              'Mesa': data['Mesa'],
              'Nome do Jogador 1': data['Nome_1'],
              'Nome do Jogador 2': data['Nome_2'],
            });
          }
        })
        .on('end', () => {
          resolve(results);
        })
        .on('error', (error) => {
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
}

export { getPendingMatches };
