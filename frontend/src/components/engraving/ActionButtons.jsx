import React from "react";
import PropTypes from "prop-types";
import { BiDownload, BiSave } from "react-icons/bi";

const ActionButtons = ({ onSave, onDownload, showPath, onTogglePath }) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-center md:gap-4 mt-4 md:space-y-0 space-y-1">
      <button
        onClick={onTogglePath}
        className="flex w-full md:w-auto items-center gap-2 px-5 py-2 bg-white text-[#062538] rounded-xl shadow-md hover:bg-gray-700 hover:text-white transition justify-center cursor-pointer hover:border-2 hover:border-white"
      >
        {showPath ? "Hide Wireframe" : "Show Wireframe"}
      </button>

      <button
        onClick={onDownload}
        className="flex w-full md:w-auto items-center gap-2 px-5 py-2 bg-white text-[#062538] rounded-xl shadow-md hover:bg-gray-700 hover:text-white transition justify-center cursor-pointer hover:border-2 hover:border-white"
      >
        <BiDownload className="text-xl" /> Download This Engraved Image
      </button>

      <button
        onClick={onSave}
        className="flex w-full md:w-auto items-center gap-2 px-5 py-2 bg-white text-[#062538] rounded-xl shadow-md hover:bg-gray-700 hover:text-white transition justify-center cursor-pointer hover:border-2 hover:border-white"
      >
        <BiSave className="text-xl" /> Save Configuration
      </button>
    </div>
  );
};

ActionButtons.propTypes = {
  onSave: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
  showPath: PropTypes.bool.isRequired,
  onTogglePath: PropTypes.func.isRequired,
};

export default ActionButtons;
