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
