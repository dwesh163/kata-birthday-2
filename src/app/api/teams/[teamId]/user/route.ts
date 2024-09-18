import { auth, getAccessToken } from '@/lib/auth';
import connectDB from '@/lib/mongo';
import { addUserToTeam, getTeam } from '@/lib/team';
import { getUser } from '@/lib/user';
import { Team } from '@/models/Team';
import { User } from '@/models/User';
import { NextResponse } from 'next/server';

interface Params {
	teamId: string;
}

export async function POST(req: Request, { params }: { params: Params }) {
	await connectDB();

	const session = await auth();

	if (!session) {
		return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
	}

	if (!params.teamId) {
		return NextResponse.json({ error: 'Invalid team ID', status: 400 });
	}

	if (!session.user.sciper) {
		return NextResponse.json({ error: 'Invalid user', status: 400 });
	}

	const user = await req.json();

	if (!user) {
		return NextResponse.json({ error: 'Invalid user', status: 400 });
	}

	const dbUser = await User.findOne({ sciper: user.sciper });
	const token = await getAccessToken();

	let id = dbUser?._id;

	if (!dbUser) {
		const adUser = await getUser(token, user.email);

		if (!adUser) {
			return NextResponse.json({ message: 'User not found' }, { status: 404 });
		}

		const newUser = new User({
			...adUser,
			settings: {
				email: { notification: true, sendAt: '09:00' },
				telegram: { notification: false, sendAt: '09:00', chatId: '' },
				push: { notification: false, sendAt: '09:00' },
			},
		});

		id = newUser._id;
		await newUser.save();
	}

	try {
		await addUserToTeam(id, session.user.sciper, params.teamId, 'member');
	} catch (error) {
		console.error('Error while adding user to team:', error);
		return NextResponse.json({ message: 'Error while adding user to team' }, { status: 500 });
	}

	return NextResponse.json({}, { status: 200 });
}
