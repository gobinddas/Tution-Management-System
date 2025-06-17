import express from "express";
import { createAttendance } from "../controller/attendanceController.js";

const attendanceRoute = express.Router();

attendanceRoute.post("/create/attendance", createAttendance);

export default attendanceRoute;


