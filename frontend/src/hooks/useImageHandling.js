import { useState, useEffect, useMemo } from "react";

export const useImageHandling = (files) => {
  const [imageURLs, setImageURLs] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const itemsPerPage = 4;
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    if (files.length > 0) {
      const urls = files.map((file) => {
        console.log("hook file", file);
        return URL.createObjectURL(file.file);
      });
      console.log('Generated URLs:', urls);
      setImageURLs(urls);
      setSelectedImage(urls[0]);
      return () => urls.forEach((url) => URL.revokeObjectURL(url));
    }
  }, [files]);

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

  const result = useMemo(() => ({
    imageURLs,
    selectedImage,
    handleNext,
    handlePrev,
    startIndex,
    itemsPerPage
  }), [imageURLs, selectedImage, startIndex, itemsPerPage]);

  // console.log("useImageHandling updated:", result);

  return result;
};