import v8 from "v8";

// WIP: this doesn't produce the right answer for me.

const input = ``;

export interface Point {
  x: number;
  y: number;
}

export const Point = {
  parse(input: string): Point {
    const [x, y] = input.split(",").map(Number);
    return { x, y };
  },
};

export interface Square {
  start: Point;
  end: Point;
}

export const Square = {
  parse(input: string[]): Square {
    const [start, end] = [Point.parse(input[0]), Point.parse(input[2])];
    return { start, end };
  },
};

interface ToggleInstruction {
  type: "toggle";
  square: Square;
}

interface TurnInstruction {
  type: "turn";
  onOrOff: "off" | "on";
  square: Square;
}

export type Instruction = ToggleInstruction | TurnInstruction;

export const Instruction = {
  parse(input: string): Instruction {
    const tokens = input.split(" ");
    const square = Square.parse(tokens.splice(tokens.length - 3, 3));
    switch (tokens[0]) {
      case "toggle":
        return { type: "toggle", square };
      case "turn":
        if (tokens[1] === "on") {
          return { type: "turn", onOrOff: "on", square };
        } else if (tokens[1] === "off") {
          return { type: "turn", onOrOff: "off", square };
        } else {
          throw new Error(`Invalid turn instruction: ${input}`);
        }
      default:
        throw new Error(`Unknown instruction: ${input}`);
    }
  },
};

export type Instructions = Instruction[];

export const Instructions = {
  parse(input: string): Instructions {
    return input.split("\n").map(Instruction.parse);
  },
};

export type LightGrid = boolean[][];

export const LightGrid = {
  create(width: number, height: number): LightGrid {
    return Array.from(Array(height), () => Array(width).fill(false));
  },
  applyInstruction(lg: LightGrid, instruction: Instruction): LightGrid {
    switch (instruction.type) {
      case "turn":
        return LightGrid.turn(lg, instruction);
      case "toggle":
        return LightGrid.toggle(lg, instruction);
    }
  },
  turn(lg: LightGrid, instruction: TurnInstruction): LightGrid {
    // const clone = v8.deserialize(v8.serialize(lg));
    const clone = lg;
    let { start, end } = instruction.square;
    for (let y = start.y; y <= end.y; y++) {
      for (let x = start.x; x <= end.x; x++) {
        clone[y][x] = instruction.onOrOff === "on";
      }
    }
    return clone;
  },
  toggle(lg: LightGrid, instruction: ToggleInstruction): LightGrid {
    // const clone = v8.deserialize(v8.serialize(lg));
    const clone = lg;
    let { start, end } = instruction.square;
    for (let y = start.y; y <= end.y; y++) {
      for (let x = start.x; x <= end.x; x++) {
        clone[y][x] = !clone[y][x];
      }
    }
    return clone;
  },
  countOn(lg: LightGrid): number {
    return lg.reduce((acc, row) => acc + row.filter(Boolean).length, 0);
  },
};

if (require.main === module) {
  const instructions = Instructions.parse(input);
  const initialLightGrid = LightGrid.create(1000, 1000);
  const resultingGrid = instructions.reduce(
    LightGrid.applyInstruction,
    initialLightGrid
  );
  console.log(LightGrid.countOn(resultingGrid));
}
