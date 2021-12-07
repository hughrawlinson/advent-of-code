const input = ``;

const numbers = input.split(",").map(Number);
function median(numbers: number[]) {
  return numbers.sort((a, b) => a - b)[Math.floor(numbers.length / 2)];
}
let m = median(numbers);
console.log(numbers.map((n) => Math.abs(m - n)).reduce((a, b) => a + b));
export {};
