import { useState } from "react";

export const useKonvaHandling = (initialState = {}) => {
  const [konvaState, setKonvaState] = useState({
    path: initialState.path || null,
    textColor: initialState.textColor || "#000000",
    textPosition: initialState.textPosition || { x: 0, y: 0 },
    rotation: initialState.rotation || 0,
    showPath: initialState.showPath !== undefined ? initialState.showPath : true,
  });
  const [path, setPath] = useState("M50,150 Q250,50 450,150");
  const [textPosition, setTextPosition] = useState({ x: 50, y: 150 });
  const [textColor, setTextColor] = useState("#000000");
  const [rotation, setRotation] = useState(0);
  const [showPath, setShowPath] = useState(true);
  const [fontSize, setFontSize] = useState(24);

  const handleTextDrag = (e) => {
    setTextPosition({ x: e.target.x(), y: e.target.y() });
  };

  const handlePathDrag = (oldX, oldY, newX, newY) => {
    setPath(path.replace(
      new RegExp(`${oldX},${oldY}`, "g"),
      `${newX},${newY}`
    ));
  };

  return {
    konvaState: { path, textPosition, textColor, rotation, showPath, fontSize },
    konvaActions: {
      handleTextDrag,
      handlePathDrag,
      setPath,
      setTextColor,
      setRotation,
      setShowPath,
      setFontSize
    }
  };
};