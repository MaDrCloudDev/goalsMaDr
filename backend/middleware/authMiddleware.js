import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';

const protect = async (c, next) => {
	try {
		let token;
		const authHeader = c.req.header('authorization');
		if (authHeader && authHeader.startsWith('Bearer')) {
			token = authHeader.split(' ')[1];
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			const user = await User.findById(decoded.id).select(
				'-password'
			);
			if (!user) {
				return c.json({ error: 'not authorized' }, 401);
			}
			c.set('user', user);
			await next();
		} else {
			return c.json({ error: 'not authorized, no token' }, 401);
		}
	} catch (error) {
		console.log(error);
		return c.json({ error: 'not authorized' }, 401);
	}
};

export { protect };
