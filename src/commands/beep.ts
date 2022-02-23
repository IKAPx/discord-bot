import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

export default {
	data: new SlashCommandBuilder().setName("beep").setDescription("Replies with boop!"),
	async execute(interaction: CommandInteraction) {
		await interaction.reply("Boop!");
	},
};
