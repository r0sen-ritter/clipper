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

export { calculateEuclideanDistance, calculateAngle };
