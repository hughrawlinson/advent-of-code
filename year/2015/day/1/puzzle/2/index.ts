const input = ``;
type Paren = '(' | ')'

let counter = 0;

const answer = (input.split('') as Paren[]).reduce<number>((floor: number, paren: Paren) => {
  counter++;
  const newFloor = paren === '(' ? floor + 1 : floor - 1;
  if (newFloor < 0) {
    console.log(counter);
    process.exit();
  }
  return newFloor;
}, 0);

console.log(answer);

export { }

