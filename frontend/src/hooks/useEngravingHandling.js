import { useState, useMemo } from "react";

export const useEngravingHandling = () => {
  const [engravingLines, setEngravingLines] = useState([]);
  const [engravingData, setEngravingData] = useState({});
  const [selectedLine, setSelectedLine] = useState(null);

  const addEngravingLine = (lineNumber, lineData = {}) => {
    const newLine = lineNumber || (engravingLines.length > 0 ? Math.max(...engravingLines) + 1 : 1);
    
    if (!engravingLines.includes(newLine)) {
      setEngravingLines([...engravingLines, newLine].sort((a, b) => a - b));
    }

    setEngravingData(prev => ({
      ...prev,
      [newLine]: {
        text: lineData.text || prev[newLine]?.text || "",
        fontSize: lineData.font_size || prev[newLine]?.fontSize || 24,
        charCount: lineData.no_of_characters || prev[newLine]?.charCount || 10,
        color: lineData.font_color || prev[newLine]?.color || "#000000"
      }
    }));

    setSelectedLine(newLine);
    return newLine;
  };

  const resetEngraving = () => {
    setEngravingLines([]);
    setEngravingData({});
    setSelectedLine(null);
  };

  const handleInputChange = (line, value, field) => {
    setEngravingData(prev => ({
      ...prev,
      [line]: {
        ...prev[line],
        [field]: field === "text" ? value.slice(0, prev[line]?.charCount || 10) : value
      }
    }));
  };

  const result = useMemo(() => ({
    engravingState: { engravingLines, engravingData, selectedLine },
    addEngravingLine,
    handleInputChange,
    setSelectedLine,
    resetEngraving
  }), [engravingLines, engravingData, selectedLine]);

  // console.log("useEngravingHandling updated:", result);

  return result;
};