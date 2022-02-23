import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, GuildMember, GuildMemberRoleManager } from "discord.js";
import { returnRoles, hideReply } from "../command-helpers.js";
import { IDatabase } from "../types.js";
import { Low } from "lowdb";

export default {
	data: new SlashCommandBuilder()
		.setDefaultPermission(false)
		.setName("jail")
		.setDescription("Jail a user for a period of time")
		.addUserOption(option => option.setName("target").setDescription("The user to jail").setRequired(true))
		.addStringOption(option => option.setName("reason").setDescription("Reason for the jail"))
		.addIntegerOption(option => option.setName("time").setDescription("Jail time in minutes")),

	async execute(interaction: CommandInteraction, client: Client, db: Low<IDatabase>) {
		try {
			// Get the interaction's options
			const user = interaction.options.getUser("target", true);
			const reason = interaction.options.getString("reason") ?? "You got bent";
			const time = interaction.options.getInteger("time");

			// Fetch the guild and guildmember objects using the respective ID's
			const guild = await client.guilds.fetch(process.env.GUILD_ID);
			const guildMember = await guild.members.fetch(user.id);
			const guildMemberRolesManager = guildMember.roles;

			freeUserFromJailAfter(guildMember, time);
			let databaseUser = getDatabaseUser(guildMember);
			const roles = getUserRoles(guildMemberRolesManager);
			if (roles.length) {
				await saveRolesToDatabase(databaseUser, roles);

				// Set user's discord role to "Jail"
				await guildMember.roles.set([process.env.ROLE_JAIL_ID]);

				console.log(getJailInfo(guildMember, roles, reason, time));
			} else if (databaseUser?.roles?.length) {
				await returnRoles(guildMember, db);
			}
			await hideReply(interaction);
			// await interaction.reply(getJailInfo(guildMember, roles, reason, time));
		} catch (err) {
			console.error(err);
		}

		/** Gets the guild member's roles */
		function getUserRoles(guildMemberRolesManager: GuildMemberRoleManager) {
			const excludedRoles = ["@everyone", "Jail"];
			const roles = Array.from(guildMemberRolesManager.cache.values(), x => ({
				id: x.id,
				name: x.name,
			})).filter(x => !excludedRoles.includes(x.name));
			return roles;
		}

		/** Set a timeout callback to free the user after 'time' minutes */
		function freeUserFromJailAfter(guildMember: GuildMember, time: number) {
			if (time != null) {
				setTimeout(async () => {
					await returnRoles(guildMember, db);
				}, time * 60 * 1000);
			}
		}

		/** Gets the user from the database, using the username and discriminator */
		function getDatabaseUser(guildMember: GuildMember): IDatabase["users"][number] {
			const userName = `${guildMember.user.username}#${guildMember.user.discriminator}`;
			let databaseUser = db.data.users[userName];
			return databaseUser;
		}

		/** Saves the user's discord roles in to the database */
		async function saveRolesToDatabase(dbUser: IDatabase["users"][number], roles: IDatabase["users"][number]["roles"]) {
			if (dbUser?.roles) {
				dbUser.roles = roles;
			} else {
				dbUser = { roles };
			}
			await db.write();
		}

		/** Prints who was jailed, for how long and for what reason, as well as which roles were removed. */
		function getJailInfo(
			guildMember: GuildMember,
			roles: IDatabase["users"][number]["roles"],
			reason: string,
			time: number,
		) {
			const timeString = time != null ? `for ${time} minute(s)` : "indefinitely";
			return `${guildMember.user.username} has been jailed ${timeString}, reason: ${reason}. Removed roles ${roles.map(
				x => x.name,
			)}`;
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
