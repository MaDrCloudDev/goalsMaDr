const errorHandler = async (err, c) => {
	console.error('Error:', err);
	
	let statusCode = 500;
	let message = 'Internal Server Error';

	if (err.name === 'ValidationError') {
		statusCode = 400;
		message = Object.values(err.errors).map(val => val.message).join(', ');
	} else if (err.name === 'CastError') {
		statusCode = 400;
		message = 'Invalid ID format';
	} else if (err.code === 11000) {
		statusCode = 400;
		message = 'Duplicate field value';
	} else if (err.name === 'JsonWebTokenError') {
		statusCode = 401;
		message = 'Invalid token';
	} else if (err.name === 'TokenExpiredError') {
		statusCode = 401;
		message = 'Token expired';
	} else if (err.message) {
		message = err.message;
	}

	return c.json(
		{
			message,
			...(process.env.NODE_ENV === 'development' && { stack: err.stack })
		},
		statusCode
	);
};

export { errorHandler };
