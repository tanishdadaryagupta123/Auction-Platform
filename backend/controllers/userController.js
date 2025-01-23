import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import cloudinary from "cloudinary";
import { generateToken } from "../utils/jwtToken.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    let avatar = {};

    // Log request data (without sensitive info)
    console.log('Registration attempt:', { 
      name, 
      email, 
      role,
      hasAvatar: !!req.files?.avatar 
    });

    if (req.files && req.files.avatar) {
      try {
        const result = await cloudinary.v2.uploader.upload(
          req.files.avatar.tempFilePath,
          {
            folder: "avatars",
            width: 150,
            crop: "scale",
          }
        );
        
        avatar = {
          public_id: result.public_id,
          url: result.secure_url,
        };
      } catch (cloudinaryError) {
        console.error('Cloudinary Upload Error:', cloudinaryError);
        return res.status(400).json({
          success: false,
          message: "Error uploading image",
          error: cloudinaryError.message
        });
      }
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email"
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      avatar: Object.keys(avatar).length > 0 ? avatar : undefined
    });

    // Generate token
    const token = user.getJWTToken();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || "Registration failed",
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please fill full form."));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid credentials.", 400));
  }
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid credentials.", 400));
  }
  generateToken(user, "Login successfully.", 200, res);
});

export const getProfile = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logout Successfully.",
    });
});

export const fetchLeaderboard = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find({ moneySpent: { $gt: 0 } });
  const leaderboard = users.sort((a, b) => b.moneySpent - a.moneySpent);
  res.status(200).json({
    success: true,
    leaderboard,
  });
});