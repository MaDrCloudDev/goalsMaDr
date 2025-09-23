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

// SPA fallback: only for non-API, extension-less routes
app.get('*', async (c, next) => {
  const pathname = new URL(c.req.url).pathname;
  // If request is for API or looks like a static asset (has a dot), skip SPA fallback
  if (pathname.startsWith('/api') || pathname.includes('.')) {
    return next();
  }
  return (
    await serveStatic({
      path: join(__dirname, '../frontend/dist/index.html'),
    })
  )(c, next);
});

app.onError(errorHandler);

export default {
	port: process.env.PORT || 5000,
	fetch: app.fetch,
};

