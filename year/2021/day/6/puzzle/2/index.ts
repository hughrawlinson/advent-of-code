const input = ``;

const inputArray = input.split(",").map(Number);

let holder = new Array(9).fill(0);
inputArray.forEach((num) => {
  holder[num]++;
});

function run(arr: number[]) {
  let newArr = arr.concat();
  let today = newArr.shift()!;
  newArr.push(today);
  newArr[6] += today;
  return newArr;
}

for (let i = 0; i < 256; i++) {
  holder = run(holder);
}

console.log(holder.reduce((a, b) => a + b));
export {};
