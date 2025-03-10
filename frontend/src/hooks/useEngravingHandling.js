import { useState } from "react";

export const useEngravingHandling = (initialState = {}) => {
  const [engravingLines, setEngravingLines] = useState([1, 2]);
  const [engravingData, setEngravingData] = useState({});
  const [selectedLine, setSelectedLine] = useState(1);
  const [engravingState, setEngravingState] = useState({
    engravingLines: initialState.engravingLines || [],
    engravingData: initialState.engravingData || {},
    selectedLine: 0,
  });

  const addEngravingLine = () => {
    const newLine = engravingLines.length + 1;
    setEngravingLines([...engravingLines, newLine]);
    setSelectedLine(newLine); 
  };

  const handleInputChange = (line, value, field) =>     {
    setEngravingData((prev) => ({
      ...prev,
      [line]: {
        ...prev[line],
        [field]: field === "text" ? value.slice(0, 10) : parseInt(value) || 0
      }
    }));
  };

  return {
    engravingState: { engravingLines, engravingData, selectedLine },
    addEngravingLine,
    handleInputChange,
    setSelectedLine
  };
};