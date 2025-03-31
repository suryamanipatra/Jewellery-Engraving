import React, { useState, useContext, useEffect, useRef, useMemo } from "react";
import axios from 'axios'
import { useLocation } from "react-router-dom";
import { FileUploadContext } from "../context/FileUploadContext";
import kamaLogo from "../assets/kama-logo.png";
import Header from "../common/Header";
import Sidebar from "../components/Sidebar";
import ImageCarousel from "../components/engraving/ImageCarousel";
import EngravingStage from "../components/engraving/EngravingStage";
import EngravingForm from "../components/engraving/EngravingForm";
import ViewTabs from "../components/engraving/ViewTabs";
import ActionButtons from "../components/engraving/ActionButtons";
import { useImageHandling } from "../hooks/useImageHandling";
import { useEngravingHandling } from "../hooks/useEngravingHandling";
import { useKonvaHandling } from "../hooks/useKonvaHandling";
import { defaultDesign } from "../constant/engravingConstants";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const AdminEngraving = () => {
  const location = useLocation();
  const { jewelryUploadId, images } = location.state || {};
  const { files } = useContext(FileUploadContext);
  const stageRef = useRef(null);

  const { imageURLs, selectedImage, handleNext, handlePrev, startIndex, itemsPerPage } = useImageHandling(files);
  const { engravingState, handleInputChange, addEngravingLine, setSelectedLine, resetEngraving } = useEngravingHandling();
  const { konvaState, konvaActions } = useKonvaHandling();
  const { setEngravings } = useContext(FileUploadContext);
  const [currentDesign, setCurrentDesign] = useState(() => ({
    ...defaultDesign,
    ...(location.state?.engraving || {}),
    imageUrl: selectedImage || location.state?.engraving?.imageUrl || ""
  }));


  const [activeTab, setActiveTab] = useState("DigiWire");
  const [sidebarOpen, setSideBarOpen] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [isProductTypeOpen, setIsProductTypeOpen] = useState(false);
  const selectedIndex = imageURLs.indexOf(selectedImage);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const selectedImageId = images?.[selectedImageIndex]?.id;
  const backendImageURLs = useMemo(() =>
    images?.map(img => `${API_BASE_URL}/uploads/${img.file_path}`) || [],
    [images]
  );
  const [modifiedImages, setModifiedImages] = useState([]);
  const [selectedJewelleryType, setSelectedJewelleryType] = useState("");
  const [productDetails, setProductDetails] = useState("");
  // const [noOfChar, setNoOfChar] = useState([]);

  const handleSave = async () => {
    try {
      handleProductTypeSelect()
      handleAddEngravingLine()

      const engravingRes = await axios.get(
        `${API_BASE_URL}/engraving-details/image/${selectedImageId}`
      );
      console.log("engravingRes", engravingRes.data)
      const engravingDetails = await engravingRes.data;
      const engravingDetail = engravingDetails[0];


      for (const line of engravingState.engravingLines) {
        const lineData = engravingState.engravingData[line];

        console.log("image_width:", konvaState.imageDimensions.width,
        )
        console.log("image_height:", konvaState.imageDimensions.width)
        const payload = {
          engraving_id: engravingDetail.id,
          line_number: line,
          text: lineData.text,
          font_type: "Arial",
          font_size: lineData.fontSize,
          font_color: lineData.color,
          position_x: konvaState.positions[line]?.x / konvaState.scale || 0,
          position_y: konvaState.positions[line]?.y / konvaState.scale || 0,
          product_details: productDetails,
          no_of_characters: Number(lineData.charCount) || 10,
          path_coordinates: konvaState.paths[line]
        };

        const response = await axios.post(`${API_BASE_URL}/engraving-lines/`, payload);
        console.log("response", response)
        if (!response) throw new Error("Failed to save line");
      }

      const updatedDesign = {
        ...currentDesign,
        engravingLines: engravingState.engravingLines,
        engravingData: engravingState.engravingData,
        imageUrl: previewImage || selectedImage
      };

      setEngravings(prev => location.state?.engraving
        ? prev.map(item => item.id === updatedDesign.id ? updatedDesign : item)
        : [...prev, { ...updatedDesign, id: Date.now() }]
      );

      // navigate('/admin');
    } catch (error) {
      console.error("Save failed:", error);
      alert("Error saving engraving. Check console for details.");
    }
  };


  useEffect(() => {
    if (backendImageURLs.length > 0 && !selectedImage) {
      setModifiedImages([...backendImageURLs]);
    }
  }, [backendImageURLs]);



  useEffect(() => {
    setCurrentDesign(prev => ({
      ...prev,
      engravingLines: engravingState.engravingLines,
      engravingData: engravingState.engravingData,
      positions: konvaState.positions,
      paths: konvaState.paths,
      rotation: konvaState.rotation,
      showPath: konvaState.showPath
    }));
  }, [
    engravingState.engravingLines,
    engravingState.engravingData,
    konvaState.positions,
    konvaState.paths,
    konvaState.rotation,
    konvaState.showPath
  ]);


  const capturePreview = () => {
    if (stageRef.current) {
      const dataUrl = stageRef.current.toDataURL();
      const updatedImages = [...modifiedImages];
      updatedImages[selectedImageIndex] = dataUrl;
      setModifiedImages(updatedImages);
      setPreviewImage(dataUrl);
    }
  };


  useEffect(() => {
    return () => setPreviewImage(null);
  }, []);


  useEffect(() => {
    const fetchEngravingData = async () => {
      if (!selectedImageId) return;

      try {
        const res = await axios.get(`${API_BASE_URL}/engraving-details/image/${selectedImageId}`);
        const details = res.data;
        console.log('line details', details);
      } catch (error) {
        console.error('Error fetching engraving details:', error);
      }
    };

    fetchEngravingData();
  }, [selectedImageId]);

  const handleAddLine = () => {
    const newLine = addEngravingLine();
    konvaActions.addNewLine(
      newLine,
      "M50,150 Q250,50 350,150",
      { x: 50, y: 150 }
    );
  };

  useEffect(() => {
    resetEngraving();

  }, [selectedImageIndex, selectedImageId]);

  const handleAddEngravingLine = async () => {
    try {
      if (!selectedImageId) {
        alert("No image selected");
        return;
      }

      const detailsRes = await axios.get(`${API_BASE_URL}/engraving-details/image/${selectedImageId}`);
      const details = detailsRes.data;
      let engravingDetail = details[details.length - 1];
      const currentLines = engravingState.engravingLines.length;
      const neededLines = currentLines + 1;

      if (!engravingDetail || neededLines > engravingDetail.total_lines) {
        const newDetailRes = await axios.post(`${API_BASE_URL}/engraving-details/`, {
          jewelry_image_id: selectedImageId,
          total_lines: neededLines
        });
        engravingDetail = newDetailRes.data;
        console.log("New engraving detail created:", engravingDetail);
      }

      const newLine = addEngravingLine();
      konvaActions.addNewLine(
        newLine,
        "M50,150 Q250,50 350,150", 
        { x: 50, y: 150 } 
      );
    } catch (error) {
      console.error("Error adding line:", error);
      alert("Failed to add engraving line");
    }
  };


  const handleProductTypeSelect = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/products`, {
        jewelry_upload_id: jewelryUploadId,
        product_type: selectedJewelleryType.toLowerCase()
      });
    } catch (error) {
      console.error("Error setting product type:", error);
      alert("Error setting product type. Please check console for details.");
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header
        kamaLogo={kamaLogo}
        userName="Mahesh"
        setSideBarOpen={setSideBarOpen}
        setIsPopupOpen={setIsPopupOpen}
        isPopupOpen={isPopupOpen}
        handleClose={() => setIsPopupOpen(false)}
        imageURLs={modifiedImages}
        // previewImage={konvaState.previewImage}
        capturePreview={capturePreview}
        previewImage={previewImage}
        selectedIndex={selectedIndex}
        textOverlays={engravingState.engravingData}
      />

      <div className="w-full flex-grow px-2 md:px-8 flex flex-col lg:flex-row">
        <div className="lg:w-[20%] fixed">
          <Sidebar
            engravingLines={engravingState.engravingLines}
            engravingData={engravingState.engravingData}
            selectedLine={engravingState.selectedLine}
            handleInputChange={handleInputChange}
            setSelectedLine={setSelectedLine}
            sidebarOpen={sidebarOpen}
            setSideBarOpen={setSideBarOpen}
            isProductTypeOpen={isProductTypeOpen}
            setIsProductTypeOpen={setIsProductTypeOpen}
            setSelectedJewelleryType={setSelectedJewelleryType}
            selectedJewelleryType={selectedJewelleryType}
            setProductDetails={setProductDetails}
            // setNoOfChar={setNoOfChar}
            handleAddEngravingLine={handleAddEngravingLine}
          />
        </div>

        <div className="lg:w-[78%] lg:ml-[20%]">
          <div className="w-full bg-gradient-to-br from-[#062538] via-[#15405B] to-[#326B8E] mt-3 mb-2 lg:ml-6 rounded-3xl p-3 md:p-6 flex flex-col relative">
            <div className="flex flex-col lg:flex-row">
              <div className="w-full lg:w-[37%] flex flex-col mb-4 lg:mb-0">
                <ViewTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                <p className="text-white text-4xl mt-2 mb-6 ">Available Views of the Jewellery</p>
                <ImageCarousel
                  imageURLs={backendImageURLs}
                  selectedImage={backendImageURLs[selectedImageIndex]}
                  onImageSelect={(absoluteIndex) => setSelectedImageIndex(absoluteIndex)}
                  handleNext={handleNext}
                  handlePrev={handlePrev}
                  startIndex={startIndex}
                  itemsPerPage={itemsPerPage}
                />
              </div>

              <div className="w-full lg:w-[65%] h-[300px] md:h-[400px] bg-white rounded-3xl shadow-lg flex flex-col items-center justify-center lg:ml-6 p-2 md:p-4 overflow-hidden relative">
                <EngravingStage
                  ref={stageRef}
                  selectedImage={backendImageURLs[selectedImageIndex]}
                  engravingLines={engravingState.engravingLines}
                  engravingData={engravingState.engravingData}
                  konvaState={konvaState}

                  onTextDrag={konvaActions.handleTextDrag}
                  onPathDrag={konvaActions.handlePathDrag}
                />
              </div>
            </div>

            <EngravingForm
              engravingLines={engravingState.engravingLines}
              engravingData={engravingState.engravingData}
              handleInputChange={handleInputChange}
            />

            <ActionButtons
              onSave={handleSave}
              onDownload={() => console.log("Download functionality")}
              showPath={konvaState.showPath}
              onTogglePath={() => konvaActions.setShowPath(!konvaState.showPath)}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminEngraving;