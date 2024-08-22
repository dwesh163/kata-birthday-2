import type { Metadata } from 'next';
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

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="max-h-screen">
			<body className={cn('antialiased', fontHeading.className, fontBody.className)}>{children}</body>
		</html>
	);
}
