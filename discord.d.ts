import { SlashCommandBuilder } from "@discordjs/builders";
import { Collection } from "discord.js";
import { Low } from "lowdb";
import { IDatabase } from "./src/types";

declare module "discord.js" {
	export interface Client {
		commands: Collection<unknown, Command>;
	}

	export interface Command {
		data: SlashCommandBuilder;
		permission: {
			id: string;
			permissions: {
				id: string;
				type: number;
				permission: boolean;
			}[];
		};
		execute: (inteaction: CommandInteraction, client: Client, db: Low<IDatabase>) => Promise<any> | any;
	}

	export interface Event {
		name: string;
		once: boolean;
		execute: (db: Low<IDatabase>, ...args: any[]) => Promise<any> | any;
	}
}
