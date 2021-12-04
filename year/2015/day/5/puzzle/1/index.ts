const input = ``

function hasThreeVowels(s: string) {
  return Array.from(s).filter(c => 'aeiou'.includes(c)).length >= 3;
}

function hasDouble(s: string) {
  return Array.from(s).some((c, i) => i < s.length - 1 && c === s[i + 1]);
}

function hasBad(s: string) {
  return s.includes('ab') || s.includes('cd') || s.includes('pq') || s.includes('xy');
}

function isNice(s: string) {
  return hasThreeVowels(s) && hasDouble(s) && !hasBad(s);
}

const candidateStrings = input.split('\n');

console.log(candidateStrings.filter(isNice).length);

export { };