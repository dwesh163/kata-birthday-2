import NextAuth, { Session, User as authUser } from 'next-auth';
import MicrosoftEntraID from '@auth/core/providers/microsoft-entra-id';
import { headers } from 'next/headers';
import connectDB from './mongo';
import { User } from '@/models/User';
import mongoose from 'mongoose';

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		MicrosoftEntraID({
			clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
			clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
			tenantId: process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID,
			async profile(profile, tokens) {
				async function getProfileImage() {
					const response = await fetch(`https://graph.microsoft.com/v1.0/me/photos/48x48/$value`, { headers: { Authorization: `Bearer ${tokens.access_token}` } });

					if (response.ok && typeof Buffer !== 'undefined') {
						try {
							const pictureBuffer = await response.arrayBuffer();
							const pictureBase64 = Buffer.from(pictureBuffer).toString('base64');
							return `data:image/jpeg;base64,${pictureBase64}`;
						} catch {}
					}
				}

				const response = await fetch(`https://graph.microsoft.com/v1.0/me?$select=employeeId,id,displayName,jobTitle,mail,surname,userPrincipalName,birthday,companyName,joinedTeams`, { headers: { Authorization: `Bearer ${tokens.access_token}` } });

				if (response.ok) {
					const data = await response.json();
					console.log(data);
					return {
						sciper: data.employeeId,
						id: data.id,
						name: data.displayName,
						jobTitle: data.jobTitle,
						email: data.mail == null ? data.userPrincipalName : data.mail,
						username: data.surname.toLowerCase(),
						birthday: data.birthday,
						unit: data.joinedTeams ? data.joinedTeams[0] : data.companyName === 'EPFL' ? 'EPFL' : 'Hors EPFL',
						image: await getProfileImage(),
					};
				} else {
					return {};
				}
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
