const fs = require('fs');

fs.readFile('./scenario.txt', 'utf8', (err, data) => {
  if (err) throw err;

  const regex = /(\w+):\s(.*?)(?=\n\w+:\s|$)/gs;
  let match;

  while ((match = regex.exec(data)) !== null) {
    const character = match[1];
    const dialogue = match[2];
    const filename = `${character}.txt`;

    fs.appendFileSync(filename, dialogue + '\n');
  }
});