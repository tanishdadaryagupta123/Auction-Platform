import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
  },
  phone: {
    type: String,
    required: [true, "Please enter your phone number"],
  },
  address: {
    type: String,
    required: [true, "Please enter your address"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    select: false,
  },
  role: {
    type: String,
    enum: {
      values: ["Bidder", "Auctioneer"],
      message: "{VALUE} is not a valid role"
    },
    default: "Bidder",
    required: [true, "Role is required"]
  },
  profileImage: {
    public_id: String,
    url: String
  },
  paymentMethods: {
    bankTransfer: {
      bankAccountNumber: String,
      bankAccountName: String,
      bankName: String,
    },
    reservepay: {
      reservepayAccountNumber: String,
    },
    paypal: {
      paypalEmail: String,
    },
  },
  moneySpent: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export const User = mongoose.model("User", userSchema);
