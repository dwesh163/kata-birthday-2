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

	// Find teams where the user is a member and has notifications enabled
	const teams = await Team.find({
		members: {
			$elemMatch: {
				user: user._id,
				hasNotification: true,
			},
		},
	})
		.select('members') // Only select members
		.populate({
			path: 'members.user', // Populate the user information in members
			select: 'name birthday jobTitle unit', // Select relevant fields
		});

	// Use a Set to store unique user IDs
	const uniqueUsers = new Set();

	// Array to store the birthday information
	const birthdayList: BirthdayType[] = [];

	// Loop through each team and collect member info
	teams.forEach((team) => {
		team.members.forEach((member) => {
			if (member.user && !uniqueUsers.has(member.user._id.toString())) {
				uniqueUsers.add(member.user._id.toString());

				// Push the user info to birthdayList
				birthdayList.push({
					name: member.user.name,
					birthday: member.user.birthday,
					jobTitle: member.user.jobTitle,
					unit: member.user.unit,
				});
			}
		});
	});

	console.log(birthdayList); // To log the result

	return birthdayList;
}
