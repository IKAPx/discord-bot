import { SlashCommandBuilder } from "@discordjs/builders";
import { returnRoles, hideReply } from "../command-helpers.js";

export default {
	data: new SlashCommandBuilder()
		.setDefaultPermission(false)
		.setName("jail")
		.setDescription("Jail a user for a period of time")
		.addUserOption(option => option.setName("target").setDescription("The user to jail").setRequired(true))
		.addStringOption(option => option.setName("reason").setDescription("Reason for the jail"))
		.addIntegerOption(option => option.setName("time").setDescription("Jail time in minutes")),

	async execute(interaction, client, db) {
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

		/**
		 * Gets the guild member's roles
		 * @param {GuildMemberRoleManager} guildMemberRolesManager
		 * @returns the users roles, excluding the default @everyone role and the Jail role
		 */
		function getUserRoles(guildMemberRolesManager) {
			const excludedRoles = ["@everyone", "Jail"];
			const roles = Array.from(guildMemberRolesManager.cache.values(), x => ({
				id: x.id,
				name: x.name,
			})).filter(x => !excludedRoles.includes(x.name));
			return roles;
		}

		/**
		 * Set a timeout callback to free the user after 'time' minutes
		 * @param { GuildMember } guildMember
		 * @param { Number } time
		 */
		function freeUserFromJailAfter(guildMember, time) {
			if (time != null) {
				setTimeout(async () => {
					await returnRoles(guildMember, db);
				}, time * 60 * 1000);
			}
		}

		/**
		 * Gets the user from the database, using the username and discriminator
		 * @param {GuildMember} guildMember
		 * @returns The user object from the database
		 */
		function getDatabaseUser(guildMember) {
			const userName = `${guildMember.user.username}#${guildMember.user.discriminator}`;
			let databaseUser = db.data.users[userName];
			return databaseUser;
		}

		/**
		 * Saves the user's discord roles in to the database
		 * @param {Object} dbUser
		 * @param {Array} roles
		 */
		async function saveRolesToDatabase(dbUser, roles) {
			if (dbUser?.roles) {
				dbUser.roles = roles;
			} else {
				dbUser = { roles };
			}
			await db.write();
		}

		/**
		 * Prints who was jailed, for how long and for what reason, as well as which roles were removed.
		 * @param {GuildMember} guildMember
		 * @param {Array} roles
		 * @param {String} reason
		 */
		function getJailInfo(guildMember, roles, reason, time) {
			const timeString = time != null ? `for ${time} minute(s)` : "indefinitely";
			return `${
				guildMember.user.username
			} has been jailed ${timeString}, reason: ${reason}. Removed roles ${roles.map(x => x.name)}`;
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
