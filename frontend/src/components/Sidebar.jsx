import React, { useState } from "react";
import axios from 'axios'
import { useNavigate, useLocation } from "react-router-dom";
import { AiOutlineSetting } from "react-icons/ai";
import { FaRing } from "react-icons/fa";
import { GiEarrings, GiNecklace } from "react-icons/gi";
import { MdOutlineInventory2 } from "react-icons/md";
import { BsSoundwave } from "react-icons/bs";
import { FiPlusCircle } from "react-icons/fi";
import { IoIosArrowDown, IoIosArrowUp, IoMdCloseCircle } from "react-icons/io";
import { ImCross } from "react-icons/im";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Sidebar = ({
  selectedImageId,
  engravingLines,
  engravingData,
  selectedLine,
  addEngravingLine,
  handleInputChange,
  sidebarOpen,
  setSideBarOpen,
  setSelectedLine,
  isProductTypeOpen,
  setIsProductTypeOpen,
  jewelryUploadId
}) => {
  const location = useLocation();
  const [selectedProductType, setSelectedProductType] = useState("");


const handleAddEngravingLine = async () => {
  try {
    if (!selectedImageId) {
      alert("No image selected");
      return;
    }

    const detailsRes = await axios.get(`${API_BASE_URL}/engraving-details/image/${selectedImageId}`);
    const details = detailsRes.data;
    let engravingDetail = details[details.length - 1];
    const currentLines = engravingLines.length;
    const neededLines = currentLines + 1;

    if (!engravingDetail || neededLines > engravingDetail.total_lines) {
      const newDetailRes = await axios.post(`${API_BASE_URL}/engraving-details/`, {
        jewelry_image_id: selectedImageId,
        total_lines: neededLines
      });
      engravingDetail = newDetailRes.data;
      console.log("New engraving detail created:", engravingDetail);
    }

    addEngravingLine(neededLines);
  } catch (error) {
    console.error("Error adding line:", error);
    alert("Failed to add engraving line");
  }
};



  const handleProductTypeSelect = async (productType) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/products`, {
        jewelry_upload_id: jewelryUploadId,
        product_type: productType.toLowerCase()
      });
  
      console.log("Product type updated:", response.data);
      setSelectedProductType(productType);
    } catch (error) {
      console.error("Error setting product type:", error);
      alert("Error setting product type. Please check console for details.");
    }
  };
  

  const handleLineClick = (line) => {
    setSelectedLine(line);
  };

  return (
    <div
      className={`${sidebarOpen
        ? "fixed inset-0 bg-white p-4 z-50 w-[100%] xl:mt-[12px] h-[100vh] lg:h-[80vh] border-[2px] border-[#DADADA] "
        : "hidden"
        } lg:relative lg:block lg:z-0 lg:pt-0 transition-all overflow-y-auto duration-300 ease-in-out`}
    >
      {sidebarOpen && (
        <div className="lg:hidden absolute top-2 right-2">
          <ImCross
            className="text-xl text-gray-500 cursor-pointer hover:text-gray-900"
            onClick={() => setSideBarOpen(false)}
          />
        </div>
      )}

      <div>
        <div
          className="flex items-center justify-between cursor-pointer py-2 md:py-4"
          onClick={() => setIsProductTypeOpen(!isProductTypeOpen)}
        >
          <span className="flex items-center gap-2">
            <AiOutlineSetting /> Product Type
          </span>
          {isProductTypeOpen ? <IoIosArrowDown /> : <IoIosArrowUp />}
        </div>
        {isProductTypeOpen && (
          <div className="space-y-2 md:space-y-3 ml-4 md:ml-8">
            {["Ring", "Earring", "Necklace"].map((item, index) => (
              <label
                key={index}
                htmlFor={`productType-${item}`}
                className="flex items-center gap-3 cursor-pointer p-1 hover:bg-gray-100 rounded"
              >
                <input
                  type="radio"
                  id={`productType-${item}`}
                  name="productType"
                  value={item}
                  checked={selectedProductType === item}
                  onChange={(e) => handleProductTypeSelect(e.target.value)}
                  className="form-radio h-4 w-4  accent-[#062538]"
                />
                {item === "Ring" ? (
                  <FaRing className="text-lg" />
                ) : item === "Earring" ? (
                  <GiEarrings className="text-lg" />
                ) : (
                  <GiNecklace className="text-lg" />
                )}
                <span className="text-gray-700 color-[#062538]">{item}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 md:gap-3 py-2">
        <MdOutlineInventory2 /> <span>Product Details</span>
      </div>
      <input
        type="text"
        placeholder=""
        className="w-full h-9 border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
        style={{boxShadow: "0px 7px 29px rgba(100, 100, 111, 0.25)"}}
      />

      <div className="flex items-center justify-between cursor-pointer pb-2 pt-4">
        <span className="flex items-center gap-2 md:gap-3">
          <BsSoundwave /> Engraving Lines
        </span>
        <FiPlusCircle className="cursor-pointer" onClick={handleAddEngravingLine} />
      </div>

      <div className="ml-4 md:ml-8 flex flex-col gap-2">
        <div className="flex flex-wrap gap-2 md:gap-3">
          {engravingLines.length === 0 && (
            <div className="text-gray-500 text-sm">
              No engraving lines added yet
            </div>
          )}
          {engravingLines.map((line) => (
            <div
              key={line}
              className={`w-8 h-8 md:w-10 md:h-10 flex justify-center items-center border rounded-md text-sm md:text-lg cursor-pointer ${selectedLine === line
                  ? "bg-[#15405B] text-white"
                  : "border-gray-400"
                }`}
              onClick={() => handleLineClick(line)}
            >
              {line}
            </div>
          ))}
        </div>
        {selectedLine && (
          <>
            <div className="flex items-center gap-2 pt-4">
              <span className="text-xs md:text-sm w-20">No. of char</span>
              <input
                type="number"
                placeholder=""
                className="w-20 md:w-24 h-9 border border-gray-400 rounded-md px-2 focus:outline-none"
                style={{boxShadow: "0px 7px 29px rgba(100, 100, 111, 0.25)"}}
                value={
                  selectedLine ? engravingData[selectedLine]?.charCount || "" : ""
                }
                onChange={(e) =>
                  handleInputChange(selectedLine, e.target.value, "charCount")
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs md:text-sm w-20">Font size</span>
              <input
                type="number"
                placeholder=""
                className="w-20 md:w-24 h-9 border border-gray-400 rounded-md px-2 focus:outline-none"
                style={{boxShadow: "0px 7px 29px rgba(100, 100, 111, 0.25)"}}
                value={
                  selectedLine ? engravingData[selectedLine]?.fontSize || "" : ""
                }
                onChange={(e) =>
                  handleInputChange(selectedLine, e.target.value, "fontSize")
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs md:text-sm w-20">Font color</span>
              <input
                type="color"
                value={engravingData[selectedLine]?.color || "#000000"}
                onChange={(e) => handleInputChange(selectedLine, e.target.value, "color")}
                className="h-9 w-20 cursor-pointer"
              />
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default Sidebar;