export type TeamType = {
	id: number;
	name: string;
	members: number;
	owner: string;
	Authorization: {
		canEdit: boolean;
		canDelete: boolean;
		canView: boolean;
		canLeave: boolean;
		isMuted?: boolean;
	};
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
