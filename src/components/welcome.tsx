'use client';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { FilePen, PenIcon } from 'lucide-react';
import { BirthdayType, SettingsType, TeamsType } from '@/types';
import Link from 'next/link';

export default function Welcome({ nextBirthdays, teams, settings }: { nextBirthdays: BirthdayType[]; teams: TeamsType[]; settings: SettingsType }) {
	const t = useTranslations('Welcome');

	return (
		<div className="flex-1 bg-background p-6 md:p-10">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<Card>
					<CardHeader>
						<CardTitle>{t('upcoming.title')}</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid gap-4">
							{nextBirthdays.map((user, index) => (
								<div className="flex items-center gap-4" key={'user' + index}>
									<Avatar>
										<AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
										<AvatarFallback>
											{user.name
												.split(' ')
												.slice(0, 2)
												.map((word) => word.charAt(0).toUpperCase())
												.join('')}
										</AvatarFallback>
									</Avatar>
									<div>
										<p className="font-medium">{user.name}</p>
										<p className="text-muted-foreground text-sm">{t('upcoming.birthday', { birthday: new Date(user.birthday) })}</p>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>{t('teams')}</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid gap-4">
							{teams.map((team, index) => (
								<div className="flex items-center gap-4" key={'team' + index}>
									<Avatar>
										<AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
										<AvatarFallback>
											{team.name
												.split(' ')
												.slice(0, 2)
												.map((word) => word.charAt(0).toUpperCase())
												.join('')}
										</AvatarFallback>
									</Avatar>
									<div>
										<p className="font-medium">{team.name}</p>
										<p className="text-muted-foreground text-sm">{team.members} members</p>
									</div>
									{team.role.includes('admin') && (
										<Button asChild variant="ghost" size="icon" className="ml-auto text-gray-400 hover:text-gray-500">
											<Link href={`/teams/${team.id}`}>
												<FilePen className="w-5 h-5" />
												<span className="sr-only">Edit</span>
											</Link>
										</Button>
									)}
								</div>
							))}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>{t('settings.title')}</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid gap-4">
							<div className="flex items-center justify-between">
								<p>{t('settings.email')}</p>
								<Switch checked={settings.email.notification} />
							</div>
							<div className="flex items-center justify-between">
								<p>{t('settings.telegram')}</p>
								<Switch checked={settings.telegram.notification} />
							</div>
							<div className="flex items-center justify-between">
								<p>{t('settings.push')}</p>
								<Switch checked={settings.push.notification} />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
