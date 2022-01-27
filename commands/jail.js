import { SlashCommandBuilder } from "@discordjs/builders";

export default {
	data: new SlashCommandBuilder()
		.setDefaultPermission(false)
		.setName("jail")
		.setDescription("Jail a user for a period of time")
		.addUserOption(option => option.setName("target").setDescription("The user to jail").setRequired(true))
		.addStringOption(option => option.setName("reason").setDescription("Reason for the jail"))
		.addIntegerOption(option => option.setName("time").setDescription("Jail time in minutes")),

	async execute(interaction, client, db) {
		const user = interaction.options.getUser("target", true);
		const reason = interaction.options.getString("reason") ?? "You got bent";
		const time = interaction.options.getInteger("time");

		async function returnRoles(guildMember, db) {
			const userName = `${guildMember.user.username}#${guildMember.user.discriminator}`;
			await guildMember.roles.set(db.data.users[userName].roles.map(x => x.id));
			console.log(
				`${guildMember.user.username} has been unjailed, returned roles ${db.data.users[userName].roles.map(
					x => x.name
				)}`
			);
		}
		if (user) {
			try {
				// fetch the guild and guildmember objects using the respective ID's
				const guild = await client.guilds.fetch(process.env.GUILD_ID);
				const guildMember = await guild.members.fetch(user.id);
				const guildMemberRolesManager = guildMember.roles;

				// if time is given unjail the user after the timeout
				if (time != null) {
					setTimeout(async () => {
						await returnRoles(guildMember, db);
					}, time * 60 * 1000);
				}

				// filter the default-role and jail-role
				const excludedRoles = ["@everyone", "Jail"];
				const roles = Array.from(guildMemberRolesManager.cache.values(), x => ({
					id: x.id,
					name: x.name,
				})).filter(x => !excludedRoles.includes(x.name));

				const userName = `${guildMember.user.username}#${guildMember.user.discriminator}`;
				if (roles.length) {
					// saves the user's roles to a database and replaces them with the jail-role
					db.data.users[userName] = { roles };
					await db.write();

					await guildMember.roles.set([process.env.ROLE_JAIL_ID]);

					const timeString = time != null ? `for ${time} minute(s)` : "indefinitely";
					console.log(
						`${
							guildMember.user.username
						} has been jailed ${timeString}, reason: ${reason}. Removed roles ${roles.map(x => x.name)}`
					);
				} else if (db.data.users[userName]?.roles?.length) {
					await returnRoles(guildMember, db);
				}
			} catch {
				err => console.error(err);
			}
		}
	},
	permission: {
		id: process.env.COMMAND_JAIL_ID,
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
