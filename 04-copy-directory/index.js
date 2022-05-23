const path = require('path');
const { readdir, copyFile, rm, mkdir } = require('fs/promises');

const dirPath = path.join(__dirname, 'files');
const dirCopyPath = path.join(__dirname, 'files-copy');

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
    console.log('All files was succesfully copied!');
  } catch (err) {
    console.log(err);
  }
}

(async function () {
  await rm(dirCopyPath, { recursive: true, force: true });
  await mkdir(dirCopyPath);
  copyDir(dirPath, dirCopyPath);
})();
