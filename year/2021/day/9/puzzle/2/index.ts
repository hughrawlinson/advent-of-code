const input = `2199943210
3987894921
9856789892
8767896789
9899965678`;

type CoOrdinate = readonly [number, number];

const CoOrdinate = {
  serialize(coOrdinate: CoOrdinate): string {
    return `${coOrdinate[0]},${coOrdinate[1]}`;
  },
};

function arrayEquals<T>(a: readonly T[], b: readonly T[]): boolean {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
}

function unique(array: readonly CoOrdinate[]): CoOrdinate[] {
  return array.filter(
    (value, index, self) =>
      self.findIndex((v) => arrayEquals(v, value)) === index
  );
}

type HeightMap = readonly number[][];

type Basin = Set<string>;

const Basin = {
  getNeighbors(coOrdinate: CoOrdinate, heightMap: HeightMap): CoOrdinate[] {
    const [row, column] = coOrdinate;
    const neighbors: CoOrdinate[] = [
      [row - 1, column],
      [row + 1, column],
      [row, column - 1],
      [row, column + 1],
    ];
    return neighbors.filter(([row, column]) => {
      return (
        row >= 0 &&
        row < heightMap.length &&
        column >= 0 &&
        column < heightMap[0].length
      );
    });
  },
  getRelevantNeighbors(
    coOrdinate: CoOrdinate,
    heightMap: HeightMap,
    seen: Basin
  ): readonly CoOrdinate[] {
    return unique(
      Basin.getNeighbors(coOrdinate, heightMap)
        .filter(([row, column]) => heightMap[row][column] < 9)
        .filter((coOrd) => !seen.has(CoOrdinate.serialize(coOrd)))
    );
  },
  getBasinForCoOrds(coOrd: CoOrdinate, heightMap: HeightMap) {
    const seen: Basin = new Set();
    seen.add(CoOrdinate.serialize(coOrd));
    function deeper(neighbors: readonly CoOrdinate[]) {
      for (let neighbor of neighbors) {
        seen.add(CoOrdinate.serialize(neighbor));
      }
      const newNeighbors = neighbors.flatMap((neighbor) =>
        Basin.getRelevantNeighbors(neighbor, heightMap, seen)
      );
      newNeighbors.length > 0 && deeper(newNeighbors);
    }
    deeper(Basin.getRelevantNeighbors(coOrd, heightMap, seen));
    return seen;
  },
};

export const HeightMap = {
  parse(input: string): HeightMap {
    return input.split("\n").map((row) => row.split("").map(Number));
  },
  localMinima(heightMap: HeightMap): readonly CoOrdinate[] {
    const minima: CoOrdinate[] = [];
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
          minima.push([row, column]);
        }
      }
    }
    return minima;
  },
  debug(heightMap: HeightMap) {
    for (let row = 0; row < heightMap.length; row++) {
      console.log(heightMap[row].join(""));
    }
  },
};

if (require.main === module) {
  const heightMap: HeightMap = HeightMap.parse(input);
  const minima: readonly CoOrdinate[] = HeightMap.localMinima(heightMap);
  console.log(
    minima
      .map((minimum) => Basin.getBasinForCoOrds(minimum, heightMap).size)
      .sort((a, b) => b - a)
      .slice(0, 3)
      .reduce((a, b) => a * b, 1)
  );
}

export {};
