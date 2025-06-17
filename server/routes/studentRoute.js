import express from "express"
import { upload } from "../middleware/multer.js";


import { createStudent, deleteStudent, getAllStudent, getStudentById, updateStudent } from "../controller/studentController.js";

const studentRoute = express.Router();

studentRoute.post("/create/student",upload.single("profile"), createStudent);
studentRoute.get("/getStudent", getAllStudent );
studentRoute.put("/update/student/:id",upload.single("profile"), updateStudent);
studentRoute.get("/student/:id", getStudentById)
studentRoute.delete("/delete/student/:id", deleteStudent)

export default studentRoute;