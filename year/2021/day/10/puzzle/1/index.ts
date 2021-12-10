const exampleInput = ``;
const testInput = ``;

const USE_EXAMPLE = false;

const input = USE_EXAMPLE ? exampleInput : testInput;

const Opener = ["(", "[", "{", "<"] as const;
type Opener = typeof Opener[number];
function isOpener(c: string): c is Opener {
  return Opener.includes(c as Opener);
}

const Closer = [")", "]", "}", ">"] as const;
type Closer = typeof Closer[number];
function isCloser(c: string): c is Closer {
  return Closer.includes(c as Closer);
}

const CloserForOpener: Map<Opener, Closer> = new Map([
  ["(", ")"],
  ["[", "]"],
  ["{", "}"],
  ["<", ">"],
]);

const OpenerForCloser: Map<Closer, Opener> = new Map(
  [...CloserForOpener].map(([k, v]) => [v, k])
);

type Token = Opener | Closer;

type Line = readonly Token[];

const Line = {
  parse(input: string): Line {
    return input.split("").map((c) => {
      if (isOpener(c)) return c as Opener;
      if (Closer.includes(c as Closer)) return c as Closer;
      throw new Error(`Invalid character: ${c}`);
    });
  },
  validate(line: Line): LineValidityResult {
    const stack: Opener[] = [];
    for (let token of line) {
      if (isOpener(token)) {
        stack.push(token);
      } else if (isCloser(token)) {
        if (stack.length === 0) {
          // incomplete! ignore in part 1
          return { type: "Success", line };
        }
        const expected = OpenerForCloser.get(token);
        if (expected !== stack.pop()) {
          return {
            type: "Corrupted",
            line,
            firstIllegalCharacter: token,
          };
        }
      }
    }
    return {
      type: "Success",
      line,
    };
  },
};

type CorruptedLine = {
  type: "Corrupted";
  line: Line;
  firstIllegalCharacter: Closer;
};

const CorruptedLine = {
  isCorruptedLine(line: LineValidityResult): line is CorruptedLine {
    return line.type === "Corrupted";
  },
};

type ValidLine = {
  type: "Success";
  line: Line;
};

type LineValidityResult = ValidLine | CorruptedLine;

type LineValidityError = "Incomplete" | "Corrupted";

type Input = string;

const Input = {
  parse: (input: Input) => input.split("\n").map(Line.parse),
};

const pointsForCloser = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137,
};

if (require.main === module) {
  const lines = Input.parse(input);
  console.log(
    lines
      .map(Line.validate)
      .filter(CorruptedLine.isCorruptedLine)
      .map(
        ({ firstIllegalCharacter }) => pointsForCloser[firstIllegalCharacter]
      )
      .reduce((a, b) => a + b, 0)
  );
}

export {};
