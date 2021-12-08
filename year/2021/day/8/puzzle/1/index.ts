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
};

function mapFromEntries<K, V>(entries: [K, V][]): Map<K, V> {
  const map = new Map<K, V>();
  for (const [key, value] of entries) {
    map.set(key, value);
  }
  return map;
}

const UnsolvedDigits = {
  parse(input: string): UnsolvedDigits {
    const digits: Digit[] = input.split(" ").map(Digit.parse);
    // const foundDigits = mapFromEntries(
    //   UniqueNumber.map((i) => [i, digits.find((d) => d.size === i)!])
    // );
    return {
      type: "unsolvedDigits",
      candidates: digits.filter((d) =>
        UniqueNumber.includes(d.size as UniqueNumber)
      ),
      // ...foundDigits,
      1: digits.find((d) => d.size === 2)!,
      4: digits.find((d) => d.size === 4)!,
      7: digits.find((d) => d.size === 3)!,
      8: digits.find((d) => d.size === 7)!,
    };
  },
  // solve(unsolved: UnsolvedDigits): SolvedDigits {
  //   return SolveableNumber.map(UnsolvedDigits.solveDigit).reduce(
  //     UnsolvedDigits.combine,
  //     unsolved
  //   );
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
  // combine(a: UnsolvedDigits, b: UnsolvedDigits): UnsolvedDigits {
  //   return {
  //     ...a,
  //     ...b,
  //   };
  // },
  // assertSolved(unsolved: UnsolvedDigits): SolvedDigits {},
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
}

type Digits = UnsolvedDigits | SolvedDigits;

interface Display {
  digits: Digits;
  outputValue: Digit[];
}

const Display = {
  parse(input: string): Display {
    const [digits, outputValue] = input.split(" | ");
    return {
      digits: UnsolvedDigits.parse(digits),
      outputValue: outputValue.split(" ").map(Digit.parse),
    };
  },
  countUniquesInOutput(display: Display): number {
    return display.outputValue.reduce<number>((acc, digit) => {
      return [2, 4, 3, 7].includes(digit.size) ? acc + 1 : acc;
    }, 0);
  },
};

type Problems = Display[];

const Problems = {
  parse: (input: string): Problems => {
    const lines = input.split("\n");
    return lines.map(Display.parse);
  },
};

if (require.main === module) {
  const problems = Problems.parse(input);
  console.log(problems[0].outputValue);
  console.log(
    problems.map((display) => ({
      outputValue: display.outputValue,
      uniqueDigitsInOutput: Display.countUniquesInOutput(display),
    }))
  );
  console.log(
    problems.map(Display.countUniquesInOutput).reduce((a, b) => a + b, 0)
  );
}

export {};
