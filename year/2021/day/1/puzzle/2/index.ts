let input = ``;
let v = input.split('\n').map(Number);
let sums = v.map((n, i) => n + v[(i + 1) % v.length] + v[(i + 2) % v.length]).slice(0, v.length - 2);
let answer = sums.map((n, i) => i == 0 ? 0 : n - sums[i - 1]).filter(n => n > 0).length
console.log(answer);
export { };
