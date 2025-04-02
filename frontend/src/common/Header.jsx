// Header.jsx
import React from "react";
// import { FaUser } from "react-icons/fa";
import { BiCategoryAlt } from "react-icons/bi";
import { AiOutlineEye } from "react-icons/ai";
import { FiRefreshCw } from "react-icons/fi";
import PreviewPopup from "../components/PreviewPopUp";
import { useSelector } from "react-redux";
import TopHeader from "./TopHeader";

const Header = ({
  kamaLogo,
  userName,
  setSideBarOpen,
  setIsPopupOpen,
  isPopupOpen,
  handleClose,
  imageURLs,
  capturePreview,
  previewImage,
  selectedIndex,
  textOverlays = {},
}) => {
  const handlePreviewClick = () => {
    capturePreview();
    setIsPopupOpen(true);
  };
  const nameSelector = useSelector((state) => state.auth.name);
  console.log("useSelector", nameSelector);
  return (
    <div className="w-full sticky top-0 z-50 bg-white">
      {/* <div className="w-full bg-white shadow-md px-4 md:px-8">
                <header className="w-full flex justify-between items-center py-3 md:py-4">
                    <img src={kamaLogo} alt="Kama Logo" className="w-24 md:w-40 h-auto" />
                    <div className="flex items-center gap-1 md:gap-3 text-[#062538]">
                        <FaUser className="text-lg md:text-2xl" />
                        <span className="text-sm md:text-lg font-medium">{nameSelector}</span>
                    </div>
                </header>
            </div> */}

      <TopHeader />

      {/* Navigation */}
      <div className="w-full bg-[#1C4E6D] px-2 md:px-8">
        <nav className="flex flex-wrap items-center justify-between">
          <div
            onClick={() => {
              if (window.innerWidth < 1200) {
                setSideBarOpen((prev) => !prev);
              }
            }}
            className="flex items-center gap-1 md:gap-2 bg-[#062538] py-2 md:py-4 px-3 md:px-6 rounded-md sm:mb-0 cursor-pointer"
          >
            <BiCategoryAlt className="text-white text-xl md:text-3xl" />
            <span className="text-white text-sm md:text-xl font-semibold">
              Features
            </span>
          </div>

          <div className="flex flex-wrap gap-2 md:gap-4">
            <div
              className="flex items-center gap-1 md:gap-2 bg-[#062538] py-2 md:py-4 px-3 md:px-6 rounded-md cursor-pointer"
              onClick={handlePreviewClick}
            >
              <AiOutlineEye className="text-white text-xl md:text-3xl" />
              <span className="text-white text-sm md:text-xl font-semibold">
                Preview
              </span>
            </div>
            <div className="flex items-center gap-1 md:gap-2 bg-[#062538] py-2 md:py-4 px-3 md:px-6 rounded-md">
              <FiRefreshCw className="text-white text-xl md:text-3xl" />
              <span className="text-white text-sm md:text-xl font-semibold">
                Refresh
              </span>
            </div>
          </div>
        </nav>
      </div>

      {isPopupOpen && (
        <PreviewPopup
          onClose={handleClose}
          images={imageURLs}
          previewImage={previewImage}
          productDetails={{
            name: "GenZ Silver Necklace",
            diamondColor: "Red",
            diamondQuality: "2",
            goldWeight: "5",
            stones: "2",
            amount: "200",
          }}
          selectedIndex={selectedIndex}
          textOverlays={textOverlays}
        />
      )}
    </div>
  );
};

export default Header;
