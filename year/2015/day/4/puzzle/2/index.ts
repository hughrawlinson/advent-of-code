// Booooooo! I'm only doing this to unlock the next day. Fuck cryptocurrency.

var crypto = require('crypto');
const input = ``;

for (let i = 0; ; i++) {
  const hash = crypto.createHash('md5').update(`${input}${i}`).digest('hex');
  if (hash.startsWith('00000')) {
    console.log(hash);
    console.log(i);
    break;
  }
}

export { }