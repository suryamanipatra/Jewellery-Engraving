import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { FaHome, FaUpload, FaCog } from "react-icons/fa";
import { AiFillMessage } from "react-icons/ai";
import { BiCategoryAlt } from "react-icons/bi";
import { Tabs, Tab, Drawer } from "@mui/material";
import TopHeader from "./TopHeader";
import kamaLogoWhite from '../assets/kama-logo-white.png';


const AdminLayout = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const location = useLocation();
  console.log("pathName", location.pathname);

  const getTabIndex = () => {
    switch (location.pathname) {
      case "/admin/home":
        return 0;
      case "/admin/upload":
        return 1;
      case "/admin/settings":
        return 2;
      case "/admin/manage-messages":
        return 3;
      default:
        return 0;
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-full max-w-6xl h-full flex flex-col shadow-lg rounded-xl overflow-hidden">
        <TopHeader />

        <div className="w-full bg-[#1C4E6D] px-2 sm:px-3 md:px-4">
          <nav className="flex items-center justify-between md:ml-4 lg:ml-0">
            <div
              onClick={() => {
                if (window.innerWidth < 1280) {
                  setIsDrawerOpen(true);
                }
              }
              }
              className="flex items-center gap-2 bg-[#062538] py-2 sm:py-3 md:pl-3 md:pr-16 lg:pr-33 xl:pr-40 lg:ml-4 rounded-md">
              <BiCategoryAlt className="text-white text-lg sm:text-xl md:text-2xl" />
              <span className="text-white text-sm sm:text-base md:text-lg font-semibold">
                Features
              </span>
            </div>
          </nav>
        </div>

        <div className="flex px-4 pt-2 gap-4 h-[80%] sm:mr-0 xl:mr-3">

          <div className="bg-white md:w-46 lg:w-70 md:ml-4 h-[98%] border border-gray-300 rounded-md shadow-md flex-shrink-0 sm:hidden xl:block">
            <Tabs
              value={getTabIndex()}
              // onChange={handleTabChange}
              orientation="vertical"
              variant="fullWidth"
              className="w-full p-3"
              sx={{
                "& .MuiTabs-indicator": {
                  backgroundColor: "#062538",
                },
              }}
            >
              <Tab
                component={Link}
                to="/admin/home"
                icon={<FaHome className="text-lg" style={{ marginRight: '30px' }} />}
                label="Home"
                iconPosition="start"
                className="text-[#062538] font-semibold"
                sx={tabStyle}
              />
              <Tab

                component={Link}
                to="/admin/upload"
                icon={<FaUpload className="text-lg" style={{ marginRight: '30px' }} />}
                label="Upload"
                iconPosition="start"
                className="text-[#062538] font-semibold"
                sx={tabStyle}
              />
              <Tab
                component={Link}
                to="/admin/settings"
                icon={<FaCog className="text-lg" style={{ marginRight: '30px' }} />}
                label="Settings"
                iconPosition="start"
                className="text-[#062538] font-semibold"
                sx={tabStyle}
              />
              <Tab
                component={Link}
                to="/admin/manage-messages"
                icon={<AiFillMessage className="text-lg" style={{ marginRight: '30px' }} />}
                label="Manage Messages"
                iconPosition="start"
                className="text-[#062538] font-semibold"
                sx={tabStyle}
              />
            </Tabs>
          </div>


          <div className="flex-1 h-[98%] bg-gradient-to-br from-[#062538] via-[#15405B] to-[#326B8E] border border-gray-300 rounded-md shadow-md flex flex-col overflow-y-auto">
            <Outlet />
          </div>
        </div>

        <Drawer
          className="hidden sm:block"
          anchor="left"
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          sx={{
            "& .MuiDrawer-paper": {
              width: "50vw",
              backgroundColor: "#062538",
              color: "white",
              padding: "20px",
            },
          }}
        >
          <div className="w-full flex flex-col gap-4">
            <div
              onClick={() => setIsDrawerOpen(false)}
              className="flex justify-end text-4xl cursor-pointer"
            >
              x
            </div>
            <div className="flex items-center gap-4 mb-4 p-2 mt-4">
              <img src={kamaLogoWhite} alt="Logo" className="object-cover" />
            </div>

            <h1 className="text-2xl font-bold text-white mb-4">Admin Menu</h1>

            <Tabs
              value={getTabIndex()}
              orientation="vertical"
              variant="fullWidth"
              className="w-full"
              sx={{
                "& .MuiTabs-indicator": {
                  backgroundColor: "#fff",
                },
              }}
            >
              <Tab
                component={Link}
                to="/admin/home"
                icon={<FaHome className="text-white text-lg" style={{ marginRight: "20px" }} />}
                label="Home"
                iconPosition="start"
                className="text-white font-semibold"
                sx={tabStyleForDrawer}
              />
              <Tab
                component={Link}
                to="/admin/upload"
                icon={<FaUpload className="text-white text-lg" style={{ marginRight: "20px" }} />}
                label="Upload"
                iconPosition="start"
                className="text-white font-semibold"
                sx={tabStyleForDrawer}
              />
              <Tab
                component={Link}
                to="/admin/settings"
                icon={<FaCog className="text-white text-lg" style={{ marginRight: "20px" }} />}
                label="Settings"
                iconPosition="start"
                className="text-white font-semibold"
                sx={tabStyleForDrawer}
              />
              <Tab
                component={Link}
                to="/admin/manage-messages"
                icon={<AiFillMessage className="text-white text-lg" style={{ marginRight: "20px" }} />}
                label="Manage Messages"
                iconPosition="start"
                className="text-white font-semibold"
                sx={tabStyleForDrawer}
              />
            </Tabs>
          </div>
        </Drawer>

      </div>
    </div>
  );
};

export default AdminLayout;

const tabStyle = {
  display: "flex",
  alignItems: "center",
  minHeight: "48px",
  textTransform: "none",
  fontSize: "0.875rem",
  color: "#062538",
  justifyContent: "flex-start",

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
};


const tabStyleForDrawer = {
  alignItems: "center",
  justifyContent: "start",
  textTransform: "none",
  fontSize: "1rem",
  paddingLeft: "20px",
  color: "white",
  "&.Mui-selected": {
    backgroundColor: "#1C4E6D",
    color: "white",
  },
};