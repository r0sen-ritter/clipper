import "./Point.css";

interface PositionPoint {
  [key: string]: { x: number; y: number };
}

interface PointProps {
  point: PositionPoint;
  handleMouseDown: (id: string) => void;
  isSelected: boolean;
}

const Point = ({ point, handleMouseDown, isSelected }: PointProps) => {
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
        borderColor: `${isSelected ? "green" : "red"}`,
      }}
      onMouseDown={() => handleMouseDown(id)}
    />
  );
};

export default Point;
