import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, GuildMember, User } from "discord.js";
import { hideReply } from "../command-helpers.js";

export default {
	data: new SlashCommandBuilder()
		.setDefaultPermission(false)
		.setName("kick")
		.setDescription("Kick a user from the server")
		.addUserOption(option => option.setName("target").setDescription("The user to kick").setRequired(true))
		.addStringOption(option => option.setName("reason").setDescription("Reason for the kick")),
	async execute(interaction: CommandInteraction, client: Client) {
		const user = interaction.options.getUser("target", true);
		const reason = interaction.options.getString("reason") ?? "You got bent";
		if (user) {
			const guild = await client.guilds.fetch(process.env.GUILD_ID);
			guild.members
				.kick(user.id, reason)
				.then(banInfo => {
					let bannedUser = "";
					if (banInfo instanceof GuildMember) {
						bannedUser = banInfo.user.tag;
					} else if (banInfo instanceof User) {
						bannedUser = banInfo.tag;
					} else {
						bannedUser = banInfo;
					}
					console.log("Kicked", bannedUser);
				})
				.catch(err => console.error(err));
		}
		await hideReply(interaction);
	},
	permission: {
		id: process.env.COMMAND_KICK_ID,
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
		],
	},
};
