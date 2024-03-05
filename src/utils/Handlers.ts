import { calculatePosition, isInsidePolygon } from "./PolCalc";
import { Dispatch, SetStateAction, MouseEvent } from "react";

interface PositionPoint {
  [key: string]: { x: number; y: number };
}

export const addNewPointHandler =
  (
    setPositions: Dispatch<SetStateAction<PositionPoint[]>>,
    positions: PositionPoint[],
    radius: number
  ) =>
  (e: MouseEvent, index: number) => {
    const newPoint = {
      [`point${positions.length + 1}`]: calculatePosition(e, radius),
    };
    setPositions((prev) => [
      ...prev.slice(0, index + 1),
      newPoint,
      ...prev.slice(index + 1),
    ]);
  };

export const scalePositionsHandler = (
  setPositions: React.Dispatch<React.SetStateAction<PositionPoint[]>>,
  radius: number
) => {
  return (direction: "up" | "down") => {
    setPositions((prev) => {
      let boundaryFound = false;
      let scaleFactor = direction === "up" ? 1.05 : 0.95;

      const relativeCenter = prev.reduce(
        (acc, point) => {
          const key = Object.keys(point)[0];
          const { x, y } = point[key];
          return { x: acc.x + x / prev.length, y: acc.y + y / prev.length };
        },
        { x: 0, y: 0 }
      );

      const calculateNewPositions = (scaleFactor: number) => {
        return prev.map((point) => {
          const key = Object.keys(point)[0];
          const { x, y } = point[key];
          const shiftedX = x - relativeCenter.x;
          const shiftedY = y - relativeCenter.y;
          const scaledX = shiftedX * scaleFactor;
          const scaledY = shiftedY * scaleFactor;
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
      };

      let newPositions = calculateNewPositions(scaleFactor);
      while (boundaryFound && scaleFactor > 1) {
        boundaryFound = false;
        scaleFactor -= 0.01;
        newPositions = calculateNewPositions(scaleFactor);
      }

      return newPositions;
    });
  };
};

export const keyPressHandler = (
  setPositions: React.Dispatch<React.SetStateAction<PositionPoint[]>>,
  setSelectedPoint: React.Dispatch<React.SetStateAction<string | null>>,
  handleScalePositions: (direction: "up" | "down") => void,
  setScaling: React.Dispatch<React.SetStateAction<boolean>>,
  selectedPoint: string | null
) => {
  return (e: KeyboardEvent | WheelEvent) => {
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
          handleScalePositions("up");
        } else {
          handleScalePositions("down");
        }
      }
      setTimeout(() => setScaling(false), 100);
    }
  };
};

export const positionsDragValidityHandler = (
  setDragging: React.Dispatch<React.SetStateAction<string | null>>,
  setIsInside: React.Dispatch<React.SetStateAction<boolean>>,
  setInitialMousePosition: React.Dispatch<
    React.SetStateAction<{ x: number; y: number } | null>
  >,
  positions: PositionPoint[],
  radius: number,
  handleMouseUp: () => void,
  onElement: boolean
) => {
  return (e: React.MouseEvent) => {
    if (onElement) return;
    const imageBox = document.getElementById("image-box");
    if (!imageBox) return false;
    const rect = imageBox.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (isInsidePolygon(x, y, positions, radius)) {
      const isUnderPoint = positions.some((point) => {
        const { x, y } = Object.values(point)[0];
        const distance = Math.sqrt(
          Math.pow(x - (e.clientX - rect.left), 2) +
            Math.pow(y - (e.clientY - rect.top), 2)
        );
        return distance <= 15;
      });

      if (!isUnderPoint) {
        setDragging("dragging");
        setIsInside(true);
        setInitialMousePosition({ x, y });
      }
    } else {
      return;
    }
    window.addEventListener("mouseup", handleMouseUp);
  };
};

export const positionsDragHandler = (
  setPositions: React.Dispatch<React.SetStateAction<PositionPoint[]>>,
  initialMousePosition: { x: number; y: number } | null,
  isInside: boolean,
  positions: PositionPoint[],
  radius: number,
  setInitialMousePosition: React.Dispatch<
    React.SetStateAction<{ x: number; y: number } | null>
  >
) => {
  return (e: React.MouseEvent) => {
    const imageBox = document.getElementById("image-box");
    if (!imageBox || !initialMousePosition) return;
    const rect = imageBox.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isInside) {
      const deltaX = x - initialMousePosition.x;
      const deltaY = y - initialMousePosition.y;

      const newPositions = positions.map((point) => {
        const key = Object.keys(point)[0];
        const { x: prevX, y: prevY } = point[key];
        const newX = prevX + deltaX;
        const newY = prevY + deltaY;
        return { [key]: { x: newX, y: newY } };
      });

      const isOutside = newPositions.some((point) => {
        const { x, y } = Object.values(point)[0];
        return (
          x < 0 ||
          x >= rect.width - 2 * radius ||
          y < 0 ||
          y >= rect.height - 2 * radius
        );
      });

      if (!isOutside) {
        setPositions(newPositions);
      }
      setInitialMousePosition({ x, y });
    }
  };
};
