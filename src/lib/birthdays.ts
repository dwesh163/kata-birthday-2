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
			select: 'name birthday jobTitle unit sciper',
		});

	const birthdayList: BirthdayType[] = [];

	teams.forEach((team) => {
		team.members.forEach((member: { user: { sciper: string; name: string; birthday: Date; jobTitle: string; unit: string } }) => {
			if (member.user && !birthdayList.some((birthday) => birthday.sciper === member.user.sciper) && user.sciper !== member.user.sciper) {
				birthdayList.push({
					name: member.user.name,
					birthday: member.user.birthday,
					jobTitle: member.user.jobTitle,
					unit: member.user.unit,
					sciper: member.user.sciper,
				});
			}
		});
	});

	return birthdayList;
}

export async function getNextBirthday(sciper: string, number: number): Promise<BirthdayType[] | null> {
	const birthdays = await getBirthdays(sciper);
	const today = new Date();

	const adjustDate = (birthday: Date) => {
		const adjusted = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());
		return adjusted < today ? new Date(today.getFullYear() + 1, birthday.getMonth(), birthday.getDate()) : adjusted;
	};

	const nextBirthdays = birthdays
		.map((b) => ({ ...b, adjustedBirthday: adjustDate(new Date(b.birthday)) }))
		.filter((b) => b.adjustedBirthday >= today)
		.sort((a, b) => a.adjustedBirthday.getTime() - b.adjustedBirthday.getTime())
		.slice(0, number);

	console.log('nextBirthdays', nextBirthdays);

	return nextBirthdays;
}
