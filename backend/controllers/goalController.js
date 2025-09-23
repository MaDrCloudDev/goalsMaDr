import { Goal } from '../models/goalModel.js';

const getGoals = async (c) => {
	try {
		const user = c.get('user');
		const url = new URL(c.req.url);
		const limitParam = url.searchParams.get('limit');
		const cursor = url.searchParams.get('cursor');
		const limit = Math.min(Math.max(Number(limitParam) || 20, 1), 100);

		const query = { user: user.id };
		if (cursor) {
			const cursorDate = new Date(cursor);
			if (!isNaN(cursorDate.getTime())) {
				query.createdAt = { $lt: cursorDate };
			}
		}

		const items = await Goal.find(query)
			.sort({ createdAt: -1 })
			.limit(limit);

		const nextCursor = items.length === limit ? items[items.length - 1].createdAt : null;
		return c.json({ items, nextCursor }, 200);
	} catch (error) {
		return c.json({ error: error.message }, 500);
	}
};

const setGoal = async (c) => {
	try {
		const user = c.get('user');
		const { text, note = '', completed = false } = await c.req.json();
		if (!text || typeof text !== 'string' || text.trim().length === 0) {
			return c.json({ error: 'Text is required' }, 400);
		}
		if (typeof note !== 'string' || note.length > 1000) {
			return c.json({ error: 'Note must be a string up to 1000 characters' }, 400);
		}
		if (typeof completed !== 'boolean') {
			return c.json({ error: 'Completed must be a boolean' }, 400);
		}
		const goal = await Goal.create({
			text,
			note,
			completed,
			completedAt: completed ? new Date() : null,
			user: user.id,
		});
		return c.json(goal, 201);
	} catch (error) {
		return c.json({ error: error.message }, 500);
	}
};

const updateGoal = async (c) => {
	try {
		const user = c.get('user');
		const goal = await Goal.findById(c.req.param('id'));
		if (!goal) {
			return c.json({ error: 'Goal not found' }, 404);
		}
		if (!user) {
			return c.json({ error: 'User not found' }, 401);
		}
		if (goal.user.toString() !== user.id) {
			return c.json({ error: 'Not authorized' }, 401);
		}
		const body = await c.req.json();
		const updates = {};
		if (typeof body.text !== 'undefined') {
			if (typeof body.text !== 'string' || body.text.trim().length === 0) {
				return c.json({ error: 'Text is required' }, 400);
			}
			updates.text = body.text;
		}
		if (typeof body.note !== 'undefined') {
			if (typeof body.note !== 'string' || body.note.length > 1000) {
				return c.json({ error: 'Note must be a string up to 1000 characters' }, 400);
			}
			updates.note = body.note;
		}
		if (typeof body.completed !== 'undefined') {
			if (typeof body.completed !== 'boolean') {
				return c.json({ error: 'Completed must be a boolean' }, 400);
			}
			updates.completed = body.completed;
		}
		// Handle completedAt based on completed change
		if (typeof updates.completed !== 'undefined' && updates.completed !== goal.completed) {
			updates.completedAt = updates.completed ? new Date() : null;
		}
		const updatedGoal = await Goal.findByIdAndUpdate(c.req.param('id'), { $set: updates }, { new: true });
		return c.json(updatedGoal, 200);
	} catch (error) {
		return c.json({ error: error.message }, 500);
	}
};

const deleteGoal = async (c) => {
	try {
		const user = c.get('user');
		const goal = await Goal.findById(c.req.param('id'));
		if (!goal) {
			return c.json({ error: 'Goal not found' }, 404);
		}
		if (!user) {
			return c.json({ error: 'User not found' }, 401);
		}
		if (goal.user.toString() !== user.id) {
			return c.json({ error: 'Not authorized' }, 401);
		}
		await goal.deleteOne();
		return c.body(null, 204);
	} catch (error) {
		return c.json({ error: error.message }, 500);
	}
};

export { getGoals, setGoal, updateGoal, deleteGoal };
