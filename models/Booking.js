import mongoose from "mongoose";
import validator from "validator";

const schema = new mongoose.Schema({
  bookingDateAndTime: {
    type: Number,
    required: [true, "Please Enter Booking Time"],
  },
  paymentIntentId: {
    type: String,
  },
  paymentAmount: {
    type: Number,
    required: [true, "Payment Amount is required"],
  },
  fkUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fkHallId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hall",
    required: true,
  },
  isBooked: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Booking = mongoose.model("Booking", schema);
