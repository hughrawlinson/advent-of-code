const input = ``;

const numbers = input.split(",").map(Number);

function cost(position: number, target: number): number {
  // let c = 0;
  // for (let i = position; i != target; target > position ? i-- : i++) {
  //   c += Math.abs(i - target);
  // }
  // return c;
  const n = Math.abs(position - target);
  return (n * (n + 1)) / 2;
}

const max = Math.max(...numbers);
let costs = Object.entries(
  new Array(max + 1)
    .fill(Infinity)
    .map((_, i) => numbers.map((n) => cost(n, i)).reduce((a, b) => a + b, 0))
);

console.log(costs.sort((a, b) => a[1] - b[1])[0]);

export {};
