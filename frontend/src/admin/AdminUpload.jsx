import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import kamaLogo from "../assets/kama-logo.png";
import { FaUser, FaGoogleDrive } from "react-icons/fa";
import { BiCategoryAlt } from "react-icons/bi";
import { AiOutlineEye } from "react-icons/ai";
import { FiRefreshCw } from "react-icons/fi";
import { MdCloudUpload } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FileUploadContext } from "../context/FileUploadContext";


const AdminUpload = () => {
  const { files, setFiles } = useContext(FileUploadContext);

  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);

  // Handle file selection from input
  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    setShowAlert(false);
  };

  // Handle drag and drop
  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
    setShowAlert(false);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };

  const handleDoneClick = () => {
    if (files.length === 0) {
      setShowAlert(true);
    } else {
      navigate("/admin/engraving");
    }
  };


  return (
    <div className="w-full h-screen flex flex-col">
      {/* Header */}
      <div className="w-full bg-white shadow-md px-4 md:px-8">
        <header className="w-full flex justify-between items-center py-4">
          <img src={kamaLogo} alt="Kama Logo" className="w-40 h-auto" />
          <div className="flex items-center gap-2 md:gap-3 text-[#062538]">
            <FaUser className="text-xl md:text-2xl" />
            <span className="text-md md:text-lg font-medium">Mahesh</span>
          </div>
        </header>
      </div>

      {/* Navigation */}
      <div className="w-full bg-[#1C4E6D] px-2 sm:px-3 md:px-4 lg:px-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-[#062538] py-2 sm:py-3 px-3 sm:px-4 md:px-5 rounded-md">
            <BiCategoryAlt className="text-white text-lg sm:text-xl md:text-2xl" />
            <span className="text-white text-sm sm:text-base md:text-lg font-semibold">Features</span>
          </div>
          <div className="flex gap-2 sm:gap-3 md:gap-4">
            <div className="flex items-center gap-2 bg-[#062538] py-2 sm:py-3 px-3 sm:px-4 md:px-5 rounded-md">
              <AiOutlineEye className="text-white text-lg sm:text-xl md:text-2xl" />
              <span className="text-white text-sm sm:text-base md:text-lg font-semibold">Preview</span>
            </div>
            <div className="flex items-center gap-2 bg-[#062538] py-2 sm:py-3 px-3 sm:px-4 md:px-5 rounded-md">
              <FiRefreshCw className="text-white text-lg sm:text-xl md:text-2xl" />
              <span className="text-white text-sm sm:text-base md:text-lg font-semibold">Refresh</span>
            </div>
          </div>
        </nav>
      </div>




      {/* Upload Section */}
      <div className="max-w-[calc(100%-2rem)] px-4 md:px-8 mt-4 mb-4 ml-8 mr-8 flex-grow bg-[#1C4E6D] rounded-lg flex items-center justify-center">
        <div className="bg-white p-3 sm:p-4 md:p-6 lg:p-8 rounded-lg shadow-lg max-w-2xl w-full">


          <h2 className="text-lg font-semibold">Upload Files</h2>
          <p className="text-sm text-gray-500 mb-4">Please upload files in pdf, docx, or doc format and make sure the file size is under 25 MB.</p>

          {/* Alert Message */}
          {showAlert && (
            <div className="bg-red-100 text-red-600 p-3 rounded-md text-center mb-4">
              Please select at least one file before proceeding.
            </div>
          )}

          {/* Drag and Drop Zone */}
          <div
            className="border-dashed border-2 border-gray-300 rounded-lg p-6 text-center mb-4 min-h-[150px] flex flex-col items-center justify-center"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {files.length === 0 ? (
              <>
                <MdCloudUpload className="text-4xl text-gray-500 mx-auto" />
                <p className="font-medium">Drop file or Browse</p>
                <p className="text-xs text-gray-400">Format: pdf, docx, doc & Max file size: 25 MB</p>
              </>
            ) : (
              <div className="w-full max-h-[150px] overflow-y-auto flex flex-col gap-2">
                {files.map((file, index) => (
                  <div key={index} className="flex justify-between items-center bg-blue-100 px-4 py-2 rounded-lg">
                    <span className="text-gray-800 truncate">{file.name}</span>
                    <button onClick={() => handleRemoveFile(index)} className="text-red-500">
                      <RiDeleteBin6Line />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* File Input */}
          <input type="file" multiple onChange={handleFileChange} className="hidden" id="fileUpload" />
          <div className="flex gap-4 justify-center mb-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-md">
              <FaGoogleDrive className="text-yellow-600" /> Upload from Drive
            </button>
            <label htmlFor="fileUpload" className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-md cursor-pointer">
              <MdCloudUpload /> Browse
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-6 mt-4">
            <button className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
            <button className={`px-4 py-2 rounded-md ${files.length === 0 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-[#062538] text-white"}`} onClick={handleDoneClick} disabled={files.length === 0}>
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUpload;