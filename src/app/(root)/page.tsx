'use server';
import Welcome from '@/components/welcome';
import { auth } from '@/lib/auth';
import { getNextBirthday } from '@/lib/birthdays';
import getSettings from '@/lib/settings';
import { getTeams } from '@/lib/team';
import { TeamsType } from '@/types';
import { redirect } from 'next/navigation';

export default async function MainPage() {
	const session = await auth();

	if (!session) {
		redirect('/login');
	}

	const nextBirthdays = (await getNextBirthday(session?.user.sciper, 3)) || [];
	const teams: TeamsType[] = await getTeams(session?.user.sciper);
	const settings = await getSettings(session?.user.sciper);

	return (
		<div className="w-full">
			<Welcome nextBirthdays={nextBirthdays} teams={teams} settings={settings} />
		</div>
	);
}
