const path = require('path');
const fs = require('fs');
const {
  readdir,
  copyFile,
  rm,
  mkdir,
  writeFile,
  readFile,
} = require('fs/promises');

const projectPath = path.join(__dirname, 'project-dist');
const assetsPath = path.join(__dirname, 'assets');
const newAssetsPath = path.join(__dirname, 'project-dist', 'assets');
const stylesPath = path.join(__dirname, 'styles');
const bundlePath = path.join(projectPath, 'style.css');
const stylesArr = [];
const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const pagePath = path.join(projectPath, 'index.html');

// Copy direction (for assets)
async function copyDir(dir, dirCopy) {
  try {
    await mkdir(dirCopy, { recursive: true });
    const files = await readdir(dir, { withFileTypes: true });
    files.forEach(async function (file) {
      const filePath = path.join(dir, file.name);
      const fileCopyPath = path.join(dirCopy, file.name);
      if (file.isFile()) {
        copyFile(filePath, fileCopyPath);
      } else if (file.isDirectory()) {
        dir1 = path.join(dir, file.name);
        dirCopy1 = path.join(dirCopy, file.name);
        copyDir(dir1, dirCopy1);
      }
    });
  } catch (err) {
    console.log(err);
  }
}

// Merge CSS
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

// HTML Build
async function createPage() {
  let template = await readFile(templatePath);
  template = template.toString();
  const tags = template.match(/{{.+}}/gi);
  const tagsWord = [];
  tags.forEach((tag) => tagsWord.push(tag.slice(2, tag.length - 2)));
  const components = {};
  for (let i = 0; i < tagsWord.length; i++) {
    let componentPath = path.join(componentsPath, `${tagsWord[i]}.html`);
    const component = await readFile(componentPath);
    components[tags[i]] = component.toString();
    template = template.replace(`${tags[i]}`, components[tags[i]]);
  }
  writeFile(pagePath, template);
}

// Remove old folder, build new project
async function init() {
  await rm(projectPath, { recursive: true, force: true });
  await mkdir(projectPath, { recursive: true });
  createBundle(stylesPath, bundlePath);
  copyDir(assetsPath, newAssetsPath);
  createPage();
}
init();
