import express from "express";

import { createBatch, deleteBatch, editBatch, getAllBatch } from "../controller/batchController.js";

const batchRoute = express.Router();

batchRoute.post("/create/batch", createBatch);
batchRoute.get("/getAllBatch", getAllBatch)
batchRoute.put("/editBatch/:id", editBatch);
batchRoute.delete("/delete/:id", deleteBatch);

export default batchRoute;