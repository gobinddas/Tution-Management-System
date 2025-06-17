import Users from "../model/userModel.js";
import sendMail from "../utils/mailer.js";
import Otp from "../model/otpModel.js"



// create user

export const createUser = async (req, res) => {
  try {
    const newUser = new Users(req.body);
    const { email } = newUser;

    const userExist = await Users.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exist" });
    }
    const savedData = await newUser.save();
    res.status(200).json({ message: "User created successfully" });
    //  res.status(200).json(savedData);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already registered" });
    }
    res.status(500).json({ errorMessage: error.message });
  }
};

// check credantial and login approvl

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }
    res.status(200).json({ message: "Login succesfully", user });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

// to send otp

export const sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const userExists = await Users.findOne({ email });
  if(userExists){
    return res.status(400).json({message:"Email already registered"});
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // store opt temp in memory

  try {
    await Otp.create({email, otp});
    await sendMail(email, `Your OTP is: ${otp}`);
    return res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};

// to verify otp

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const existingOtp = await Otp.findOne({ email, otp });

    if (!existingOtp) {
      return res
        .status(400)
        .json({ verified: false, success: false, message: "Invalid or expired OTP" });
    }

    // If valid, delete it to prevent reuse
    await Otp.deleteMany({ email }); // cleanup all OTPs for that email

    return res.json({ verified: true, success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

