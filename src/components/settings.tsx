'use client';
import { toast } from 'sonner';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Mail, MessageSquare, SendIcon } from 'lucide-react';
import { Session } from 'next-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SettingsType } from '@/types';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

export default function Settings({ session, baseSettings }: { session: Session; baseSettings: SettingsType }) {
	const t = useTranslations('Settings');

	const router = useRouter();

	const [settings, setSettings] = useState(baseSettings);

	const handleEmailNotificationChange = (value: boolean) => {
		setSettings((prevSettings) => ({
			...prevSettings,
			email: { ...prevSettings.email, notification: value },
		}));
	};

	const handleTelegramNotificationChange = (value: boolean) => {
		setSettings((prevSettings) => ({
			...prevSettings,
			telegram: { ...prevSettings.telegram, notification: value },
		}));
	};

	const handlePushNotificationChange = (value: boolean) => {
		setSettings((prevSettings) => ({
			...prevSettings,
			push: { ...prevSettings.push, notification: value },
		}));
	};

	const handleEmailSendAtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSettings((prevSettings) => ({
			...prevSettings,
			email: { ...prevSettings.email, sendAt: e.target.value },
		}));
	};

	const handleTelegramSendAtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSettings((prevSettings) => ({
			...prevSettings,
			telegram: { ...prevSettings.telegram, sendAt: e.target.value },
		}));
	};

	const handlePushSendAtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSettings((prevSettings) => ({
			...prevSettings,
			push: { ...prevSettings.push, sendAt: e.target.value },
		}));
	};

	const handleChatIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSettings((prevSettings) => ({
			...prevSettings,
			telegram: { ...prevSettings.telegram, chatId: e.target.value },
		}));
	};

	const saveSettings = () => {
		fetch('/api/settings', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(settings),
		})
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				toast(t(data.error));
				router.refresh();
				return;
			})
			.catch((error) => {
				console.error('Failed to save settings:', error);
			});
	};

	return (
		<div className="p-10 py-12 pt-7">
			<div className="">
				<div className="flex justify-between items-center">
					<div className="flex items-center gap-4">
						<Avatar className="h-24 w-24">
							<AvatarImage src={session.user.image} />
							<AvatarFallback>
								{session.user.name
									.split(' ')
									.slice(0, 2)
									.map((word: string) => word.charAt(0).toUpperCase())
									.join('')}
							</AvatarFallback>
						</Avatar>
						<div className="space-y-1">
							<div className="text-3xl font-bold">{session.user.name}</div>
							<div className="text-xl text-muted-foreground">
								{session.user.jobTitle} &mdash; {session.user.unit}
							</div>
						</div>
					</div>
					<Button onClick={saveSettings}>{t('save')}</Button>
				</div>

				<h3 className="mb-3 mt-8 text-lg font-medium">{t('contact')}</h3>
				<div className="flex items-center gap-4 w-full justify-stretch">
					<Card className="w-full">
						<CardHeader>
							<CardTitle className="flex items-center justify-between gap-1">
								<div className="flex items-center gap-1">
									<Mail className="h-6 w-6" />
									<p className="text-xl font-medium">Email</p>
								</div>
								<Switch aria-label="Email notifications" onCheckedChange={handleEmailNotificationChange} checked={settings.email.notification} />
							</CardTitle>
						</CardHeader>
						<CardContent className="flex flex-col gap-3">
							<Input type="email" placeholder="Email" value={session.user.email} disabled />
							<div className="flex items-center gap-2">
								<p>Send at :</p>
								<Input type="time" disabled={!settings.email.notification} value={settings.email.sendAt} onChange={handleEmailSendAtChange} className="max-w-[110px]" />
							</div>
						</CardContent>
					</Card>

					<Card className="w-full">
						<CardHeader>
							<CardTitle className="flex items-center justify-between gap-1">
								<div className="flex items-center gap-1">
									<SendIcon className="h-6 w-6" />
									<p className="text-xl font-medium">Telegram</p>
								</div>
								<Switch aria-label="Telegram notifications" onCheckedChange={handleTelegramNotificationChange} checked={settings.telegram.notification} />
							</CardTitle>
						</CardHeader>
						<CardContent className="flex flex-col gap-3">
							<Input type="text" placeholder="Telegram ID" value={settings.telegram.chatId} onChange={handleChatIdChange} disabled={!settings.telegram.notification} />
							<div className="flex items-center gap-2">
								<p>Send at :</p>
								<Input type="time" disabled={!settings.telegram.notification} value={settings.telegram.sendAt} onChange={handleTelegramSendAtChange} className="max-w-[110px]" />
							</div>
						</CardContent>
					</Card>

					<Card className="w-full">
						<CardHeader>
							<CardTitle className="flex items-center justify-between gap-1">
								<div className="flex items-center gap-1">
									<MessageSquare className="h-6 w-6" />
									<p className="text-xl font-medium">Push Notifications</p>
								</div>
								<Switch aria-label="Push notifications" onCheckedChange={handlePushNotificationChange} checked={settings.push.notification} />
							</CardTitle>
						</CardHeader>
						<CardContent className="flex flex-col gap-3">
							<Input type="text" value="This device" disabled />
							<div className="flex items-center gap-2">
								<p>Send at :</p>
								<Input type="time" disabled={!settings.push.notification} value={settings.push.sendAt} onChange={handlePushSendAtChange} className="max-w-[110px]" />
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
