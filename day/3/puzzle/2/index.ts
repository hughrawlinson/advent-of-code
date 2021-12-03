let input = ``;
let values: number[][] = input.split('\n').map(x => x.split('').map(Number));

function sieve(numbers: number[][], digit: number, ones: 0 | 1): number[][] {
	if (numbers.length < 2) {
		return numbers;
	}
	else if (digit >= numbers[0].length) {
		return numbers;
	}
	let countForDigit = numbers.reduce((a, b) => a + b[digit], 0);

	return sieve(numbers.filter(x => x[digit] === ((countForDigit >= numbers.length / 2) ? ones : 1 - ones)), digit + 1, ones);
}

const oxygenGeneratorRating = parseInt(sieve(values, 0, 0)[0].join(''), 2);
const co2ScrubberRating = parseInt(sieve(values, 0, 1)[0].join(''), 2);

console.log(oxygenGeneratorRating * co2ScrubberRating);

export { };