export async function fetchUserProfile(accessToken: string) {
	try {
		const response = await fetch('https://graph.microsoft.com/v1.0/me?$select=employeeId,id,displayName,jobTitle,mail,surname,userPrincipalName,birthday,companyName,joinedTeams,department', {
			headers: { Authorization: `Bearer ${accessToken}` },
		});

		if (response.ok) {
			return await response.json();
		}
	} catch (error) {
		console.error('Error fetching user profile:', error);
	}
	return null;
}

export async function getUser(token: string, email: string) {
	const response = await fetch(`${process.env.MICROSOFT_GRAPH_API_URL}/users/${email}?$select=employeeId,id,displayName,jobTitle,mail,surname,userPrincipalName,birthday,companyName,joinedTeams,department`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
			ConsistencyLevel: 'eventual',
		},
	});

	if (!response.ok) {
		console.error('Failed to fetch user:', response.statusText);
		return null;
	}

	const userProfile = await response.json();

	if (userProfile) {
		return {
			sciper: userProfile.employeeId,
			id: userProfile.id,
			name: userProfile.displayName,
			jobTitle: userProfile.jobTitle,
			email: userProfile.mail || userProfile.userPrincipalName,
			username: userProfile.surname.toLowerCase(),
			birthday: userProfile.birthday,
			unit: userProfile.department ? userProfile.department : userProfile.companyName === 'EPFL' ? 'EPFL' : 'Hors EPFL',
		};
	}
	return null;
}
