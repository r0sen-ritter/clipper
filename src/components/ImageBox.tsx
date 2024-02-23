import React, { useState, useEffect } from "react";
import "./ImageBox.css";
import ContentImage from "/pittsburgh.jpg";

const ImageBox = () => {
  type PositionKey = "point1" | "point2" | "point3";
  const radius = 5;
  const [dragging, setDragging] = useState<string | null>(null);
  const [positions, setPositions] = useState({
    point1: { x: 140 - radius, y: 10 },
    point2: { x: 10, y: 280 - radius - 10 },
    point3: { x: 280 - radius - 15, y: 280 - radius - 10 },
  });

  const handleMouseDown = (id: PositionKey) => {
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
      setPositions((prev) => ({ ...prev, [dragging]: { x, y } }));
    }
  };

  useEffect(() => {
    const image = document.getElementById("image");
    if (image) {
      image.style.clipPath = `polygon(${positions.point1.x + radius}px ${
        positions.point1.y + radius
      }px, ${positions.point2.x + radius}px ${positions.point2.y + radius}px, ${
        positions.point3.x + radius
      }px ${positions.point3.y + radius}px)`;
    }
  }, [positions]);

  return (
    <div id="image-box" onMouseMove={handleMouseMove}>
      <img id="image" src={ContentImage} />
      {(["point1", "point2", "point3"] as PositionKey[]).map((id) => (
        <div
          key={id}
          className="point"
          id={id}
          style={{ left: `${positions[id].x}px`, top: `${positions[id].y}px` }}
          onMouseDown={() => handleMouseDown(id)}
        />
      ))}
    </div>
  );
};

export default ImageBox;
