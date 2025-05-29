import React, { useState, useContext } from "react";
import axios from 'axios'
import useDrivePicker from "react-google-drive-picker";
import { useNavigate } from "react-router-dom";
import { FaGoogleDrive } from "react-icons/fa";
import { MdCloudUpload } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FileUploadContext } from "../context/FileUploadContext";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Loader from "../common/Loader";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const VITE_GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const VITE_GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;


const AdminUpload = () => {
  const { files, setFiles } = useContext(FileUploadContext);
  const [viewTypes, setViewTypes] = useState([]);
  const [uploadSource, setUploadSource] = useState("local");
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [openPicker, data, setOpenPicker] = useDrivePicker();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");
  const [isLoading, setIsLoading] = useState(false);
  // const [selectedFile, setSelectedFile] = useState([]);

  const handleOpenPicker = () => {
    setUploadSource("drive");
    openPicker({
      clientId: VITE_GOOGLE_CLIENT_ID,
      developerKey: VITE_GOOGLE_API_KEY,
      viewId: "IMAGES",
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
      callbackFunction: (data) => {
        if (data.action === 'picked') {
          const driveFiles = data.docs;
          setFiles(prev => [
            ...prev,
            ...driveFiles.map(doc => ({ type: "drive", doc }))
          ]);
          setViewTypes(prev => [...prev, ...driveFiles.map(() => "front")]);
        } else {
          setSnackbarMessage("No files selected or an error occurred.");
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
        }
      }
    });
  };

  // useEffect(() => {
  //   if (data) {
  //     console.log("drive data", data);
  //     data.docs.map((i) => console.log(i))
  //   }
  // }, [data]);



  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setUploadSource("local");
    setFiles(prev => [
      ...prev,
      ...newFiles.map(file => ({ type: "local", file }))
    ]);
    setViewTypes(prev => [...prev, ...newFiles.map(() => "front")]);
    setShowAlert(false);
  };

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
    const updatedViewTypes = viewTypes.filter((_, i) => i !== index);
    setViewTypes(updatedViewTypes);
  };

  const handleViewTypeChange = (index, value) => {
    const newTypes = [...viewTypes];
    newTypes[index] = value;
    setViewTypes(newTypes);
  };

  const handleDoneClick = async () => {
    if (files.length === 0) {
      setSnackbarMessage("Please select at least one file!");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      setSnackbarMessage("Please Login!");
      navigate('/login');
      return;
    }
    setIsLoading(true);

    const formData = new FormData();
    // const userId = Math.floor(1000 + Math.random() * 9000);

    // formData.append("user_id", userId);
    formData.append("upload_source", uploadSource);
    console.log("upload files", files);
    files.forEach((item, index) => {
      console.log("item",item)
      // console.log("item", item);
      if (uploadSource === "local" && item.type === "local") {
        formData.append("files", item.file);
        formData.append("view_types", viewTypes[index]);
      } else if (uploadSource === "drive" && item.type === "drive") {
        console.log("item",item)
        formData.append("files", item.doc.name);
        formData.append("view_types", viewTypes[index]);
      }
    });
    try {
      const responseData = await axios.post(
        `${API_BASE_URL}/jewelry-uploads/`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      console.log("upload response", responseData)
      setTimeout(() => {
        navigate("/admin/engraving", {
          state: {
            jewelryUploadId: responseData?.data.upload.id,
            images: responseData?.data.images
          }
        });
      }, 3000);
    } catch (error) {
      console.error("Upload error:", error);
      setSnackbarMessage(error.response?.data?.message || 'Upload failed. Please try again.');
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }
  };

  const removeFiles = () => {
    setFiles([]);
    setViewTypes([]);
    setUploadSource("local");
  }



  return (
    <div className="w-full h-full p-4">


      {isLoading && (
        <div className="fixed inset-0 bg-white/70 backdrop-blur-sm z-50 flex items-center justify-center">
          <Loader />
        </div>
      )}

      <div className=" h-full px-4 md:px-8 flex-grow  rounded-lg flex items-center justify-center">
        <div className="bg-white p-3 sm:p-4 md:p-6 lg:p-8 rounded-lg shadow-lg max-w-2xl w-full">


          <h2 className="text-lg font-semibold">Upload Files</h2>
          <p className="text-sm text-gray-500 mb-4">Please upload files in pdf, docx, or doc format and make sure the file size is under 25 MB.</p>


          {showAlert && (
            <div className="bg-red-100 text-red-600 p-3 rounded-md text-center mb-4">
              Please select at least one file before proceeding.
            </div>
          )}


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
                {console.log("files", files)}
                {files.map((file, index) => (
                  <div key={index} className="flex justify-between items-center bg-blue-100 px-4 py-2 rounded-lg">
                    {console.log("file", file)}
                    <span className="text-gray-800 truncate">{file.doc?.name || file.docs?.name || file.file.name || "Unnamed file"}</span>

                    <div className="flex items-center gap-2">
                      <select
                        value={viewTypes[index]}
                        onChange={(e) => handleViewTypeChange(index, e.target.value)}
                        className="border rounded p-1 text-sm"
                      >
                        <option value="front">Front</option>
                        <option value="side">Side</option>
                        <option value="angled">Angled</option>
                        <option value="top">Top</option>
                      </select>
                      <button onClick={() => handleRemoveFile(index)} className="text-red-500">
                        <RiDeleteBin6Line />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            )}
          </div>


          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={() => setOpenSnackbar(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            sx={{
              '&.MuiSnackbar-root': {
                top: '24px',
                right: '24px',
                zIndex: 1400,
              }
            }}
          >
            <Alert
              onClose={() => setOpenSnackbar(false)}
              severity={snackbarSeverity}
              sx={{
                minWidth: '300px',
                backgroundColor: 'white',
                margin: 0,
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e0e0e0',
                '& .MuiAlert-icon': {
                  color: {
                    error: '#E0115F',
                    warning: '#FFBF00',
                    info: '#4B0082',
                    success: '#50C878'
                  }[snackbarSeverity]
                }
              }}
            >
              <span className={`font-medium ${snackbarSeverity === 'error' ? 'text-[#E0115F]' :
                snackbarSeverity === 'warning' ? 'text-[#FFBF00]' :
                  snackbarSeverity === 'info' ? 'text-[#4B0082]' :
                    'text-[#50C878]'}`}
              >
                {snackbarMessage}
              </span>
            </Alert>
          </Snackbar>
          <input type="file" multiple onChange={handleFileChange} className="hidden" id="fileUpload" />
          <div className="flex gap-4 justify-center mb-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-md cursor-pointer" onClick={() => handleOpenPicker()}>
              <FaGoogleDrive className="text-yellow-600" /> Upload from Drive
            </button>
            <label htmlFor="fileUpload" className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-md cursor-pointer">
              <MdCloudUpload /> Browse
            </label>
          </div>


          <div className="flex justify-center gap-6 mt-4">
            <button className="px-4 py-2 bg-gray-200 rounded-md cursor-pointer" onClick={() => removeFiles()}>Cancel</button>
            <button className={`px-4 py-2 rounded-md ${files.length === 0 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-[#062538] text-white cursor-pointer"}`} onClick={handleDoneClick} disabled={files.length === 0}>
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUpload;