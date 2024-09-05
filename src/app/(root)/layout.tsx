'use client';
import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import React from 'react';
import { Header } from '@/components/header';
import Sidebar from '@/components/sidebar';

export default function RootLayout({ children, session }: { children: ReactNode; session?: Session }) {
	return (
		<SessionProvider session={session}>
			<Header />
			<main className="flex sm:h-[calc(100%-90px)]">
				<Sidebar />
				{children}
			</main>
		</SessionProvider>
	);
}
