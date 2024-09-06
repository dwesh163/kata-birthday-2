import { auth } from '@/lib/auth';
import { updateSettings } from '@/lib/settings';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	const settings = await req.json();
	const session = await auth();

	if (!session) {
		return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
	}

	if (!settings) {
		return NextResponse.json({ error: 'No settings provided' }, { status: 400 });
	}

	const update = await updateSettings(session.user.email, { email: { notification: settings.email.notification, sendAt: settings.email.sendAt }, telegram: { notification: settings.telegram.notification, sendAt: settings.telegram.sendAt, chatId: settings.telegram.chatId }, push: { notification: settings.push.notification, sendAt: settings.push.sendAt } });

	if (update.error != '') {
		return NextResponse.json(update.error, { status: 500 });
	}

	return NextResponse.json({ error: 'success' });
}
