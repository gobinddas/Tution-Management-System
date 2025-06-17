import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";

import route from "./routes/userRoute.js";
import studentRoute from "./routes/studentRoute.js";
import batchRoute from "./routes/batchRoute.js";
import attendanceRoute from "./routes/attendanceRoute.js";


const app = express();
app.use(bodyParser.json());
app.use(cors());
dotenv.config();
app.use('/uploads', express.static('uploads'));


const PORT = process.env.PORT || 7000;
const MONGOURL = process.env.MONGO_URL;

mongoose
    .connect(MONGOURL)
    .then(() => {
        console.log("Database connected Succesfully");
        app.listen(PORT, ()=>{
            console.log(`Server is running in Port : ${PORT}`)
        })
    })
    .catch(err=>{
        console.log(err)
    });

    // api call - from routes

    app.use("/api", route);
    app.use("/api",studentRoute);
    app.use("/api",batchRoute);
    app.use("/api",attendanceRoute);