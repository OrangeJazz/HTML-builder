const fs = require('fs');
const path = require('path');
const stream = fs.WriteStream(path.join(__dirname, 'text.txt'), 'utf-8');
const { stdin, stdout, exit } = process;
stdout.write(
  'Введите текст.\nДля выхода введите слово "exit" без кавычек или нажмите Ctrl + C\n'
);
stdin.on('data', (data) => {
  data = data.toString().trim();
  if (data === 'exit') exit();
  stream.write(`${data.toString()}\n`);
});
process.on('exit', () => stdout.write('Запись окончена'));
process.on('SIGINT', exit);
