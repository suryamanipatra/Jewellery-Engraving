import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

const AdminEngraving = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { jewelryUploadId, images } = location.state || {};
  const { files } = useContext(FileUploadContext);
  const stageRef = useRef(null);

  const { imageURLs, selectedImage, replaceImageAtIndex, handleImageClick, handleNext,handlePrev,startIndex,itemsPerPage } = useImageHandling(files);
  const { engravingState, handleInputChange, addEngravingLine } = useEngravingHandling();
  const { konvaState, konvaActions } = useKonvaHandling();
  const { setEngravings } = useContext(FileUploadContext);
  const [currentDesign, setCurrentDesign] = useState(() => ({
    ...defaultDesign,
    ...(location.state?.engraving || {}),
    imageUrl: selectedImage || location.state?.engraving?.imageUrl || ""
  }));


  const [activeTab, setActiveTab] = useState("Wireframe");
  const [sidebarOpen, setSideBarOpen] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [isProductTypeOpen, setIsProductTypeOpen] = useState(false);
  const selectedIndex = imageURLs.indexOf(selectedImage);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const selectedImageId = images?.[selectedImageIndex]?.id;
  const backendImageURLs = images?.map(img => `http://localhost:8000/${img.file_path}`) || [];


  const handleSaveEngravedImage = () => {
    if (stageRef.current) {
      const dataURL = stageRef.current.toDataURL();
      const currentIndex = imageURLs.indexOf(selectedImage);
      if (currentIndex !== -1) {
        replaceImageAtIndex(currentIndex, dataURL);
      }
      setPreviewImage(null); // Clear preview image after save
      handleImageClick(dataURL);
      navigate("/admin");
    }
  };
  const handleSave = () => {
    const updatedDesign = {
      ...currentDesign,
      engravingLines: engravingState.engravingLines,
      engravingData: engravingState.engravingData,
      textColor: konvaState.textColor,
      textPosition: konvaState.textPosition,
      rotation: konvaState.rotation,
      showPath: konvaState.showPath,
      path: konvaState.path,
      imageUrl: previewImage || selectedImage
    };

    setEngravings(prev => {
      if (location.state?.engraving) {
        return prev.map(item => item.id === updatedDesign.id ? updatedDesign : item);
      }
      return [...prev, { ...updatedDesign, id: Date.now() }];
    });

    navigate('/admin');
  };
  const capturePreview = () => {
    const dataUrl = stageRef.current.toDataURL();
    replaceImageAtIndex(selectedIndex, dataUrl);
    setPreviewImage(dataUrl);
  };
  useEffect(() => {
    return () => setPreviewImage(null);
  }, []);
  useEffect(() => {
    const fetchEngravingData = async () => {
      if (!selectedImageId) return;

      const res = await fetch(
        `http://localhost:8000/api/engraving-details/image/${selectedImageId}`
      );
      const details = await res.json();
      console.log("line details", details);
      if (details.length > 0) {
        setCurrentEngravingDetail(details[0]);
      }
    };

    fetchEngravingData();
  }, [selectedImageId]);

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header
        kamaLogo={kamaLogo}
        userName="Mahesh"
        setSideBarOpen={setSideBarOpen}
        setIsPopupOpen={setIsPopupOpen}
        isPopupOpen={isPopupOpen}
        handleClose={() => setIsPopupOpen(false)}
        imageURLs={imageURLs}
        // previewImage={konvaState.previewImage}
        capturePreview={capturePreview}
        previewImage={previewImage}
        selectedIndex={selectedIndex}
        textOverlays={engravingState.engravingData}
      />

      <div className="w-full flex-grow px-2 md:px-8 flex flex-col lg:flex-row">
        <Sidebar
          selectedImageId={selectedImageId}
          engravingLines={engravingState.engravingLines}
          engravingData={engravingState.engravingData}
          selectedLine={engravingState.selectedLine}
          addEngravingLine={addEngravingLine}
          handleInputChange={handleInputChange}
          setSelectedLine={engravingState.setSelectedLine}
          sidebarOpen={sidebarOpen}
          setSideBarOpen={setSideBarOpen}
          isProductTypeOpen={isProductTypeOpen}
          setIsProductTypeOpen={setIsProductTypeOpen}
          jewelryUploadId={jewelryUploadId}
        />

        <div className="w-full lg:w-[80%] bg-[#1C4E6D] mt-3 mb-2 lg:ml-6 rounded-3xl p-3 md:p-6 flex flex-col relative">
          <div className="flex flex-col lg:flex-row flex-1">
            <div className="w-full lg:w-[37%] flex flex-col items-center justify-center mb-4 lg:mb-0">
              <ViewTabs activeTab={activeTab} setActiveTab={setActiveTab} />

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
                path={konvaState.path}
                text={engravingState.engravingData[engravingState.selectedLine]?.text || ""}
                fontSize={engravingState.engravingData[engravingState.selectedLine]?.fontSize || 24}
                textColor={konvaState.textColor}
                textPosition={konvaState.textPosition}
                rotation={konvaState.rotation}
                showPath={konvaState.showPath}
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
          />
        </div>
      </div>
    </div>
  );
};

export default AdminEngraving;