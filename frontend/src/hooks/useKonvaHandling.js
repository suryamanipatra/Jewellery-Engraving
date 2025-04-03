import { useState } from "react";


export const useKonvaHandling = (initialState = {}) => {
  const [konvaState, setKonvaState] = useState({
    paths: initialState.paths || { 1: "M50,150 Q250,50 350,150" },
    positions: initialState.positions || { 1: { x: 50, y: 150 } },
    rotation: initialState.rotation || 0,
    visiblePaths: initialState.visiblePaths || { 1: true },
    // showPath: initialState.showPath !== undefined ? initialState.showPath : true,
    scale: 1,
    imageDimensions: { width: 0, height: 0 },
  });

  const handleTextDrag = (line, e) => {
    setKonvaState(prev => ({
      ...prev,
      positions: {
        ...prev.positions,
        [line]: { x: e.target.x(), y: e.target.y() }
      }
      
    }));
    // console.log("positions",positions)
    // console.log(`Text Position for Line ${line}:`, { x: e.target.x(), y: e.target.y() });
  };
  const addNewLine = (line, path, position) => {
    setKonvaState(prev => ({
      ...prev,
      paths: { ...prev.paths, [line]: path },
      positions: { ...prev.positions, [line]: position },
    }));
  };

  const handlePathDrag = (line, oldX, oldY, newX, newY) => {
    setKonvaState(prev => ({
      ...prev,
      paths: {
        ...prev.paths,
        [line]: prev.paths[line].replace(
          new RegExp(`${oldX},${oldY}`, "g"),
          `${newX},${newY}`
        )
      }
    }));
    
  };


  const togglePathVisibility = (line) => {
    setKonvaState(prev => ({
      ...prev,
      visiblePaths: {
        ...prev.visiblePaths,
        [line]: !prev.visiblePaths[line]
      }
    }));
  };

  const setPathVisibility = (line, isVisible) => {
    setKonvaState(prev => ({
      ...prev,
      visiblePaths: {
        ...prev.visiblePaths,
        [line]: isVisible
      }
    }));
  };

  return {
    konvaState,
    konvaActions: {
      handleTextDrag,
      handlePathDrag,
      addNewLine,
      setPaths: (paths) => setKonvaState(prev => ({ ...prev, paths })),
      setRotation: (rotation) => setKonvaState(prev => ({ ...prev, rotation })),
      togglePathVisibility,
      setPathVisibility,
      // setShowPath: (showPath) => setKonvaState(prev => ({ ...prev, showPath }))
    }
  };
}; 