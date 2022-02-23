import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction } from "discord.js";
import { hideReply } from "../command-helpers.js";

export default {
	data: new SlashCommandBuilder()
		.setDefaultPermission(false)
		.setName("timeout")
		.setDescription("Timeout a user for a period of time")
		.addUserOption(option => option.setName("target").setDescription("The user to timeout").setRequired(true))
		.addIntegerOption(option => option.setName("time").setDescription("Timeout length in minutes").setRequired(true))
		.addStringOption(option => option.setName("reason").setDescription("Reason for the timeout")),
	async execute(interaction: CommandInteraction, client: Client) {
		const user = interaction.options.getUser("target", true);
		const reason = interaction.options.getString("reason") ?? "You got bent";
		const time = interaction.options.getInteger("time", true);
		if (user) {
			const guild = await client.guilds.fetch(process.env.GUILD_ID);
			const guildMember = await guild.members.fetch(user.id);
			try {
				let mem = await guildMember.timeout(time * 60 * 1000, reason);
				console.log(`User ${mem.user.username} timedout for ${time} minute(s).`);
			} catch (err) {
				console.error(err);
			}
		}
		await hideReply(interaction);
	},
	permission: {
		id: process.env.COMMAND_TIMEOUT_ID,
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
