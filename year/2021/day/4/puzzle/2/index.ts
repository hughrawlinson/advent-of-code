const input = ``;

interface Cell {
  value: number;
  called: boolean;
}

const Cell = {
  new(value: number): Cell {
    return {
      value,
      called: false,
    };
  }
}

type Sheet = Cell[][];

interface Game {
  moves: number[];
  sheets: Sheet[];
}

const parseSheet = (sheet: string): Sheet => {
  const lines = sheet.split('\n')
  const splitLines = lines.map(x => x.split(/\s/).filter(x => x.length));
  return splitLines.map(line => line.map(x => Cell.new(parseInt(x, 10))));
}

const parseInput = (input: string): Game => {
  const [movesString, ...sheetsStrings] = input.split('\n\n');
  const moves = movesString.split(',').map(x => parseInt(x, 10));
  const sheets = sheetsStrings.map(parseSheet);

  return { moves, sheets }
}

const transpose: (sheet: Sheet) => Sheet = sheet => {
  return sheet[0].map((_, i) => sheet.map(row => row[i]));
}

const isEmptyRow = (row: Cell[]): boolean => row.reduce<boolean>((acc, cell) => acc && cell.called, true);

const hasEmptyRow = (sheet: Sheet): boolean => sheet.reduce<boolean>((acc, row) => acc || isEmptyRow(row), false);
const hasEmptyColumn = (sheet: Sheet): boolean => hasEmptyRow(transpose(sheet));

const sheetHasWon = (sheet: Sheet): boolean => hasEmptyRow(sheet) || hasEmptyColumn(sheet);

const scoreSheet = (sheet: Sheet): number =>
  sheet
    .flat()
    .filter(({ called }) => !called)
    .map(({ value }) => value)
    .reduce((acc, value) => acc + value, 0);

const sheetsThatHaveWon: number[] = [];

const winConditionMet = (sheet: Sheet, move: number, sheetIndex: number) => {
  if (!sheetsThatHaveWon.includes(sheetIndex)) {
    sheetsThatHaveWon.push(sheetIndex);
    const score = scoreSheet(sheet);
    console.log({
      move,
      score,
      answer: score * move,
      sheetIndex
    })
  }
}

const play = ({ moves, sheets }: Game): any => {
  let filteredSheets = sheets.concat();
  for (const move of moves) {
    filteredSheets = filteredSheets.map((sheet, i) => {
      const filteredSheet = sheet.map(row => row.map(({ value, called }) => ({ value, called: called || value === move })));
      if (sheetHasWon(filteredSheet)) {
        winConditionMet(filteredSheet, move, i);
      }
      return filteredSheet;
    });
  }
}

const game: Game = parseInput(input);
play(game);

export { };