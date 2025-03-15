import React,{useState} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AiOutlineSetting } from "react-icons/ai";
import { FaRing } from "react-icons/fa";
import { GiEarrings, GiNecklace } from "react-icons/gi";
import { MdOutlineInventory2 } from "react-icons/md";
import { BsSoundwave } from "react-icons/bs";
import { FiPlusCircle } from "react-icons/fi";
import { IoIosArrowDown, IoIosArrowUp, IoMdCloseCircle } from "react-icons/io";
import { ImCross } from "react-icons/im";

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

      const detailsRes = await fetch(
        `http://localhost:8000/api/engraving-details/image/${selectedImageId}`
      );
      const details = await detailsRes.json();
      let engravingDetail = details[details.length - 1];
      const currentLines = engravingLines.length;
      const neededLines = currentLines + 1;
      if (!engravingDetail || neededLines > engravingDetail.total_lines) {
        const newDetailRes = await fetch("http://localhost:8000/api/engraving-details/", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            jewelry_image_id: selectedImageId,
            total_lines: neededLines
          })
        });
        engravingDetail = await newDetailRes.json();
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
      const response = await fetch("http://localhost:8000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jewelry_upload_id: jewelryUploadId,
          product_type: productType.toLowerCase()
        })
      });

      if (!response.ok) {
        throw new Error("Failed to set product type");
      }

      const result = await response.json();
      console.log("Product type updated:", result);
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
      className={`${
        sidebarOpen
          ? "fixed inset-0 bg-white p-4 z-50 w-[40%] xl:mt-0 overflow-y-auto h-[100vh]"
          : "hidden"
      } lg:relative lg:block lg:z-0 lg:pt-0 lg:w-[20%] md:w-[40%] sm:w-[40%] transition-all overflow-y-auto duration-300 ease-in-out`}
    >
      {/* Close Icon for Mobile View */}
      {sidebarOpen && (
        <div className="lg:hidden absolute top-2 right-2">
          <ImCross
            className="text-xl text-gray-500 cursor-pointer hover:text-gray-900"
            onClick={() => setSideBarOpen(false)}
          />
        </div>
      )}

      {/* Product Type Dropdown */}
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
              <div
                key={index}
                className={`flex items-center gap-2 md:gap-3 cursor-pointer ${
                  selectedProductType === item ? "text-blue-500" : ""
                }`}
                onClick={() => handleProductTypeSelect(item)}
              >
                {item === "Ring" ? (
                  <FaRing />
                ) : item === "Earring" ? (
                  <GiEarrings />
                ) : (
                  <GiNecklace />
                )}
                <span>{item}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex items-center gap-2 md:gap-3 py-2">
        <MdOutlineInventory2 /> <span>Product Details</span>
      </div>
      <input
        type="text"
        placeholder=""
        className="w-full h-9 border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
      />

      {/* Engraving Lines Section */}
      <div className="flex items-center justify-between cursor-pointer py-2">
        <span className="flex items-center gap-2 md:gap-3">
          <BsSoundwave /> Engraving Lines
        </span>
        <FiPlusCircle className="cursor-pointer" onClick={handleAddEngravingLine} />
      </div>

      <div className="ml-4 md:ml-8 flex flex-col gap-2">
        <div className="flex flex-wrap gap-2 md:gap-3">
          {engravingLines.map((line) => (
            <div
              key={line}
              className={`w-8 h-8 md:w-10 md:h-10 flex justify-center items-center border rounded-md text-sm md:text-lg cursor-pointer ${
                selectedLine === line
                  ? "bg-blue-500 text-white"
                  : "border-gray-400"
              }`}
              onClick={() => handleLineClick(line)}
            >
              {line}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs md:text-sm w-20">No. of char</span>
          <input
            type="number"
            placeholder=""
            className="w-20 md:w-24 h-9 border border-gray-400 rounded-md px-2 focus:outline-none"
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
            value={
              selectedLine ? engravingData[selectedLine]?.fontSize || "" : ""
            }
            onChange={(e) =>
              handleInputChange(selectedLine, e.target.value, "fontSize")
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;