import React from "react";
import PropTypes from "prop-types";

const ViewTabs = ({ activeTab, setActiveTab }) => {
  const tabs = ["Wireframe", "Pen Tool"];

  return (
    <div className="flex rounded-lg bg-white p-1 w-full max-w-[62%] shadow-md mb-4">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`flex-1 px-4 py-2 text-xs md:text-sm font-medium rounded-md transition-all
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