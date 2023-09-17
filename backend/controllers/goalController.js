const asyncHandler = require('express-async-handler');
const Goal = require('../models/goalModel');
const User = require('../models/userModel');

// GET get goals /api/goals private
const getGoals = asyncHandler(async (req, res) => {
	const goals = await Goal.find({ user: req.user.id });
	res.status(200).json(goals);
});
// POST set goals /api/goals private
const setGoal = asyncHandler(async (req, res) => {
	if (!req.body.text) {
		res.status(400);
		throw new Error('add text');
	}
	const goal = await Goal.create({
		text: req.body.text,
		user: req.user.id,
	});
	res.status(200).json(goal);
});
// PUT update goals /api/goals/:id private
const updateGoal = asyncHandler(async (req, res) => {
	const goal = await Goal.findById(req.params.id);
	if (!goal) {
		res.status(400);
		throw new Error('goal not found');
	}
	// check for user
	if (!req.user) {
		res.status(401);
		throw new Error('user not found');
	}
	// ensure logged in user matches goal user
	if (goal.user.toString() !== req.user.id) {
		res.status(401);
		throw new Error('user not authorized');
	}
	const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
	});
	res.status(200).json(updatedGoal);
});
// DELETE delete goals /api/goals/:id private
const deleteGoal = asyncHandler(async (req, res) => {
	const goal = await Goal.findById(req.params.id);
	if (!goal) {
		res.status(400);
		throw new Error('goal not found');
	}
	if (!req.user) {
		res.status(401);
		throw new Error('user not found');
	}
	// ensure logged in user matches goal user
	if (goal.user.toString() !== req.user.id) {
		res.status(401);
		throw new Error('user not authorized');
	}
	await goal.remove();
	res.status(200).json({ id: req.params.id });
});
// export
module.exports = {
	getGoals,
	setGoal,
	updateGoal,
	deleteGoal,
};
