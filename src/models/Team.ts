import mongoose from 'mongoose';

const { Schema } = mongoose;

const TeamSchema = new Schema({
	name: String,
	owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

	members: [
		{
			user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
			Authorization: { type: Number, default: 2 },
		},
	],
});

export const Team = mongoose.models.Team || mongoose.model('Team', TeamSchema);
