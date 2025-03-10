import React, { useState, useEffect, forwardRef } from "react";
import { Stage, Layer, Path, TextPath, Circle, Image } from "react-konva";

const EngravingStage = forwardRef(({
  selectedImage,
  path,
  text,
  fontSize,
  textColor,
  textPosition,
  rotation,
  showPath,
  onTextDrag,
  onPathDrag
}, ref) => {
  const [konvaImage, setKonvaImage] = useState(null);

  useEffect(() => {
    if (selectedImage) {
      const img = new window.Image();
      img.src = selectedImage;
      img.onload = () => {
        setKonvaImage(img);
      };
    }
  }, [selectedImage]);

  return (
    <Stage
      ref={ref}
      width={window.innerWidth < 768 ? 250 : 450}
      height={window.innerWidth < 768 ? 150 : 400}
    >
      <Layer>
        {konvaImage && (
          <Image
            image={konvaImage}
            width={window.innerWidth < 768 ? 250 : 450}
            height={window.innerWidth < 768 ? 150 : 400}
          />
        )}

        <Path data={path} stroke="gray" strokeWidth={2} visible={showPath} />
        
        <TextPath
          text={text}
          data={path}
          fontSize={fontSize}
          fill={textColor}
          x={textPosition.x}
          y={textPosition.y}
          draggable
          onDragMove={onTextDrag}
          rotation={rotation}
        />

        {showPath &&
          path.match(/(-?\d+\.?\d*)/g).map((val, index, arr) =>
            index % 2 === 0 ? (
              <Circle
                key={index}
                x={Number.parseFloat(arr[index])}
                y={Number.parseFloat(arr[index + 1])}
                radius={5}
                fill="blue"
                draggable
                onDragMove={(e) =>
                  onPathDrag(arr[index], arr[index + 1], e.target.x(), e.target.y())
                }
              />
            ) : null
          )}
      </Layer>
    </Stage>
  );
});

export default EngravingStage;