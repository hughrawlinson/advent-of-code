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
    let [xoff, yoff] = [0, 0];
    if (start.x > end.x) {
      xoff = -1;
    } else if (start.x < end.x) {
      xoff = 1;
    }
    if (start.y > end.y) {
      yoff = -1;
    } else if (start.y < end.y) {
      yoff = 1;
    }

    for (let i = 0; i <= length; i++) {
      points.push({
        x: start.x + i * xoff,
        y: start.y + i * yoff,
      });
    }
    return points;
  },
  length(line: LineSegment): number {
    const { start, end } = line;
    return Math.max(Math.abs(start.x - end.x), Math.abs(start.y - end.y));
  },
};

type LineSegments = LineSegment[];

let counter = 0;

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
        counter++;
        grid[point.y - minY][point.x - minX] = grid[point.y - minY][
          point.x - minX
        ]
          ? grid[point.y - minY][point.x - minX] + 1
          : 1;
      }
    }
    return grid;
  },
  getDebugString(lineSegments: LineSegments): string {
    return LineSegments.plot(lineSegments)
      .map((row) => row.map((x) => (x === 0 ? "." : x)).join(""))
      .join("\n");
  },
  display(lineSegments: LineSegments) {
    console.log(LineSegments.getDebugString(lineSegments));
  },
  getNumberOfIntesectingPoints(lineSegments: LineSegments): number {
    return LineSegments.plot(lineSegments)
      .flat()
      .filter((x) => x > 1).length;
  },
};

const filteredLineSegments = LineSegments.parse(input);

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
  numberOfIntersectingPoints:
    LineSegments.getNumberOfIntesectingPoints(filteredLineSegments),
});
