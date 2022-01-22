const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
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
