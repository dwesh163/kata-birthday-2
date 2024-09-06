'use server';
import { auth } from '@/lib/auth';
import { BirthdayType } from '@/types';
import { redirect } from 'next/navigation';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { getBirthdays } from '@/lib/birthdays';
import { useTranslations } from 'next-intl';
import Birthdays from '@/components/birthdays';

export default async function BirthdaysPage() {
	const session = await auth();
	if (!session) {
		redirect('/login');
	}
	const birthdays = (await getBirthdays(session?.user?.sciper as string)) as BirthdayType[];

	return (
		<div className="w-full">
			<Breadcrumb className="px-10 py-6">
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/">Home</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>Birthdays</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<Birthdays birthdays={birthdays} />
		</div>
	);
}
