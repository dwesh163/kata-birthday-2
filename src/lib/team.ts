import mongoose from 'mongoose';
import connectDB from '@/lib/mongo';
import { Team } from '@/models/Team';
import { User } from '@/models/User';
import { TeamsType } from '@/types';

export async function getTeams(sciper: string): Promise<TeamsType[]> {
	try {
		await connectDB();

		const user = await User.findOne({ sciper: sciper });
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
			return [];
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
		return [];
	} finally {
		await mongoose.disconnect();
	}
}

export async function getTeam(teamId: string, sciper: string) {
	try {
		await connectDB();

		const user = await User.findOne({ sciper: sciper });
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
					birthday: new Date(new Date(memberUser.birthday).setFullYear(1970)),
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

export async function createTeam(name: string, sciper: string) {
	try {
		await connectDB();

		const owner = await User.findOne({ sciper: sciper });
		if (!owner) {
			return { error: 'Owner not found' };
		}

		const existingTeam = await Team.findOne({ name: name });

		if (existingTeam && existingTeam.createdAt > new Date().getTime() - 1000 * 60 * 60 * 24) {
			return { error: 'Team already exists' };
		}

		const team = new Team({
			name,
			owner: owner._id,
			members: [{ user: owner._id, role: 'superadmin' }],
		});

		await team.save();

		return team;
	} catch (error) {
		console.error('Error while creating team:', error);
		return { error: 'Error while creating team', status: 500 };
	} finally {
	}
}

export async function addUserToTeam(userId: string, reqUserSciper: string, teamId: string, role: string) {
	try {
		await connectDB();

		const reqUser = await User.findOne({ sciper: reqUserSciper });

		const user = await User.findById(userId);
		const team = await Team.findOne({
			_id: teamId,
			members: {
				$elemMatch: {
					user: reqUser._id,
					role: { $in: ['superadmin', 'admin'] },
				},
			},
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

export async function removeUserFromTeam(sciper: string, reqUserSciper: string, teamId: string) {
	try {
		await connectDB();

		const user = await User.findOne({ sciper: sciper });
		const reqUser = await User.findOne({ sciper: reqUserSciper });

		if (!user || !reqUser) {
			return { error: 'User not found' };
		}

		if (user._id.toString() === reqUser._id.toString()) {
			return { error: 'Cannot remove yourself from the team' };
		}

		await connectDB();

		const team = await Team.findOne({
			_id: teamId,
			members: {
				$elemMatch: {
					user: reqUser._id,
					role: { $in: ['superadmin', 'admin'] },
				},
			},
		});

		if (!team) {
			return { error: 'Team not found' };
		}

		if (team.owner.toString() === user._id.toString()) {
			return { error: 'Cannot remove owner from the team' };
		}

		const role = await getRole(reqUser.sciper, teamId);

		if (role !== 'superadmin' && role !== 'admin') {
			return { error: 'User not authorized to remove user from team' };
		}

		team.members.map((member: { user: { _id: { toString: () => string } } }) => console.log('member:', member.user._id.toString()));

		const updatedMembers = team.members.filter((member: { user: { _id: { toString: () => string } } }) => member.user._id.toString() !== user._id.toString());
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
