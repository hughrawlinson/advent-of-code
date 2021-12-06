const input = ``;

let fishes = input.split(",").map(Number);

function run(fishes: number[]): number[] {
  let newFish = 0;
  return fishes
    .map((fish) => {
      let v = fish - 1;
      if (v < 0) {
        newFish++;
        return 6;
      }
      return v;
    })
    .concat(new Array(newFish).fill(8));
}

for (let i = 0; i < 80; i++) {
  fishes = run(fishes);
  console.log(`Generation ${i + 1}: ${fishes.length}`);
  // console.log(`After\t${i + 1} days: ${fishes.join(",")}`);
}

console.log(fishes.length);

export {};
