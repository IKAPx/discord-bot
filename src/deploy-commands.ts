import * as dotenv from "dotenv";
import * as fs from "fs";
import { resolve } from "path";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

dotenv.config();

const commands = [];
const permissions = [];
const commandFiles = fs.readdirSync(resolve(__dirname, "commands")).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
	const module = await import(`./commands/${file}`);
	const command = module.default;
	commands.push(command.data.toJSON());
	if (command.permission) {
		permissions.push(command.permission);
	}
}

const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN);
// Register all of our commands
rest
	.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands })
	.then(() => console.log("Successfully registered application commands."))
	.catch(console.error);
// Register all of our command permissions
rest
	.put(Routes.guildApplicationCommandsPermissions(process.env.CLIENT_ID, process.env.GUILD_ID), {
		body: permissions,
	})
	.then(() => console.log("Successfully registered application permissions."))
	.catch(console.error);
