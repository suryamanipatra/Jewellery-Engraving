import React, { useState, useContext, useEffect, useRef, useMemo, use } from "react";
import axios from 'axios'
import { useLocation, useParams } from "react-router-dom";
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
import Loader from "../common/Loader";
import { Snackbar, Alert } from "@mui/material";
import PencilStage from "../components/engraving/PencilStage";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const AdminEditEngraving = () => {
    const location = useLocation();
    const { id } = useParams();
    const { imageData } = location.state || {};
    const targetId = id;
    const imageArray = Object.values(imageData || {});
    const matchedImage = imageArray.find(item => item.id === targetId);
    const cleanedURL = matchedImage?.url?.startsWith('blob:')
        ? matchedImage.url.replace('blob:', '')
        : matchedImage?.url || '';
    //   console.log("imageData", imageData)
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
    const selectedIndex = imageURLs.indexOf(selectedImage);
    const [isProductTypeOpen, setIsProductTypeOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(id);
    const selectedImageId = id;
    const [backendImageURLs, setBackendImageURLs] = useState(cleanedURL ? [cleanedURL] : []);
    const [modifiedImages, setModifiedImages] = useState([]);
    const [selectedJewelleryType, setSelectedJewelleryType] = useState("");
    const [productDetails, setProductDetails] = useState("");
    const [isRefreshClicked, setIsRefreshClicked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const isSaveConfigurationClickedRef = useRef(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [drawingPhase, setDrawingPhase] = useState('idle');
    const [isDrawingMode, setIsDrawingMode] = useState(false);


    useEffect(() => {
        const fetchFullEngravingDetails = async () => {
            setIsLoading(true);
            try {
                const res = await axios.get(`${API_BASE_URL}/get-details?jewelry_upload_id=${id}`);
                res.data.forEach(item => {
                    const {
                        product: { product_type },
                        engraving_details
                    } = item;

                    const engravingLines = engraving_details?.flatMap(detail => detail.engraving_lines) || [];

                    console.log("Product Type:", product_type);
                    console.log("Engraving Lines:", engravingLines);
                    if (engravingLines.length > 0 && engravingLines[0].product_details) {
                        setProductDetails(engravingLines[0].product_details);
                    }
                    if (product_type) {
                        setSelectedJewelleryType(product_type);
                    }

                    if (engravingLines?.length > 0) {
                        resetEngraving();
                        const initialEngravingData = {};
                        engravingLines.forEach(line => {
                            const newLine = addEngravingLine(line.line_number, {
                                text: line.text,
                                font_size: line.font_size,
                                font_color: line.font_color,
                                no_of_characters: line.no_of_characters
                            });
                            // Set positions and paths if they exist
                            if (line.position_x && line.position_y) {
                                konvaActions.setPositions(prev => ({
                                    ...prev,
                                    [newLine]: {
                                        x: line.position_x,
                                        y: line.position_y
                                    }
                                }));
                            }
                            if (line.path_coordinates) {
                                konvaActions.setPaths(prev => ({
                                    ...prev,
                                    [newLine]: line.path_coordinates
                                }));
                            }
                        });
                    }
                });
            } catch (error) {
                console.error("Error fetching full engraving details:", error);
            } finally {
                setTimeout(() => setIsLoading(false), 3000);
            }
        };

        fetchFullEngravingDetails();
    }, [id]);


    useEffect(() => {
        if (activeTab === "Pencil") {
            // if (!engravingState.engravingLines.includes(1)) {
            //   resetEngraving();
            //   addEngravingLine();
            // }
            setDrawingPhase('awaitingFirstPoint');
        } else {
            setDrawingPhase('idle');
        }
    }, [activeTab]);

    const handleSave = async () => {
        try {
            if (!engravingState.engravingLines.length || !engravingState.engravingData || (selectedJewelleryType === "") || (productDetails === "")) {
                setSnackbarMessage("Please add all engraving details before saving!");
                setSnackbarSeverity("warning");
                setSnackbarOpen(true);
                return;
            }

            isSaveConfigurationClickedRef.current = true;

            setIsLoading(true);
            handleProductTypeSelect()
            // handleAddEngravingLine(true)
            handleAddEngravingLine()
            const engravingRes = await axios.get(
                `${API_BASE_URL}/engraving-details/image/${selectedImageId}`
            );
            console.log("engravingRes", engravingRes?.data)
            const engravingDetails = await engravingRes?.data;
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
                    path_coordinates: konvaState.paths[line],
                    engraved_by: activeTab,
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
            setSnackbarMessage("Engraving saved successfully!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
        } catch (error) {
            console.error("Save failed:", error);
            // alert("Error saving engraving. Check console for details.");
            setSnackbarMessage("Error saving engraving!");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        } finally {
            isSaveConfigurationClickedRef.current = false;
            setTimeout(() => {
                setIsLoading(false);
            }
                , 3000);
        }
    };


    useEffect(() => {
        if (backendImageURLs.length > 0 && !selectedImage) {
            setModifiedImages([...backendImageURLs]);
        }
    }, []);



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
            setIsLoading(true);
            try {
                const res = await axios.get(`${API_BASE_URL}/engraving-details/image/${selectedImageId}`);
                const details = res.data;
                console.log('line details', details);

                if (details && details.length > 0) {
                    const latest = details[details.length - 1];
                    const lines = await axios.get(`${API_BASE_URL}/engraving-lines/engraving/${latest.id}`);
                    const lineData = lines.data;
                    resetEngraving();
                    const engravingLines = [];
                    const engravingData = {};
                    const positions = {};
                    const paths = {};

                    lineData.forEach((line, index) => {
                        const newLine = addEngravingLine(line.line_number, {
                            text: line.text,
                            font_size: line.font_size,
                            font_color: line.font_color,
                            no_of_characters: line.no_of_characters
                        });
                        if (line.position_x && line.position_y) {
                            konvaActions.setPositions(prev => ({
                                ...prev,
                                [newLine]: {
                                    x: line.position_x,
                                    y: line.position_y
                                }
                            }));
                        }
                        if (line.path_coordinates) {
                            konvaActions.setPaths(prev => ({
                                ...prev,
                                [newLine]: line.path_coordinates
                            }));
                        }
                    });
                }

            } catch (error) {
                console.error('Error fetching engraving details:', error);
            } finally {
                setTimeout(() => setIsLoading(false), 3000);
            }
        };

        fetchEngravingData();
    }, [selectedImageId]);



    useEffect(() => {
        resetEngraving();

    }, [selectedImageIndex, selectedImageId]);

    const handleAddEngravingLine = async () => {
        try {
            if (isSaveConfigurationClickedRef.current) return;
            if (!selectedImageId) {
                alert("No image selected");
                return;
            }

            if (activeTab === "Pencil") {
                const newLine = addEngravingLine();
                setSelectedLine(newLine);
                setDrawingPhase('awaitingFirstPoint');
            }
            setIsLoading(true);
            const detailsRes = await axios.get(
                `${API_BASE_URL}/engraving-details/image/${selectedImageId}`
            );
            const details = detailsRes?.data;

            if (isSaveConfigurationClickedRef.current) return;

            let engravingDetail = details[details.length - 1];
            const currentLines = engravingState.engravingLines.length;
            const neededLines = currentLines + 1;

            if (!engravingDetail || neededLines > engravingDetail.total_lines) {
                const newDetailRes = await axios.post(`${API_BASE_URL}/engraving-details/`, {
                    jewelry_image_id: selectedImageId,
                    total_lines: neededLines
                });
                engravingDetail = newDetailRes.data;
            }

            // DigiWire-specific line creation
            if (activeTab !== "Pencil") {
                const newLine = addEngravingLine();
                konvaActions.addNewLine(
                    newLine,
                    "M25,75 Q125,25 175,75",
                    { x: 50, y: 150 }
                );
            }

        } catch (error) {
            console.error("Error adding line:", error);
            alert("Failed to add engraving line");
        } finally {
            isSaveConfigurationClickedRef.current = false;
            setTimeout(() => setIsLoading(false), 3000);
        }
    };

    useEffect(() => {
        if (drawingPhase === 'idle' && isDrawingMode) {
            const newLine = engravingState.engravingLines.length + 1;
            addEngravingLine();
            konvaActions.addNewLine(
                newLine,
                konvaState.tempPath,
                konvaState.tempStartPoint
            );
            setIsDrawingMode(false);
        }
    }, [drawingPhase, isDrawingMode, engravingState.engravingLines.length, addEngravingLine, konvaActions, konvaState]);


    const handleProductTypeSelect = async () => {
        try {
            setIsLoading(true);
            const response = await axios.post(`${API_BASE_URL}/products`, {
                jewelry_upload_id: jewelryUploadId,
                product_type: selectedJewelleryType.toLowerCase()
            });
        } catch (error) {
            console.error("Error setting product type:", error);
            alert("Error setting product type. Please check console for details.");
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }
                , 3000);
        }
    };


    const downloadParticularEngravedImage = () => {
        if (!stageRef.current) return;

        const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 });

        const link = document.createElement("a");
        link.href = dataURL;
        link.download = `engraved_image_${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        <div className="w-full min-h-screen flex flex-col">
            {isLoading && (
                <div className="fixed inset-0 z-54 bg-white/70 backdrop-blur-sm z-50 flex items-center justify-center">
                    <Loader />
                </div>
            )}

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
                setSelectedJewelleryType={setSelectedJewelleryType}
                setProductDetails={setProductDetails}
                resetEngraving={resetEngraving}
                setIsRefreshClicked={setIsRefreshClicked}
                setIsLoading={setIsLoading}
                productDetails={productDetails}
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
                        isRefreshClicked={isRefreshClicked}
                        setIsRefreshClicked={setIsRefreshClicked}
                        setIsLoading={setIsLoading}
                        activeTab={activeTab}
                        productDetails={productDetails}
                    />
                </div>

                <div className="lg:w-[78%] lg:ml-[20%]">
                    <div className="w-full bg-gradient-to-br from-[#062538] via-[#15405B] to-[#326B8E] mt-3 mb-2 lg:ml-6 rounded-3xl p-3 md:p-6 flex flex-col">
                        <div className="flex flex-col lg:flex-row ">
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
                                {activeTab === "DigiWire" ? (
                                    <EngravingStage
                                        ref={stageRef}
                                        selectedImage={backendImageURLs[selectedImageIndex]}
                                        engravingLines={engravingState.engravingLines}
                                        engravingData={engravingState.engravingData}
                                        konvaState={konvaState}
                                        onTextDrag={konvaActions.handleTextDrag}
                                        onPathDrag={konvaActions.handlePathDrag}
                                    />
                                ) : (
                                    <PencilStage
                                        ref={stageRef}
                                        selectedImage={backendImageURLs[selectedImageIndex]}
                                        konvaState={konvaState}
                                        konvaActions={konvaActions}
                                        engravingData={engravingState.engravingData}
                                        scale={konvaState.scale}
                                        onTextDrag={konvaActions.handleTextDrag}
                                        drawingPhase={drawingPhase}
                                        setDrawingPhase={setDrawingPhase}
                                        selectedLine={engravingState.selectedLine}
                                        engravingLines={engravingState.engravingLines}
                                    />
                                )}
                            </div>
                        </div>

                        <EngravingForm
                            engravingLines={engravingState.engravingLines}
                            engravingData={engravingState.engravingData}
                            handleInputChange={handleInputChange}
                        />

                        <ActionButtons
                            onSave={handleSave}
                            onDownload={downloadParticularEngravedImage}
                            konvaState={konvaState}
                            konvaActions={konvaActions}
                            engravingLines={engravingState.engravingLines}
                            activeTab={activeTab}
                        // showPath={konvaState.showPath}
                        // onTogglePath={() => konvaActions.setShowPath(!konvaState.showPath)}
                        />
                    </div>
                </div>

            </div>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} variant="filled" sx={{ width: "100%" }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default AdminEditEngraving;