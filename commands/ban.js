const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
		.setDefaultPermission(false)
		.setName("ban")
		.setDescription("Ban a user from the server")
		.addUserOption(option => option.setName("target").setDescription("The user to ban").setRequired(true))
		.addStringOption(option => option.setName("reason").setDescription("Reason for the ban")),
	async execute(interaction, client) {
		const user = interaction.options.getUser("target");
		const reason = interaction.options.getString("reason") ?? "You got bent";
		if (user) {
			const guild = await client.guilds.fetch(process.env.GUILD_ID);
			guild.members
				.ban(user.id, { days: 0, reason: reason })
				.then(banInfo => console.log(`Banned ${banInfo.user?.tag ?? banInfo.tag ?? banInfo}`))
				.catch(err => console.error(err));
		}
	},
	permission: {
		id: process.env.COMMAND_BAN_ID,
		permissions: [
			{
				id: process.env.ROLE_ADMIN_ID,
				type: 1, // 1 == ROLE
				permission: true,
			},
		],
	},
};
