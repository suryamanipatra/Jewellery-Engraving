import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import kamaLogo from "../assets/kama-logo.png";
import loginJewellery from "../assets/login-logo.png";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Snackbar, Alert } from "@mui/material";
import { useSelector, useDispatch } from 'react-redux'
import { setLoginDetails } from '../redux/reducer/authReducer.jsx'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Auth = () => {
  const initialAuthDetails = useSelector((state) => state.auth.name)
  const dispatch = useDispatch()
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === "/login";

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    setFormData({ name: "", email: "", password: "" });
  }, [location.pathname]);

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });


const handleSubmit = async (e) => {
  e.preventDefault();
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
    console.log("login response",response.data)
    dispatch(setLoginDetails(response.data))

    if (isLogin) {
      localStorage.setItem("token", response.data.access_token);
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
  }
};


  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-full bg-white px-4 md:px-12 lg:px-[18%] relative -top-6">
        <header className="w-full flex justify-between items-center pt-6 pb-4">
          <img src={kamaLogo} alt="Kama Logo" className="w-40 h-auto" />
        </header>
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
              className="sm:w-[80%] sm:h-[80%] lg:w-[70%] lg:h-[70%] md:w-[70%] md:h-[70%] object-cover mx-auto md:mx-0 mt-4 md:mt-8 md:ml-8"
            />
          </div>

          <div className="w-full md:w-3/5 p-6 bg-white rounded-tl-4xl rounded-bl-4xl shadow-lg flex items-center justify-center">
            <div className="w-full flex flex-col">
              <h2 className="text-[#062538] text-xl sm:text-2xl font-semibold mb-4 text-center">
                {isLogin ? "Welcome back" : "Create Account"}
              </h2>

              <div className="w-fit mx-auto border border-gray-300 lg:px-4 lg:py-2 sm:px-2 sm:py-2 xs:px-4 xs:py-4 rounded-lg cursor-pointer">
                <div className="flex items-center gap-2">
                  <FcGoogle size={24} />
                  <span className="text-sm text-gray-700">
                    {isLogin ? "Sign in with Google" : "Sign up with Google"}
                  </span>
                </div>
              </div>

              <p className="text-gray-400 text-center my-4">- OR -</p>

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
                  className="w-full bg-[#062538] text-white py-3 rounded-lg hover:bg-[#15405B] transition duration-300"
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
            </div>
          </div>
        </div>
      </div>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}  anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Auth;
