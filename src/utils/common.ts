/**
 * Angle in degrees between vector and x axis
 * @param x0 - first point's x coordinate
 * @param y0 - first point's y coordinate
 * @param x1 - second point's x coordinate
 * @param y1 - second point's y coordinate
 * @returns Angle between vector and x axis
 */
export const getDegAngel = (x0: number, y0: number, x1: number, y1: number): number => {
  const y = y1 - y0;
  const x = x1 - x0;
  return Math.atan2(y, x) * (180 / Math.PI);
};

/**
 * Returns a random number between two numbers
 *
 * @param {number} min - min number
 * @param {number} max - max number
 * @returns Random number between min and max
 */
export const random = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};
