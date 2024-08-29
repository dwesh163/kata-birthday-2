'use client';
import React, { useEffect, useState } from 'react';
import { setLocaleCookie } from '@/lib/cookie';
import { useSession } from 'next-auth/react';

const getCookieValue = (name: string): string | undefined => {
	const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
	return match ? match[2] : undefined;
};

export const LanguageSelector: React.FC = () => {
	const [locale, setLocale] = useState<string>('en');
	const { status } = useSession();

	useEffect(() => {
		const cookieLocale = getCookieValue('locale');
		if (cookieLocale) {
			setLocale(cookieLocale);
		}
	}, []);

	const changeLocale = (newLocale: string): void => {
		setLocaleCookie(newLocale);
		setLocale(newLocale);

		window.location.reload();
	};

	return (
		<nav className="ml-auto flex items-center space-x-4">
			<ul className="flex items-center space-x-1">
				<li>
					<button onClick={() => changeLocale('fr')} className={`cursor-pointer font-bold ${locale === 'fr' && status != 'loading' ? 'text-red-500' : 'hover:text-gray-400 text-gray-300'}`}>
						FR
					</button>
				</li>
				<span className="border-l-2 border-solid h-4 w-1 border-gray-300"></span>
				<li>
					<button onClick={() => changeLocale('en')} className={`cursor-pointer -ml-0.5 font-bold ${locale === 'en' && status != 'loading' ? 'text-red-500' : 'hover:text-gray-400 text-gray-300'}`}>
						EN
					</button>
				</li>
			</ul>
		</nav>
	);
};
