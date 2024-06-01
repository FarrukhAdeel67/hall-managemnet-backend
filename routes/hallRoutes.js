import express from "express";
import { createHall, getAllHalls, getMyHalls, getSingleHall } from "../controllers/hallController.js";
import { multipleUpload } from "../middlewares/multer.js";
const router = express.Router();
router.route("/createHall").post(multipleUpload, createHall);
router.route("/getAllHalls").get(getAllHalls);
router.route("/getMyHalls").get(getMyHalls);
router.route("/getSingleHall/:hallId").get(getSingleHall);

export default router;
