import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

export default {
	data: new SlashCommandBuilder()
		.setDefaultPermission(true)
		.setName("server")
		.setDescription("Display info about this server."),
	async execute(interaction: CommandInteraction) {
		return interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
	},
};
