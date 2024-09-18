'use client';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslations } from 'next-intl';
import { UserType } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Bell, BellOff, FilePen, LogOut, Trash } from 'lucide-react';
import { UserSearch } from './userSearch';
import { UnitSearch } from './unitSearch';
import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';

export default function Team({ team, users }: { team: { name: string; owner: string }; users: UserType[] }) {
	const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
	const t = useTranslations('Team');
	const roles = ['superadmin', 'admin', 'member'];
	const router = useRouter();

	const handleRoleChange = (sciper: string, role: string) => {
		console.log(role);
	};

	const params = useParams();

	function onUserSelect(user: UserType) {
		fetch(`/api/teams/${params.teamId}/user`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(user),
		}).then((response) => {
			if (!response.ok) {
				console.error('Failed to add user:', response.statusText);
			} else {
				router.refresh();
				setIsAddUserDialogOpen(false);
			}
		});
	}

	function removeUser(sciper: string) {
		fetch(`/api/teams/${params.teamId}/user/${sciper}`, {
			method: 'DELETE',
		}).then((response) => {
			if (!response.ok) {
				console.error('Failed to remove user:', response.statusText);
			} else {
				router.refresh();
			}
		});
	}

	return (
		<div className="flex-1 bg-background p-6 md:p-10 md:pt-4 pt-1">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="font-semibold text-[30px]">{team.name}</h1>
					<p className="text-sm">{t('owned', { owner: team.owner })}</p>
				</div>
				<div className="flex items-center justify-center gap-2">
					<Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
						<DialogTrigger asChild>
							<Button>{t('import.one.title')}</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[625px] gap-0">
							<DialogHeader>
								<DialogTitle>{t('import.one.title')}</DialogTitle>
								<DialogDescription>{t('import.one.description')}</DialogDescription>
							</DialogHeader>
							<UserSearch onSelect={onUserSelect} />
						</DialogContent>
					</Dialog>
					<Dialog>
						<DialogTrigger asChild>
							<Button disabled>{t('import.unit.title')}</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[625px] gap-0">
							<DialogHeader>
								<DialogTitle>{t('import.unit.title')}</DialogTitle>
								<DialogDescription>{t('import.unit.description')}</DialogDescription>
							</DialogHeader>
							<UnitSearch />
						</DialogContent>
					</Dialog>
				</div>
			</div>
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
													<Button variant="outline" size="icon" onClick={() => removeUser(user.sciper)}>
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
