import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { cn } from '@/lib/utils';

const fontHeading = Inter({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-heading',
});

const fontBody = Inter({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-body',
});

export const metadata: Metadata = {
	title: 'Birthminder',
	description: 'Never forget a birthday again!',
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const locale = await getLocale();

	const messages = await getMessages();

	return (
		<html lang={locale} style={{ height: '100%' }}>
			<body className={cn('antialiased h-full', fontHeading.className, fontBody.className)}>
				<NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
			</body>
		</html>
	);
}
