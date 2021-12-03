let input = ``;

interface Instruction {
	direction: "forward" | "up" | "down";
	amount: number;
}

function instruction([direction, amount]: string[]): Instruction {
	return {
		direction: direction as "forward" | "up" | "down",
		amount: Number(amount),
	};
}

let instructions = input.split('\n').map(v => instruction(v.split(' ')));

interface Position {
	aim: number;
	horizontalPosition: number;
	depth: number;
}

let finalPosition: Position = instructions.reduce<Position>(({ horizontalPosition, depth, aim }, { direction, amount }) => {
	switch (direction) {
		case "forward":
			return {
				horizontalPosition: horizontalPosition + amount,
				aim,
				depth: depth + aim * amount,
			}
		case "down":
			return {
				horizontalPosition,
				depth,
				aim: aim + amount
			}
		case "up":
			return {
				horizontalPosition,
				depth,
				aim: aim - amount
			}
		default:
			throw new Error(`Unknown instruction: ${instruction}`);
	}
}, { horizontalPosition: 0, depth: 0, aim: 0 });

console.log(finalPosition.depth * finalPosition.horizontalPosition);
export { };