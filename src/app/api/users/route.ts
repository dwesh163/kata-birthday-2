import { auth, getAccessToken } from '@/lib/auth';
import { fetchProfileImage } from '@/lib/user';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const search = searchParams.get('search');

	const session = await auth();

	if (!session) {
		return NextResponse.json({ error: 'Not authenticated', status: 401 });
	}

	try {
		const token = await getAccessToken();
		const response = await fetch(`${process.env.MICROSOFT_GRAPH_API_URL}/users?$count=true&$search="displayName:${search}"&$select=displayname,department,mail,jobTitle,userPrincipalName`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
				ConsistencyLevel: 'eventual',
			},
		});

		if (!response.ok) {
			console.error('Failed to fetch users:', response.statusText);
			return NextResponse.json({ error: 'Error while retrieving users', status: 500 });
		}

		const data = await response.json();
		const users = await Promise.all(
			data.value
				.map(async (user: any) => ({
					name: user.displayName,
					unit: user.department,
					email: user.mail || user.userPrincipalName,
					jobTitle: user.jobTitle,
					image: await fetchProfileImage(token, user.mail || user.userPrincipalName),
				}))
				.slice(0, 10)
		);

		console.log('users', users);

		return NextResponse.json(users);
	} catch (error) {
		console.error(error);
		return { error: 'Error while retrieving users', status: 500 };
	}
}
