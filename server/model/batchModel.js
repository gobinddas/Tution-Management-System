import mongoose from "mongoose";

const batchSchema = new mongoose.Schema({
    name:{type:String, required:true, unique:true},
    

}, {timestamps:true});

export default mongoose.model("Batch", batchSchema);