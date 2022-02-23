import { SlashCommandBuilder } from "@discordjs/builders";
import { getMathQuestion } from "../random-math.js";
import { breakoutAnswers } from "../command-helpers.js";
import { CommandInteraction } from "discord.js";

export default {
	data: new SlashCommandBuilder()
		.setDefaultPermission(false)
		.setName("breakout")
		.setDescription("Breakout a user from jail"),

	async execute(interaction: CommandInteraction) {
		const { question, answer } = getMathQuestion({
			minRange: 1,
			maxRange: 100,
			minNumbers: 2,
			maxNumbers: 4,
			operators: ["/", "*", "+", "-"],
			negativeChance: 20,
			exponentChance: 10,
			minExponent: 2,
			maxExponent: 4,
		});

		breakoutAnswers[interaction.user.id] = answer;

		await interaction.reply(
			`To breakout from jail answer this question: ${question}. Round down to the nearest integer.`,
		);
	},
	permission: {
		id: process.env.COMMAND_BREAKOUT_ID,
		permissions: [
			{
				id: process.env.ROLE_ADMIN_ID,
				type: 1, // 1 == ROLE
				permission: true,
			},
			{
				id: process.env.ROLE_MODERATOR_ID,
				type: 1, // 1 == ROLE
				permission: true,
			},
			{
				id: process.env.ROLE_JAIL_ID,
				type: 1, // 1 == ROLE
				permission: true,
			},
		],
	},
};
