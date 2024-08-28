export type TeamType = {
	id: number;
	name: string;
	members: number;
	owner: string;
	isMuted?: boolean;
	role: string;
};

export type User = {
	id: number;
	name: string;
	email: string;
	birthday: Date;
	Authorization: {
		hasNotification: boolean;
	};
	unit?: string;
	image?: string;
	sciper?: string;
};
