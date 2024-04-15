import express from "express";
import { login, logout, register } from "../controllers/userController.js";
const router = express.Router();
//register user
router.route("/register").post(register);
//login user
router.route("/login").post(login);
//logout user
router.route("/logout").get(logout);

export default router;
