const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
	info: (message, ...args) => {
		console.log(`[INFO] ${new Date().toISOString()}: ${message}`, ...args);
	},
	
	error: (message, error = null) => {
		console.error(`[ERROR] ${new Date().toISOString()}: ${message}`);
		if (error && isDevelopment) {
			console.error(error);
		}
	},
	
	warn: (message, ...args) => {
		console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, ...args);
	},
	
	debug: (message, ...args) => {
		if (isDevelopment) {
			console.debug(`[DEBUG] ${new Date().toISOString()}: ${message}`, ...args);
		}
	}
};
