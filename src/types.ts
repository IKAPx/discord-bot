export interface IDatabase {
	users: {
		[key: string]: {
			roles: {
				id: string;
				name: string;
			}[];
		};
	};
}
