const path = require('path');
const { readdir } = require('fs/promises');
const { stat } = require('fs');
const folderPath = path.join(__dirname, 'secret-folder');

readdir(folderPath, { withFileTypes: true })
  .then((files) => {
    for (let file of files) {
      if (file.isFile()) {
        const filePath = path.join(folderPath, file.name);
        const fileInfo = path.parse(filePath);
        const fileName = fileInfo.name;
        const fileExtent = fileInfo.ext.slice(1);
        stat(filePath, (err, stats) => {
          if (err) console.log(`Error! ${err}`);
          console.log(`${fileName} - ${fileExtent} - ${stats.size} bytes`);
        });
      }
    }
  })
  .catch((err) => {
    console.log(`Error! ${err}`);
  });
