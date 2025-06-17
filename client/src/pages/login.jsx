// login.jsx with enhancements
import React, { useState } from "react";
import { Eye, EyeOff, Mail, User, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import zenith from "../assets/zenith.webp";
import axios from "axios";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please fill in all required fields");
      return;
    }
    if (isLogin) {
      // login flow
      try {
        const response = await axios.post(
          "http://localhost:8000/api/login/user",
          {
            email: formData.email,
            password: formData.password,
          }
        );
        toast.success(response.data.message, { position: "top-center" });
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userData", JSON.stringify(response.data.user));
        navigate("/dashboard");
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setError("Invalid email or password");
        } else {
          setError("Something went wrong. please try again!");
        }
      }
    } else {
      // registration flow
      if (!formData.name) {
        setError("Please enter your full name");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match!");
        return;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long");
        return;
      }

      // otp sent -> now verify it

      if (otpSent) {
        if (!otp) {
          setError("Please enter the otp sent to your email");
          return;
        }
        try {
          const verifyRes = await axios.post(
            "http://localhost:8000/api/verify-otp",
            {
              email: formData.email,
              otp,
            }
          );
          if (verifyRes.data.success) {
            await axios
              .post("http://localhost:8000/api/create/user", formData)
              .then((response) => {
                toast.success(response.data.message, {
                  position: "top-center",
                });
              })
              .catch((error) => {
                console.log(error);
              });
            setIsLogin(true);
          }else{
            setError("Invalid or expired OTP")
          }
        } catch (error) {
          setError("OTP varified failed")
        }
      }else{
        // send otp first 
       try {
        const res = await axios.post("http://localhost:8000/api/send-otp",{
          email : formData.email,
        });
        if(res.data.success){
          toast.success("OTP send to your email",{position:"top-center"});
          setOtpSent(true);
        }else{
          setError("Failed to send OTP. Try again")
        }
        
       } catch (error) {
        setError("Email already register")
        
       }
      }
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    });
    setShowConfirmPassword(false);
    setShowPassword(false);
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center"
      style={{
        background:
          "linear-gradient(135deg, #020202 0%, #1b6896 60%, #a16f55 100%)",
        minHeight: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <div className="flex flex-col md:flex-row w-full h-full min-h-screen items-stretch justify-center">
        {/* Left Side: Content/Brand (Bright) */}
        <div className="flex flex-col justify-center items-center md:w-1/2 w-full bg-white text-[#020202] relative px-5 sm:px-10 py-5 sm:py-16 ">
          <div className="flex flex-col items-center w-full max-w-md mx-auto gap-4">
            <img
              src={zenith}
              alt="ZenithPanther Logo"
              className="mb-2"
              style={{
                width: 100,
                height: 100,
                objectFit: "cover",
                borderRadius: 28,
              }}
            />
            <h1
              className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-1 text-[#1b6896]"
              style={{ letterSpacing: "0.03em" }}
            >
              ZenithPanther
            </h1>

            <p className="text-base sm:text-lg text-[#1b6896] mb-4 text-center leading-relaxed max-w-xs sm:max-w-sm">
              <span className="font-semibold">Welcome to ZenithPanther</span>,
              your modern tuition management system.
              <br />
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full mb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#a16f55]">Email:</span>
                <a
                  href="mailto:info@bluebugsoft.com"
                  className="hover:underline text-[#1b6896] break-all"
                >
                  info@bluebugsoft.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#a16f55]">Phone:</span>
                <a
                  href="tel:9829303050"
                  className="hover:underline text-[#1b6896]"
                >
                  9829303050
                </a>
              </div>
            </div>
            <div className="absolute bottom-6 left-0 w-full text-center text-xs text-[#a16f55] font-medium tracking-wide hidden md:block">
              Powered by{" "}
              <span className="text-[#1b6896] font-bold">BlueBug Soft</span>
            </div>
          </div>
        </div>
        {/* Right Side: Form (Dark, a16f55) */}
        <div className="flex-1 flex flex-col justify-center items-center px-4 py-5 sm:px-10 sm:py-15 bg-[#1b6896] transition-colors duration-500">
          <div className="w-full max-w-md mx-auto">
            <div className="mb-8 text-center">
              <p className="text-2xl   text-white font-bold">
                {isLogin ? "Sign in to your account" : "Create your account"}
              </p>
            </div>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded shadow text-center">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="relative">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-1 text-white"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-[#1b6896]" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      id="name"
                      placeholder="John Doe"
                      className="pl-10 pr-4 py-2 w-full border border-[#1b6896] rounded-lg focus:ring-2 focus:ring-[#1b6896] focus:border-[#1b6896] bg-[#fff7f2] text-[#020202] shadow"
                    />
                  </div>
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1 text-white"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-[#1b6896]" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    id="email"
                    placeholder="example@gmail.com"
                    className="pl-10 pr-4 py-2 w-full border border-[#1b6896] rounded-lg focus:ring-2 focus:ring-[#1b6896] focus:border-[#1b6896] bg-[#fff7f2] text-[#020202] shadow"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-1 text-white"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-[#1b6896]" />
                  </div>
                  <input
                    name="password"
                    value={formData.password}
                    type={showPassword ? "text" : "password"}
                    onChange={handleChange}
                    id="password"
                    placeholder="••••••"
                    className="pl-10 pr-10 py-2 w-full border border-[#1b6896] rounded-lg focus:ring-2 focus:ring-[#1b6896] focus:border-[#1b6896] bg-[#fff7f2] text-[#020202] shadow"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="text-[#1b6896] hover:text-[#020202] focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium mb-1 text-white"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-[#1b6896]" />
                    </div>
                    <input
                      placeholder="••••••"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      className="pl-10 pr-10 py-2 w-full border border-[#1b6896] rounded-lg focus:ring-2 focus:ring-[#1b6896] focus:border-[#1b6896] bg-[#fff7f2] text-[#020202] shadow"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="text-[#1b6896] hover:text-[#020202] focus:outline-none"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {!isLogin && otpSent && (
                <div>
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium mb-1 text-white"
                  >
                    Enter OTP
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-[#1b6896]" />
                    </div>
                    <input
                      type="text"
                      name="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      id="otp"
                      placeholder="Enter OTP"
                      className="pl-10 pr-4 py-2 w-full border border-[#1b6896] rounded-lg focus:ring-2 focus:ring-[#1b6896] focus:border-[#1b6896] bg-[#fff7f2] text-[#020202] shadow"
                      maxLength={6}
                      autoComplete="one-time-code"
                    />
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#1b6896] text-white py-3 rounded-lg font-semibold shadow-lg focus:outline-none focus:ring-2 focus:ring-[#020202] focus:ring-opacity-50 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:bg-[#1b4696]"
                  style={{ letterSpacing: "0.04em" }}
                >
                  {isLogin
                    ? "Sign In"
                    : otpSent
                    ? "Verify OTP & Create Account"
                    : "Send OTP"}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={toggleMode}
                className="text-white hover:text-[#cfd3f3] font-semibold transition-colors cursor-pointer underline underline-offset-2"
              >
                {isLogin
                  ? "Need an account? Sign up"
                  : "Already have an account? Log in"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
