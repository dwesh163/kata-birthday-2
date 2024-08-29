export type TeamType = {
	id: number;
	name: string;
	members: number;
	owner: string;
	isMuted?: boolean;
	role: string;
};

export type User = {
	id: string;
	name: string;
	email: string;
	birthday: Date;
	username: String;
	jobTitle: String;
	unit: String;
	sciper: String;
	image: String;
};

declare module 'next-auth' {
	interface Session {
		user: User;
		expires: string;
	}
}
