import "./Edge.css";
import { calculateEuclideanDistance, calculateAngle } from "../utils/PolCalc";
interface PositionPoint {
  [key: string]: { x: number; y: number };
}

interface EdgeProps {
  point: PositionPoint;
  nextPoint: PositionPoint;
  index: number;
  radius: number;
  addNewPointHandler: (e: React.MouseEvent, index: number) => void;
}

const Edge = ({
  point,
  nextPoint,
  index,
  radius,
  addNewPointHandler,
}: EdgeProps) => {
  const euclideanDistance = calculateEuclideanDistance(point, nextPoint) - 9;
  const angle = calculateAngle(point, nextPoint);
  const x = point[Object.keys(point)[0]].x + radius;
  const y = point[Object.keys(point)[0]].y + radius;
  const offsetX = 5 * Math.cos(angle);
  const offsetY = 5 * Math.sin(angle);
  return (
    <div
      key={`edge-${index}`}
      className="edge"
      style={{
        width: `${euclideanDistance}px`,
        transform: `rotate(${angle}rad)`,
        left: `${x + offsetX}px`,
        top: `${y + offsetY}px`,
      }}
      onClick={(e: React.MouseEvent) => addNewPointHandler(e, index)}
    />
  );
};

export default Edge;
