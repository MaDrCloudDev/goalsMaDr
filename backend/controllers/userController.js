import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/userModel.js';

// POST add user /api/users public
const registerUser = async (c) => {
	try {
		const { name, email, password } = await c.req.json();
		if (!name || !email || !password) {
			return c.json({ error: 'please add all fields' }, 400);
		}
		const userExists = await User.findOne({ email });
		if (userExists) {
			return c.json({ error: 'user already exists' }, 400);
		}
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		const user = await User.create({
			name,
			email,
			password: hashedPassword,
		});
		if (user) {
			return c.json(
				{
					_id: user.id,
					name: user.name,
					email: user.email,
					token: generateToken(user._id),
				},
				201
			);
		}
		return c.json({ error: 'invalid user data' }, 400);
	} catch (error) {
		return c.json({ error: error.message }, 500);
	}
};

// POST authenticate user /api/users/login public
const loginUser = async (c) => {
	try {
		const { email, password } = await c.req.json();
		const user = await User.findOne({ email });
		if (user && (await bcrypt.compare(password, user.password))) {
			return c.json(
				{
					_id: user.id,
					name: user.name,
					email: user.email,
					token: generateToken(user._id),
				},
				200
			);
		}
		return c.json({ error: 'invalid credentials' }, 400);
	} catch (error) {
		return c.json({ error: error.message }, 500);
	}
};

// GET get user data /api/users/me private
const getMe = async (c) => {
	try {
		const user = c.get('user');
		return c.json(user, 200);
	} catch (error) {
		return c.json({ error: error.message }, 500);
	}
};

// generate JWT
const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: '30d',
	});
};

export { registerUser, loginUser, getMe };
