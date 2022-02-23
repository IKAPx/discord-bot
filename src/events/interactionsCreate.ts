import { Interaction, TextChannel } from "discord.js";
import { Low } from "lowdb";
import { IDatabase } from "../types";

export default {
	name: "interactionCreate",
	execute(db: Low<IDatabase>, interaction: Interaction) {
		console.log(`${interaction.user.tag} in #${(interaction.channel as TextChannel).name} triggered an interaction.`);
	},
};
