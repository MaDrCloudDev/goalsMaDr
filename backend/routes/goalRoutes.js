import { Hono } from 'hono';
import {
	getGoals,
	setGoal,
	updateGoal,
	deleteGoal,
} from '../controllers/goalController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = new Hono();
const express = require('express');
const router = express.Router();
const {
	getGoals,
	setGoal,
	updateGoal,
	deleteGoal,
} = require('../controllers/goalController');

const { protect } = require('../middleware/authMiddleware');
router.route('/').get(protect, getGoals).post(protect, setGoal);
router
	.route('/:id')
	.delete(protect, deleteGoal)
	.put(protect, updateGoal);
module.exports = router;

router.get('/', protect, getGoals);
router.post('/', protect, setGoal);
router.put('/:id', protect, updateGoal);
router.delete('/:id', protect, deleteGoal);

export default router;
