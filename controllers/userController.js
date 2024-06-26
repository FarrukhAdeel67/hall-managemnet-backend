import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import errorHandler from "../utils/errorHandler.js";
import { User } from "../models/User.js";
import { Hall } from "../models/Hall.js";
import { Booking } from "../models/Booking.js";
import { sendToken } from "../utils/sendToken.js";

//register user

import stripe from "stripe";
import mongoose from "mongoose";

const stripeInstance = stripe(
  "sk_test_51PMv4eFjKd2J4rFyzo5tlxMCmP9xWK94LEIyONL8AmKvMWJqidhllSLT3OtHhMCVbdV9BKkoKcdXbmbTQ9Nl42Zd00uEw6fZtL"
);
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

export const getPaymentIntent = catchAsyncError(async (req, res, next) => {
  try {
    const { amount } = req.body;
    if (!amount) {
      throw new Error("ammount is required");
    }
    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: (parseFloat(amount).toFixed(2) * 100).toFixed(0).toString(),
      currency: "GBP",
      payment_method_types: ["card"],
      capture_method: "manual",
    });
    console.log("Payment intent created:", paymentIntent.status);

    if (!paymentIntent) {
      throw new Error("Payment intent is undefined");
    }

    res.status(200).json({
      success: true,
      paymentIntent: {
        client_secret: paymentIntent?.client_secret,
        stripe_intent_id: paymentIntent?.id,
        status: paymentIntent?.status,
        amount: parseInt(amount),
      },
    });
  } catch (error) {
    throw new Error(error.message);
  }
});

export const bookHall = catchAsyncError(async (req, res, next) => {
  try {
    const { amount, paymentIntentId, bookingDateAndTime } = req.body;
    const { userId, hallId } = req.params;
    if (
      !amount ||
      !paymentIntentId ||
      !bookingDateAndTime ||
      !userId ||
      !hallId
    ) {
      throw new Error("required fileds cannot be empty ");
    }

    const hall = await Hall.findById(hallId);
    if (!hall) {
      throw new Error("hall not found");
    }
    const chcekBooking = await Booking.findOne({
      fkHallId: hallId,
      bookingDateAndTime: bookingDateAndTime,
    });

    if (chcekBooking) {
      throw new Error(
        "hall is already booked for this date and time, kindly choose another date and time."
      );
    }

    const bookedHall = await Booking.create({
      paymentAmount: amount,
      paymentIntentId: paymentIntentId,
      bookingDateAndTime: parseInt(bookingDateAndTime),
      fkUserId: userId,
      fkHallId: hallId,
    });
    const updateHall = await Hall.findByIdAndUpdate(
      hallId,
      {
        $inc: { bookingCount: 1 },
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "hall booked successfully",
      bookedHall,
    });
  } catch (error) {
    throw new Error(error.message);
  }
});

export const getSpecificHallBookings = catchAsyncError(
  async (req, res, next) => {
    const { hallId } = req.params;
    const bookings = await Booking.find({ fkHallId: hallId });

    if (!bookings) {
      return res.status(404).json({ message: "Bookings not found" });
    }
    res.status(200).json({
      success: true,
      bookings,
    });
  }
);

export const getMyBookings = catchAsyncError(async (req, res, next) => {
  const { userId } = req.params;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid or missing userId" });
  }

  try {
    const myBookings = await Booking.find({
      fkUserId: new mongoose.Types.ObjectId(userId),
    });

    if (!myBookings || myBookings.length === 0) {
      return res.status(404).json({ message: "Bookings not found" });
    }

    // Fetch the hall details for each booking
    const halls = await Promise.all(
      myBookings.map(async (booking) => {
        const hall = await Hall.findById(booking.fkHallId);
        return {
          hall,
        };
      })
    );
    console.log(halls);
    console.log(myBookings);
    res.status(200).json({
      success: true,
      myBookings,
      halls,
    });
  } catch (error) {
    next(error);
  }
});

export const getAllBookings = catchAsyncError(async (req, res, next) => {
  try {
    const myBookings = await Booking.find();

    if (!myBookings || myBookings.length === 0) {
      return res.status(404).json({ message: "Bookings not found" });
    }

    // Fetch the user and hall details for each booking
    const detailedBookings = await Promise.all(
      myBookings.map(async (booking) => {
        const hall = await Hall.findById(booking.fkHallId);
        const user = await User.findById(booking.fkUserId);

        return {
          booking,
          hall,
          user,
        };
      })
    );
    console.log(detailedBookings, "Bookings");
    res.status(200).json({
      success: true,
      detailedBookings,
      myBookings
    });
  } catch (error) {
    next(error);
  }
});

