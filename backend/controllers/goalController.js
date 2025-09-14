import { Goal } from '../models/goalModel.js';
import { User } from '../models/userModel.js';

// GET get goals /api/goals private
const getGoals = async (c) => {
	try {
		const user = c.get('user'); // Assuming user is set by protect middleware
		const goals = await Goal.find({ user: user.id });
		return c.json(goals, 200);
	} catch (error) {
		return c.json({ error: error.message }, 500);
	}
};

// POST set goals /api/goals private
const setGoal = async (c) => {
	try {
		const user = c.get('user');
		const { text } = await c.req.json();
		if (!text) {
			return c.json({ error: 'add text' }, 400);
		}
		const goal = await Goal.create({
			text,
			user: user.id,
		});
		return c.json(goal, 200);
	} catch (error) {
		return c.json({ error: error.message }, 500);
	}
};

// PUT update goals /api/goals/:id private
const updateGoal = async (c) => {
	try {
		const user = c.get('user');
		const goal = await Goal.findById(c.req.param('id'));
		if (!goal) {
			return c.json({ error: 'goal not found' }, 400);
		}
		if (!user) {
			return c.json({ error: 'user not found' }, 401);
		}
		if (goal.user.toString() !== user.id) {
			return c.json({ error: 'user not authorized' }, 401);
		}
		const updatedGoal = await Goal.findByIdAndUpdate(
			c.req.param('id'),
			await c.req.json(),
			{
				new: true,
			}
		);
		return c.json(updatedGoal, 200);
	} catch (error) {
		return c.json({ error: error.message }, 500);
	}
};

// DELETE delete goals /api/goals/:id private
const deleteGoal = async (c) => {
	try {
		const user = c.get('user');
		const goal = await Goal.findById(c.req.param('id'));
		if (!goal) {
			return c.json({ error: 'goal not found' }, 400);
		}
		if (!user) {
			return c.json({ error: 'user not found' }, 401);
		}
		if (goal.user.toString() !== user.id) {
			return c.json({ error: 'user not authorized' }, 401);
		}
		await goal.deleteOne();
		return c.json({ id: c.req.param('id') }, 200);
	} catch (error) {
		return c.json({ error: error.message }, 500);
	}
};

export { getGoals, setGoal, updateGoal, deleteGoal };
