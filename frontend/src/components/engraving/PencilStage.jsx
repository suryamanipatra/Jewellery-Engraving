import React, { forwardRef, useCallback, useMemo, useState } from "react";
import { Stage, Layer, Line, Path, TextPath, Image } from "react-konva";
import useImage from 'use-image';

const PencilStage = forwardRef(({
    selectedImage,
    konvaState,
    konvaActions,
    engravingData,
    scale,
    onTextDrag,
    drawingPhase,
    setDrawingPhase,
    selectedLine,
    engravingLines
}, ref) => {
    const [points, setPoints] = useState([]);
    const [image] = useImage(selectedImage || '');

    const CANVAS_WIDTH = 450;
    const CANVAS_HEIGHT = 400;

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
    }, [image]);

    const handleMouseDown = useCallback(() => {
        if (drawingPhase !== 'awaitingFirstPoint') return;

        const point = ref.current.getPointerPosition();
        setPoints([point]);
        setDrawingPhase('drawing');
    }, [drawingPhase, ref, setDrawingPhase]);

    const handleMouseMove = useCallback(() => {
        if (drawingPhase !== 'drawing') return;

        const point = ref.current.getPointerPosition();
        setPoints(prev => [...prev, point]);
    }, [drawingPhase, ref]);

    const handleMouseUp = useCallback(() => {
        if (drawingPhase === 'drawing' && points.length >= 2 && selectedLine) {
            const pathData = points.reduce((acc, point) => {
                return acc ? `${acc} L ${point.x} ${point.y}` : `M ${point.x} ${point.y}`;
              }, '');

            konvaActions.addNewLine(selectedLine, pathData, points[0]);
            setDrawingPhase('idle');
            setPoints([]);
        }
    }, [drawingPhase, points, konvaActions, selectedLine]);
    // {drawingPhase === 'awaitingFirstPoint' && (
    //     <Text
    //       text="Click and drag to draw your path"
    //       x={CANVAS_WIDTH/2 - 100}
    //       y={20}
    //       fontSize={16}
    //       fill="red"
    //     />
    //   )}
    const showDrawingLine = points.length > 1 && drawingPhase === 'drawing';
    // const showSavedPath = konvaState.paths[1] && drawingPhase === 'idle';
    // const showText = konvaState.paths[1] && engravingData[1]?.text;

    return (
        <Stage
            ref={ref}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            scaleX={scale}
            scaleY={scale}
            style={{
                cursor: drawingPhase === 'awaitingFirstPoint' ? 'crosshair' : 'default',
                backgroundColor: 'white'
            }}
        >
            <Layer>
                {image && (
                    <Image
                        image={image}
                        {...scaledImageProps}
                    />
                )}

                {showDrawingLine && (
                    <Line
                        points={points.flatMap(p => [p.x, p.y])}
                        stroke="red"
                        strokeWidth={2}
                        tension={0.5}
                    />
                )}

                {engravingLines.map(line => (
                    <div key={line}>
                        {konvaState.paths[line] && (
                            <Path
                                data={konvaState.paths[line]}
                                stroke="blue"
                                strokeWidth={1}
                                dash={[5, 5]}
                            />
                        )}
                        {engravingData[line]?.text && konvaState.paths[line] && (
                            <TextPath
                                data={konvaState.paths[line]}
                                text={engravingData[line].text}
                                fill={engravingData[line]?.color || "#000000"}
                                fontSize={engravingData[line]?.fontSize || 24}
                                draggable
                                onDragMove={(e) => onTextDrag(line, e)}
                            />
                        )}
                    </div>
                ))}
            </Layer>
        </Stage>
    );
});

export default PencilStage;