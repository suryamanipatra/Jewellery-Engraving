// Header.jsx
import React from "react";
// import { FaUser } from "react-icons/fa";
import { BiCategoryAlt } from "react-icons/bi";
import { AiOutlineEye } from "react-icons/ai";
import { RiRefreshFill } from "react-icons/ri";
import PreviewPopup from "../components/PreviewPopUp";
import { useSelector } from "react-redux";
import TopHeader from "./TopHeader";
import { set } from "lodash";

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
  setSelectedJewelleryType,
  setProductDetails,
  resetEngraving,
  setIsRefreshClicked,
  setIsLoading,
  productDetails,
  isDrawerOpen,
  setIsDrawerOpen,
}) => {
  // console.log("productDetails", productDetails);
  const handlePreviewClick = () => {
    capturePreview();
    setIsPopupOpen(true);
  };

  return (
    <div className="w-full sticky top-0 z-50 bg-white">
     

      <TopHeader />

      {/* Navigation */}
      <div className="w-full bg-[#1C4E6D] px-2 md:px-8">
        <nav className="flex flex-wrap items-center justify-between">
          <div
            // onClick={() => {
            //   if (window.innerWidth < 1200) {
            //     setSideBarOpen((prev) => !prev);
            //   }
            // }}
            onClick={() => {
              if (window.innerWidth < 1280) {
                setIsDrawerOpen(true);
              }
            }
            }
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
            <div 
              onClick={() => {
                setTimeout(() => {
                  setIsRefreshClicked(true);
                }, 2000);

                setIsLoading(true);
                setSelectedJewelleryType("");
                setProductDetails("");
                resetEngraving();
              }}
              className="flex items-center gap-1 md:gap-2 bg-[#062538] py-2 md:py-4 px-3 md:px-6 rounded-md">
              <RiRefreshFill className="text-white text-xl md:text-3xl" />
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
          productDetails={productDetails}
          selectedIndex={selectedIndex}
          textOverlays={textOverlays}
        />
      )}
    </div>
  );
};

export default Header;
