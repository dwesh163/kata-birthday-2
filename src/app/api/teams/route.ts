import { auth, getAccessToken } from '@/lib/auth';
import connectDB from '@/lib/mongo';
import { addUserToTeam, createTeam } from '@/lib/team';
import { User } from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';
import { UserType } from '@/types';
import { getUser } from '@/lib/user';

export async function POST(req: NextRequest) {
	const body = await req.json();
	const { users, name } = body as { users: UserType[]; name: string };

	const session = await auth();

	if (!session) {
		return NextResponse.json({ error: 'Not authenticated', status: 401 });
	}

	try {
		if (!name) {
			return NextResponse.json({ message: 'Invalid team name' }, { status: 400 });
		}

		const team = await createTeam(name, session.user.sciper);

		if (!team) {
			return NextResponse.json({ message: 'Error while creating team' }, { status: 500 });
		}

		if (!users || users.length === 0) {
			return NextResponse.json({ message: 'No users to add to team' }, { status: 200 });
		}

		const token = await getAccessToken();

		for (const user of users) {
			await connectDB();

			const dbUser = await User.findOne({ email: user.email });

			let id = dbUser?._id;

			if (!dbUser) {
				const adUser = await getUser(token, user.email);

				if (!adUser) {
					return NextResponse.json({ message: 'User not found' }, { status: 404 });
				}

				const newUser = new User({ ...adUser, settings: { email: { notification: true, sendAt: '09:00' }, telegram: { notification: false, sendAt: '09:00', chatId: '' }, push: { notification: false, sendAt: '09:00' } } });

				id = newUser._id;
				await newUser.save();
			}

			await addUserToTeam(id, session.user.sciper, team._id, 'member');
		}

		return NextResponse.json({ message: 'Team created successfully' });
	} catch (error) {
		console.error('Error while adding user to team:', error);
		return NextResponse.json({ message: 'Error while adding user to team' }, { status: 500 });
	} finally {
	}
}
