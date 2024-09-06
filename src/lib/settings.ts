import { User } from '@/models/User';
import { ErrorType, SettingsType } from '@/types';
import connectDB from './mongo';

export default async function getSettings(email: string): Promise<SettingsType> {
	await connectDB();
	const user = await User.findOne({ email: email });

	console.log(user.settings);

	return user.settings;
}

export async function updateSettings(email: string, settings: SettingsType): Promise<ErrorType> {
	try {
		await connectDB();
		await User.updateOne({ email: email }, { settings });
	} catch (error) {
		return { error: 'internal', status: 500 };
	}

	return { error: '', status: 200 };
}
