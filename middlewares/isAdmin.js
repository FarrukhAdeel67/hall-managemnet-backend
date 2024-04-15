import errorHandler from "../utils/errorHandler.js";

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin")
    return next(
      new errorHandler(
        "the user is not authorized to access this resourse",
        403
      )
    );
  next();
};
