import "./Presets.css";
import { useState } from "react";

interface PositionPoint {
  [key: string]: { x: number; y: number };
}
type Preset = { [key: string]: PositionPoint[] };

const presets: Preset = {
  rhombus: [
    { point1: { x: 140, y: 0 } },
    { point2: { x: 0, y: 135 } },
    { point3: { x: 140, y: 270 } },
    { point4: { x: 270, y: 135 } },
  ],
  pentagon: [
    { point1: { x: 135, y: 0 } },
    { point2: { x: 0, y: 125 } },
    { point3: { x: 78, y: 270 } },
    { point4: { x: 200, y: 270 } },
    { point5: { x: 270, y: 125 } },
  ],
  hexagon: [
    { point1: { x: 70, y: 0 } },
    { point2: { x: 0, y: 135 } },
    { point3: { x: 70, y: 270 } },
    { point4: { x: 210, y: 270 } },
    { point5: { x: 270, y: 135 } },
    { point6: { x: 210, y: 0 } },
  ],
};

interface PresetsProps {
  setPositions: React.Dispatch<React.SetStateAction<PositionPoint[]>>;
}

const Presets = ({ setPositions }: PresetsProps) => {
  const handlePresetSelection = (id: string) => {
    setPositions(presets[id]);
    setSelected(id);
  };

  const [selected, setSelected] = useState<string>("");

  return (
    <div id="preset-menu">
      <div
        className={`preset ${selected === "rhombus" ? "selected" : ""}`}
        id="rhombus"
        onClick={() => handlePresetSelection("rhombus")}
      >
        Rhombus
      </div>
      <div
        className={`preset ${selected === "pentagon" ? "selected" : ""}`}
        id="pentagon"
        onClick={() => handlePresetSelection("pentagon")}
      >
        Pentagon
      </div>
      <div
        className={`preset ${selected === "hexagon" ? "selected" : ""}`}
        id="hexagon"
        onClick={() => handlePresetSelection("hexagon")}
      >
        Hexagon
      </div>
    </div>
  );
};

export default Presets;
