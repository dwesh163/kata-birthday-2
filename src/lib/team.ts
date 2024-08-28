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

export async function getTeam(teamId: string, userId: string) {
	try {
		await connectDB();

		let team = await Team.findOne({
			$and: [{ _id: teamId }, { 'members.user': userId }],
			$or: [{ 'members.hasNotification': true }, { 'members.isMuted': false }],
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

		return { result, status: 200 };
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

		const owner = await User.findById(ownerId).exec();
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
