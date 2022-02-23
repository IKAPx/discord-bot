import { evaluate } from "mathjs";

interface MathQuestionConfig {
	minRange?: number;
	maxRange?: number;
	minNumbers?: number;
	maxNumbers?: number;
	negativeChance?: number;
	exponentChance?: number;
	minExponent?: number;
	maxExponent?: number;
	operators?: ["/", "*", "+", "-"];
}

const defaultConfig: MathQuestionConfig = {
	minRange: 1,
	maxRange: 20,
	minNumbers: 2,
	maxNumbers: 4,
	negativeChance: 25,
	exponentChance: 10,
	minExponent: 2,
	maxExponent: 4,
	operators: ["/", "*", "+", "-"],
};

export function getMathQuestion(config: MathQuestionConfig) {
	config = { ...defaultConfig, ...config };

	let question = "";

	const totalParts = getRandomNumberBetween(config.minNumbers, config.maxNumbers);

	for (let i = 0; i < totalParts; i++) {
		const number = getRandomNumberBetween(config.minRange, config.maxRange);
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
			(hasExponent ? "^" + getRandomNumberBetween(config.minExponent, config.maxExponent) : "");
	}

	// Round down the answer to the nearest integer
	const answer = Math.floor(evaluate(question));

	return {
		question: question,
		answer: answer,
	};
}

function getRandomNumberBetween(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}
