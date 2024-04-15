export const sendToken = (res, user, message, statusCode = 200) => {
  const token = user.getJWTToken();
  const options = {
    expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), //means expire in 15 days
    httpOnly: true,
    secure: true, //uncomment now cookie will not work in postman, it will work on website
    sameSite: "none",
  };
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    message,
    user,
  });
};
