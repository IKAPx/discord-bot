module.exports = {
	name: "ready",
	once: true,
	execute(client) {
		client.user.setUsername("Bender");
		client.user.setActivity("Bending the bendee");
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};
