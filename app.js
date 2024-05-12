import express from "express";
import { config } from "dotenv";
import userRouter from "./routes/userRoutes.js";
import errorMiddleware from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";

import cors from "cors";
config({
  path: "./config/config.env",
});
const app = express();
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});
//using middlewares
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // only this url can use these apis
    credentials: true, //true to use the cookies
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
//importing and using Routes
app.use("/api/v1/", userRouter);
export default app;
app.get("/api/v1", (req, res) => {
  res.send(
    `<h1>Server is working. Click <a href=${process.env.FRONTEND_URL}>here</a> to visit front end</h1>`
  );
});
app.use(errorMiddleware);
