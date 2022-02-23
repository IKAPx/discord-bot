import { SlashCommandBuilder } from "@discordjs/builders";
import { hideReply } from "../command-helpers.js";
import { Client, CommandInteraction, GuildMember, User } from "discord.js";

export default {
	data: new SlashCommandBuilder()
		.setDefaultPermission(false)
		.setName("ban")
		.setDescription("Ban a user from the server")
		.addUserOption(option => option.setName("target").setDescription("The user to ban").setRequired(true))
		.addStringOption(option => option.setName("reason").setDescription("Reason for the ban")),
	async execute(interaction: CommandInteraction, client: Client) {
		const user = interaction.options.getUser("target", true);
		const reason = interaction.options.getString("reason") ?? "You got bent";
		if (user) {
			const guild = await client.guilds.fetch(process.env.GUILD_ID);
			guild.members
				.ban(user.id, { days: 0, reason: reason })
				.then(banInfo => {
					let bannedUser = "";
					if (banInfo instanceof GuildMember) {
						bannedUser = banInfo.user.tag;
					} else if (banInfo instanceof User) {
						bannedUser = banInfo.tag;
					} else {
						bannedUser = banInfo;
					}
					console.log(`Banned ${bannedUser}`);
				})
				.catch(err => console.error(err));
		}
		await hideReply(interaction);
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
