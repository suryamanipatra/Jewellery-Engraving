// ActionButtons.js
import React, { useState } from "react";
import PropTypes from "prop-types";
import { BiDownload, BiSave } from "react-icons/bi";

const ActionButtons = ({
  onSave,
  onDownload,
  konvaState,
  konvaActions,
  engravingLines,
  activeTab,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row md:justify-center md:gap-4 mt-4 md:space-y-0 space-y-1">
      <div className="relative">
        {activeTab === "DigiWire" && (
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex w-full md:w-auto items-center gap-2 px-5 py-2 bg-white text-[#062538] rounded-xl shadow-md hover:bg-gray-700 hover:text-white transition justify-center cursor-pointer hover:border-2 hover:border-white"
        >
          DigiWire Visibility
        </button>
        )}

        {isDropdownOpen && (
          <div className="absolute z-10 mb-1 w-full bg-white rounded-md shadow-lg bottom-full">
            {engravingLines.map(line => (
              <button
                key={line}
                onClick={() => {
                  konvaActions.togglePathVisibility(line);
                  setIsDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {konvaState.visiblePaths[line] ? `Hide ${line}` : `Show ${line}`}
              </button>
            ))}
          </div>
        )}
      </div>

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
  konvaState: PropTypes.object.isRequired,
  konvaActions: PropTypes.object.isRequired,
  engravingLines: PropTypes.array.isRequired,
};

export default ActionButtons;
