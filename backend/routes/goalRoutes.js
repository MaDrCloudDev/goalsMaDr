import { Hono } from 'hono';
import {
	getGoals,
	setGoal,
	updateGoal,
	deleteGoal,
} from '../controllers/goalController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateGoal } from '../middleware/validationMiddleware.js';

const router = new Hono();

router.get('/', protect, getGoals);
router.post('/', protect, validateGoal, setGoal);
router.put('/:id', protect, validateGoal, updateGoal);
router.delete('/:id', protect, deleteGoal);

export default router;
