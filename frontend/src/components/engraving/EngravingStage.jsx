import React, { useState, useEffect, forwardRef } from "react";
import { Stage, Layer, Path, TextPath, Circle, Image, Text } from "react-konva";

const EngravingStage = forwardRef(({
  selectedImage,
  engravingLines,
  engravingData,
  konvaState,
  onTextDrag,
  onPathDrag
}, ref) => {
  const [konvaImage, setKonvaImage] = useState(null);

  useEffect(() => {
    if (selectedImage) {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.src = selectedImage;
      img.onload = () => {
        setKonvaImage(img);
        const stageWidth = window.innerWidth < 768 ? 250 : 450;
        const stageHeight = window.innerWidth < 768 ? 150 : 400;
        const scaleX = stageWidth / img.width;
        const scaleY = stageHeight / img.height;
        const scale = Math.min(scaleX, scaleY);
      };
    }
  }, [selectedImage]);

  return (
    <Stage
      ref={ref}
      width={window.innerWidth < 768 ? 250 : 450}
      height={window.innerWidth < 768 ? 150 : 400}
    >
      <Layer scaleX={konvaState.scale} scaleY={konvaState.scale}>
        {konvaImage && (
          <Image 
            image={konvaImage}
            crossOrigin="anonymous"
            width={window.innerWidth < 768 ? 250 : 450}
            height={window.innerWidth < 768 ? 150 : 400}
          />
        )}
        {engravingLines.length === 0 && (
          <Text
            text=""
            x={20}
            y={20}
            fontSize={16}
            fill="#666"
          />
        )}
        {engravingLines.map(line => {
          const data = engravingData[line] || {};
          return (
            <React.Fragment key={line}>
              {/* TextPath is always visible */}
              <TextPath
                text={data.text || ""}
                data={konvaState.paths[line] || ""}
                fontSize={engravingData[line]?.fontSize || 24}
                fill={engravingData[line]?.color || "#000000"}
                x={konvaState.positions[line]?.x || 0}
                y={konvaState.positions[line]?.y || 0}
                draggable
                onDragMove={(e) => onTextDrag(line, e)}
                rotation={konvaState.rotation}
              />
              
              {/* Path visibility controlled by visiblePaths */}
              {konvaState.visiblePaths[line] && (
                <>
                  <Path
                    data={konvaState.paths[line] || ""}
                    stroke="gray"
                    strokeWidth={2}
                  />
                  
                  {/* Control points visibility also controlled by visiblePaths */}
                  {konvaState.paths[line]?.match(/(-?\d+\.?\d*)/g)?.map((val, index, arr) =>
                    index % 2 === 0 ? (
                      <Circle
                        key={index}
                        x={Number.parseFloat(arr[index])}
                        y={Number.parseFloat(arr[index + 1])}
                        radius={5}
                        fill="blue"
                        draggable
                        onDragMove={(e) => 
                          onPathDrag(
                            line,
                            arr[index],
                            arr[index + 1],
                            e.target.x(),
                            e.target.y()
                          )
                        }
                      />
                    ) : null
                  )}
                </>
              )}
            </React.Fragment>
          );
        })}
      </Layer>
    </Stage>
  );
});

export default EngravingStage;