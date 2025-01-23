import mongoose from "mongoose";

export const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected Successfully');
    console.log(`Environment: ${process.env.NODE_ENV}`);
  } catch (error) {
    console.error("Database connection error:", error);
    if (process.env.NODE_ENV === 'production') {
      console.log('Retrying connection in 5 seconds...');
      setTimeout(connection, 5000);
    } else {
      console.log('Please make sure MongoDB is running locally');
      process.exit(1);
    }
  }
};
