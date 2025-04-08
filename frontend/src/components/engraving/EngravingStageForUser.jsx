import React, { useState, useEffect, forwardRef } from "react";
import { Stage, Layer, Path, TextPath, Image, Text } from "react-konva";

const EngravingStageForUser = forwardRef(({
  selectedImage,
  engravingLines,
  engravingData,
  konvaState,
  texts,
//   onTextDrag,
}, ref) => {
  const [konvaImage, setKonvaImage] = useState(null); 
  console.log("engravingLines", engravingLines)

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
        // konvaActions.setScale(scale);
        // konvaActions.setImageDimensions({
        //   width: img.width,
        //   height: img.height,
        // });
      };
    //   img.onload = () => setKonvaImage(img);
    }
  }, [selectedImage]);



  return (
    <Stage ref={ref} width={window.innerWidth < 768 ? 250 : 450} height={window.innerWidth < 768 ? 150 : 400}>
      <Layer scaleX={konvaState.scale} scaleY={konvaState.scale}>
        {konvaImage && (
          <Image image={konvaImage} width={window.innerWidth < 768 ? 250 : 450}  height={window.innerWidth < 768 ? 150 : 400} />
        )}
        {engravingLines.map(line => (
          <React.Fragment key={line.id}>
            {console.log("engraved by", line?.engraved_by)} 
            <TextPath
              text={texts[line.id] || ""} 
              data={engravingData[line.id]?.path || ""}
              fontSize={engravingData[line.id]?.fontSize || 24} 
              fill={engravingData[line.id]?.color || "#000"} 
              {
                ...(line?.engraved_by === "DigiWire"
                  ? {
                      x: engravingData[line.id]?.positionX || 0,
                      y: engravingData[line.id]?.positionY || 0,
                    }
                  : {})
              }           
              // x={engravingData[line.id]?.positionX || 0}
              // y={engravingData[line.id]?.positionY || 0}
            //   draggable
            //   onDragMove={(e) => onTextDrag(line.id, e)}
            />
          </React.Fragment>
        ))}
      </Layer>
    </Stage>
  );
});

export default EngravingStageForUser;
