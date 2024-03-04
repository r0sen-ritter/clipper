import { useState, useEffect, useRef, useCallback } from "react";
import "./ImageBox.css";
import ContentImage from "/pittsburgh.jpg";
import Point from "./Point";
import Edge from "./Edge";
import { calculatePosition } from "../utils/PolCalc";
import {
  addNewPointHandler,
  scalePositionsHandler,
  keyPressHandler,
  positionsDragValidityHandler,
  positionsDragHandler,
} from "../utils/Handlers";

interface PositionPoint {
  [key: string]: { x: number; y: number };
}

interface ImageBoxProps {
  positions: PositionPoint[];
  setPositions: React.Dispatch<React.SetStateAction<PositionPoint[]>>;
  radius: number;
}

const ImageBox = ({ positions, setPositions, radius }: ImageBoxProps) => {
  const [dragging, setDragging] = useState<string | null>(null);
  const [scaling, setScaling] = useState<boolean>(false);
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);
  const [isInside, setIsInside] = useState<boolean>(false);
  const [initialMousePosition, setInitialMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const draggingRef = useRef(dragging);
  const handleAddNewPoint = addNewPointHandler(setPositions, positions, radius);
  const handleScalePositions = scalePositionsHandler(setPositions, radius);
  const handleKeyPress = keyPressHandler(
    setPositions,
    setSelectedPoint,
    handleScalePositions,
    setScaling,
    selectedPoint
  );
  const handlePositionsDrag = positionsDragHandler(
    setPositions,
    initialMousePosition,
    isInside,
    positions,
    radius,
    setInitialMousePosition
  );

  const handleMouseDown = (id: string) => {
    setSelectedPoint((prevId) => (prevId === id ? null : id));
    setDragging(id);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseUp = () => {
    setDragging(null);
    setIsInside(false);
    setInitialMousePosition(null);
    window.removeEventListener("mouseup", handleMouseUp);
  };
  const handlePositionsDragValidity = positionsDragValidityHandler(
    setDragging,
    setIsInside,
    setInitialMousePosition,
    dragging,
    positions,
    radius,
    handleMouseUp
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const currentDragging = draggingRef.current;
      if (currentDragging) {
        const newPosition = calculatePosition(e, radius);
        if (newPosition.x !== 0 || newPosition.y !== 0) {
          setPositions((prev) =>
            prev.map((point) => {
              if (Object.keys(point)[0] === currentDragging) {
                return { [currentDragging]: newPosition };
              }
              return point;
            })
          );
        }
      }
    },
    [radius, setPositions]
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("wheel", handleKeyPress, { passive: false });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("wheel", handleKeyPress);
    };
  }, [handleKeyPress, handleMouseMove]);

  useEffect(() => {
    draggingRef.current = dragging;
  }, [dragging]);

  useEffect(() => {
    const image = document.getElementById("image");
    if (image) {
      const points = positions
        .map((point) => {
          const key = Object.keys(point)[0];
          return `${point[key].x + radius}px ${point[key].y + radius}px`;
        })
        .join(", ");

      image.style.clipPath = `polygon(${points})`;
    }
  }, [positions, radius]);

  return (
    <div
      id="image-box"
      className={scaling ? "scaling" : ""}
      onMouseDown={(e) => handlePositionsDragValidity(e)}
      onMouseMove={handlePositionsDrag}
    >
      <img id="image" src={ContentImage} />
      {positions.map((point) => (
        <Point
          point={point}
          handleMouseDown={handleMouseDown}
          isSelected={Object.keys(point)[0] === selectedPoint}
        />
      ))}
      {!dragging &&
        positions.map((point, index, array) => {
          const nextPoint = array[(index + 1) % array.length];
          return (
            <Edge
              point={point}
              nextPoint={nextPoint}
              index={index}
              radius={radius}
              addNewPointHandler={handleAddNewPoint}
            />
          );
        })}
    </div>
  );
};

export default ImageBox;
