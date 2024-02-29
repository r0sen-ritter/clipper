interface PositionPoint {
  [key: string]: { x: number; y: number };
}

const calculateEuclideanDistance = (
  point1: PositionPoint,
  point2: PositionPoint
) => {
  const key1 = Object.keys(point1)[0];
  const key2 = Object.keys(point2)[0];
  const x1 = point1[key1].x;
  const y1 = point1[key1].y;
  const x2 = point2[key2].x;
  const y2 = point2[key2].y;
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

const calculateAngle = (point1: PositionPoint, point2: PositionPoint) => {
  const key1 = Object.keys(point1)[0];
  const key2 = Object.keys(point2)[0];
  const x1 = point1[key1].x;
  const y1 = point1[key1].y;
  const x2 = point2[key2].x;
  const y2 = point2[key2].y;
  return Math.atan2(y2 - y1, x2 - x1);
};

const calculatePosition = (
  e: { clientX: number; clientY: number },
  radius: number
): { x: number; y: number } => {
  const imageBox = document.getElementById("image-box");
  if (!imageBox) return { x: 0, y: 0 };
  const rect = imageBox.getBoundingClientRect();
  let x = e.clientX - rect.left - radius;
  let y = e.clientY - rect.top - radius;
  x = Math.max(0, Math.min(x, 280 - 2 * radius));
  y = Math.max(0, Math.min(y, 280 - 2 * radius));
  return { x, y };
};

export { calculateEuclideanDistance, calculateAngle, calculatePosition };
