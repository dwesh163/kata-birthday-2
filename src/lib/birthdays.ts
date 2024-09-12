import { Team } from '@/models/Team';
import { User } from '@/models/User';
import { BirthdayType } from '@/types';
import connectDB from './mongo';

export async function getBirthdays(sciper: string): Promise<BirthdayType[]> {
	await connectDB();
	const user = await User.findOne({ sciper: sciper });

	if (!user) {
		throw new Error('User not found');
	}

	const teams = await Team.find({
		members: {
			$elemMatch: {
				user: user._id,
				hasNotification: true,
			},
		},
	})
		.select('members')
		.populate({
			path: 'members.user',
			select: 'name birthday jobTitle unit',
		});

	const uniqueUsers = new Set();

	const birthdayList: BirthdayType[] = [];

	teams.forEach((team) => {
		team.members.forEach((member: { user: { _id: { toString: () => unknown }; name: any; birthday: string | number | Date; jobTitle: any; unit: any } }) => {
			if (member.user && !uniqueUsers.has(member.user._id.toString())) {
				uniqueUsers.add(member.user._id.toString());

				birthdayList.push({
					name: member.user.name,
					birthday: new Date(new Date(member.user.birthday).setFullYear(1970)),
					jobTitle: member.user.jobTitle,
					unit: member.user.unit,
				});
			}
		});
	});

	return birthdayList;
}
