import React, { useState } from 'react';
import axios from 'axios';
import { RiAdminFill } from "react-icons/ri";
import { IoIosArrowUp } from "react-icons/io";
import { FaProductHunt } from "react-icons/fa6";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminSettings = () => {
    const [openSection, setOpenSection] = useState(null);
    const [adminFormData, setAdminFormData] = useState({ name: "", email: "", password: "" });
    const [categoryFormData, setCategoryFormData] = useState({ name: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleCloseSnackbar = () => {
        setMessage(null);
        setError(null);
    };


    const handleAdminSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Unauthorized: Please log in");
                setLoading(false);
                return;
            }

            const response = await axios.post(
                `${API_BASE_URL}/admin/users`,
                adminFormData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setMessage(response.data.message);
            setAdminFormData({ name: "", email: "", password: "" });
            setOpenSection(null);
        } catch (err) {
            setError(err.response?.data?.detail || "Something went wrong");
        }

        setLoading(false);
    };


    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Unauthorized: Please log in");
                setLoading(false);
                return;
            }

            const response = await axios.post(
                `${API_BASE_URL}/admin/categories`,
                categoryFormData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMessage(response.data.message);
            setCategoryFormData({ name: "" });
            setOpenSection(null);
        } catch (err) {
            setError(err.response?.data?.detail || "Something went wrong");
        }

        setLoading(false);
    };

    return (
        <div className='m-6 overflow-y-auto space-y-4'>

            <Snackbar
                open={!!message || !!error}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={error ? 'error' : 'success'}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {error || message}
                </Alert>
            </Snackbar>


            <div className='rounded-lg overflow-hidden'>
                <div
                    className="flex justify-between items-center py-2 px-4 bg-[#D9D9D94F] cursor-pointer rounded-lg"
                    onClick={() => setOpenSection(openSection === 'admin' ? null : 'admin')}
                >
                    <div className='flex items-center gap-4'>
                        <RiAdminFill size={30} color="white" />
                        <h4 className='text-white'>Add New Admin</h4>
                    </div>
                    <IoIosArrowUp
                        size={30}
                        color="white"
                        className={`transition-transform ${openSection === 'admin' ? 'rotate-180' : ''}`}
                    />
                </div>

                {openSection === 'admin' && (
                    <form onSubmit={handleAdminSubmit} className="space-y-4 p-4 bg-[#D9D9D94F] rounded-lg mt-4">
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            className="w-[60%] border-b border-gray-300 py-2 outline-none text-white bg-transparent"
                            value={adminFormData.name}
                            onChange={(e) => setAdminFormData({ ...adminFormData, name: e.target.value })}
                            required
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            className="w-[60%] border-b border-gray-300 py-2 outline-none text-white bg-transparent"
                            value={adminFormData.email}
                            onChange={(e) => setAdminFormData({ ...adminFormData, email: e.target.value })}
                            required
                        />

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                className="w-[60%] border-b border-gray-300 py-2 outline-none text-white bg-transparent"
                                value={adminFormData.password}
                                onChange={(e) => setAdminFormData({ ...adminFormData, password: e.target.value })}
                                required
                            />
                            <div
                                className="absolute top-2 right-[40%] cursor-pointer text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <AiOutlineEyeInvisible size={20} color="white" /> : <AiOutlineEye size={20} color="white" />}
                            </div>
                        </div>

                        <div className='flex gap-4 justify-end pt-4'>
                            <button
                                type="button"
                                onClick={() => {
                                    setOpenSection(null);
                                    setAdminFormData({ name: "", email: "", password: "" });
                                }}
                                className="w-1/4 bg-[#062538] text-white py-2 rounded-lg hover:bg-[#15405B] transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="w-1/4 bg-[#062538] text-white py-2 rounded-lg hover:bg-[#15405B] transition"
                                disabled={loading}
                            >
                                {loading ? "Creating..." : "Done"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
            <div className='rounded-lg overflow-hidden'>
                <div
                    className="flex justify-between items-center py-2 px-4 bg-[#D9D9D94F] cursor-pointer rounded-lg"
                    onClick={() => setOpenSection(openSection === 'category' ? null : 'category')}
                >
                    <div className='flex items-center gap-4'>
                        <FaProductHunt size={30} color="white" />
                        <h4 className='text-white'>Add New Product Category</h4>
                    </div>
                    <IoIosArrowUp
                        size={30}
                        color="white"
                        className={`transition-transform ${openSection === 'category' ? 'rotate-180' : ''}`}
                    />
                </div>

                {openSection === 'category' && (
                    <form onSubmit={handleCategorySubmit} className="space-y-4 p-4 bg-[#D9D9D94F] rounded-lg mt-4">
                        <input
                            type="text"
                            name="name"
                            placeholder="Add New Category"
                            className="w-[60%] border-b border-gray-300 py-2 outline-none text-white bg-transparent"
                            value={categoryFormData.name}
                            onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                            required
                        />

                        <div className='flex gap-4 justify-end pt-4'>
                            <button
                                type="button"
                                onClick={() => {
                                    setOpenSection(null);
                                    setCategoryFormData({ name: "" });
                                }}
                                className="w-1/4 bg-[#062538] text-white py-2 px-4 rounded-lg hover:bg-[#15405B] transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="w-1/4 bg-[#062538] text-white py-2 rounded-lg hover:bg-[#15405B] transition"
                                disabled={loading}
                            >
                                {loading ? "Adding..." : "Done"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default AdminSettings;