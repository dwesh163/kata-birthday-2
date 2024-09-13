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
	members: UserType[];
};

export type UserType = {
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

export type BirthdayType = {
	name: string;
	birthday: Date;
	jobTitle: string;
	unit: string;
	sciper?: string;
};

export type SettingsType = {
	email: {
		notification: boolean;
		sendAt: string;
	};
	telegram: {
		notification: boolean;
		sendAt: string;
		chatId: string;
	};
	push: {
		notification: boolean;
		sendAt: string;
	};
};
export type ErrorType = {
	error: string;
	status: number;
};

declare module 'next-auth' {
	interface Session {
		user: UserType;
		expires: string;
	}
}
