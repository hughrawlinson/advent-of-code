const input = ``;

type Position = [number, number];

const answer = input
  .split("")
  .reduce<Position[]>(
    ([[x, y], ...history], direction): Position[] => {
      switch (direction) {
        case "^":
          return [[x, y + 1], [x, y], ...history];
        case "v":
          return [[x, y - 1], [x, y], ...history];
        case "<":
          return [[x - 1, y], [x, y], ...history];
        case ">":
          return [[x + 1, y], [x, y], ...history];
        default:
          throw new Error(`Unknown direction: ${direction}`);
      }
    },
    [[0, 0]]
  )
  .map(([x, y]) => `Position:${x},${y}`);

console.log(new Set(answer).size);

export { };
