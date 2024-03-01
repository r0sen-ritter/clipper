import { useState, useEffect, useRef, useCallback } from "react";
import "./ImageBox.css";
import ContentImage from "/pittsburgh.jpg";
import Point from "./Point";
import Edge from "./Edge";
import { calculatePosition } from "../utils/PolCalc";

interface PositionPoint {
  [key: string]: { x: number; y: number };
}

interface ImageBoxProps {
  positions: PositionPoint[];
  setPositions: React.Dispatch<React.SetStateAction<PositionPoint[]>>;
  radius: number;
}

const ImageBox = ({ positions, setPositions, radius }: ImageBoxProps) => {
  const [dragging, setDragging] = useState<string | null>(null);
  const [scaling, setScaling] = useState<boolean>(false);
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);

  const draggingRef = useRef(dragging);

  const handleMouseDown = (id: string) => {
    setSelectedPoint((prevId) => (prevId === id ? null : id));
    setDragging(id);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseUp = () => {
    setDragging(null);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const currentDragging = draggingRef.current;
      if (currentDragging) {
        const newPosition = calculatePosition(e, radius);
        if (newPosition.x !== 0 || newPosition.y !== 0) {
          setPositions((prev) =>
            prev.map((point) => {
              if (Object.keys(point)[0] === currentDragging) {
                return { [currentDragging]: newPosition };
              }
              return point;
            })
          );
        }
      }
    },
    [radius, setPositions]
  );

  const scalePositions = useCallback(
    (direction: "up" | "down") => {
      let boundaryFound: boolean = false;
      setPositions((prev) => {
        const relativeCenter = prev.reduce(
          (acc, point) => {
            const key = Object.keys(point)[0];
            const { x, y } = point[key];
            return { x: acc.x + x / prev.length, y: acc.y + y / prev.length };
          },
          { x: 0, y: 0 }
        );

        console.log(boundaryFound);

        const newPositions = prev.map((point) => {
          const key = Object.keys(point)[0];
          const { x, y } = point[key];

          const shiftedX = x - relativeCenter.x;
          const shiftedY = y - relativeCenter.y;
          const scaledX = shiftedX * (direction === "up" ? 1.1 : 0.9);
          const scaledY = shiftedY * (direction === "up" ? 1.1 : 0.9);
          let newX = scaledX + relativeCenter.x;
          let newY = scaledY + relativeCenter.y;

          if (
            newX < 0 ||
            newX > 280 - 2 * radius ||
            newY < 0 ||
            newY > 280 - 2 * radius
          ) {
            boundaryFound = true;
          }

          newX = Math.max(0, Math.min(newX, 280 - 2 * radius));
          newY = Math.max(0, Math.min(newY, 280 - 2 * radius));

          const newPoint = {
            [key]: {
              x: newX,
              y: newY,
            },
          };
          return newPoint;
        });

        return boundaryFound ? prev : newPositions;
      });
    },
    [setPositions, radius]
  );
  const handleKeyPress = useCallback(
    (e: KeyboardEvent | WheelEvent) => {
      if ("key" in e) {
        if (e.key === "Delete" || e.key === "Backspace") {
          setPositions((prev) =>
            prev.filter((point) => Object.keys(point)[0] !== selectedPoint)
          );
          setSelectedPoint(null);
        }
      } else if ("deltaY" in e) {
        if (e.ctrlKey || e.metaKey) {
          setScaling(true);
          e.preventDefault();
          if (e.deltaY < 0) {
            scalePositions("up");
          } else {
            scalePositions("down");
          }
        }
        setTimeout(() => setScaling(false), 100);
      }
    },
    [selectedPoint, setPositions, setSelectedPoint, scalePositions, setScaling]
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("wheel", handleKeyPress, { passive: false });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("wheel", handleKeyPress);
    };
  }, [handleKeyPress, handleMouseMove]);

  useEffect(() => {
    draggingRef.current = dragging;
  }, [dragging]);

  useEffect(() => {
    const image = document.getElementById("image");
    if (image) {
      const points = positions
        .map((point) => {
          const key = Object.keys(point)[0];
          return `${point[key].x + radius}px ${point[key].y + radius}px`;
        })
        .join(", ");

      image.style.clipPath = `polygon(${points})`;
    }
  }, [positions, radius]);

  const addNewPointHandler = (e: React.MouseEvent, index: number) => {
    const newPoint = {
      [`point${positions.length + 1}`]: calculatePosition(e, radius),
    };
    setPositions((prev) => [
      ...prev.slice(0, index + 1),
      newPoint,
      ...prev.slice(index + 1),
    ]);
  };

  return (
    <div id="image-box" className={scaling ? "scaling" : ""}>
      <img id="image" src={ContentImage} />
      {positions.map((point) => (
        <Point
          point={point}
          handleMouseDown={handleMouseDown}
          isSelected={Object.keys(point)[0] === selectedPoint}
        />
      ))}
      {!dragging &&
        positions.map((point, index, array) => {
          const nextPoint = array[(index + 1) % array.length];
          return (
            <Edge
              point={point}
              nextPoint={nextPoint}
              index={index}
              radius={radius}
              addNewPointHandler={addNewPointHandler}
            />
          );
        })}
    </div>
  );
};

export default ImageBox;
