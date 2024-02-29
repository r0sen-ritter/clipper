import "./Point.css";
import { useState } from "react";

interface PositionPoint {
  [key: string]: { x: number; y: number };
}

interface PointProps {
  point: PositionPoint;
  handleMouseDown: (
    id: string,
    setPointSelected: (bool: boolean) => void,
    pointSelected: boolean
  ) => void;
}

const Point = ({ point, handleMouseDown }: PointProps) => {
  const [pointSelected, setPointSelected] = useState(false);

  const id = Object.keys(point)[0];
  const { x, y } = point[id];

  return (
    <div
      key={id}
      id={id}
      className="point"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        borderColor: `${pointSelected ? "green" : "red"}`,
      }}
      onMouseDown={() => handleMouseDown(id, setPointSelected, pointSelected)}
    />
  );
};

export default Point;
