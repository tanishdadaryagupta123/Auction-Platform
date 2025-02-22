import { config } from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { connection } from "./database/connection.js";
import { errorMiddleware } from "./middlewares/error.js";
import userRouter from "./router/userRoutes.js";
import auctionItemRouter from "./router/auctionItemRoutes.js";
import bidRouter from "./router/bidRoutes.js";
import commissionRouter from "./router/commissionRouter.js";
import superAdminRouter from "./router/superAdminRoutes.js";
import { endedAuctionCron } from "./automation/endedAuctionCron.js";
import { verifyCommissionCron } from "./automation/verifyCommissionCron.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
config({
  path: "./config/config.env",
});
// cors is used to connect frontend and backend
app.use(
  cors({
    origin: [
      "https://auction-platform-neon.vercel.app",
      "https://auction-platform-ruddy.vercel.app",
      "http://localhost:3000"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type", 
      "Authorization", 
      "x-csrf-token",
      "Access-Control-Allow-Headers",
      "Origin",
      "Accept",
      "X-Requested-With"
    ],
    exposedHeaders: ["set-cookie"],
    optionsSuccessStatus: 200
  })
);

// Remove the generic CORS middleware and replace with specific headers
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && origin.match(/auction-platform.*\.vercel\.app$/)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

app.use(cookieParser()); // this is used to access the cookies. because we dont use cookieparser so cookie is only generate but we dont access.
app.use(express.json());// it help to return the data in json formate. we dont use this so we dont access the data
app.use(express.urlencoded({ extended: true }));//it help to check the data in same formate.
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max-file-size
    debug: process.env.NODE_ENV === 'development',
    createParentPath: true,
    parseNested: true
  })
);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/auctionitem", auctionItemRouter);
app.use("/api/v1/bid", bidRouter);
app.use("/api/v1/commission", commissionRouter);
app.use("/api/v1/superadmin", superAdminRouter);

endedAuctionCron();
verifyCommissionCron();
connection();

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    status: 'success',
    message: 'Auction Platform API is running'
  });
});

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal server error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Add at the end of your routes
app.use(errorMiddleware);

// Add a catch-all error handler for unhandled routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

export default app;