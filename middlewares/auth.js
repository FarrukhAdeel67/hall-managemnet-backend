import jwt from "jsonwebtoken";
import { catchAsyncError } from "./catchAsyncError.js";
import errorHandler from "../utils/errorHandler.js";
import { User } from "../models/User.js";
export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) return next(new errorHandler("User Not Logged In..", 401)); //401 unauthorized user.
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded._id);
  next();
});
export const authorizeSubscribers = (req, res, next) => {
  if (req.user.subscription.status !== "avtive" && req.user.role !== "admin")
    return next(
      new errorHandler("only subscribers can access this resource", 403)
    );
  next();
};
