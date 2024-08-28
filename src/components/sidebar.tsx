'use client';
import { useTranslations } from 'next-intl';
import { Cake, Home, Settings, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
	const pathname = usePathname();
	const t = useTranslations('Sidebar');

	return (
		<aside className="w-1/5 space-y-2 border-r p-4">
			<nav className="space-y-2 w-full">
				<Link href="/" className={`px-6 py-3 rounded-lg flex text-primary-secondary font-medium w-full items-center justify-start gap-2 hover:bg-gray-200 hover:bg-opacity-50 ${pathname === '/' ? 'text-red-500' : ''}`}>
					<Home className="w-6 h-6 inline-block" />
					{t('overview')}
				</Link>
				<Link href="/teams" className={`px-6 py-3 rounded-lg flex text-primary-secondary font-medium w-full items-center justify-start gap-2 hover:bg-gray-200 hover:bg-opacity-50 ${pathname.includes('teams') ? 'text-red-500' : ''}`}>
					<Users className="w-6 h-6 inline-block" />
					{t('teams')}
				</Link>
				<Link href="/birthdays" className={`px-6 py-3 rounded-lg flex text-primary-secondary font-medium w-full items-center justify-start gap-2 hover:bg-gray-200 hover:bg-opacity-50 ${pathname === '/birthdays' ? 'text-red-500' : ''}`}>
					<Cake className="w-6 h-6 inline-block" />
					{t('birthdays')}
				</Link>
				<Link href="/settings" className={`px-6 py-3 rounded-lg flex text-primary-secondary font-medium w-full items-center justify-start gap-2 hover:bg-gray-200 hover:bg-opacity-50 ${pathname === '/settings' ? 'text-red-500' : ''}`}>
					<Settings className="w-6 h-6 inline-block" />
					{t('settings')}
				</Link>
			</nav>
		</aside>
	);
}
