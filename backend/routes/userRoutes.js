import { Hono } from 'hono';
import {
	registerUser,
	loginUser,
	getMe,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateUser, validateLogin } from '../middleware/validationMiddleware.js';

const router = new Hono();

router.post('/', validateUser, registerUser);
router.post('/login', validateLogin, loginUser);
router.get('/me', protect, getMe);

export default router;
