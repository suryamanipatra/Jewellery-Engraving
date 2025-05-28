import React, { useState, useEffect, use } from "react";
import axios from 'axios'
import { AiOutlineSetting } from "react-icons/ai";
import { MdOutlineInventory2 } from "react-icons/md";
import { BsSoundwave } from "react-icons/bs";
import { FiPlusCircle, FiMinusCircle } from "react-icons/fi";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { ImCross } from "react-icons/im";
import { getCategoryIcon } from "../utils/IconMapping.jsx";
import kamaLogoWhite from "../assets/kama-logo-white.png";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Sidebar = ({
  engravingLines,
  engravingData,
  selectedLine,
  handleInputChange,
  sidebarOpen,
  setSideBarOpen,
  setSelectedLine,
  isProductTypeOpen,
  setIsProductTypeOpen,
  setSelectedJewelleryType,
  selectedJewelleryType,
  setProductDetails,
  handleAddEngravingLine,
  isRefreshClicked,
  setIsRefreshClicked,
  setIsLoading,
  activeTab,
  onClose
}) => {
  const [jewelleryTypes, setJewelleryTypes] = useState([]);

  const [showInputFields, setShowInputFields] = useState(false);
  const [property, setProperty] = useState("");
  const [value, setValue] = useState("");
  const [productInfo, setProductInfo] = useState([]);


  const handleAddProperty = () => {
    if (property.trim() && value.trim()) {
      const newProductInfo = [...productInfo, { property, value }];
      setProductInfo(newProductInfo);
      setProductDetails(JSON.stringify(newProductInfo)); // Store as JSON string
      setProperty("");
      setValue("");
      setShowInputFields(false);
    }
  };

  const handleLineClick = (line) => {
    setSelectedLine(line);
  };

  useEffect(() => {
    if (isRefreshClicked) {
      setProductInfo([]);
      setProductDetails("");
      setShowInputFields(false);
      setProperty("");
      setValue("");
      setSelectedLine(null);
      setIsRefreshClicked(false);
      setIsLoading(false);
    }
  }, [isRefreshClicked, setIsRefreshClicked]);

  useEffect(() => {
    const fetchJewelleryProductTypes = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/products/get_all_jewelry_types`);
        if (response?.status === 200) {
          const temp = [];
          response?.data?.map((item) => {
            temp.push(item?.name);
          });
          console.log("Jewellery types:", temp);
          setJewelleryTypes(temp);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchJewelleryProductTypes();
  }, []);

  return (
    <div
      className={`${sidebarOpen
        ? "fixed inset-0 bg-white p-4 z-50 w-[100%] xl:mt-[12px] h-[100vh] lg:h-[80vh] border-[2px] border-[#DADADA] "
        : "hidden"
        } lg:relative lg:block lg:z-0 lg:pt-0 transition-all overflow-y-auto duration-300 ease-in-out sm:w-[60vw] lg:w-auto sm:bg-[#062538] lg:bg-white`}
    >
      {sidebarOpen && (
        // <div className="lg:hidden absolute top-2 right-2">
        //   <ImCross
        //     className="text-xl text-gray-500 cursor-pointer hover:text-gray-900"
        //     onClick={() => setSideBarOpen(false)}
        //   />
        // </div>
        
        <div className="lg:hidden">
          <div
          onClick={onClose}
          className="flex justify-end text-4xl cursor-pointer"
        >
          x
        </div>
        <div className="flex items-center gap-4 mb-4 p-2 mt-4">
          <img src={kamaLogoWhite} alt="Logo" className="object-cover" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-4">Engraving Panel</h1>
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

        {jewelleryTypes.length !== 0 && isProductTypeOpen && (
          <div className="space-y-2 md:space-y-3 ml-4 md:ml-8 h-32 overflow-y-auto border border-gray-300 rounded-md p-2 shadow-md">
            {jewelleryTypes.map((item, index) => (
              <label
                // key={index}
                key={`${item}-${selectedJewelleryType}`}
                htmlFor={`productType-${item}`}
                className="flex items-center gap-3 cursor-pointer p-1 hover:bg-gray-100 rounded"
              >
                <input
                  type="radio"
                  id={`productType-${item}`}
                  name="productType"
                  value={item}
                  checked={selectedJewelleryType === item}
                  onChange={(e) => setSelectedJewelleryType(e.target.value)}
                  className="form-radio h-4 w-4  accent-[#062538]"
                />
                {getCategoryIcon(item)}
                <span className="text-white color-[#062538] xl:text-gray-700 xl:color-[#062538]">{item}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* <div className="flex items-center gap-2 md:gap-3 py-2">
        <MdOutlineInventory2 /> <span>Product Details</span>
      </div>
      <textarea
        placeholder=""
        className="w-full h-9 border border-gray-300 rounded-md px-3 py-2 focus:outline-none resize-y"
        onChange={(e) => setProductDetails(e.target.value)}
        style={{ boxShadow: "0px 7px 29px rgba(100, 100, 111, 0.25)" }}
      /> */}


      <div className="flex items-center justify-between py-2 mt-2">
        <div className="flex items-center gap-2 md:gap-3">
          <MdOutlineInventory2 />
          <span>Product Details</span>
        </div>
        <FiPlusCircle
          className="cursor-pointer text-xl"
          onClick={() => setShowInputFields(true)}
        />
      </div>

      {showInputFields && (
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            placeholder="Property"
            value={property}
            onChange={(e) => setProperty(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none w-1/2"
          />
          <input
            type="text"
            placeholder="Value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none w-1/2"
          />
          <button
            className="bg-[#062538] text-white px-3 py-1 rounded-md cursor-pointer"
            onClick={handleAddProperty}
          >
            ✓
          </button>
        </div>
      )}


      {productInfo.length !== 0 && (
        <div className="mt-3 space-y-2 md:space-y-3 ml-4 md:ml-8 max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2 shadow-md">
          {productInfo.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-1">
              <div className="flex gap-2">
                <span className="font-semibold">{item.property}:</span>
                <span>{item.value}</span>
              </div>
              <FiMinusCircle
                className="cursor-pointer text-red-500 text-lg"
                onClick={() => {
                  const updatedInfo = productInfo.filter((_, i) => i !== index);
                  setProductInfo(updatedInfo);
                  setProductDetails(JSON.stringify(updatedInfo));
                }}
              />
            </div>
          ))}
        </div>
      )}


      <div className="flex items-center justify-between cursor-pointer pb-2 pt-4">
        <span className="flex items-center gap-2 md:gap-3">
          <BsSoundwave /> Engraving Lines
        </span>
        <FiPlusCircle
          className="cursor-pointer text-xl"
          onClick={handleAddEngravingLine}
          // style={{
          //   visibility: activeTab === "Pencil" ? "visible" : "visible" // Always show
          // }}
        />
        {/* <FiPlusCircle className="cursor-pointer text-xl" onClick={handleAddEngravingLine} /> */}
      </div>

      <div className="ml-4 md:ml-8 flex flex-col gap-2">
        <div className="flex flex-wrap gap-2 md:gap-3">
          {engravingLines.length === 0 && (
             <div className="text-gray-500 text-sm">
             {activeTab === "Pencil" ? "Click + to start drawing" : "No engraving lines added yet"}
           </div>
          )}
          {engravingLines.map((line) => (
      <div
        key={line}
        className={`w-8 h-8 md:w-10 md:h-10 flex justify-center items-center border rounded-md text-sm md:text-lg cursor-pointer ${
          selectedLine === line
            ? "bg-[#15405B] text-white"
            : "border-gray-400"
        }`}
        onClick={() => handleLineClick(line)}
      >
        {line}
      </div>
    ))}

          {/* {engravingLines.map((line) => (
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
          ))} */}
        </div>
        {selectedLine && (
          <>
            <div className="flex items-center gap-2 pt-4">
              <span className="text-xs md:text-sm w-20">No. of char</span>
              <input
                type="number"
                placeholder=""
                className="w-20 md:w-24 h-9 border border-gray-400 rounded-md px-2 focus:outline-none"
                style={{ boxShadow: "0px 7px 29px rgba(100, 100, 111, 0.25)" }}
                value={engravingData[selectedLine]?.charCount ?? 10}
                onChange={(e) => {
                  let value = e.target.value;

                  if (value.length > 1 && value.startsWith("0")) {
                    value = value.replace(/^0+/, "");
                  }

                  handleInputChange(selectedLine, value, "charCount");
                }}
              />

            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs md:text-sm w-20">Font size</span>
              <input
                type="number"
                placeholder=""
                className="w-20 md:w-24 h-9 border border-gray-400 rounded-md px-2 focus:outline-none"
                style={{ boxShadow: "0px 7px 29px rgba(100, 100, 111, 0.25)" }}
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