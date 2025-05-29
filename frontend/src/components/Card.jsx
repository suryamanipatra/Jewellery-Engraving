import React from 'react';
import { IoArrowRedoSharp } from "react-icons/io5";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';

const Card = ({ 
  id, 
  upload_id, 
  imageUrl, 
  isAdmin = false, 
  onEdit = () => {}, 
  onDelete = () => {} 
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="w-full 2xl:w-[15vw] md:w-[30vw] mx-auto p-5 border border-gray-300 rounded-xl bg-white hover:shadow-md transition-shadow">
      <div className="w-full h-[20vh] bg-white rounded-md mb-2.5 shadow-md flex items-center justify-center overflow-hidden">
        <img
          src={imageUrl}
          alt="product"
          className="w-full h-full object-contain"
        />
      </div>
      <p className="text-md text-gray-500 mb-0">{id}</p>
      <p className="text-sm text-black-500 mb-0">name</p>
      
      <div className="mt-2.5 flex justify-center gap-2">
        {isAdmin ? (
          <>
            <button 
              onClick={() => onEdit(id)}
              className="flex items-center px-3 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
              aria-label="Edit"
            >
              <FiEdit className="mr-1" />
              Edit
            </button>
            <button 
              onClick={() => onDelete(id)}
              className="flex items-center px-3 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
              aria-label="Delete"
            >
              <FiTrash2 className="mr-1" />
              Delete
            </button>
          </>
        ) : (
          <button 
            className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
            onClick={() => navigate(`/engraving/${upload_id}`)}
          >
            Engrave
            <IoArrowRedoSharp className="ml-2" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Card;