'use client';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslations } from 'next-intl';
import { UserType } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Bell, BellOff, FilePen, LogOut, Trash } from 'lucide-react';

export default function Team({ team, users }: { team: { name: string; owner: string }; users: UserType[] }) {
	const t = useTranslations('Team');
	const roles = ['superadmin', 'admin', 'member'];

	const handleRoleChange = (sciper: string, role: string) => {
		console.log(role);
	};

	return (
		<div className="flex-1 bg-background p-6 md:p-10 md:pt-4 pt-1">
			<h1 className="font-semibold text-[30px]">{team.name}</h1>
			<p className="text-sm">{t('owned', { owner: team.owner })}</p>
			<Table className="mt-5">
				<TableHeader>
					<TableRow className="hover:bg-white">
						<TableHead className="w-[30%]">{t('table.name')}</TableHead>
						<TableHead className="">{t('table.birthday')}</TableHead>
						<TableHead className="">{t('table.unit')}</TableHead>
						<TableHead className="w-[150px]">{t('table.role')}</TableHead>
						<TableHead className="w-[150px]">{t('table.actions')}</TableHead>
					</TableRow>
				</TableHeader>
				{users == undefined ? (
					<TableCaption>{t('empty')}</TableCaption>
				) : (
					<TableBody>
						{users.map((user) => (
							<TableRow key={user.id} className="hover:bg-white">
								<TableCell className="w-max font-medium">{user.name}</TableCell>
								<TableCell>{t('content.birthday', { birthday: new Date(user.birthday) })}</TableCell>
								<TableCell className="text-gray-700">{user.unit ? user.unit : t('content.out')}</TableCell>
								<TableCell>
									<Select onValueChange={(value) => handleRoleChange(user.sciper, value)} value={user.role}>
										<SelectTrigger className="w-[200px]">
											<SelectValue placeholder={t(`roles.${user.role}`)} />
										</SelectTrigger>

										<SelectContent>
											{roles.map((role) => (
												<SelectItem key={role} value={role}>
													{t(`roles.${role}`)}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-2">
										<TooltipProvider delayDuration={300}>
											<Tooltip>
												<TooltipTrigger asChild>
													<Button variant="outline" size="icon">
														{user.hasNotification ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
													</Button>
												</TooltipTrigger>
												<TooltipContent>{user.hasNotification ? <p>{t('actions.notification.off')}</p> : <p>{t('actions.notification.on')}</p>}</TooltipContent>
											</Tooltip>
										</TooltipProvider>
										<TooltipProvider delayDuration={300}>
											<Tooltip>
												<TooltipTrigger asChild>
													<Button variant="outline" size="icon">
														<LogOut className="h-4 w-4" />
													</Button>
												</TooltipTrigger>
												<TooltipContent>
													<p>{t('actions.remove')}</p>
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				)}
			</Table>
		</div>
	);
}
