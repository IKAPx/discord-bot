import { returnRoles, breakoutAnswers } from "../command-helpers.js";
import { Interaction, TextChannel, Message } from "discord.js";
import { Low } from "lowdb";
import { IDatabase } from "../types";

export default {
	name: "messageCreate",
	async execute(db: Low<IDatabase>, message: Message) {
		if ((message.channel as TextChannel).name === "jail" && !message.author.bot) {
			let answer = breakoutAnswers[message.author.id];
			if (answer == null) {
				message.channel.send("Request to /breakout first!");
				return;
			} else if (answer === Number.parseInt(message.content.trim())) {
				await returnRoles(message.member, db);
			} else {
				message.channel.send("Wrong answer bozo!");
			}
		}
	},
};
