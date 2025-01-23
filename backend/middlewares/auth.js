import { User } from "../models/userSchema.js";
import jwt from "jsonwebtoken";
import ErrorHandler from "./error.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: "Please login to access this resource"
      });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login to access this resource"
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = await User.findById(decoded.id);
      
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "User not found"
        });
      }
      
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token"
      });
    }
  } catch (error) {
    console.error('Auth Error:', error);
    return res.status(500).json({
      success: false,
      message: "Authentication error"
    });
  }
});

export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
