import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import loginJewellery from "../assets/login-logo.png";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Snackbar, Alert } from "@mui/material";
import { useDispatch } from 'react-redux'
import { setLoginDetails } from '../redux/reducer/authReducer.jsx'
import TopHeader from "../common/TopHeader.jsx";
import Loader from "../common/Loader.jsx";
import { useGoogleLogin } from '@react-oauth/google';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Auth = () => {
  const dispatch = useDispatch()
  const location = useLocation();
  const navigate = useNavigate();

  const isLogin = location.pathname === "/login";
  const isForgotPassword = location.pathname === "/forgot-password";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [formDataForForgotPassword, setFormDataForForgotPassword] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const [step, setStep] = useState(1);
  const [showLoader, setShowLoader] = useState(true);


  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    setFormData({ name: "", email: "", password: "" });
  }, [location.pathname]);

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });


  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowLoader(true);
    try {
      const url = isLogin ? `${API_BASE_URL}/login` : `${API_BASE_URL}/signup`;

      const payload = isLogin
        ? new URLSearchParams({ username: formData.email, password: formData.password })
        : { name: formData.name, email: formData.email, password: formData.password };

      const config = {
        headers: {
          "Content-Type": isLogin ? "application/x-www-form-urlencoded" : "application/json",
        },
      };

      const response = await axios.post(url, payload, config);
      if (response?.status === 200) {
        console.log("login response", response?.data)
        if (isLogin) {
          dispatch(setLoginDetails(response?.data))
        }
      }

      if (isLogin) {
        localStorage.setItem("token", response?.data?.access_token);
        setSnackbar({ open: true, message: "Login successful!", severity: "success" });
        setTimeout(() => navigate("/admin/home"), 1000);
      } else {
        setSnackbar({ open: true, message: "Signup successful! Please login.", severity: "success" });
        setTimeout(() => navigate("/login"), 1000);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.detail || "Something went wrong, please try again.";
      setSnackbar({ open: true, message: errorMessage, severity: "error" });
    } finally {
      setTimeout(() => setShowLoader(false), 3000);
    }
  };


  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const getUserInfo = async (accessToken) => {
    try {
      const response = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      console.log("User Info:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    console.log("credential", credentialResponse)
    if (!credentialResponse.id_token) {
      console.warn("id_token missing, using access_token instead.");
      const userData = await getUserInfo(credentialResponse.access_token);
      console.log("User Data from access_token:", userData);
      
    }
    console.log("id_token exists:", credentialResponse.access_token);
    setShowLoader(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/google-login`, {
        token: credentialResponse.access_token
      });
      console.log("response",response)

      if (response?.status === 200) {
        dispatch(setLoginDetails(response.data));
        localStorage.setItem("token", response.data.access_token);
        setSnackbar({ open: true, message: "Google login successful!", severity: "success" });
        setTimeout(() => navigate("/engraving-categories"), 1000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.detail || "Google login failed";
      setSnackbar({ open: true, message: errorMessage, severity: "error" });
    } finally {
      setShowLoader(false);
    }
  };

  const handleGoogleLoginError = () => {
    setSnackbar({ open: true, message: "Google login failed", severity: "error" });
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleLoginSuccess,
    onError: handleGoogleLoginError,
  });

  useEffect(() => {
    setFormDataForForgotPassword({ email: "", password: "", confirmPassword: "", otp: "" });
    setStep(1);
  }, [location.pathname]);


  const handleChangeForForgotPassword = (e) => {
    setFormDataForForgotPassword({
      ...formDataForForgotPassword,
      [e.target.name]: e.target.value
    });
  };


  const handleSendOtp = async (e) => {
    e.preventDefault();
    setShowLoader(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/send-otp`, { email: formDataForForgotPassword?.email });
      if (response?.status === 200) {
        setSnackbar({ open: true, message: "OTP sent to your email!", severity: "success" });
        setStep(2);
      }
    } catch (error) {
      setSnackbar({ open: true, message: "Failed to send OTP", severity: "error" });
    } finally {
      setTimeout(() => setShowLoader(false), 3000);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setShowLoader(true);
    if (formDataForForgotPassword?.password !== formDataForForgotPassword?.confirmPassword) {
      setSnackbar({ open: true, message: "Passwords do not match", severity: "error" });
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/verify-otp`, {
        email: formDataForForgotPassword?.email,
        otp: formDataForForgotPassword?.otp,
        password: formDataForForgotPassword?.password,
      });

      if (response?.status === 200) {
        setSnackbar({ open: true, message: response?.data?.message, severity: "success" });
        setTimeout(() => navigate("/login"), 1000);
      }

    } catch (error) {
      setSnackbar({ open: true, message: error.response?.data?.detail || "Unknown Error", severity: "error" });
    } finally {
      setTimeout(() => setShowLoader(false), 3000);
    }
  };

  useEffect(() => {
    setTimeout(() => setShowLoader(false), 3000);
  }, [])

  return (
    <>
      {showLoader &&
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#062538]/[0.34] backdrop-blur-[5px]">
          <Loader />
        </div>

      }

      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="w-full bg-white md:px-12 lg:px-[16%] pb-4">
          <TopHeader />
        </div>

        <div className="flex items-center justify-center px-4 md:px-12 lg:px-[18%] relative -top-6">
          <div className="bg-gradient-to-br from-[#062538] via-[#15405B] to-[#326B8E] flex md:flex-row rounded-lg">
            <div className="w-full md:w-2/5 p-4 md:p-8 text-center md:text-left">
              <p className="text-white font-telex font-normal text-base sm:text-2xl md:text-2xl leading-[137%] tracking-wide">
                Make It Yours: Personalized Jewelry Engraved with Love...
              </p>
              <img
                src={loginJewellery}
                alt="Jewelry"
                className="sm:w-[80%] sm:h-[80%] lg:w-[70%] lg:h-[60%] md:w-[70%] md:h-[60%] object-cover mx-auto md:mx-0 mt-4 md:mt-8 md:ml-8"
              />
            </div>

            <div className="w-full md:w-3/5 p-6 bg-white rounded-tl-4xl rounded-bl-4xl shadow-lg flex items-center justify-center">
              <div className="w-full flex flex-col">
                <h2 className="text-[#062538] text-xl sm:text-2xl font-semibold mb-4 text-center">
                  {/* {isLogin ? "Welcome back" : "Create Account"} */}
                  {isForgotPassword ? "Forgot Password" : isLogin ? "Welcome Back!" : "Create Account"}
                </h2>

                {!isForgotPassword && (
                  <>
                    <div className="w-fit mx-auto border border-gray-300 lg:px-4 lg:py-2 sm:px-2 sm:py-2 xs:px-4 xs:py-4 rounded-lg cursor-pointer"
                      onClick={googleLogin}
                    >
                      <div className="flex items-center gap-2">
                        <FcGoogle size={24} />
                        <span className="text-sm text-gray-700">
                          {isLogin ? "Sign in with Google" : "Sign up with Google"}
                        </span>
                      </div>

                    </div>

                    <p className="text-gray-400 text-center my-4">- OR -</p>
                  </>
                )}

                {isForgotPassword ? (
                  <form className="space-y-4 md:px-12" onSubmit={step === 1 ? handleSendOtp : handleResetPassword}>
                    {/* Step 1: Email Input */}
                    {step === 1 && (
                      <>
                        <input
                          type="email"
                          name="email"
                          placeholder="Email Address"
                          className="w-full border-b border-gray-300 py-2 outline-none text-gray-700"
                          onChange={handleChangeForForgotPassword}
                          value={formDataForForgotPassword.email}
                          required
                        />
                        <button
                          type="submit"
                          className="w-full bg-[#062538] text-white py-3 rounded-lg hover:bg-[#15405B] transition duration-300 cursor-pointer"
                        >
                          Send OTP
                        </button>
                        <p className="text-center text-gray-500 mt-4">
                          {isForgotPassword ? "Remembered your password ? " : ""}
                          <NavLink to={isForgotPassword ? "/login" : ""} className="text-[#062538] font-semibold">
                            Login
                          </NavLink>
                        </p>
                      </>
                    )}

                    {/* Step 2: OTP + Password Input */}
                    {step === 2 && (
                      <>
                        <input
                          type="text"
                          name="otp"
                          placeholder="Enter OTP"
                          className="w-full border-b border-gray-300 py-2 outline-none text-gray-700"
                          onChange={handleChangeForForgotPassword}
                          value={formDataForForgotPassword.otp}
                          required
                        />

                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="New Password"
                            className="w-full border-b border-gray-300 py-2 pr-10 outline-none text-gray-700"
                            onChange={handleChangeForForgotPassword}
                            value={formDataForForgotPassword.password}
                            required
                          />
                          <div
                            className="absolute top-2 right-2 cursor-pointer text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                          </div>
                        </div>

                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            className="w-full border-b border-gray-300 py-2 outline-none text-gray-700"
                            onChange={handleChangeForForgotPassword}
                            value={formDataForForgotPassword.confirmPassword}
                            required
                          />
                          <div
                            className="absolute top-2 right-2 cursor-pointer text-gray-500"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                          </div>
                        </div>


                        <button
                          type="submit"
                          className="w-full bg-[#062538] text-white py-3 rounded-lg hover:bg-[#15405B] transition duration-300 cursor-pointer"
                        >
                          Confirm
                        </button>

                        <p className="text-center text-gray-500 mt-4">
                          {isForgotPassword ? "Remembered your password ? " : ""}
                          <NavLink to={isForgotPassword ? "/login" : ""} className="text-[#062538] font-semibold">
                            Login
                          </NavLink>
                        </p>
                      </>
                    )}
                  </form>
                ) : (
                  ""
                )}

                {!isForgotPassword && (
                  <>

                    <form className="space-y-4 md:px-12" onSubmit={handleSubmit}>
                      {!isLogin && (
                        <input
                          type="text"
                          name="name"
                          placeholder="Full Name"
                          className="w-full border-b border-gray-300 py-2 outline-none text-gray-700"
                          onChange={handleChange}
                          value={formData.name}
                        />
                      )}


                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        className="w-full border-b border-gray-300 py-2 outline-none text-gray-700"
                        onChange={handleChange}
                        value={formData.email}
                      />

                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Password"
                          className="w-full border-b border-gray-300 py-2 pr-10 outline-none text-gray-700"
                          onChange={handleChange}
                          value={formData.password}
                        />
                        <div
                          className="absolute top-2 right-2 cursor-pointer text-gray-500"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                        </div>
                      </div>

                      {isLogin && (
                        <div className="text-right mt-1">
                          <NavLink to="/forgot-password" className="text-sm text-[#062538] hover:underline">
                            Forgot Password?
                          </NavLink>
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full bg-[#062538] text-white py-3 rounded-lg hover:bg-[#15405B] transition duration-300 cursor-pointer"
                      >
                        {isLogin ? "Login" : "Create Account"}
                      </button>
                    </form>

                    <p className="text-center text-gray-500 mt-4">
                      {isLogin ? "Don't have an account? " : "Already have an account? "}
                      <NavLink to={isLogin ? "/signup" : "/login"} className="text-[#062538] font-semibold">
                        {isLogin ? "Sign Up" : "Login"}
                      </NavLink>
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
};

export default Auth;
