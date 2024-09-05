import mongoose from 'mongoose';

const url = `mongodb://${process.env.MONGO_USER_USERNAME}:${process.env.MONGO_USER_PASSWORD}@${process.env.MONGO_HOST}:27017/${process.env.MONGO_DATABASE}?directConnection=true`;
export default async function connectDB() {
	if (mongoose.connection.readyState >= 1) {
		return;
	}
	await mongoose.connect(url);
}
