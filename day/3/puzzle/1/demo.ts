const input = `00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`;

function transpose<T>(arg: T[][]): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arg[0].length; i++) {
    result.push([]);
    for (let j = 0; j < arg.length; j++) {
      result[i].push(arg[j][i]);
    }
  }
  return result;
}

const inp = input.split("\n").map((line) => line.split("").map(Number));
const numberOfNumbers = input.split("\n").length;
const gammaString = transpose(inp)
  .map((column) => column.reduce((a, b) => a + b, 0))
  .map((oneCount) => (oneCount > numberOfNumbers / 2 ? 1 : 0))
  .join("");

const epsilonString = gammaString
  .split("")
  .map((n) => 1 - Number(n))
  .join("");

const gamma = parseInt(gammaString, 2);
const epsilon = parseInt(epsilonString, 2);

console.log({
  gamma,
  epsilon,
  answer: gamma * epsilon,
});

export {};
