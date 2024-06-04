import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import errorHandler from "../utils/errorHandler.js";
import { Hall } from "../models/Hall.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "cloudinary";
import mongoose from "mongoose";
import { uploadFile } from "../middlewares/multer.js";

export const createHall = catchAsyncError(async (req, res, next) => {
  const {
    name,
    ownerName,
    email,
    location,
    area,
    capacity,
    rentCharge,
    description,
  } = req.body;
  const files = req.files;
  console.log(
    name,
    email,
    location,
    capacity,
    rentCharge,
    description,
    ownerName
  );
  if (
    !name ||
    !location ||
    !area ||
    !capacity ||
    !rentCharge ||
    !email ||
    !description ||
    !ownerName
  ) {
    return next(new errorHandler("Required Fields cannot be empty", 400));
  }
  // const uploadedFiles = [];
  // for (const file of files) {
  //   try {
  //     const result = await new Promise((resolve, reject) => {
  //       const stream = cloudinary.v2.uploader.upload_stream((error, result) => {
  //         if (error) {
  //           reject(error);
  //         } else {
  //           resolve(result);
  //         }
  //       });

  //       stream.end(file.buffer);
  //     });
  //     uploadedFiles.push({ url: result.secure_url });
  //   } catch (error) {
  //     console.error("Error uploading file:", error);
  //     // uploadedFiles.push(null);
  //   }
  // }
  const results = await Promise.all(files.map((file) => uploadFile(file)));
  const uploadedFiles = results.map((result) => ({ url: result.secure_url }));
  const hall = await Hall.create({
    name,
    ownerName,
    email,
    location,
    area,
    capacity,
    rentCharge,
    description,
    fkUserId: req.user._id,
    files: uploadedFiles,
  });

  res.status(201).json({
    success: true,
    message: "Hall created Successfully!",
    data: hall,
  });
});

export const getAllHalls = catchAsyncError(async (req, res, next) => {
  const { name, location } = req.query;

  const filter = { isBooked: { $ne: true } }; // Exclude halls that are booked
  if (name) {
    filter.name = { $regex: name, $options: "i" };
  }
  if (location) {
    filter.location = { $regex: location, $options: "i" };
  }

  const halls = await Hall.find(filter);

  if (!halls || halls.length === 0) {
    return next(new errorHandler("No halls found", 404));
  }

  res.status(200).json({
    success: true,
    halls,
  });
});

export const getMyHalls = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return next(new errorHandler("Invalid user ID", 400));
  }

  const halls = await Hall.find({ fkUserId: userId });

  if (!halls || halls.length === 0) {
    return next(new errorHandler("No halls found", 404));
  }
  console.log(halls, "Halls");
  res.status(200).json({
    success: true,
    halls,
  });
});

export const getSingleHall = catchAsyncError(async (req, res, next) => {
  const { hallId } = req.params;
  const hall = await Hall.findOne({ _id: hallId });
  if (!hall) {
    return res.status(404).json({ message: "Hall not found" });
  }
  res.status(200).json({
    success: true,
    hall,
  });
});
