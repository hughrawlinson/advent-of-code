const input = ``;

type HeightMap = number[][];

const HeightMap = {
  parse(input: string): HeightMap {
    return input.split("\n").map((row) => row.split("").map(Number));
  },
  localMinima(heightMap: HeightMap): number[] {
    const minima: number[] = [];
    for (let row = 0; row < heightMap.length; row++) {
      for (let column = 0; column < heightMap[row].length; column++) {
        const current = heightMap[row][column];
        let up = row > 0 ? heightMap[row - 1][column] : Infinity;
        let down =
          row < heightMap.length - 1 ? heightMap[row + 1][column] : Infinity;
        let left = column > 0 ? heightMap[row][column - 1] : Infinity;
        let right =
          column < heightMap[row].length - 1
            ? heightMap[row][column + 1]
            : Infinity;
        if (
          current < up &&
          current < down &&
          current < left &&
          current < right
        ) {
          minima.push(current);
        }
      }
    }
    return minima;
  },
};

if (require.main === module) {
  const heightMap = HeightMap.parse(input);
  console.log(HeightMap.localMinima(heightMap).reduce((a, b) => a + b + 1, 0));
}

export {};
