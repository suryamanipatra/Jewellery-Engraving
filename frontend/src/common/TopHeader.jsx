import React, { useState, useEffect, useRef, use } from 'react'
import kamaLogo from "../assets/kama-logo.png";
import { FaUser } from "react-icons/fa";
import { logout } from "../redux/reducer/authReducer";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";



const TopHeader = () => {
    const [isOpen, setIsOpen] = useState(false);
    const popoverRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const path = location.pathname;

    const name = useSelector((state) => state.auth.name) || "Admin/User";
    const email = useSelector((state) => state.auth.email) || "admin@example.com";
    const role = useSelector((state) => state.auth.role) || "Admin/User";

    const togglePopover = () => setIsOpen(!isOpen);

    useEffect(() => {
        function handleClickOutside(event) {
            if (popoverRef.current && !popoverRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    

    const handleLogout = () => {
        localStorage.clear();
        dispatch(logout());
        navigate("/");
    };

    return (
        <div className={`w-full ${path === '/' || path === '/login' || path === '/signup' || path === '/forgot-password' ? "" : "shadow-md"} px-4 md:px-8  lg:h-[5vh] xl:h-[7vh] 2xl:h-[9vh] md:h-[6vh] flex items-center` }>
            <header className="w-full flex justify-between items-center py-4">
                <img src={kamaLogo} alt="Kama Logo" className="w-40 h-auto" />
                {path === "/login" || path === "/" || path === "/signup" || path === '/forgot-password' ? null :
                <div className="relative">
                    <div
                        className="flex items-center gap-2 md:gap-3 text-[#062538] cursor-pointer"
                        onClick={togglePopover}
                    >
                        <FaUser className="text-xl md:text-2xl" />
                        <span className="text-md md:text-lg font-medium">{name}</span>
                    </div>

                    {isOpen && (
                        <div
                            ref={popoverRef}
                            className="absolute w-max top-full mt-2 right-0 bg-white shadow-lg rounded-lg p-4 z-50 border border-gray-300"
                        >

                            <p className="text-sm font-medium text-gray-700 whitespace-nowrap">Name : {name}</p>
                            <p className="text-xs text-gray-500 whitespace-nowrap">Email : {email}</p>
                            <p className="text-xs text-gray-500 whitespace-nowrap">Role : {role}</p>

                            <button
                                onClick={handleLogout}
                                className="mt-3 w-full bg-[#062538] text-white py-1 px-3 rounded-md text-sm cursor-pointer"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
                }
            </header>
        </div>
    )
}

export default TopHeader