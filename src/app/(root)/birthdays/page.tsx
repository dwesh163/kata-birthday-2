'use server';

import Birthdays from '@/components/birthdays';

export default async function BirthdaysPage() {
	return (
		<div className="w-full">
			<Birthdays />
		</div>
	);
}
