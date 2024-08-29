import mongoose from 'mongoose';

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
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
