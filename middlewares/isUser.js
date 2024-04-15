import errorHandler from "../utils/errorHandler";
import { catchAsyncError } from "./catchAsyncError";
import { User } from "../models/User.js";

export const isUser = catchAsyncError(async (req, res, next) => {
  const { userId } = req.params;
  if (!userId) return next(new errorHandler("User Id is required!", 400));
  const user = await User.findById(userId);
  if (!user) return next(new errorHandler("User doesn't exist", 400));
  req.user = user;
  next();
});
