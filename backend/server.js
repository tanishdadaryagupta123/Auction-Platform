import app from "./app.js";
import cloudinary from "cloudinary";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables based on NODE_ENV
if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: './config/config.env' });
} else {
  // In production, use environment variables from Render
  dotenv.config();
}

// Configure cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Log Cloudinary configuration
console.log('Cloudinary Configuration:', {
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not Set',
  api_secret: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not Set'
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected Successfully');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return false;
  }
};

// Initialize server
const startServer = async () => {
  try {
    const isConnected = await connectDB();
    if (!isConnected) {
      console.error('Failed to connect to MongoDB');
      if (process.env.NODE_ENV === 'production') {
        console.log('Retrying server startup...');
        setTimeout(startServer, 5000);
        return;
      }
      process.exit(1);
    }

    const port = process.env.PORT || 5001;
    const server = app.listen(port, () => {
      console.log(`Server running on port ${port} in ${process.env.NODE_ENV} mode`);
      console.log(`MongoDB URI: ${process.env.NODE_ENV === 'production' ? 'Using Atlas' : 'Using Local'}`);
    });

    server.on('error', (error) => {
      console.error('Server Error:', error);
      process.exit(1);
    });
  } catch (error) {
    console.error('Server Startup Error:', error);
    if (process.env.NODE_ENV === 'production') {
      setTimeout(startServer, 5000);
    } else {
      process.exit(1);
    }
  }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  process.exit(0);
});