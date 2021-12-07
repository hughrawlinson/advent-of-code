const input = ``;

interface Point {
  x: number;
  y: number;
}

const Point = {
  parse: (str: string): Point => {
    const [x, y] = str.split(",").map(Number);
    return { x, y };
  },
  serialize: (point: Point): string => `${point.x},${point.y}`,
};

interface LineSegment {
  start: Point;
  end: Point;
}

const LineSegment = {
  parse: (line: string): LineSegment => {
    const [start, end] = line.split(" -> ");
    return {
      start: Point.parse(start),
      end: Point.parse(end),
    };
  },
  /**
   * Return debug string for a line segment
   *
   * @param lineSegment One line segment
   * @returns debug string for line segment
   */
  debug(lineSegment: LineSegment) {
    const h = LineSegment.isHorizontal(lineSegment) ? "-" : ".";
    const v = LineSegment.isVertical(lineSegment) ? "|" : ".";
    const { start, end } = lineSegment;
    return `${h}${v}:${start.x},${start.y} -> ${end.x},${end.y}`;
  },
  isHorizontal(line: LineSegment): boolean {
    return line.start.y === line.end.y;
  },

  isVertical(line: LineSegment): boolean {
    return line.start.x === line.end.x;
  },

  isHorizontalOrVertical(line: LineSegment): boolean {
    return LineSegment.isHorizontal(line) || LineSegment.isVertical(line);
  },

  getPoints(line: LineSegment): Point[] {
    const points: Point[] = [];
    const { start, end } = line;
    const length = LineSegment.length(line);
    for (let i = 0; i <= length; i++) {
      if (LineSegment.isHorizontal(line)) {
        points.push({
          x: start.x - end.x > 0 ? start.x - i : start.x + i,
          y: start.y,
        });
      } else {
        points.push({
          x: start.x,
          y: start.y - end.y > 0 ? start.y - i : start.y + i,
        });
      }
    }
    return points;
  },
  length(line: LineSegment): number {
    const { start, end } = line;
    return Math.abs(start.x - end.x) + Math.abs(start.y - end.y);
  },
};

type LineSegments = LineSegment[];

const LineSegments = {
  parse(input: string): LineSegments {
    return input.split("\n").map(LineSegment.parse);
  },
  plot(lines: LineSegments) {
    const minX = 0;
    const maxX = Math.max(
      ...lines.flatMap(({ start, end }) => [start.x, end.x])
    );
    const minY = 0;
    const maxY = Math.max(
      ...lines.flatMap(({ start, end }) => [start.y, end.y])
    );
    const width = maxX - minX + 1;
    const height = maxY - minY + 1;
    const grid = new Array(height).fill(0).map(() => new Array(width).fill(0));
    for (const line of lines) {
      const points = LineSegment.getPoints(line);
      for (const point of points) {
        grid[point.y - minY][point.x - minX] = grid[point.y - minY][point.x - minX] ? grid[point.y - minY][point.x - minX] + 1 : 1;
      }
    }
    return grid;
  },
  getDebugString(lineSegments: LineSegments): string {
    return LineSegments.plot(
      lineSegments.filter(LineSegment.isHorizontalOrVertical)
    )
      .map((row) => row.map((x) => (x === 0 ? "." : x)).join(""))
      .join("\n");
  },
  display(lineSegments: LineSegments) {
    // console.log(LineSegments.getDebugString(lineSegments));
    const thing = LineSegments.plot(
      lineSegments.filter(LineSegment.isHorizontalOrVertical)
    ).flat().filter((x) => x > 1).length;
    // .map((row) => row.map((x) => (x === 0 ? "." : x)).join(""))
    // .join("\n");
    console.log(thing);
  },
};

const lines = [
  LineSegment.parse(`0,0 -> 10,0`),
  LineSegment.parse(`0,0 -> 0,10`),
  LineSegment.parse(`10,0 -> 10,10`),
  LineSegment.parse(`0,10 -> 10,10`),
];
LineSegments.display(lines);

const lineSegments = LineSegments.parse(input);

const filteredLineSegments = lineSegments.filter(
  LineSegment.isHorizontalOrVertical
);

const totalLength = filteredLineSegments.reduce(
  (total, line) => total + LineSegment.length(line) + 1,
  0
);

const allPoints: Point[] = filteredLineSegments.flatMap(LineSegment.getPoints);

const serializedPoints = allPoints.map(Point.serialize);
const uniqueSerializedPoints = [...new Set(serializedPoints)];
console.log({
  totalPoints: allPoints.length,
  totalLength,
  uniquePoints: uniqueSerializedPoints.length,
  difference: allPoints.length - uniqueSerializedPoints.length,
  differenceTotalLength: totalLength - uniqueSerializedPoints.length,
  otherCount: LineSegments.display(filteredLineSegments),
});

export {};
