import { returnRoles, breakoutAnswers } from "../command-helpers.js";

export default {
	name: "messageCreate",
	async execute(message, db) {
		if (message.channel.name === "jail" && !message.author.bot) {
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
