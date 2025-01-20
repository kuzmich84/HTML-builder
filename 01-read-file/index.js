const fs = require('fs');
const path = require('path');
const { stdout } = require('process');
const file = path.join(__dirname, './text.txt');
let data = '';
const readStream = fs.createReadStream(file, 'utf-8');
readStream.on('data', (chunk) => (data += chunk));
readStream.on('end', () => stdout.write(data));
readStream.on('error', (error) => console.log('Error', error.message));
