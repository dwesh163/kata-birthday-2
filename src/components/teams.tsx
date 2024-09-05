'use client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslations } from 'next-intl';
import { TeamsType } from '@/types';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Bell, BellOff, FilePen, LogOut, Trash } from 'lucide-react';

export default function Teams({ teams }: { teams: TeamsType[] }) {
	const router = useRouter();
	const t = useTranslations('Teams');

	const handleRowClick = (id: number) => {
		router.push(`/teams/${id}`);
	};

	return (
		<div className="flex-1 bg-background p-6 md:p-10 md:pt-2 pt-0">
			<Button onClick={() => router.push('/teams/new')}>{t('create')}</Button>

			<Table>
				<TableHeader>
					<TableRow className="hover:bg-white">
						<TableHead className="w-[150px]">{t('table.name')}</TableHead>
						<TableHead className="w-[200px]">{t('table.owner')}</TableHead>
						<TableHead>{t('table.members')}</TableHead>
						<TableHead className="w-[100px]">{t('table.actions')}</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{teams.length !== 0 ? (
						teams.map((team) => (
							<TableRow key={team.id} className="hover:bg-white">
								<TableCell className="font-medium">{team.name}</TableCell>
								<TableCell className="text-gray-700">{team.owner}</TableCell>
								<TableCell>{team.members}</TableCell>
								<TableCell>
									<div className="flex items-center gap-2">
										<TooltipProvider delayDuration={300}>
											<Tooltip>
												<TooltipTrigger asChild>
													<Button variant="outline" size="icon">
														{team.isMuted ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
													</Button>
												</TooltipTrigger>
												<TooltipContent>{team.isMuted ? <p>{t('actions.unmute')}</p> : <p>{t('actions.mute')}</p>}</TooltipContent>
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
													<p>{t('actions.leave')}</p>
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
										{team.role === 'admin' ||
											(team.role === 'superAdmin' && (
												<TooltipProvider delayDuration={300}>
													<Tooltip>
														<TooltipTrigger asChild>
															<Button variant="outline" size="icon" onClick={() => handleRowClick(team.id)}>
																<FilePen className="h-4 w-4" />
															</Button>
														</TooltipTrigger>
														<TooltipContent>
															<p>{t('actions.edit')}</p>
														</TooltipContent>
													</Tooltip>
												</TooltipProvider>
											))}
										{team.role === 'superAdmin' && (
											<TooltipProvider delayDuration={300}>
												<Tooltip>
													<TooltipTrigger asChild>
														<Button variant="outline" size="icon">
															<Trash className="h-4 w-4" />
														</Button>
													</TooltipTrigger>
													<TooltipContent>
														<p>{t('actions.delete')}</p>
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										)}
									</div>
								</TableCell>
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell>{t('empty')}</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
