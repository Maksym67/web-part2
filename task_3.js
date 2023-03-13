const fs = require('fs');

const data = fs.readFileSync('./scenario.txt', );

const results = scenario.match(/^[a-z]+:/gmi);
console.log(results);

const charachters = [];
results.forEach(characterName => {
 const name = characterName.slice(0, -1);
 if (!charachters.includes(name)) {
  charachters.push(name);
 }
});

console.log(charachters);