import mongoose from 'mongoose';
import connectDB from '@/lib/mongo';
import { Team } from '@/models/Team';
import { User } from '@/models/User';

export async function getTeams(userId: string) {
	try {
		await connectDB();

		const teams = await Team.find({
			$and: [{ 'members.user': userId }, { 'members.hasNotification': true }],
		})
			.select('name members owner')
			.populate({
				path: 'members.user',
				select: 'name',
			});

		const userTeams = await Promise.all(
			teams.map(async (team) => {
				const member = team.members.find((member: { user: { _id: { toString: () => string } } }) => member.user._id.toString() === userId);
				const owner = await User.findById(team.owner);

				return {
					id: team._id,
					name: team.name,
					owner: owner ? owner.name : '',
					members: team.members.length,
					role: member.role,
					isMuted: member.isMuted,
				};
			})
		);

		return userTeams;
	} catch (error) {
		console.error('Error while retrieving user teams with roles:', error);
		return { error: 'Error while retrieving user teams with roles', status: 500 };
	} finally {
		await mongoose.disconnect();
	}
}
