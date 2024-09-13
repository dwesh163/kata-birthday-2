'use server';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Settings from '@/components/settings';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import getSettings from '@/lib/settings';

export default async function SettingsPage() {
	const session = await auth();

	if (!session) {
		return redirect('/login');
	}

	const settings = await getSettings(session?.user.sciper);

	return (
		<div className="w-full h-full">
			<Breadcrumb className="px-10 pt-6">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/">Home</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink href="/settings">Settings</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>Me</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<Settings session={session} baseSettings={settings} />
		</div>
	);
}
