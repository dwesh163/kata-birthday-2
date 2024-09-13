import { User } from '@/models/User';
import { ErrorType, SettingsType } from '@/types';
import connectDB from './mongo';

export default async function getSettings(sciper: string): Promise<SettingsType> {
	await connectDB();
	const user = await User.findOne({ sciper: sciper });

	console.log('getSettings:', user);

	return user.settings;
}

export async function updateSettings(sciper: string, settings: SettingsType): Promise<ErrorType> {
	try {
		await connectDB();
		await User.updateOne({ sciper: sciper }, { settings });
	} catch (error) {
		return { error: 'internal', status: 500 };
	}

	return { error: '', status: 200 };
}
