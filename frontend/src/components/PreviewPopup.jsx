import { useState, useEffect } from "react"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { MdEmail } from "react-icons/md"
import { GiDiamondRing } from "react-icons/gi"
import { FaGem, FaWeightHanging, FaCubes, FaDollarSign } from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"

const PreviewPopup = ({ onClose, images, selectedIndex, productDetails, previewImage, textOverlays=[] }) => {
    const [currentIndex, setCurrentIndex] = useState(() => {
        const maxIndex = images.length - 1;
        return Math.min(selectedIndex, maxIndex);
    });
    const safeTextOverlays = Array.isArray(textOverlays) ? textOverlays : [];
    const imagesToShow = previewImage
        ? [
            ...images.slice(0, selectedIndex),
            previewImage,
            ...images.slice(selectedIndex + 1)
        ]
        : images;
    useEffect(() => {
        if (imagesToShow.length > 0 && currentIndex >= imagesToShow.length) {
            setCurrentIndex(0);
        }
    }, [imagesToShow]);
    useEffect(() => {
        setCurrentIndex(selectedIndex);
    }, [selectedIndex, previewImage]);
    useEffect(() => {
        if (imagesToShow.length > 0) {
            const maxIndex = imagesToShow.length - 1;
            setCurrentIndex(prev => {
                let newIndex = Math.min(prev, maxIndex);
                if (newIndex < 0) newIndex = 0;
                return newIndex;
            });
        } else {
            setCurrentIndex(0);
        }
    }, [imagesToShow]);

    const handleNext = () => {
        if (imagesToShow.length === 0) return;
        setCurrentIndex((prev) => (prev + 1) % imagesToShow.length);
    };

    const handlePrev = () => {
        if (imagesToShow.length === 0) return;
        setCurrentIndex((prev) =>
            (prev - 1 + imagesToShow.length) % imagesToShow.length
        );
    };
    console.log('Current preview:', {
        imagesToShow,
        currentImage: imagesToShow[currentIndex],
        previewExists: !!previewImage
    });
    const getRelativePosition = (pos, containerSize, imageSize) => {
        return (pos / imageSize) * containerSize;
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 backdrop-blur-[2px] bg-white/30 flex justify-center items-center z-50 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => {
                    if (e.target === e.currentTarget) onClose()
                }}
            >
                <motion.div
                    className="bg-gradient-to-br from-[#1C4E6D] to-[#062538] p-4 md:p-6 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col relative overflow-auto"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", damping: 25 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        className="absolute top-2 right-2 md:top-4 md:right-4 text-white text-lg font-bold hover:text-gray-300 z-10"
                        onClick={onClose}
                    >
                        ✖
                    </button>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full mb-4 mt-2 md:mt-4 gap-4">
                        <div className="text-white">
                            <h2 className="font-exo2 font-normal text-2xl md:text-[40px]">Preview...</h2>
                            <p className="font-exo2 font-normal text-lg md:text-[24px] text-gray-300 mt-2 md:mt-4">
                                How does it look? Isn't it pretty?...
                            </p>
                        </div>
                        <button className="flex items-center gap-2 bg-yellow-500 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg shadow-md hover:bg-yellow-600 text-sm md:text-base">
                            <MdEmail size={16} className="md:size-[20px]" />
                            Send Via Email
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row flex-1 w-full gap-4 md:gap-6">
                    {imagesToShow.length > 0 && imagesToShow[currentIndex] && (

                        <div className="w-full md:w-3/5 relative bg-white rounded-lg flex items-center justify-center p-2 md:p-4">
                            {console.log("Imgaes :", imagesToShow)}
                            {console.log("show :", imagesToShow[currentIndex])}
                                <img
                                    src={imagesToShow[currentIndex]}
                                    alt="Preview"
                                    className="max-w-full max-h-40 md:max-h-52 object-contain rounded-lg"
                                />
                            
                           
                            {/* Render Text Overlays */}
                            {safeTextOverlays?.map((overlay, index) => {
                                const containerWidth = 450; 
                                const containerHeight = 400;
                                const imageWidth = konvaImage?.width || 450;
                                const imageHeight = konvaImage?.height || 400;

                                const x = getRelativePosition(overlay.x, containerWidth, imageWidth);
                                const y = getRelativePosition(overlay.y, containerHeight, imageHeight);

                                return (
                                    <span
                                        key={index}
                                        className="absolute"
                                        style={{
                                            left: `${x}px`,
                                            top: `${y}px`,
                                        }}
                                    >
                                        {overlay.text}
                                    </span>
                                );
                            })}

                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={handlePrev}
                                        className="absolute left-2 bg-gray-700 text-white p-1 md:p-2 rounded-full shadow-md hover:bg-gray-900"
                                    >
                                        <FaChevronLeft size={16} className="md:size-[20px]" />
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className="absolute right-2 bg-gray-700 text-white p-1 md:p-2 rounded-full shadow-md hover:bg-gray-900"
                                    >
                                        <FaChevronRight size={16} className="md:size-[20px]" />
                                    </button>
                                </>
                            )}
                        </div>
                    )}

                        <div className="w-full md:w-2/5 bg-white p-3 md:p-5 rounded-lg flex flex-col">
                            <h3 className="text-base md:text-lg font-bold mb-2 md:mb-4">{productDetails.name}</h3>
                            <div className="text-[#062538] space-y-2 md:space-y-3 text-sm md:text-base">
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1 md:gap-2">
                                        <GiDiamondRing className="text-blue-600 md:size-[20px]" size={16} />
                                        Diamond Color:
                                    </span>
                                    <span className="font-bold">{productDetails.diamondColor}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1 md:gap-2">
                                        <FaGem className="text-purple-600 md:size-[20px]" size={16} />
                                        Diamond Quality:
                                    </span>
                                    <span className="font-bold">{productDetails.diamondQuality}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1 md:gap-2">
                                        <FaWeightHanging className="text-yellow-600 md:size-[20px]" size={16} />
                                        Gold Wt.:
                                    </span>
                                    <span className="font-bold">{productDetails.goldWeight} gm</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1 md:gap-2">
                                        <FaCubes className="text-green-600 md:size-[20px]" size={16} />
                                        Stones:
                                    </span>
                                    <span className="font-bold">{productDetails.stones}</span>
                                </div>
                                <div className="flex items-center justify-between text-base md:text-lg font-semibold">
                                    <span className="flex items-center gap-1 md:gap-2">
                                        <FaDollarSign className="text-gray-700 md:size-[20px]" size={16} />
                                        Amount:
                                    </span>
                                    <span className="font-bold">{productDetails.amount} $</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

export default PreviewPopup

