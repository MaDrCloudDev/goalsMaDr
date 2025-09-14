const errorHandler = async (err, c) => {
	const statusCode =
		c.res.statusCode && c.res.statusCode !== 200
			? c.res.statusCode
			: 500;
	return c.json(
		{
			message: err.message,
			stack: process.env.NODE_ENV === 'production' ? null : err.stack,
		},
		statusCode
	);
};

export { errorHandler };
