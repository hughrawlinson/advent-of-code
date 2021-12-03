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
	horizontalPosition: number;
	depth: number;
}

let finalPosition: Position = instructions.reduce<Position>(({ horizontalPosition, depth }, { direction, amount }) => {
	switch (direction) {
		case "forward":
			return {
				horizontalPosition: horizontalPosition + amount,
				depth
			}
		case "down":
			return {
				horizontalPosition,
				depth: depth + amount
			}
		case "up":
			return {
				horizontalPosition,
				depth: depth - amount
			}
		default:
			throw new Error(`Unknown instruction: ${instruction}`);
	}
}, { horizontalPosition: 0, depth: 0 });

console.log(finalPosition.depth * finalPosition.horizontalPosition);