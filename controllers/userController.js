import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import errorHandler from "../utils/errorHandler.js";
import { User } from "../models/User.js";
// import { Course } from "../models/Course.js";
import { sendToken } from "../utils/sendToken.js";
// import { sendEmail } from "../utils/sendEmail.js";
// import getDataUri from "../utils/dataUri.js";
// import cloudinary from "cloudinary";
// import crypto from "crypto";
// import { Stats } from "../models/Stats.js";
//register user
export const register = catchAsyncError(async (req, res, next) => {
  const { fullName, email, password, phoneNumber, address } = req.body;
  if (!fullName || !address || !phoneNumber || !email || !password)
    return next(new errorHandler("Required Fields cannot be empty", 400));
  let user = await User.findOne({
    email,
  });
  if (user) return next(new errorHandler("User already Exist", 409));
  user = await User.create({
    fullName,
    email,
    phoneNumber,
    address,
    password,
  });
  sendToken(res, user, "registered successfully", 201);
});

//login user
export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new errorHandler("Required fields cannot be empty", 400));
  const user = await User.findOne({ email }).select("+password");
  if (!user) return next(new errorHandler("Incorrect Email or  Password", 401));
  const isMatch = await user.comparePassword(password);
  if (!isMatch)
    return next(new errorHandler("Incorrect Email or  Password", 401));
  sendToken(res, user, `Welcome back ${user.fullName}`, 200);
});
//logout user
export const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .json({
      success: true,
      message: "Logged Out Successfully",
    });
});
//get all users
export const getAllUsers = catchAsyncError(async (req, res, next) => {
  const Users = await User.find();
  if (!Users) {
    return next(new errorHandler("No User found", 404));
  }

  res.status(200).json({
    success: true,
    Users,
  });
});
