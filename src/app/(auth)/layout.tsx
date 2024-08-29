'use client';
import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import React from 'react';

export default function RootLayout({ children, session }: { children: ReactNode; session?: Session }) {
	return (
		<SessionProvider session={session}>
			<main>{children}</main>
		</SessionProvider>
	);
}
