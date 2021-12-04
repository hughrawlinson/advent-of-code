const input = ``;

const answer = input.split('\n').map(line => {
  const sides = line.split('x').map(v => parseInt(v, 10));
  sides.sort((a, b) => a - b);
  const [smallest, secondSmallest, ..._] = sides;
  const wrap = 2 * smallest + 2 * secondSmallest;
  const bow = sides.reduce((a, b) => a * b, 1);
  return wrap + bow;
}).reduce((a, b) => a + b, 0);
console.log(answer);


export { };