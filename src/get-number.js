'use strict';

/**
 * Always returns a numeric value, given a value. Logic from jQuery's `isNumeric`.
 * @param {*} value Possibly numeric value.
 * @return {number} `value` or zero if `value` isn't numeric.
 * @private
 */
export default function getNumber(value) {
  let str = value && value.toString();
  let val = parseFloat(str);
  if (val + 1 >= 0) {
    return val;
  }

  return 0;
}
