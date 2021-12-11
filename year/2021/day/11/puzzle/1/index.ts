const exampleInput = ``;

const testInput = ``;

const USE_EXAMPLE = false;

const input = USE_EXAMPLE ? exampleInput : testInput;

type FlashState = "No Need" | "Should Flash" | "Has Flashed";

interface Dumbo {
  type: "Dumbo";
  energyLevel: number;
  flashState: FlashState;
}

const Dumbo = {
  create(energyLevel: number, flashState?: FlashState): Dumbo {
    return {
      type: "Dumbo",
      energyLevel,
      flashState: flashState || "No Need",
    };
  },
  boostEnergyLevel(dumbo: Dumbo): Dumbo {
    return Dumbo.create(
      dumbo.energyLevel + 1,
      dumbo.energyLevel + 1 > 9 ? "Should Flash" : "No Need"
    );
  },
  willItFlash(dumbo: Dumbo): boolean {
    return dumbo.flashState === "Should Flash";
  },
  flash(dumbo: Dumbo): Dumbo {
    if (!Dumbo.willItFlash(dumbo)) {
      throw new Error("Tried to flash an unflashing Dumbo");
    }
    return Dumbo.create(dumbo.energyLevel, "Has Flashed");
  },
  prepareForNextTurn(dumbo: Dumbo): Dumbo {
    if (dumbo.flashState === "Has Flashed") {
      return Dumbo.create(0);
    }
    return Dumbo.create(dumbo.energyLevel);
  },
};

interface Cavern {
  flashTotal: number;
  contents: Dumbo[][];
}

const Cavern = {
  parse(input: string): Cavern {
    return {
      flashTotal: 0,
      contents: input
        .split("\n")
        .map((line) =>
          line.split("").map((n) => Dumbo.create(parseInt(n, 10)))
        ),
    };
  },
  step(cavern: Cavern): Cavern {
    return Cavern.cMap(
      Cavern.runFlashes(Cavern.cMap(cavern, Dumbo.boostEnergyLevel)),
      Dumbo.prepareForNextTurn
    );
  },
  runFlashes(cavern: Cavern): Cavern {
    if (!Cavern.any(cavern, Dumbo.willItFlash)) {
      return cavern;
    }
    let flashCount = 0;
    let boostPositions: [number, number][] = [];
    const flashedCavern = Cavern.cMap(cavern, (dumbo, position): Dumbo => {
      if (Dumbo.willItFlash(dumbo)) {
        flashCount++;
        boostPositions = [...boostPositions, ...Cavern.getNeighbors(position)];
        return Dumbo.flash(dumbo);
      }
      return dumbo;
    });
    const updatedCavern: Cavern = {
      ...boostPositions
        .filter(
          ([row, column]) =>
            cavern.contents[row][column].flashState === "No Need"
        )
        .reduce(
          (acc, el) => Cavern.mapPosition(acc, el, Dumbo.boostEnergyLevel),
          flashedCavern
        ),
      flashTotal: cavern.flashTotal + flashCount,
    };
    if (!Cavern.any(updatedCavern, Dumbo.willItFlash)) {
      return updatedCavern;
    }
    return Cavern.runFlashes(updatedCavern);
  },
  mapPosition(
    cavern: Cavern,
    position: [number, number],
    f: (dumbo: Dumbo) => Dumbo
  ): Cavern {
    // Here's what I want to do, but array literals don't have computed properties
    // So instead I have to mess about with mutable data :vomit_emoji:
    // return {
    //   ...cavern,
    //   contents: [
    //     ...cavern.contents,
    //     [row]: [
    //       ...cavern.contents[row],
    //       [column]: f(cavern.contents[row][column])
    //     ]
    //   ]
    // }

    const [row, column] = position;
    let contents = cavern.contents.concat();

    contents[row] = contents[row].concat();
    contents[row][column] = f(contents[row][column]);

    return {
      ...cavern,
      contents,
    };
  },
  getNeighbors(position: [number, number]): [number, number][] {
    return [-1, 0, 1]
      .flatMap((row) =>
        [-1, 0, 1].map(
          (column) =>
            [position[0] + row, position[1] + column] as [number, number]
        )
      )
      .filter(
        ([row, column]) => row >= 0 && row < 10 && column >= 0 && column < 10
      );
  },
  cMap(
    cavern: Cavern,
    mapper:
      | ((dumbo: Dumbo) => Dumbo)
      | ((dumbo: Dumbo, position: [number, number]) => Dumbo)
  ): Cavern {
    return {
      flashTotal: cavern.flashTotal,
      contents: cavern.contents.map((line, row) =>
        line.map((dumbo, column) => mapper(dumbo, [row, column]))
      ),
    };
  },
  any({ contents }: Cavern, predicate: (d: Dumbo) => boolean): boolean {
    return contents.reduce<boolean>(
      (acc, line) =>
        acc ||
        line.reduce<boolean>(
          (lineAcc, dumbo) => lineAcc || predicate(dumbo),
          false
        ),
      false
    );
  },
};

Error.stackTraceLimit = 50;

if (require.main === module) {
  const ITERATIONS = 100;
  const initialCavern = Cavern.parse(input);
  const result = new Array(ITERATIONS)
    .fill(0)
    .reduce<Cavern>(Cavern.step, initialCavern).flashTotal;
  console.log(result);
}

export {};
