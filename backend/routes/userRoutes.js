import { Hono } from 'hono';
import {
	registerUser,
	loginUser,
	getMe,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = new Hono();

router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

export default router;
