const input = ``;
type Paren = '(' | ')'

const answer = (input.split('') as Paren[]).reduce<number>((floor: number, paren: Paren) => {
  switch (paren) {
    case '(':
      return floor + 1;
    case ')':
      return floor - 1;
      break;
  }
}, 0);

console.log(answer);

export { }