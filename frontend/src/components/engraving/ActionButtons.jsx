import React from "react";
import PropTypes from "prop-types";
import { BiDownload, BiSave } from "react-icons/bi";

const ActionButtons = ({ onSave, onDownload, showPath, onTogglePath }) => {
  return (
    <div className="flex justify-center gap-4 mt-4">
      <button
        onClick={onTogglePath}
        className="flex items-center gap-2 px-5 py-2 bg-white text-[#062538] rounded-xl shadow-md hover:bg-gray-700 hover:text-white transition"
      >
        {showPath ? "Hide Wireframe" : "Show Wireframe"}
      </button>

      <button
        onClick={onDownload}
        className="flex items-center gap-2 px-5 py-2 bg-white text-[#062538] rounded-xl shadow-md hover:bg-gray-700 hover:text-white transition"
      >
        <BiDownload className="text-xl" /> Download
      </button>

      <button
        onClick={onSave}
        className="flex items-center gap-2 px-5 py-2 bg-white text-[#062538] rounded-xl shadow-md hover:bg-gray-700 hover:text-white transition"
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
