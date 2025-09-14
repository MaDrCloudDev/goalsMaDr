import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static';
import { cors } from 'hono/cors';
import mongoose from 'mongoose';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import goalRoutes from './routes/goalRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler } from './middleware/errorMiddleware.js';

// Get the directory of the current module
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = new Hono();

// Enable CORS for frontend
app.use('*', cors({ origin: 'http://localhost:3000' })); // Adjust to your frontend URL

// Serve static files from frontend/dist
app.use(
	'/*',
	serveStatic({ root: join(__dirname, '../frontend/dist') })
);

// API routes
app.route('/api/goals', goalRoutes);
app.route('/api/users', userRoutes);

// Error handling middleware
app.onError(errorHandler);

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI;
mongoose
	.connect(mongoUri, { dbName: 'goals-app' })
	.then(() => console.log('MongoDB connected'))
	.catch((err) => console.error('MongoDB connection error:', err));

// Fallback to serve index.html for SPA routing
app.get(
	'*',
	serveStatic({
		path: join(__dirname, '../frontend/dist/index.html'),
	})
);

export default {
	port: process.env.PORT || 5000,
	fetch: app.fetch,
};
