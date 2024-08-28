import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
	name: String,
	email: String,
	birthday: Date,
	unit: String,
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
