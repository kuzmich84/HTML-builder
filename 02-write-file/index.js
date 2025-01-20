const { stdin, stdout } = require('process');
const fs = require('fs');
const path = require('path');

const outputFile = fs.createWriteStream(path.join(__dirname, './dest.txt'));

stdout.write('What is your name? Date of Birth?\n');
stdin.on('data', (chunk) => {
  if (chunk.toString().trim() === 'exit') {
    process.exit();
  } else {
    outputFile.write(chunk);
  }
});

process.on('exit', () => stdout.write('Good bye!\n'));

process.on('SIGINT', () => {
  process.exit();
});
