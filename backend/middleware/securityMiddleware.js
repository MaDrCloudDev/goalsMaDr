export const securityHeaders = async (c, next) => {
	await next();
	
	c.res.headers.set('X-Content-Type-Options', 'nosniff');
	c.res.headers.set('X-Frame-Options', 'DENY');
	c.res.headers.set('X-XSS-Protection', '1; mode=block');
	c.res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	
	c.res.headers.delete('Server');
};

const rateLimitStore = new Map();

export const rateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
	return async (c, next) => {
		const clientIP = c.req.header('x-forwarded-for') || 
						c.req.header('x-real-ip') || 
						'unknown';
		
		const now = Date.now();
		const windowStart = now - windowMs;
		
		for (const [ip, requests] of rateLimitStore.entries()) {
			const filteredRequests = requests.filter(time => time > windowStart);
			if (filteredRequests.length === 0) {
				rateLimitStore.delete(ip);
			} else {
				rateLimitStore.set(ip, filteredRequests);
			}
		}
		
		const requests = rateLimitStore.get(clientIP) || [];
		const recentRequests = requests.filter(time => time > windowStart);
		
		if (recentRequests.length >= maxRequests) {
			return c.json({ error: 'Too many requests, please try again later' }, 429);
		}
		
		recentRequests.push(now);
		rateLimitStore.set(clientIP, recentRequests);
		
		await next();
	};
};
