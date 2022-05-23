const fs = require('fs');
const path = require('path');
const stream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');
stream.on('data', (chunk) => {
  console.log(chunk);
});

stream.on('error', (e) => console.log(`error reading: ${e}`));
