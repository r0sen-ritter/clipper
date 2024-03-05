import "./ClipPath.css";
interface PositionPoint {
  [key: string]: { x: number; y: number };
}

interface ClipPathProps {
  positions: PositionPoint[];
}

const ClipPath = ({ positions }: ClipPathProps) => {
  const handleCopy = () => {
    const clipPathValue = document.getElementById(
      "clip-path-value"
    ) as HTMLDivElement;
    navigator.clipboard.writeText(clipPathValue.innerText);
  };

  const points = positions
    .map((point) => {
      const key = Object.keys(point)[0];
      return `${Math.round((point[key].x / 270) * 100)}% ${Math.round(
        (point[key].y / 270) * 100
      )}%`;
    })
    .join(", ");
  return (
    <div id="clip-path-container">
      <div id="clip-path-value">{`clip-path: polygon(${points});`}</div>
      <button className="btn" onClick={handleCopy}>
        Copy
      </button>
    </div>
  );
};

export default ClipPath;
