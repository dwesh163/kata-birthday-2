import { auth } from '@/lib/auth';
import { removeUserFromTeam } from '@/lib/team';
import { NextResponse } from 'next/server';

interface Params {
	teamId: string;
	sciper: string;
}

export async function DELETE(req: Request, { params }: { params: Params }) {
	const session = await auth();

	if (!session) {
		return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
	}

	const { teamId, sciper } = params;

	if (!teamId) {
		return NextResponse.json({ error: 'Invalid team ID' }, { status: 400 });
	}

	if (!sciper) {
		return NextResponse.json({ error: 'Invalid user' }, { status: 400 });
	}

	try {
		const error = await removeUserFromTeam(sciper, session.user.sciper, teamId);
		console.log(error);
	} catch (error) {
		return NextResponse.json({ error: 'An error occurred while removing the user from the team' }, { status: 500 });
	}

	return NextResponse.json({ success: true });
}
