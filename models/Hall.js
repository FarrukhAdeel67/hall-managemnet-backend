import mongoose from "mongoose";
import validator from "validator";

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Your Full Name"],
  },
  location: {
    type: String,
    required: [true, "Please enter location of the hall"],
  },
  area: {
    type: Number,
    required: [true, "Please enter area of the hall in square meters"],
  },
  capacity: {
    type: Number,
    required: [true, "Please enter capacity of the hall (in number of people)"],
  },
  rentCharge: {
    type: Number,
    required: [true, "Please enter hall location"],
  },
  files: [
    {
      url: {
        type: String,
      },
    },
  ],
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    validate: validator.isEmail,
  },
  description: {
    type: String,
    required: [true, "describe your hall at least 150 words"],
    maxlength: 150 * 5,
  },
  fkUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Hall = mongoose.model("Hall", schema);
