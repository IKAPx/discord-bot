import { evaluate } from "mathjs";

/**
 example config: {
 		minRange: 1,
		maxRange: 5000,
		minNumbers: 5,
		maxNumbers: 10,
		operators: ["/", "*", "+", "-"],
		negativeChance: 50,
		exponentChance: 25,
		minExponent: 2,
		maxExponent: 5,
	}
 */
export function getMathQuestion(config = {}) {
	let question = "";

	const totalParts = getRandomNumberBetween(config.minNumbers ?? 2, config.maxNumbers ?? 4);

	for (let i = 0; i < totalParts; i++) {
		const number = getRandomNumberBetween(config.minRange ?? 1, config.maxRange ?? 20);
		const operation = config.operators
			? config.operators[getRandomNumberBetween(0, config.operators.length - 1)]
			: ["/", "*", "+", "-"][getRandomNumberBetween(0, 3)];

		const isNegative = config.negativeChance ? config.negativeChance >= getRandomNumberBetween(1, 100) : false;
		const hasExponent = config.exponentChance ? config.exponentChance >= getRandomNumberBetween(1, 100) : false;

		question +=
			(i !== 0 ? " " + operation + " " : "") +
			(isNegative ? "(-" : "") +
			number +
			(isNegative ? ")" : "") +
			(hasExponent ? "^" + getRandomNumberBetween(config.minExponent ?? 2, config.maxExponent ?? 4) : "");
	}
	console.log(question);
	const answer = Math.floor(evaluate(question));

	return {
		question: question,
		answer: answer,
	};
}

function getRandomNumberBetween(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

// getMathQuestion({
// 		minRange: 1,
// 		maxRange: 5000,
// 		minNumbers: 5,
// 		maxNumbers: 10,
// 		operators: ["/", "*", "+"],
// 		negativeChance: 50,
// 		exponentChance: 25,
// 		minExponents: 2,
// 		maxExponents: 5,
// 	}
// );
