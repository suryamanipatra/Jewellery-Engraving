import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RiAdminFill } from "react-icons/ri";
import { IoIosArrowUp } from "react-icons/io";
import { FaProductHunt } from "react-icons/fa6";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { MdOutlineHourglassEmpty } from "react-icons/md";

import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Paper,
    IconButton,
    Tooltip,
    Typography
} from '@mui/material';
import { RiDeleteBin5Fill } from "react-icons/ri";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminSettings = () => {
    const [openSection, setOpenSection] = useState('admin');
    const [adminFormData, setAdminFormData] = useState({ name: "", email: "", password: "", role: "admin" });
    const [categoryFormData, setCategoryFormData] = useState({ name: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const [categoriesLoaded, setCategoriesLoaded] = useState(false);
    const [categories, setCategories] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

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
                `${API_BASE_URL}/products/store_jewelry_types`,
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
            setCategoriesLoaded(false);
        } catch (err) {
            setError(err.response?.data?.detail || "Something went wrong");
        }

        setLoading(false);
    };



    useEffect(() => {
        if (openSection === "manage-product-category" && !categoriesLoaded) {
            fetchCategories();
            setCategoriesLoaded(true);
        }
    }, [openSection]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/products/get_all_jewelry_types`);
            setCategories(response?.data);
        } catch (error) {
            setError("Failed to fetch categories: " + (error.response?.data?.detail || error.message));
            console.error("Error fetching categories:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/products/delete_jewelry_type/${id}`);
            setCategories(categories.filter(category => category.id !== id));
            setMessage("Category deleted successfully");
        } catch (error) {
            setError("Failed to delete category: " + (error.response?.data?.detail || error.message));
            console.error("Error deleting category:", error);
        }
    };

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
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
                        className={`transition-transform ${openSection === 'admin' ? '' : 'rotate-180'}`}
                    />
                </div>

                {openSection === 'admin' && (
                    <form onSubmit={handleAdminSubmit} className="space-y-4 p-4 bg-[#D9D9D94F] rounded-lg mt-4 px-15.5">
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
                                className="w-1/4 bg-[#fff] text-[#062538] cursor-pointer hover:text-white py-2 rounded-lg hover:bg-[#15405B] transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="w-1/4 bg-[#062538] cursor-pointer text-white py-2 rounded-lg hover:bg-[#15405B] transition"
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
                        className={`transition-transform ${openSection === 'category' ? '' : 'rotate-180'}`}
                    />
                </div>

                {openSection === 'category' && (
                    <form onSubmit={handleCategorySubmit} className="space-y-4 p-4 bg-[#D9D9D94F] rounded-lg mt-4 px-15.5">
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
                                className="w-1/4 bg-[#fff] text-[#062538] cursor-pointer hover:text-white py-2 px-4 rounded-lg hover:bg-[#15405B] transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="w-1/4 bg-[#062538] cursor-pointer text-white py-2 rounded-lg hover:bg-[#15405B] transition"
                                disabled={loading}
                            >
                                {loading ? "Adding..." : "Done"}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            <div className='rounded-lg overflow-hidden'>
                <div
                    className="flex justify-between items-center py-2 px-4 bg-[#D9D9D94F] cursor-pointer rounded-lg"
                    onClick={() => setOpenSection(openSection === 'manage-product-category' ? null : 'manage-product-category')}
                >
                    <div className='flex items-center gap-4'>
                        <FaProductHunt size={30} color="white" />
                        <h4 className='text-white'>Manage Product Categories</h4>
                    </div>
                    <IoIosArrowUp
                        size={30}
                        color="white"
                        className={`transition-transform ${openSection === 'manage-product-category' ? '' : 'rotate-180'}`}
                    />
                </div>

                {openSection === 'manage-product-category' && (
                    <Box sx={{ width: '100%', pt: 2, pb: 2, borderRadius: 2 }}>
                        <Paper sx={{ width: '100%', mb: 2, background: '#D9D9D94F', borderRadius: 2 }}>
                            <TableContainer sx={{ maxHeight: 400 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ color: "white" }}>Name</TableCell>
                                            <TableCell sx={{ color: "white" }}>Created At</TableCell>
                                            <TableCell sx={{ color: "white" }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {categories.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={3} align="center">
                                                    <Box sx={{ display: 'flex', alignItems: 'center', py: 3, justifyContent: "center" }}>
                                                        <MdOutlineHourglassEmpty size={25} color='white' />
                                                        <Typography sx={{ color: "white", marginLeft: '5px' }} variant="h6">
                                                            No data to show
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            categories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((category) => (
                                                <TableRow key={category.id}>
                                                    <TableCell sx={{ color: "white" }}>{category.name}</TableCell>
                                                    <TableCell sx={{ color: "white" }}>{new Date(category.created_at).toLocaleString()}</TableCell>
                                                    <TableCell>
                                                        <Tooltip title="Delete">
                                                            <IconButton onClick={() => handleDelete(category.id)}>
                                                                <RiDeleteBin5Fill className="text-red-700" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={categories.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                sx={{ color: "white" }}
                            />
                        </Paper>
                    </Box>
                )}

            </div>

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
        </div>
    );
}

export default AdminSettings;