const input = ``;

type Position = [number, number];

let answer = input
  .split("")
  .reduce<[string[], string[]]>(([santa, robosanta], el, i) => {
    if (i % 2 === 0) {
      return [[...santa, el], robosanta];
    }
    return [santa, [...robosanta, el]]
  }, [[], []])
  .map((list) => list
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
  )
  .flat()
  .map(([x, y]) => `Position:${x},${y}`);

console.log(new Set(answer).size);

export { };
