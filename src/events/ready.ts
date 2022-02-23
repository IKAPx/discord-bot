import { Client, Interaction } from "discord.js";
import { Low } from "lowdb";
import { IDatabase } from "../types";

// Gets command IDs for our command permissions, used in deploy-commands.js
async function getCommandIds(client: Client) {
	const commandManager = await client.guilds.cache.get(process.env.GUILD_ID)?.commands;
	const commands = await commandManager.fetch();
	commands.map(({ id, name }) => {
		console.log(id, name);
	});
}
export default {
	name: "ready",
	once: true,
	async execute(db: Low<IDatabase>, client: Client) {
		client.user.setUsername("Bender");
		client.user.setActivity("Bending the bendee");
		// await getCommandIds(client);
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};
