const input = ``;

const answer = input.split('\n').map(line => {
  const [l, w, h] = line.split('x').map(v => parseInt(v, 10));
  return 2 * l * w + 2 * w * h + 2 * h * l + Math.min(l * w, w * h, h * l);
}).reduce((a, b) => a + b, 0);
console.log(answer);

export { };