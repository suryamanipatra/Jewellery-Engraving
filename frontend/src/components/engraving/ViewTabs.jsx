import React from "react";
import PropTypes from "prop-types";

const ViewTabs = ({ activeTab, setActiveTab }) => {
  const tabs = ["DigiWire", "Pencil"];
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    console.log("tab is ", tab);
    if (tab === "Pencil") {
      console.log("Initializing Pencil mode...");
    }
  };

  return (
    <div className="flex rounded-lg bg-white p-1 w-full lg:w-[90%] max-w-[100%] shadow-md mb-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => handleTabChange(tab)}
          className={`flex-1 px-4 py-2 text-xs md:text-lg font-medium rounded-md transition-all
                      ${
                        activeTab === tab
                          ? "bg-[#062538] text-white shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

ViewTabs.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
};

export default ViewTabs;