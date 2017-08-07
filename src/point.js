import getNumber from './get-number';

class Point {
  /**
   * Represents a coordinate pair.
   * @param {number} [x=0] X.
   * @param {number} [y=0] Y.
   */
  constructor(x, y) {
    this.x = getNumber(x);
    this.y = getNumber(y);
  }

  /**
   * Whether two points are equal.
   * @param {Point} a Point A.
   * @param {Point} b Point B.
   * @return {boolean}
   */
  static equals(a, b) {
    return a.x === b.x && a.y === b.y;
  }
}

export default Point;
