export async function returnRoles(guildMember, db) {
	const userName = `${guildMember.user.username}#${guildMember.user.discriminator}`;
	await guildMember.roles.set(db.data.users[userName].roles.map(x => x.id));
	console.log(
		`${guildMember.user.username} has been unjailed, returned roles ${db.data.users[userName].roles.map(
			x => x.name
		)}`
	);
}

export let breakoutAnswers = {};
