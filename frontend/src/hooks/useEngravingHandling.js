import { useState } from "react";

export const useEngravingHandling = (initialState = {}) => {
  const [engravingLines, setEngravingLines] = useState([]);
  const [engravingData, setEngravingData] = useState({});
  const [selectedLine, setSelectedLine] = useState(null);
  

  const addEngravingLine = () => {
    const newLine = engravingLines.length + 1;
    setEngravingLines([...engravingLines, newLine]);
    setEngravingData(prev => ({
      ...prev,
      [newLine]: { text: "", fontSize: 24, charCount: 10, color: "#000000" }
    }));
    setSelectedLine(newLine); 
    return newLine;
  };

  const resetEngraving = () => {
    setEngravingLines([]);
    setEngravingData({});
    setSelectedLine(null);
  };

  const handleInputChange = (line, value, field) =>     {
    setEngravingData((prev) => ({
      ...prev,
      [line]: {
        ...prev[line],
        [field]: field === "text" ? value.slice(0, prev[line]?.charCount || 10) : value
      }
    }));
  };

  return {
    engravingState: { engravingLines, engravingData, selectedLine },
    addEngravingLine,
    handleInputChange,
    setSelectedLine,
    resetEngraving
  };
};