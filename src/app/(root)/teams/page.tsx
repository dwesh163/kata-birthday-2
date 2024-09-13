'use server';
import Teams from '@/components/teams';
import { auth } from '@/lib/auth';
import { getTeams } from '@/lib/team';
import { ErrorType, TeamsType } from '@/types';
import { redirect } from 'next/navigation';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Link from 'next/link';

export default async function TeamsPage() {
	const session = await auth();
	if (!session) {
		redirect('/login');
	}
	const teams = (await getTeams(session.user.sciper)) as TeamsType[];

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
