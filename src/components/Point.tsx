import "./Point.css";

interface PositionPoint {
  [key: string]: { x: number; y: number };
}

interface PointProps {
  point: PositionPoint;
  handleMouseDown: (id: string) => void;
}

const Point: React.FC<PointProps> = ({ point, handleMouseDown }) => {
  const id = Object.keys(point)[0];
  const { x, y } = point[id];
  return (
    <div
      key={id}
      className="point"
      id={id}
      style={{ left: `${x}px`, top: `${y}px` }}
      onMouseDown={() => handleMouseDown(id)}
    />
  );
};

export default Point;
