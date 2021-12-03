let input = ``;
let v = input.split('\n').map(Number);
let answer = v.map((n, i) => i == 0 ? 0 : n - v[i - 1]).filter(n => n > 0).length
console.log(answer);
export { };
