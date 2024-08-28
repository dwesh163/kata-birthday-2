'use server';

import Teams from '@/components/teams';

export default async function TeamsPage() {
	return (
		<div className="w-full">
			<Teams />
		</div>
	);
}
