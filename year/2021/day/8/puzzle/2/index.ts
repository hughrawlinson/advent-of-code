const input = ``;

type SegmentID = "a" | "b" | "c" | "d" | "e" | "f" | "g";

type Digit = Set<SegmentID>;

const Digit = {
  parse: (input: string): Digit => {
    return new Set(input.split("").map((c) => c.toLowerCase() as SegmentID));
  },
};

const UniqueNumber = [1, 4, 7, 8] as const;
type UniqueNumber = typeof UniqueNumber[number];
const SolveableNumber = [0, 2, 3, 5, 6] as const;
type SolveableNumber = typeof SolveableNumber[number];

const countToUnique: { [key: number]: UniqueNumber } = {
  2: 1,
  4: 4,
  3: 7,
  7: 8,
};

type UnsolvedDigits = {
  candidates: Digit[];
  type: "unsolvedDigits";
  // [K in UniqueNumber]: Digit;
  // [L in SolveableNumber]?: Digit
  0?: Digit;
  1: Digit;
  2?: Digit;
  3?: Digit;
  4: Digit;
  5?: Digit;
  6?: Digit;
  7: Digit;
  8: Digit;
  9?: Digit;
};

const lookup: {
  [k: number]: { [l: number]: number | { [m: number]: number } };
} = {
  // length
  6: {
    // 0, 6, 9
    // number in common with 1
    1: 6,
    2: {
      // 0, 9
      // number in common with 4
      3: 0,
      4: 9,
    },
  },
  5: {
    // 2, 3, 5
    // number in common with 1
    1: {
      // 2, 5
      // number in common with 4
      2: 2,
      3: 5,
    },
    2: 3,
  },
};

function mapFromEntries<K, V>(entries: [K, V][]): Map<K, V> {
  const map = new Map<K, V>();
  for (const [key, value] of entries) {
    map.set(key, value);
  }
  return map;
}

function intersection<T>(setA: Set<T>, setB: Set<T>) {
  let _intersection = new Set<T>();
  for (let elem of setB) {
    if (setA.has(elem)) {
      _intersection.add(elem);
    }
  }
  return _intersection;
}

function setEqual<T>(setA: Set<T>, setB: Set<T>): boolean {
  if (setA.size !== setB.size) {
    return false;
  }
  for (let elem of setA) {
    if (!setB.has(elem)) {
      return false;
    }
  }
  return true;
}

const UnsolvedDigits = {
  parse(input: string): UnsolvedDigits {
    const digits: Digit[] = input.split(" ").map(Digit.parse);
    type FoundDigits = {
      1: Digit;
      4: Digit;
      7: Digit;
      8: Digit;
    };
    const foundDigits: FoundDigits = Object.fromEntries(
      digits.map((digit) => [countToUnique[digit.size], digit])
    ) as FoundDigits;
    return {
      type: "unsolvedDigits",
      candidates: digits.filter(
        (d) => ![2, 4, 3, 7].includes(d.size as UniqueNumber)
      ),
      ...foundDigits,
    };
  },
  solve(unsolvedDigits: UnsolvedDigits): SolvedDigits {
    const { candidates } = unsolvedDigits;
    const entries = candidates.map((candidate) => {
      const length = candidate.size;
      if (length !== 6 && length !== 5) {
        throw new Error(`Digit ${candidate} has invalid length ${length}`);
      }
      const inCommonWith1 = intersection(candidate, unsolvedDigits[1]).size;
      const inCommonWith4 = intersection(candidate, unsolvedDigits[4]).size;
      let n: number | { [n: number]: number } = lookup[length][inCommonWith1];
      if (typeof n !== "number") {
        n = n[inCommonWith4];
      }
      if (typeof n === "undefined") {
        throw new Error(
          `Digit ${candidate} has no solution for ${inCommonWith1} and ${inCommonWith4}`
        );
      }
      return [n, candidate];
    });
    const solutions = Object.fromEntries(entries);
    return UnsolvedDigits.assertSolved({
      ...unsolvedDigits,
      ...solutions,
    });
  },
  // solve(unsolved: UnsolvedDigits): SolvedDigits {
  //   return UnsolvedDigits.assertSolved(
  //     SolveableNumber.map(UnsolvedDigits.solveDigit).reduce(
  //       (acc, el) => el(acc),
  //       unsolved
  //     )
  //   );
  // },
  // solveDigit(n: SolveableNumber): (unsolved: UnsolvedDigits) => UnsolvedDigits {
  //   return function (unsolved: UnsolvedDigits): UnsolvedDigits {
  //     return {
  //       ...unsolved,
  //       [n]: new Set<SegmentID>() as Digit,
  //     };
  //   };
  // },
  // solveDigit<T extends SolveableNumber>(
  //   n: T
  // ): (unsolved: UnsolvedDigits) => UnsolvedDigits & { [key in T]: Digit } {
  //   return function (
  //     unsolved: UnsolvedDigits
  //   ): UnsolvedDigits & { [key in T]: Digit } {
  //     return {
  //       ...unsolved,
  //       [n]: new Set<SegmentID>() as Digit,
  //     };
  //   };
  // },
  combine(a: UnsolvedDigits, b: UnsolvedDigits): UnsolvedDigits {
    return {
      ...a,
      ...b,
    };
  },
  assertSolved(unsolved: UnsolvedDigits): SolvedDigits {
    for (let n of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
      if (!unsolved.hasOwnProperty(n)) {
        throw new Error(`Missing digit ${n}`);
      }
    }
    return { ...unsolved, type: "solvedDigits" } as unknown as SolvedDigits;
  },
};

interface SolvedDigits {
  type: "solvedDigits";
  0: Digit;
  1: Digit;
  2: Digit;
  3: Digit;
  4: Digit;
  5: Digit;
  6: Digit;
  7: Digit;
  8: Digit;
  9: Digit;
}

type Digits = UnsolvedDigits | SolvedDigits;

// interface Display {
//   digits: Digits;
//   outputValue: Digit[];
// }

interface UnsolvedDisplay {
  type: "unsolvedDisplay";
  digits: UnsolvedDigits;
  outputValue: Digit[];
}

interface SolvedDisplay {
  type: "solvedDisplay";
  digits: SolvedDigits;
  outputValue: Digit[];
}

type Display = UnsolvedDisplay | SolvedDisplay;

function serializeOrdered(digit: Digit): string {
  return Array.from(digit).sort().join("");
}

const Display = {
  parse(input: string): UnsolvedDisplay {
    const [digits, outputValue] = input.split(" | ");
    return {
      type: "unsolvedDisplay",
      digits: UnsolvedDigits.parse(digits),
      outputValue: outputValue.split(" ").map(Digit.parse),
    };
  },
  countUniquesInOutput(display: Display): number {
    return display.outputValue.reduce<number>((acc, digit) => {
      return [2, 4, 3, 7].includes(digit.size) ? acc + 1 : acc;
    }, 0);
  },
  read(display: UnsolvedDisplay): number {
    const { digits, outputValue } = display;
    const solvedDigits = UnsolvedDigits.solve(digits);
    const lookup: Map<string, number> = mapFromEntries(
      ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const).map((n) => [
        serializeOrdered(solvedDigits[n]),
        n,
      ])
    );
    const result = parseInt(
      outputValue
        .map((digit) => `${lookup.get(serializeOrdered(digit))}`)
        .join(""),
      10
    );
    if (isNaN(result)) {
      throw new Error(`Could not parse ${display.outputValue}`);
    }
    return result;
  },
};

type Problems = UnsolvedDisplay[];

const Problems = {
  parse: (input: string): Problems => {
    const lines = input.split("\n");
    return lines.map(Display.parse);
  },
  solve: (problems: Problems): number => {
    return problems.reduce((acc, problem) => {
      const readValue = Display.read(problem);
      if (isNaN(readValue)) {
        throw new Error(`Invalid read value ${readValue}`);
      }
      return acc + readValue;
    }, 0);
  },
};

if (require.main === module) {
  const problems = Problems.parse(input);
  // console.log(
  //   problems.map((display) => ({
  //     outputValue: display.outputValue,
  //     uniqueDigitsInOutput: Display.countUniquesInOutput(display),
  //   }))
  // );
  // console.log(
  //   problems.map(Display.countUniquesInOutput).reduce((a, b) => a + b, 0)
  // );
  console.log(Problems.solve(problems));
}

export {};
