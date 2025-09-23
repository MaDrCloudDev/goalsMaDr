import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static';
import { cors } from 'hono/cors';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import goalRoutes from './routes/goalRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import { securityHeaders, rateLimit } from './middleware/securityMiddleware.js';
import { logger } from './utils/logger.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = new Hono();

await connectDB();

if (process.env.NODE_ENV === 'production') {
	app.use('*', securityHeaders);
	app.use('/api/*', rateLimit(100, 15 * 60 * 1000));
}

app.use(
	'*',
	cors({
		origin:
			process.env.NODE_ENV === 'production'
				? process.env.FRONTEND_URL
				: 'http://localhost:5173',
	})
);

app.use('*', async (c, next) => {
	const start = Date.now();
	await next();
	const duration = Date.now() - start;
	logger.info(`${c.req.method} ${c.req.url} - ${c.res.status} (${duration}ms)`);
});

app.get('/api/health', (c) => {
	return c.json({
		status: 'OK',
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
	});
});

app.route('/api/goals', goalRoutes);
app.route('/api/users', userRoutes);

app.use(
	'/*',
	serveStatic({
		root: join(__dirname, '../frontend/dist'),
		rewriteRequestPath: (path) => path,
	})
);

app.get(
	'*',
	serveStatic({
		path: join(__dirname, '../frontend/dist/index.html'),
	})
);

app.onError(errorHandler);

export default {
	port: process.env.PORT || 5000,
	fetch: app.fetch,
};

