import "./App.css";
import ImageBox from "./components/ImageBox";
import { useState } from "react";
import Presets from "./components/Presets";

interface PositionPoint {
  [key: string]: { x: number; y: number };
}
const App = () => {
  const radius = 5;
  const [positions, setPositions] = useState<PositionPoint[]>([
    { point1: { x: 140 - radius, y: 10 } },
    { point2: { x: 10, y: 280 - radius - 10 } },
    { point3: { x: 280 - radius - 15, y: 280 - radius - 10 } },
  ]);

  return (
    <div id="app">
      <ImageBox
        positions={positions}
        setPositions={setPositions}
        radius={radius}
      />
      <Presets setPositions={setPositions} />
    </div>
  );
};

export default App;
