'use server';
import Teams from '@/components/teams';
import { auth } from '@/lib/auth';
import { getTeams } from '@/lib/team';
import { TeamsType } from '@/types';
import { redirect } from 'next/navigation';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

export default async function TeamsPage() {
	const session = await auth();
	if (!session) {
		redirect('/login');
	}
	const teams = (await getTeams(session?.user?.id as string)) as TeamsType[];

	if (!teams) {
		return <div>No teams found</div>;
	}

	return (
		<div className="w-full">
			<Breadcrumb className="px-10 py-6">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/">Home</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>Teams</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<Teams teams={teams} />
		</div>
	);
}
