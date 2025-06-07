import React, { useState, useEffect, forwardRef , useMemo} from "react";
import { Stage, Layer, Path, TextPath, Circle, Image, Text } from "react-konva";
import useImage from "use-image";

const EngravingStage = forwardRef(({
  selectedImage,
  engravingLines,
  engravingData,
  konvaState,
  onTextDrag,
  onPathDrag
}, ref) => {
  const [image] = useImage(selectedImage, "Anonymous");

  const CANVAS_WIDTH = window.innerWidth < 768 ? 250 : 450;
  const CANVAS_HEIGHT = window.innerWidth < 768 ? 150 : 400;

  const scaledImageProps = useMemo(() => {
    if (!image) return { width: 0, height: 0, x: 0, y: 0 };

    const scaleRatio = Math.min(
      CANVAS_WIDTH / image.width,
      CANVAS_HEIGHT / image.height
    );

    return {
      width: image.width * scaleRatio,
      height: image.height * scaleRatio,
      x: (CANVAS_WIDTH - image.width * scaleRatio) / 2,
      y: (CANVAS_HEIGHT - image.height * scaleRatio) / 2
    };
  }, [image, CANVAS_WIDTH, CANVAS_HEIGHT]);

  return (
    <Stage
      ref={ref}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
    >
      <Layer scaleX={konvaState.scale} scaleY={konvaState.scale}>
        {image && (
          <Image
            image={image}
            {...scaledImageProps}
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
          const pathData = konvaState.paths[line] || "";
          const position = konvaState.positions[line] || {};

          return (
            <React.Fragment key={line}>
              <TextPath
                text={data.text || ""}
                data={pathData}
                fontSize={data.fontSize || 24}
                fill={data.color || "#000000"}
                x={position.x || 0}
                y={position.y || 0}
                draggable
                onDragMove={(e) => {
                  console.log('Text Drag:', e.evt.type);
                  onTextDrag(line, e);
                }}
                rotation={konvaState.rotation}
              />

              {konvaState.visiblePaths[line] && (
                <>
                  <Path
                    data={pathData}
                    stroke="gray"
                    strokeWidth={2}
                  />

                  {(pathData.match(/(-?\d+\.?\d*)/g) || []).map((val, index, arr) =>
                    index % 2 === 0 ? (
                      <Circle
                        key={index}
                        x={parseFloat(arr[index])}
                        y={parseFloat(arr[index + 1])}
                        radius={5}
                        fill="blue"
                        draggable
                        onDragMove={(e) => {
                          console.log('Path Point Drag:', e.evt.type);
                          onPathDrag(
                            line,
                            arr[index],
                            arr[index + 1],
                            e.target.x(),
                            e.target.y()
                          );
                        }}
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
