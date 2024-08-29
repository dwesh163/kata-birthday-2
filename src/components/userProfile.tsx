import { UserRound } from 'lucide-react';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';

export function UserProfile() {
	const { data: session, status } = useSession();
	return (
		<div className="flex space-x-1 -mt-0.5 select-none">
			<UserRound />
			{status === 'loading' ? <p>Loading...</p> : <p className="text-black">{session?.user?.name}</p>}
		</div>
	);
}
