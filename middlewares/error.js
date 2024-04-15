const errorMiddleware = (err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Something Went Wrong!",
  });
};
export default errorMiddleware;
