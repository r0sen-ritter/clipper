import ImageBox from "./ImageBox";
import { useState } from "react";
import Presets from "./Presets";

interface PositionPoint {
  [key: string]: { x: number; y: number };
}

const radius = 5;

const Clipper = () => {
  const [positions, setPositions] = useState<PositionPoint[]>([
    { point1: { x: 140 - radius, y: 10 } },
    { point2: { x: 10, y: 280 - radius - 10 } },
    { point3: { x: 280 - radius - 15, y: 280 - radius - 10 } },
  ]);

  return (
    <>
      <ImageBox
        positions={positions}
        setPositions={setPositions}
        radius={radius}
      />
      <Presets setPositions={setPositions} />
    </>
  );
};

export default Clipper;
