const { readdir } = require('fs/promises');
const fs = require('fs');
const path = require('path');

async function createBundle(dir) {
  let data = '';
  let readStream = null;

  try {
    const files = await readdir(dir, { withFileTypes: true });
    const output = fs.createWriteStream(
      path.join(__dirname, 'project-dist', 'bundle.css'),
    );
    for (const file of files) {
      if (file.isFile() && path.extname(file.name).slice(1) === 'css') {
        try {
          readStream = fs.createReadStream(path.join(dir, file.name), 'utf-8');
          readStream.on('data', (chunk) => (data += chunk));
        } catch (error) {
          console.log(error);
        }
      }
    }
    readStream.on('end', () => output.write(data));
  } catch (err) {
    console.error(err);
  }
}

createBundle(path.join(__dirname, './styles'));
