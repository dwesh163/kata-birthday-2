import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
	try {
		const token = await getToken({
			req,
			secret: process.env.NEXTAUTH_SECRET!,
			secureCookie: process.env.NODE_ENV === 'production',
			salt: process.env.NODE_ENV === 'production' ? '__Secure-authjs.session-token' : 'authjs.session-token',
		});

		const url = new URL(req.url);
		console.log('oken', token);

		if (url.pathname === '/login') {
			return NextResponse.next();
		}

		if (!token?.email) {
			return NextResponse.redirect(new URL('/login', req.url));
		}

		return NextResponse.next();
	} catch (error) {
		console.error('Error while checking token:', error);
		return NextResponse.redirect(new URL('/error', req.url));
	}
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		'/((?!api|_next/static|_next/image|error|favicon.ico).*)',
	],
};
