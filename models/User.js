import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
const schema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Please Enter Your Full Name"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: true,
    validate: validator.isEmail,
  },
  phoneNumber: {
    type: String,
    required: [true, "Please Enter Your Phone Number"],
    unique: true,
  },
  address: {
    type: String,
    required: [true, "Please Enter Your Address"],
    unique: false,
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minlength: [6, "Password Must be at least 6 characters"],
    select: false,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: String,
});

schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const hashedPassword = await bcrypt.hash(this.password, 12);
  this.password = hashedPassword;
  next();
});

schema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
schema.methods.getJWTToken = function () {
  //send to utility function
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
};
//reset token //same as the otp, dont get confused with cookie token.
schema.methods.getResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256") //sha256 is some algorithm
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
  return resetToken;
};
export const User = mongoose.model("User", schema);
