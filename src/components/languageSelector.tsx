import React, { useEffect, useState } from 'react';
import { setLocaleCookie } from '@/lib/cookie';

const getCookieValue = (name: string): string | undefined => {
	const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
	return match ? match[2] : undefined;
};

const LanguageSelector: React.FC = () => {
	const [locale, setLocale] = useState<string>('en');

	useEffect(() => {
		const cookieLocale = getCookieValue('locale');
		if (cookieLocale) {
			setLocale(cookieLocale);
		}
	}, []);

	const handleLocaleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
		const selectedLocale = event.target.value;
		setLocaleCookie(selectedLocale);
		setLocale(selectedLocale);

		window.location.reload();
	};

	return (
		<select onChange={handleLocaleChange} value={locale}>
			<option value="en">English</option>
			<option value="fr">Français</option>
		</select>
	);
};

export default LanguageSelector;
