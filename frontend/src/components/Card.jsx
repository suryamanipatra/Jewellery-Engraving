import React from 'react';
import { IoArrowRedoSharp } from "react-icons/io5";
import kamaLogo from "../assets/login-logo.png";
import { useNavigate } from 'react-router-dom';

const Card = ({ id, upload_id,imageUrl }) => {
  const navigate = useNavigate();
    return (
      <div className="w-full 2xl:w-[15vw] md:w-[30vw] mx-auto p-5 border border-gray-300 rounded-xl bg-white">
        <div className="w-full h-[20vh] bg-gray-100 rounded-md mb-2.5">
          
            <img
              src={imageUrl}
              alt="name"
              className="w-full h-full object-contain"
            />
        </div>
        <p className="text-md text-gray-500 mb-0">{id}</p>
        <p className="text-sm text-black-500 mb-0">name</p>
        <div className="mt-2.5 flex justify-center">
          <button 
            className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 cursor-pointer"
            onClick={() => navigate(`/engraving/${upload_id}`)}
          >
            Engrave
            <IoArrowRedoSharp className="ml-2 text-white" />
          </button>
        </div>
      </div>
    );
  };

export default Card; 
