import mongoose from "mongoose"; 


// Define the schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  email: {
    type: String,
    required: true,
    unique:true,
  },
  password: {
    type: String,
    require: true
  }
});

export default mongoose.model("Users", userSchema);

