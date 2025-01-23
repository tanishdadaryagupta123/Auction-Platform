import mongoose from "mongoose";

export const connection = async () => {
  try {
    // Get MongoDB URI based on environment
    const uri = process.env.NODE_ENV === 'production' 
      ? process.env.MONGO_URI  // Use MongoDB Atlas in production
      : 'mongodb://127.0.0.1:27017/MERN_AUCTION_PLATFORM'; // Use local MongoDB in development

    await mongoose.connect(uri);
    console.log('MongoDB Connected Successfully');
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`Database Host: ${mongoose.connection.host}`);
    return true;
  } catch (error) {
    console.error("Database connection error:", error);
    if (error.name === 'MongoServerSelectionError') {
      console.error('Could not connect to MongoDB server. Please check:');
      console.error('1. MongoDB URI is correct');
      console.error('2. Network connectivity');
      console.error('3. MongoDB server is running');
      console.error('4. IP Whitelist in MongoDB Atlas');
    }
    
    if (process.env.NODE_ENV === 'production') {
      console.log('Retrying connection in 5 seconds...');
      setTimeout(connection, 5000);
    } else {
      console.log('Please make sure MongoDB is running locally');
      process.exit(1);
    }
    return false;
  }
};
