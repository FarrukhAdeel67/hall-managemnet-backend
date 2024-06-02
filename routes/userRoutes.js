import express from "express";
import {
  bookHall,
  getAllUsers,
  getPaymentIntent,
  login,
  logout,
  register,
} from "../controllers/userController.js";
import hallRouter from "./hallRoutes.js";
import { isUser } from "../middlewares/isUser.js";
import { getAllHalls } from "../controllers/hallController.js";
const router = express.Router();

//register user
router.route("/register").post(register);
//login user
router.route("/login").post(login);
//logout user
router.route("/logout").get(logout);
// get all users
router.route("/getAllUsers").get(getAllUsers);
//create paymentIntent
router
  .route("/users/:userid/halls/:hallId/getPaymentIntent")
  .post(getPaymentIntent);
//book a hall
router.route("/users/:userId/halls/:hallId/bookHall").post(bookHall);
//hall router
router.use("/users/:userId", isUser, hallRouter);

export default router;
