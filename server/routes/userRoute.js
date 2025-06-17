import express from "express"

import { createUser, loginUser, sendOtp, verifyOtp } from "../controller/userController.js";

const route = express.Router();

route.post("/create/user", createUser);
route.post("/login/user",loginUser);
route.post("/send-otp",sendOtp)
route.post("/verify-otp", verifyOtp)
export default route;