export default class Rect {
  /**
   * Class for representing rectangular regions.
   * https://github.com/google/closure-library/blob/master/closure/goog/math/rect.js
   * @param {number} x Left.
   * @param {number} y Top.
   * @param {number} w Width.
   * @param {number} h Height.
   * @param {number} id Identifier
   * @constructor
   */
  constructor(x, y, w, h, id) {
    this.id = id;

    /** @type {number} */
    this.left = x;

    /** @type {number} */
    this.top = y;

    /** @type {number} */
    this.width = w;

    /** @type {number} */
    this.height = h;
  }

  /**
   * Returns whether two rectangles intersect.
   * @param {Rect} a A Rectangle.
   * @param {Rect} b A Rectangle.
   * @return {boolean} Whether a and b intersect.
   */
  static intersects(a, b) {
    return (
      a.left < b.left + b.width && b.left < a.left + a.width && a.top < b.top + b.height && b.top < a.top + a.height
    );
  }
}
