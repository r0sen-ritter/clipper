import { useState, useEffect } from "react";
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

  const handleMouseDown = (id: string) => {
    setDragging(id);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseUp = () => {
    setDragging(null);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging) {
      const newPosition = calculatePosition(e, radius);
      if (newPosition.x !== 0 || newPosition.y !== 0) {
        setPositions((prev) =>
          prev.map((point) => {
            if (Object.keys(point)[0] === dragging) {
              return { [dragging]: newPosition };
            }
            return point;
          })
        );
      }
    }
  };

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
    <div id="image-box" onMouseMove={handleMouseMove}>
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
