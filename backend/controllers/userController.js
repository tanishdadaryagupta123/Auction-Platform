import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import cloudinary from "cloudinary";
import { generateToken } from "../utils/jwtToken.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  try {
    const { 
      userName, 
      email, 
      phone, 
      password, 
      address, 
      role = "Bidder",
      bankAccountName,
      bankAccountNumber,
      bankName,
      reservepayAccountNumber,
      paypalEmail
    } = req.body;

    // Log the received data
    console.log('Registration Data:', {
      userName,
      email,
      phone,
      address,
      role,
      hasPaymentDetails: !!bankAccountName
    });

    // Validate required fields
    if (!userName || !email || !password || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields"
      });
    }

    // Validate role
    if (role && !["Bidder", "Auctioneer"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role specified"
      });
    }

    let profileImage = undefined;

    if (req.files && req.files.profileImage) {
      try {
        const result = await cloudinary.v2.uploader.upload(
          req.files.profileImage.tempFilePath,
          {
            folder: "avatars",
            width: 150,
            crop: "scale",
          }
        );
        
        profileImage = {
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

    // Create user data object
    const userData = {
      userName,
      email,
      phone,
      password,
      address,
      role: role || "Bidder",
      profileImage
    };

    // Add payment methods if role is Auctioneer
    if (role === "Auctioneer") {
      userData.paymentMethods = {
        bankTransfer: {
          bankAccountNumber,
          bankAccountName,
          bankName,
        },
        reservepay: {
          reservepayAccountNumber,
        },
        paypal: {
          paypalEmail,
        },
      };
    }

    const user = await User.create(userData);
    const token = user.getJWTToken();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage
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

  const token = user.getJWTToken();

  // Set cookie options
  const options = {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : undefined
  };

  res
    .status(200)
    .cookie("token", token, options)
    .json({
      success: true,
      message: "Login successfully.",
      token,
      user
    });
});

export const getProfile = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  try {
    // Clear the cookie with appropriate settings
    res
      .status(200)
      .cookie("token", "", {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: true, // Always use secure in production
        sameSite: 'none', // Required for cross-site
        path: '/',
        domain: process.env.NODE_ENV === 'production' ? '.vercel.app' : undefined
      })
      .json({
        success: true,
        message: "Logged out successfully"
      });
  } catch (error) {
    next(error);
  }
});

export const fetchLeaderboard = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find({ moneySpent: { $gt: 0 } });
  const leaderboard = users.sort((a, b) => b.moneySpent - a.moneySpent);
  res.status(200).json({
    success: true,
    leaderboard,
  });
});