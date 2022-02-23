import { GuildMember, CommandInteraction } from "discord.js";
import { Low } from "lowdb";
import { IDatabase } from "./types";

export async function returnRoles(guildMember: GuildMember, db: Low<IDatabase>) {
	const userName = `${guildMember.user.username}#${guildMember.user.discriminator}`;
	await guildMember.roles.set(db.data.users[userName].roles.map(x => x.id));
	console.log(
		`${guildMember.user.username} has been unjailed, returned roles ${db.data.users[userName].roles.map(x => x.name)}`,
	);
}

export let breakoutAnswers: { [key: string]: number } = {};

export async function hideReply(interaction: CommandInteraction) {
	await interaction.deferReply();
	await interaction.deleteReply();
}
