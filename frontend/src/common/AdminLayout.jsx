import { Link, Outlet, useLocation } from "react-router-dom";
import kamaLogo from "../assets/kama-logo.png";
import { FaUser, FaHome, FaUpload, FaCog } from "react-icons/fa";
import { BiCategoryAlt } from "react-icons/bi";
import { Tabs, Tab } from "@mui/material";
import { useSelector } from 'react-redux'

const AdminLayout = () => {
    const location = useLocation();
    console.log("pathName", location.pathname)

    const getTabIndex = () => {
        switch (location.pathname) {
            case "/admin/home":
                return 0;
            case "/admin/upload":
                return 1;
            case "/admin/settings":
                return 2;
            default:
                return 0;
        }
    };
    const nameSelector = useSelector((state) => state.auth.name)
    console.log("useSelector",nameSelector)

    return (
        <div className="w-full h-screen flex justify-center items-center">
            <div className="w-full max-w-6xl h-full flex flex-col shadow-lg rounded-xl overflow-hidden">
                
                <div className="w-full shadow-md px-4 md:px-8">
                    <header className="w-full flex justify-between items-center py-4">
                        <img src={kamaLogo} alt="Kama Logo" className="w-40 h-auto" />
                        <div className="flex items-center gap-2 md:gap-3 text-[#062538]">
                            <FaUser className="text-xl md:text-2xl" />
                            <span className="text-md md:text-lg font-medium">{nameSelector ? nameSelector : "Admin/User"}</span>
                        </div>
                    </header>
                </div>

                
                <div className="w-full bg-[#1C4E6D] px-2 sm:px-3 md:px-4">
                    <nav className="flex items-center justify-between md:ml-4 lg:ml-0">
                        <div className="flex items-center gap-2 bg-[#062538] py-2 sm:py-3 md:pl-3 md:pr-16 lg:pr-33 xl:pr-40 lg:ml-4 rounded-md">
                            <BiCategoryAlt className="text-white text-lg sm:text-xl md:text-2xl" />
                            <span className="text-white text-sm sm:text-base md:text-lg font-semibold">
                                Features
                            </span>
                        </div>
                    </nav>
                </div>

                
                <div className="flex px-4 pt-2 gap-4 h-[80%]">
                   
                    <div className="bg-white md:w-46 lg:w-70 md:ml-4 h-[98%] border border-gray-300 rounded-md shadow-md flex-shrink-0">
                        <Tabs
                            value={getTabIndex()}
                            // onChange={handleTabChange}
                            orientation="vertical"
                            variant="fullWidth"
                            className="w-full"
                            sx={{
                                "& .MuiTabs-indicator": {
                                    backgroundColor: "#062538",
                                },
                            }}
                        >
                            <Tab
                                component={Link}
                                to="/admin/home"
                                icon={<FaHome className="text-lg" />}
                                label="Home"
                                iconPosition="start"
                                className="text-[#062538] font-semibold"
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    minHeight: "48px",
                                    textTransform: "none",
                                    fontSize: "0.875rem",
                                    "&.Mui-selected": {
                                        backgroundColor: "#062538",
                                        color: "white",
                                    },
                                    "& .MuiTab-wrapper": {
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        width: "100%",
                                        padding: "0 8px",
                                    },
                                    "& .MuiTab-label": {
                                        textAlign: "right",
                                        flexGrow: 1,
                                        marginLeft: "8px",
                                    },
                                }}
                            />
                            <Tab

                                component={Link}
                                to="/admin/upload"
                                icon={<FaUpload className="text-lg" />}
                                label="Upload"
                                iconPosition="start"
                                className="text-[#062538] font-semibold"
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    minHeight: "48px",
                                    textTransform: "none",
                                    fontSize: "0.875rem",
                                    "&.Mui-selected": {
                                        backgroundColor: "#062538",
                                        color: "white",
                                    },
                                    "& .MuiTab-wrapper": {
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        width: "100%",
                                        padding: "0 8px",
                                    },
                                    "& .MuiTab-label": {
                                        textAlign: "right",
                                        flexGrow: 1,
                                        marginLeft: "8px",
                                    },
                                }}
                            />
                            <Tab
                                component={Link}
                                to="/admin/settings"
                                icon={<FaCog className="text-lg" />}
                                label="Settings"
                                iconPosition="start"
                                className="text-[#062538] font-semibold"
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    minHeight: "48px",

                                    textTransform: "none",
                                    fontSize: "0.875rem",
                                    "&.Mui-selected": {
                                        backgroundColor: "#062538",
                                        color: "white",

                                    },
                                    "& .MuiTab-wrapper": {
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        width: "100%",
                                        padding: "0 8px",

                                    },
                                    "& .MuiTab-label": {
                                        textAlign: "right",
                                        flexGrow: 1,
                                        marginLeft: "8px",
                                    },
                                }}
                            />
                        </Tabs>
                    </div>

                    
                    <div className="flex-1 h-[98%] bg-gradient-to-br from-[#062538] via-[#15405B] to-[#326B8E] border border-gray-300 rounded-md shadow-md flex flex-col">
                    <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;