import { useState, useEffect } from "react";

export const useImageHandling = (files) => {
  const [imageURLs, setImageURLs] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const itemsPerPage = 4;
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    console.log('Files changed:', files);
    if (files.length > 0) {
      const urls = files.map((file) => URL.createObjectURL(file));
      console.log('Generated URLs:', urls);
      setImageURLs(urls);
      setSelectedImage(urls[0]);
      return () => urls.forEach((url) => URL.revokeObjectURL(url));
    }
  }, [files]);

  const handleImageClick = (url) => {
    setSelectedImage(url);
  };
  const replaceImageAtIndex = (index, newUrl) => {
    console.log("new url", newUrl);
    setImageURLs(prev => {
      const newUrls = [...prev];
      if (index >= 0 && index < newUrls.length) {
        URL.revokeObjectURL(newUrls[index]);
        newUrls[index] = newUrl;
      }
      return newUrls;
    });
  };

  const handleNext = () => {
    if (startIndex + itemsPerPage < imageURLs.length) {
      setStartIndex(startIndex + itemsPerPage);
    }
  };

  const handlePrev = () => {
    if (startIndex - itemsPerPage >= 0) {
      setStartIndex(startIndex - itemsPerPage);
    }
  };

  return {
    imageURLs,
    replaceImageAtIndex,
    selectedImage,
    handleImageClick,
    handleNext,
    handlePrev,
    startIndex,
    itemsPerPage
  };
};