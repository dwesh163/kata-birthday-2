export type TeamsType = {
	id: number;
	name: string;
	members: number;
	owner: string;
	isMuted?: boolean;
	role: string;
};

export type TeamType = {
	id: string;
	name: string;
	owner: string;
	members: User[];
};

export type User = {
	id: string;
	name: string;
	email: string;
	birthday: Date;
	username: string;
	jobTitle: string;
	unit: string;
	sciper: string;
	image: string;
	hasNotification?: boolean;
	role?: string;
};

export type ErrorType = {
	error: string;
	status: number;
};

declare module 'next-auth' {
	interface Session {
		user: User;
		expires: string;
	}
}
