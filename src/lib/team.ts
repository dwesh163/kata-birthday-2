import mongoose from 'mongoose';
import connectDB from '@/lib/mongo';
import { Team } from '@/models/Team';
import { User } from '@/models/User';

export async function getTeams(userId: string) {
	try {
		await connectDB();

		const user = await User.findOne({ id: userId });

		const teams = await Team.find({
			members: {
				$elemMatch: {
					user: user._id,
					hasNotification: true,
				},
			},
		})
			.select('name members owner')
			.populate({
				path: 'members.user',
				select: 'name',
			});

		if (teams.length === 0) {
			return { error: 'No teams found', status: 404 };
		}

		const userTeams = await Promise.all(
			teams.map(async (team) => {
				await connectDB();

				const member = team.members.find((member: { user: { _id: { toString: () => string } } }) => member.user._id.toString() === user._id.toString());
				const owner = await User.findById(team.owner);

				return {
					id: team._id.toString(),
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

export async function getTeam(teamId: string, userId: string) {
	try {
		await connectDB();

		const user = await User.findOne({ id: userId });
		let team = await Team.findOne({
			_id: teamId,
			members: {
				$elemMatch: {
					user: user._id,
					hasNotification: true,
				},
			},
		});

		if (!team) {
			return { error: 'Team not found', status: 404 };
		}

		const members = await Promise.all(
			team.members.map(async (member: { user: string; role: string; hasNotification: boolean }) => {
				const memberUser = await User.findById(member.user);
				if (!memberUser) return null;

				return {
					role: member.role,
					hasNotification: member.hasNotification,
					name: memberUser.name,
					id: memberUser._id.toString(),
					email: memberUser.email,
					unit: memberUser.unit,
				};
			})
		);

		const validMembers = members.filter((member) => member !== null);
		const owner = await User.findById(team.owner);

		const result = {
			id: team._id.toString(),
			name: team.name,
			owner: owner.name,
			members: validMembers,
		};

		return result;
	} catch (error) {
		console.error('Error while retrieving team:', error);
		return { error: 'Error while retrieving team', status: 500 };
	} finally {
		await mongoose.disconnect();
	}
}

export async function createTeam(name: string, ownerId: string) {
	try {
		await connectDB();

		const owner = await User.findOne({ id: ownerId });
		if (!owner) {
			return { error: 'Owner not found' };
		}

		const team = new Team({
			name,
			owner: owner._id,
			members: [{ user: owner._id, role: 'superAdmin' }],
		});

		await team.save();

		return team;
	} catch (error) {
		console.error('Error while creating team:', error);
		return { error: 'Error while creating team', status: 500 };
	} finally {
		await mongoose.disconnect();
	}
}

export async function addUserToTeam(userId: string, teamId: string, role: string) {
	try {
		await connectDB();

		const user = await User.findById(userId).exec();
		const team = await Team.findOne({
			$and: [{ _id: teamId }, { 'members.user': userId }],
			$or: [{ 'members.hasNotification': true }, { 'members.isMuted': false }],
		});

		if (!user || !team) {
			return { error: 'User or team not found' };
		}

		const userAlreadyInTeam = team.members.some((member: { user: { _id: { toString: () => string } } }) => member.user.toString() === user._id.toString());
		if (userAlreadyInTeam) {
			return { error: 'User already in team' };
		}

		team.members.push({ user: user._id, role: role });

		await team.save();

		return team;
	} catch (error) {
		console.error('Error while adding user to team:', error);
		return { error: 'Error while adding user to team', status: 500 };
	} finally {
		await mongoose.disconnect();
	}
}

export async function removeUserFromTeam(userId: string, teamId: string) {
	try {
		await connectDB();

		const team = await Team.findOne({
			$and: [{ _id: teamId }, { 'members.user': userId }],
			$or: [{ 'members.hasNotification': true }, { 'members.isMuted': false }],
		});

		if (!team) {
			return { error: 'Team not found' };
		}

		const updatedMembers = team.members.filter((member: { user: { _id: { toString: () => string } } }) => member.user.toString() !== userId);
		if (updatedMembers.length === team.members.length) {
			return { error: 'User not found in team' };
		}

		team.members = updatedMembers;

		await team.save();
		return team;
	} catch (error) {
		console.error('Error while removing user from team:', error);
		return { error: 'Error while removing user from team', status: 500 };
	} finally {
		await mongoose.disconnect();
	}
}
