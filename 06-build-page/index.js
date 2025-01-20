const path = require('path');
const fs = require('fs');
const { readdir, mkdir, copyFile } = require('fs/promises');

const dir = path.join(__dirname, './assets');
let prevNameDir = '';

const fileCopy = path.join(__dirname, './project-dist');

(async function () {
  let dataCss = '';
  let readStreamCss = null;
  let readStreamHtmlComponents = null;
  const templateFile = path.join(__dirname, 'template.html');
  let data = '';

  try {
    await mkdir(path.join(__dirname, 'project-dist'), { recursive: true });
    await mkdir(path.join(fileCopy, './assets'), { recursive: true });
    await copyFile(
      templateFile,
      path.join(__dirname, 'project-dist', 'index.html'),
    );

    const filesCss = await readdir(path.join(__dirname, 'styles'), {
      withFileTypes: true,
    });
    const filesHtml = await readdir(path.join(__dirname, 'components'), {
      withFileTypes: true,
    });
    const outputCss = fs.createWriteStream(
      path.join(__dirname, 'project-dist', 'style.css'),
    );
    const outputHtml = fs.createWriteStream(
      path.join(__dirname, 'project-dist', 'index.html'),
    );

    fs.readFile(path.join(__dirname, 'template.html'), (err, dataFile) => {
      if (err) throw err;
      data = dataFile.toString();

      for (const file of filesHtml) {
        let dataHtml = '';

        if (file.isFile() && path.extname(file.name).slice(1) === 'html') {
          const componentName = path.basename(
            file.name,
            path.extname(file.name),
          );
          readStreamHtmlComponents = fs.createReadStream(
            path.join(path.join(__dirname, 'components'), file.name),
            'utf-8',
          );
          readStreamHtmlComponents.on('data', (chunk) => (dataHtml += chunk));
          readStreamHtmlComponents.on('data', () => {
            const dataNew = data.replace(`{{${componentName}}}`, dataHtml);
            data = dataNew;
          });
        }
      }

      readStreamHtmlComponents.on('end', () => outputHtml.write(data));
    });

    for (const file of filesCss) {
      if (file.isFile() && path.extname(file.name).slice(1) === 'css') {
        readStreamCss = fs.createReadStream(
          path.join(path.join(__dirname, 'styles'), file.name),
          'utf-8',
        );
        readStreamCss.on('data', (chunk) => (dataCss += '\n' + chunk + '\n'));
      }
    }
    readStreamCss.on('end', () => outputCss.write(dataCss));
  } catch (err) {
    console.error(err);
  }
})();

async function listDirectory(dir) {
  const files = await readdir(dir, { withFileTypes: true });

  for (const file of files) {
    if (file.isDirectory()) {
      await mkdir(path.join(__dirname, 'project-dist', 'assets', file.name), {
        recursive: true,
      });
      prevNameDir = file.name;
      await listDirectory(path.join(dir, file.name));
    } else {
      await copyFile(
        path.join(dir, file.name),
        path.join(fileCopy, 'assets', prevNameDir, file.name),
      );
    }
  }
}

listDirectory(dir);
