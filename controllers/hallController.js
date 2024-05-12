import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import errorHandler from "../utils/errorHandler.js";
import { Hall } from "../models/Hall.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "cloudinary";

export const createHall = catchAsyncError(async (req, res, next) => {
  const { name, email, location, area, capacity, rentCharge, description } =
    req.body;
  const files = req.files;

  if (
    !name ||
    !location ||
    !area ||
    !capacity ||
    !rentCharge ||
    !email ||
    !description
  ) {
    return next(new errorHandler("Required Fields cannot be empty", 400));
  }

  const fileUris = getDataUri(files);
  const uploadedFiles = [];
  for (const fileUri of fileUris) {
    try {
      const myCloud = await cloudinary.v2.uploader.upload(fileUri);
      uploadedFiles.push({ url: myCloud.secure_url });
    } catch (error) {
      console.error("Error uploading file:", error);
      uploadedFiles.push(null);
    }
  }

  try {
    const hall = await Hall.create({
      name,
      email,
      location,
      area,
      capacity,
      rentCharge,
      description,
      fkUserId: req.user._id,
      images: uploadedFiles,
    });

    res.status(201).json({
      success: true,
      message: "Hall created Successfully!",
      data: hall,
    });
  } catch (error) {
    return next(new errorHandler("Failed to create hall", 500));
  }
});

export const getAllHalls = catchAsyncError(async (req, res, next) => {
  const { name, email, location, area, capacity, rentCharge, description } =
    req.body;

  if (
    !name ||
    !location ||
    !area ||
    !capacity ||
    !rentCharge ||
    !email ||
    !description
  )
    return next(new errorHandler("Required Fields cannot be empty", 400));
  let halls = await Hall.find();
  if (!halls) return next(new errorHandler("No halls found", 404));

  res.status(200).json({
    success: true,
    halls: halls,
  });
});
