import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

export default {
	data: new SlashCommandBuilder()
		.setDefaultPermission(true)
		.setName("avatar")
		.setDescription("Get the avatar URL of the selected user, or your own avatar.")
		.addUserOption(option => option.setName("target").setDescription("The user's avatar to show").setRequired(true)),
	async execute(interaction: CommandInteraction) {
		const user = interaction.options.getUser("target");
		if (user) return interaction.reply(`${user.username}'s avatar: ${user.displayAvatarURL({ dynamic: true })}`);
		return interaction.reply(`Your avatar: ${interaction.user.displayAvatarURL({ dynamic: true })}`);
	},
};
