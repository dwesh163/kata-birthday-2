import mongoose from 'mongoose';

const url = `mongodb://${process.env.MONGO_USER_USERNAME}:${process.env.MONGO_USER_PASSWORD}@${process.env.MONGO_HOST}:27017/${process.env.MONGO_DATABASE}?directConnection=true`;
export default async function connectDB() {
	console.log(url);
	await mongoose.connect(url);
}
