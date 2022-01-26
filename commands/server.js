import { SlashCommandBuilder } from "@discordjs/builders";

export default {
	data: new SlashCommandBuilder()
		.setDefaultPermission(true)
		.setName("server")
		.setDescription("Display info about this server."),
	async execute(interaction) {
		return interaction.reply(
			`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`
		);
	},
};
