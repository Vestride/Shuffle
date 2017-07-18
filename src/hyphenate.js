/**
 * Hyphenates a javascript style string to a css one. For example:
 * MozBoxSizing -> -moz-box-sizing.
 * @param {string} str The string to hyphenate.
 * @return {string} The hyphenated string.
 */
export default function hyphenate(str) {
  return str.replace(/([A-Z])/g, (str, m1) => `-${m1.toLowerCase()}`);
}
