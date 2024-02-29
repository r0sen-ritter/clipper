import { useState, useEffect, useRef } from "react";
import "./ImageBox.css";
import ContentImage from "/pittsburgh.jpg";
import Point from "./Point";
import Edge from "./Edge";
import { calculatePosition } from "../utils/PolCalc";

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
  const [pointsSelected, setPointsSelected] = useState<string[]>([]);

  const draggingRef = useRef(dragging);

  const handleMouseDown = (
    id: string,
    setPointSelected: (bool: boolean) => void,
    pointSelected: boolean
  ) => {
    setPointSelected(!pointSelected);
    setDragging(id);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseUp = () => {
    setDragging(null);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
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
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    console.log(e.key);
    if (e.key === "Delete") {
      setPositions((prev) =>
        prev.filter((point) => !pointsSelected.includes(Object.keys(point)[0]))
      );
      setPointsSelected([]);
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keypress", handleKeyPress);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, []);

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

  const addNewPointHandler = (e: React.MouseEvent, index: number) => {
    const newPoint = {
      [`point${positions.length + 1}`]: calculatePosition(e, radius),
    };
    setPositions((prev) => [
      ...prev.slice(0, index + 1),
      newPoint,
      ...prev.slice(index + 1),
    ]);
  };

  return (
    <div id="image-box">
      <img id="image" src={ContentImage} />
      {positions.map((point) => (
        <Point point={point} handleMouseDown={handleMouseDown} />
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
              addNewPointHandler={addNewPointHandler}
            />
          );
        })}
    </div>
  );
};

export default ImageBox;
