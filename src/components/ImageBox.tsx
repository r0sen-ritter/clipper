import React, { useState, useEffect } from "react";
import "./ImageBox.css";
import ContentImage from "/pittsburgh.jpg";

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
      const imageBox = document.getElementById("image-box");
      if (!imageBox) return;
      const rect = imageBox.getBoundingClientRect();
      let x = e.clientX - rect.left - radius;
      let y = e.clientY - rect.top - radius;
      x = Math.max(0, Math.min(x, 280 - 2 * radius));
      y = Math.max(0, Math.min(y, 280 - 2 * radius));
      setPositions((prev) =>
        prev.map((point) => {
          if (Object.keys(point)[0] === dragging) {
            return { [dragging]: { x, y } };
          }
          return point;
        })
      );
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

  const calculateEuclideanDistance = (
    point1: PositionPoint,
    point2: PositionPoint
  ) => {
    const key1 = Object.keys(point1)[0];
    const key2 = Object.keys(point2)[0];
    const x1 = point1[key1].x;
    const y1 = point1[key1].y;
    const x2 = point2[key2].x;
    const y2 = point2[key2].y;
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  const calculateAngle = (point1: PositionPoint, point2: PositionPoint) => {
    const key1 = Object.keys(point1)[0];
    const key2 = Object.keys(point2)[0];
    const x1 = point1[key1].x;
    const y1 = point1[key1].y;
    const x2 = point2[key2].x;
    const y2 = point2[key2].y;
    return (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  };

  const generateEdgeDiv = (
    euclideanDistance: number,
    angle: number,
    x: number,
    y: number,
    key: string
  ) => {
    return (
      <div
        key={key}
        className="edge"
        style={{
          width: `${euclideanDistance}px`,
          height: "2px",
          transform: `rotate(${angle}rad)`,
          position: "absolute",
          backgroundColor: "red",
          zIndex: 4,
          transformOrigin: "0 0",
          left: `${x}px`,
          top: `${y}px`,
        }}
      />
    );
  };

  return (
    <div id="image-box" onMouseMove={handleMouseMove}>
      <img id="image" src={ContentImage} />
      {positions.map((point) => (
        <div
          key={Object.keys(point)[0]}
          className="point"
          id={Object.keys(point)[0]}
          style={{
            left: `${Object.values(point)[0].x}px`,
            top: `${Object.values(point)[0].y}px`,
          }}
          onMouseDown={() => handleMouseDown(Object.keys(point)[0])}
        />
      ))}
      {positions.map((point, index, array) => {
        if (index === array.length - 1) return null;
        const euclideanDistance = calculateEuclideanDistance(
          point,
          array[index + 1]
        );
        const angle = calculateAngle(point, array[index + 1]);
        const x = point[Object.keys(point)[0]].x;
        const y = point[Object.keys(point)[0]].y;
        return generateEdgeDiv(euclideanDistance, angle, x, y, `edge-${index}`);
      })}
    </div>
  );
};

export default ImageBox;
