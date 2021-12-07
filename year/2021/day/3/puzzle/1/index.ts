let input = ``;
let acc = new Array(12).fill(0);

let values: number[][] = input.split('\n').map(x => x.split('').map(Number));

values.forEach(x => {
  acc.forEach((n, i) => {
    acc[i] = (n + x[i]);
  })
})

function process(v: number[], size: number) {
  let epsilon = parseInt(v.map(x => x > size / 2 ? 1 : 0).join(''), 2);
  let gamma = parseInt(v.map(x => x > size / 2 ? 0 : 1).join(''), 2);
  return {
    epsilon,
    gamma
  }
}
const { epsilon, gamma } = process(acc, values.length);

console.log(epsilon, gamma, gamma * epsilon);

export { };