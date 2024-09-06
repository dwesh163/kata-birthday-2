'use server';

import Team from '@/components/team';
import { auth } from '@/lib/auth';
import { getTeam } from '@/lib/team';
import { ErrorType, TeamType, User } from '@/types';
import { redirect } from 'next/navigation';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

export default async function TeamPage({ params }: { params: { teamId: string } }) {
	const session = await auth();
	if (!session) {
		redirect('/login');
	}

	const team: TeamType | ErrorType = await getTeam(params.teamId as string, session?.user?.id as string);

	if ('error' in team) {
		return <div>{team.error}</div>;
	}

	if (!team) {
		return <div>No teams found</div>;
	}

	const users = team.members as User[];

	return (
		<div className="w-full">
			<Breadcrumb className="px-10 pt-6">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/">Home</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink href="/teams">Teams</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>{team.name}</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<Team users={users} team={{ name: team.name, owner: team.owner }} />
		</div>
	);
}
