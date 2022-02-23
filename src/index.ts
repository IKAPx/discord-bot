import * as dotenv from "dotenv";
import * as fs from "fs";
import { join, dirname, resolve } from "path";
import { Low, JSONFile } from "lowdb";
import { fileURLToPath } from "url";
import { IDatabase } from "./types";
import { Client, Collection, Intents } from "discord.js";

// Initialize dotenv
dotenv.config();

// Initialize lowdb
const __dirname = dirname(fileURLToPath(import.meta.url));

// Use JSON file for storage
const file = join(__dirname, "db.json");
const adapter = new JSONFile<IDatabase>(file);
const db = new Low(adapter);

// Read data from JSON file, this will set db.data content
await db.read();
if (db.data === null) {
	db.data = { users: {} };
	await db.write();
}

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
// Event handling

const eventFiles = fs.readdirSync(resolve(__dirname, "events")).filter(file => file.endsWith(".js"));

for (const file of eventFiles) {
	const module = await import(`./events/${file}`);
	const event = module.default;
	if (event.once) {
		client.once(event.name, (...args) => event.execute(db, ...args));
	} else {
		client.on(event.name, (...args) => event.execute(db, ...args));
	}
}

client.commands = new Collection();
const commandFiles = fs.readdirSync(resolve(__dirname, "commands")).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
	const module = await import(`./commands/${file}`);
	const command = module.default;
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

// Command handling
client.on("interactionCreate", async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction, client, db);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
	}
});

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
