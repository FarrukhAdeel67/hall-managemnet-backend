import express from "express";
import { createHall, getAllHalls } from "../controllers/hallController.js";
import { multipleUpload } from "../middlewares/multer.js";
const router = express.Router();
router.route("/createHall").post(multipleUpload, createHall);
router.route("/getAllHalls").get(getAllHalls);

export default router;
