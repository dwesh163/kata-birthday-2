import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BirthdayType } from '@/types';
import { useTranslations } from 'next-intl';

export default function Birthdays({ birthdays }: { birthdays: BirthdayType[] }) {
	const t = useTranslations('Birthdays');

	return (
		<div className="flex-1 bg-background p-6 md:p-10 md:pt-4 pt-1 -mt-7">
			<h1 className="font-semibold text-[30px]">{t('title')}</h1>
			<p className="text-sm">{t('description')}</p>
			<Table className="mt-5">
				<TableHeader>
					<TableRow className="hover:bg-white">
						<TableHead className="w-[25%]">{t('table.name')}</TableHead>
						<TableHead className="w-max">{t('table.birthday')}</TableHead>
						<TableHead className="w-3/5">{t('table.unit')}</TableHead>
						<TableHead>{t('table.job')}</TableHead>
					</TableRow>
				</TableHeader>
				{birthdays.length !== 0 && (
					<TableBody>
						{birthdays.map((user, index) => (
							<TableRow key={index} className="hover:bg-white">
								<TableCell className="w-max font-medium">{user.name}</TableCell>
								<TableCell>{t('content.birthday', { birthday: new Date(user.birthday) })}</TableCell>
								<TableCell className="text-gray-700">{user.unit ? user.unit : t('content.out')}</TableCell>
								<TableCell>{user.jobTitle}</TableCell>
							</TableRow>
						))}
					</TableBody>
				)}
			</Table>
			{birthdays.length === 0 && <div className="w-full text-center p-3">{t('empty')}</div>}
		</div>
	);
}
