'use server';

import Welcome from '@/components/welcome';

export default async function MainPage() {
	return (
		<div className="w-full">
			<Welcome />
		</div>
	);
}
