import mongoose from 'mongoose';

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI, { 
			dbName: 'goals-app' 
		});
		console.log(`MongoDB connected: ${conn.connection.host}`);
		return conn;
	} catch (error) {
		console.error('MongoDB connection error:', error);
		process.exit(1);
	}
};

export default connectDB;
