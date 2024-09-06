import mongoose, { set } from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
	id: String,
	name: String,
	username: String,
	jobTitle: String,
	email: String,
	birthday: Date,
	unit: String,
	sciper: String,
	image: String,
	settings: {
		email: {
			notification: { type: Boolean, default: true },
			sendAt: { type: String, default: '09:00' },
		},
		telegram: {
			notification: { type: Boolean, default: false },
			sendAt: { type: String, default: '09:00' },
			chatId: String,
		},
		push: {
			notification: { type: Boolean, default: false },
			sendAt: { type: String, default: '09:00' },
		},
	},
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
