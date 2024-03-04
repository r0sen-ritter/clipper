import "./ClipPath.css";
interface PositionPoint {
  [key: string]: { x: number; y: number };
}

interface ClipPathProps {
  positions: PositionPoint[];
}

const ClipPath = ({ positions }: ClipPathProps) => {
  const points = positions
    .map((point) => {
      const key = Object.keys(point)[0];
      return `${Math.round((point[key].x / 280) * 100)}% ${Math.round(
        (point[key].y / 280) * 100
      )}%`;
    })
    .join(", ");
  return <div id="clip-path-value">{`clip-path: polygon(${points});`}</div>;
};

export default ClipPath;
