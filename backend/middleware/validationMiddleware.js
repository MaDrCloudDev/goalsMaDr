export const validateGoal = async (c, next) => {
	const body = await c.req.json();
	
	if (!body.text || typeof body.text !== 'string' || body.text.trim().length === 0) {
		return c.json({ error: 'Goal text is required and must be a non-empty string' }, 400);
	}
	
	if (body.text.length > 500) {
		return c.json({ error: 'Goal text must be less than 500 characters' }, 400);
	}
	
	await next();
};

export const validateUser = async (c, next) => {
	const body = await c.req.json();
	
	if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
		return c.json({ error: 'Name is required and must be a non-empty string' }, 400);
	}
	
	if (!body.email || typeof body.email !== 'string') {
		return c.json({ error: 'Email is required' }, 400);
	}
	
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(body.email)) {
		return c.json({ error: 'Please provide a valid email address' }, 400);
	}
	
	if (!body.password || typeof body.password !== 'string' || body.password.length < 6) {
		return c.json({ error: 'Password must be at least 6 characters long' }, 400);
	}
	
	await next();
};

export const validateLogin = async (c, next) => {
	const body = await c.req.json();
	
	if (!body.email || !body.password) {
		return c.json({ error: 'Email and password are required' }, 400);
	}
	
	await next();
};
