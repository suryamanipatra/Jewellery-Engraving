import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileUploadContext } from "../context/FileUploadContext";
import Card from "../components/Card";
import axios from "axios";
import NoProductFound from "../common/NoProductFound";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { engravings } = useContext(FileUploadContext);
  const [currentCards, setCurrentCards] = useState([]);
  const [images, setImages] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      const imageResponses = await Promise.all(
        currentCards.map(async (card) => {
          try {
            const response = await axios.get(`${API_BASE_URL}/get-file/${card.file_path}`, {
              responseType: "blob",
            });

            const blob = response.data;
            const url = URL.createObjectURL(blob);

            return {
              id: card.id,
              url,
              jewelry_upload_id: card.jewelry_upload_id
            };
          } catch (error) {
            console.error("Error fetching image:", error);
            return { id: card.id, url: null };
          }
        })
      );

      const imageMap = Object.fromEntries(imageResponses.map(img => [img.id, img]));
      console.log("imageMap", imageMap);
      setImages(imageMap);
      setIsLoading(false);
    };

    if (currentCards.length > 0) {
      fetchImages();
    } else {
      setIsLoading(false);
    }
  }, [currentCards]);

  useEffect(() => {
    const fetchCards = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/get-image?jewelry_type=`);
        if (response?.status === 200) {
          setCurrentCards(response?.data);
        }
      } catch (error) {
        if (error?.response?.data?.detail === "No matching images found") {
          setCurrentCards([]);
        }
        console.error('Error fetching cards:', error);
        setIsLoading(false);
      }
    };

    fetchCards();
  }, []);

  const handleEdit = (jewelryUploadId) => {
    const cardData = currentCards.find(card => card.jewelry_upload_id === jewelryUploadId);
    const imageData = images[cardData.id];
    console.log("cardData", cardData);
    navigate(`/edit/engraving/${jewelryUploadId}`, {
    state: {
      imageData 
    }
  });
  };

  const handleDelete = async (productId) => {
    try {
      console.log("Deleting product with ID:", productId);
      setCurrentCards(currentCards.filter(card => card.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  useEffect(() => {
    return () => {
      Object.values(images).forEach(img => {
        if (img.url) URL.revokeObjectURL(img.url);
      });
    };
  }, [images]);

  if (isLoading) {
    return <div className="p-4 md:p-6">Loading products...</div>;
  }

  return (
    <div className="p-4 md:p-6 overflow-y-auto">
      {currentCards.length === 0 ? (
        <NoProductFound/>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-4 md:gap-6">
          {console.log("currentCards", currentCards)}
          {console.log("images", images)}
          {currentCards.map((card) => (
            <Card
              key={card.id}
              id={card.id}
              upload_id={card.jewelry_upload_id}
              imageUrl={images[card.id]?.url || ''}
              isAdmin={true}
              onEdit={() => handleEdit(card.jewelry_upload_id)}
              onDelete={() => handleDelete(card.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;