import React from "react";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";

const ImageCarousel = ({
  imageURLs,
  selectedImage,
  handleImageClick,
  handleNext,
  handlePrev,
  startIndex,
  itemsPerPage
}) => {
  const visibleImages = imageURLs.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="relative flex items-center justify-center w-full">
      <button
        onClick={handlePrev}
        disabled={startIndex === 0}
        className="absolute left-[-10px] md:left-[-20px] top-1/2 transform -translate-y-1/2 p-1 md:p-2 rounded-full shadow-md text-white bg-gray-700 disabled:opacity-50"
      >
        <FaChevronLeft size={18} className="md:text-2xl" />
      </button>

      {/* <div className="grid grid-cols-2 gap-2 md:gap-4 min-h-[180px] md:min-h-[260px]">
        {console.log("visibleImages", visibleImages)}
        
        {visibleImages.map((url, index) => (
          <div
            key={index}
            className={`w-[80px] h-[80px] md:w-[120px] md:h-[120px] flex items-center justify-center shadow-md overflow-hidden rounded-xl md:rounded-3xl cursor-pointer border-2 ${
              selectedImage === url ? "border-blue-500" : "border-transparent"
            }`}
            onClick={() => handleImageClick(url)}
          >
            <img
              src={url}
              alt={`Uploaded ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div> */}
      <div className="grid grid-cols-2 gap-2 md:gap-4 min-h-[180px] md:min-h-[260px]">
  {console.log("visibleImages", visibleImages)}

  {visibleImages.length > 0 ? (
    visibleImages.map((url, index) => (
      <div
        key={index}
        className={`w-[80px] h-[80px] md:w-[120px] md:h-[120px] flex items-center justify-center shadow-md overflow-hidden rounded-xl md:rounded-3xl cursor-pointer border-2 ${
          selectedImage === url ? "border-blue-500" : "border-transparent"
        }`}
        onClick={() => handleImageClick(url)}
      >
        <img
          src={url}
          alt={`Uploaded ${index + 1}`}
          className="w-full h-full object-cover"
        />
      </div>
    ))
  ) : (
    Array.from({ length: 4 }).map((_, index) => (
      <div
        key={index}
        className="w-[80px] h-[80px] md:w-[120px] md:h-[120px] flex items-center justify-center shadow-md overflow-hidden rounded-xl md:rounded-3xl border-2  border-gray-500"
      >
        
        <span className="text-gray-400">Image</span>
      </div>
    ))
  )}
</div>


      <button
        onClick={handleNext}
        disabled={startIndex + itemsPerPage >= imageURLs.length}
        className="absolute right-[-10px] md:right-[-20px] top-1/2 transform -translate-y-1/2 p-1 md:p-2 rounded-full shadow-md text-white bg-gray-700 disabled:opacity-50"
      >
        <FaChevronRight size={18} className="md:text-2xl" />
      </button>
    </div>
  );
};

export default ImageCarousel;