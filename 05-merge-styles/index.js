const path = require('path');
const fs = require('fs');
const { readdir, writeFile } = require('fs/promises');

const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');
const stylesPath = path.join(__dirname, 'styles');
const stylesArr = [];

async function createBundle(sourseDir, result) {
  try {
    const files = await readdir(sourseDir, {
      withFileTypes: true,
    });
    for (const file of files) {
      const extFile = path.extname(path.join(sourseDir, file.name));
      if (file.isFile() && extFile === '.css') {
        const input = fs.createReadStream(
          path.join(sourseDir, file.name),
          'utf-8'
        );
        for await (const chunk of input) {
          stylesArr.push(chunk);
        }
      }
    }
    await writeFile(result, stylesArr.join('\n'), 'utf-8');
  } catch (err) {
    console.log(err);
  }
}
createBundle(stylesPath, bundlePath);
