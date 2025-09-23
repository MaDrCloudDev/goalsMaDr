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
		note: {
			type: String,
			maxlength: 1000,
			default: '',
		},
		completed: {
			type: Boolean,
			default: false,
		},
		completedAt: {
			type: Date,
			default: null,
		},
	},
	{
		timestamps: true,
	}
);

export const Goal = mongoose.model('Goal', goalSchema);
