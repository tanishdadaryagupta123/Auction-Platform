import mongoose from "mongoose";

export const connection = async () => {
  try {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const uri = isDevelopment 
      ? process.env.MONGO_URI 
      : process.env.MONGODB_ATLAS_URI; // Use different env var for production

    if (!uri) {
      throw new Error('MongoDB URI is not defined');
    }

    await mongoose.connect(uri, {
      dbName: isDevelopment ? "MERN_AUCTION_PLATFORM" : undefined,
    });

    console.log('MongoDB Connected Successfully');
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`Database Host: ${mongoose.connection.host}`);
    return true;
  } catch (error) {
    console.error("Database connection error:", error);
    
    // Log detailed error information
    if (error.name === 'MongoServerSelectionError') {
      console.error('MongoDB Connection Details:');
      console.error(`Environment: ${process.env.NODE_ENV}`);
      console.error(`Error Code: ${error.code}`);
      console.error(`Error Message: ${error.message}`);
      if (error.reason) {
        console.error('Reason:', error.reason);
      }
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
