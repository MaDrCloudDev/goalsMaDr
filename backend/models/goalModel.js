import mongoose from 'mongoose';

const goalSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
		text: {
			type: String,
			required: [true, 'please add text'],
		},
	},
	{
		timestamps: true,
	}
);

export const Goal = mongoose.model('Goal', goalSchema);
