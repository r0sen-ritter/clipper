import "./Presets.css";

// const handlePresetSelection(id:string){

// }

const Presets = () => {
  return (
    <div id="preset-menu">
      <div
        className="preset"
        id="rhombus"
        // onClick={() => handlePresetSelection("rhombus")}
      >
        Rhombus
      </div>
      <div
        className="preset"
        id="pentagon"
        // onClick={() => handlePresetSelection("pentagon")}
      >
        Pentagon
      </div>
      <div
        className="preset"
        id="paralellogram"
        // onClick={() => handlePresetSelection("paralellogram")}
      >
        Paralellogram
      </div>
    </div>
  );
};

export default Presets;
