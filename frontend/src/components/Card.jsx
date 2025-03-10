import React from 'react';
import { IoArrowRedoSharp } from "react-icons/io5";

const Card = ({ imageUrl, name, onEngrave }) => {
    return (
      <div className="w-full max-w-[300px] mx-auto p-5 border border-gray-300 rounded-xl bg-white">
        <div className="w-full h-[150px] bg-gray-100 rounded-md mb-2.5">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-contain"
            />
          )}
        </div>
        <h4 className="text-lg font-bold text-black mb-0">{name}</h4>
        {/* <h4 className='tex-lg font-bold text-black mb-0'>{}</h4> */}
        <div className="mt-2.5 flex justify-center">
          <button 
            onClick={onEngrave}
            className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
          >
            Engrave
            <IoArrowRedoSharp className="ml-2 text-white" />
          </button>
        </div>
      </div>
    );
  };

export default Card;