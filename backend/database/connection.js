import mongoose from "mongoose";

export const connection = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "MERN_AUCTION_PLATFORM"
    });

    console.log(`MongoDB connected with host: ${connection.host}`);
    console.log(`Database: ${connection.name}`);
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
