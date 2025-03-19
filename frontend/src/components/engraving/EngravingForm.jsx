import React from "react";

const EngravingForm = ({ engravingLines, engravingData, handleInputChange }) => {
    if (engravingLines.length === 0) return null;

    return  (
        <div className="w-full p-2 rounded-2xl flex flex-col justify-between">
            <h2 className="text-lg font-semibold text-white mb-2">Engraving</h2>
    
            <div className="w-full p-3 flex flex-col gap-3">
                {engravingLines.map((line) => (
                    <div key={line} className="w-full flex items-center gap-3">
                        <label className="text-white text-[16px] font-medium w-16 text-center">
                            Line {line}
                        </label>
                        <input
                            type="text"
                            placeholder="Enter engraving text"
                            className="flex-1 min-w-0 p-2 rounded-lg bg-white border border-gray-400 text-black focus:border-blue-500 outline-none"
                            maxLength={engravingData[line]?.charCount || 10}
                            value={engravingData[line]?.text || ""}
                            onChange={(e) => handleInputChange(line, e.target.value, "text")}
                        />
                        <span className="text-white text-[16px] w-10 text-right">
                            {(engravingData[line]?.text?.length || 0)}/
                            {engravingData[line]?.charCount || 10}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
    
   

export default EngravingForm;
