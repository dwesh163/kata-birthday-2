import NextAuth, { Session } from 'next-auth';
import MicrosoftEntraID from '@auth/core/providers/microsoft-entra-id';
import connectDB from './mongo';
import { User } from '@/models/User';
import mongoose from 'mongoose';
import { fetchProfileImage, fetchUserProfile } from './user';

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		MicrosoftEntraID({
			clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
			clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
			tenantId: process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID,
			async profile(profile, tokens) {
				const userProfile = await fetchUserProfile(tokens.access_token as string);
				if (userProfile) {
					const image = await fetchProfileImage(tokens.access_token as string);
					return {
						sciper: userProfile.employeeId,
						id: userProfile.id,
						name: userProfile.displayName,
						jobTitle: userProfile.jobTitle,
						email: userProfile.mail || userProfile.userPrincipalName,
						username: userProfile.surname.toLowerCase(),
						birthday: userProfile.birthday,
						unit: userProfile.department ? userProfile.department : userProfile.companyName === 'EPFL' ? 'EPFL' : 'Hors EPFL',
						image,
					};
				}
				return {};
			},
		}),
	],
	pages: {
		signIn: '/login',
		error: '/auth/error',
	},
	callbacks: {
		async signIn({ user }) {
			await connectDB();

			if (!(await User.findOne({ email: user.email }))) {
				const newUser = new User(user);
				await newUser.save();
			} else {
				console.log('User already exists');
			}
			await mongoose.disconnect();

			return true;
		},
		async session({ session }: { session: Session }): Promise<Session> {
			await connectDB();
			const dbUser = await User.findOne({ email: session.user.email });

			if (dbUser) {
				session.user = {
					id: dbUser.id as string,
					name: dbUser.name as string,
					email: dbUser.email as string,
					birthday: dbUser.birthday as Date,
					username: dbUser.username as string,
					jobTitle: dbUser.jobTitle as string,
					unit: dbUser.unit as string,
					sciper: dbUser.sciper as string,
					image: dbUser.image as string,
				};
			}
			await mongoose.disconnect();

			return session;
		},
	},
});

export async function getAccessToken(): Promise<string> {
	const response = await fetch(`https://login.microsoftonline.com/${process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID}/oauth2/v2.0/token`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({
			grant_type: 'client_credentials',
			client_id: process.env.AUTH_MICROSOFT_ENTRA_ID_ID as string,
			client_secret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET as string,
			scope: 'https://graph.microsoft.com/.default',
		}),
	});

	if (!response.ok) {
		throw new Error(`Failed to get access token: ${response.statusText}`);
	}

	const data = await response.json();
	return data.access_token;
}
