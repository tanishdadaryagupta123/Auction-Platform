import mongoose from "mongoose";

export const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected Successfully');
    console.log(`Environment: ${process.env.NODE_ENV}`);
  } catch (error) {
    console.error("Database connection error:", error);
    if (error.name === 'MongoServerSelectionError') {
      console.error('Could not connect to MongoDB server. Please check:');
      console.error('1. MongoDB URI is correct');
      console.error('2. Network connectivity');
      console.error('3. MongoDB server is running');
    }
    
    if (process.env.NODE_ENV === 'production') {
      console.log('Retrying connection in 5 seconds...');
      setTimeout(connection, 5000);
    } else {
      console.log('Please make sure MongoDB is running locally');
      process.exit(1);
    }
  }
};
