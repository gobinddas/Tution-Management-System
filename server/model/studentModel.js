import mongoose from "mongoose";


const studentSchema = new mongoose.Schema({
    profile:{type:String},
    firstName :{type:String, require:true},
    middleName : {type: String},
    lastName : {type:String, require:true},
    batch:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Batch",
       
    },
    shift:{type:String, enum:['Morning', 'Day', 'Evening'], default:'Morning'},
    phone:{type:String,match:/^9\d{9}$/, require:true},
    email:{type:String, require:true},
    address:{type:String, require:true},
    stream : {type:String},
    parentName:{type:String},
    parentPhone:{type:String, match:/^9\d{9}$/},
    pastEducation :{type:String},
}, {timestamps:true});

export default mongoose.model("Student", studentSchema);