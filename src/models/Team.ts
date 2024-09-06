import mongoose from 'mongoose';

const { Schema } = mongoose;

const TeamSchema = new Schema({
	name: String,
	owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	members: [
		{
			user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
			role: { type: String, enum: ['member', 'admin', 'superadmin'], default: 'member' },
			hasNotification: { type: Boolean, default: true },
			isMuted: { type: Boolean, default: false },
		},
	],
	createdAt: { type: Date, default: Date.now },
});

export const Team = mongoose.models.Team || mongoose.model('Team', TeamSchema);
