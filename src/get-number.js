'use strict';

/**
 * Always returns a numeric value, given a value. Logic from jQuery's `isNumeric`.
 * @param {*} value Possibly numeric value.
 * @return {number} `value` or zero if `value` isn't numeric.
 */
export default function getNumber(value) {
  return parseFloat(value) || 0;
}
