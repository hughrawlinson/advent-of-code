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

const CloserForOpener = {
  "(": ")",
  "[": "]",
  "{": "}",
  "<": ">",
} as const;

const OpenerForCloser = {
  ")": "(",
  "]": "[",
  "}": "{",
  ">": "<",
} as const;

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
        const expected = OpenerForCloser[token];
        if (expected !== stack.pop()) {
          return {
            type: "Corrupted",
            line,
            firstIllegalCharacter: token,
          };
        }
      }
    }
    if (stack.length > 0) {
      return {
        type: "Incomplete",
        line,
        completion: stack.map((o) => CloserForOpener[o]).reverse(),
      };
    }
    return {
      type: "Success",
      line,
    };
  },
  pointsForCloser: {
    ")": 1,
    "]": 2,
    "}": 3,
    ">": 4,
  },
  scoreClosers(closers: Closer[]): number {
    return closers
      .map((closer) => Line.pointsForCloser[closer])
      .reduce((acc, el) => 5 * acc + el, 0);
  },
};

type IncompleteLine = {
  type: "Incomplete";
  line: Line;
  completion: Closer[];
};

const IncompleteLine = {
  isIncompleteLine: (line: LineValidityResult): line is IncompleteLine =>
    line.type === "Incomplete",
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

type LineValidityResult = ValidLine | CorruptedLine | IncompleteLine;

type Input = string;

const Input = {
  parse: (input: Input) => input.split("\n").map(Line.parse),
};

function median<T extends number>(arr: readonly T[]): T {
  const sorted = arr.slice().sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted[mid];
}

if (require.main === module) {
  const lines = Input.parse(input);
  console.log(
    median(
      lines
        .map(Line.validate)
        .filter(IncompleteLine.isIncompleteLine)
        .map(({ completion }) => Line.scoreClosers(completion))
    )
  );
}

export {};
