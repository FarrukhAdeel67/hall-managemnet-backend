import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import errorHandler from "../utils/errorHandler.js";
import { Hall } from "../models/Hall.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "cloudinary";
import { uploadFile } from "../middlewares/multer.js";

export const createHall = catchAsyncError(async (req, res, next) => {
  const { name, email, location, area, capacity, rentCharge, description } = req.body;
  const files = req.files;

  if (!name || !location || !area || !capacity || !rentCharge || !email || !description) {
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

  try {
    const results = await Promise.all(files.map(file => uploadFile(file)));
    const uploadedFiles = results.map(result => ({ url: result.secure_url }));
    const hall = await Hall.create({
      name,
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
