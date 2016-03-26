'use strict';

import xtend from 'xtend';

// http://stackoverflow.com/a/962890/373422
function randomize(array) {
  var tmp;
  var current;
  let top = array.length;

  if (!top) {
    return array;
  }

  while (--top) {
    current = Math.floor(Math.random() * (top + 1));
    tmp = array[current];
    array[current] = array[top];
    array[top] = tmp;
  }

  return array;
}

let defaults = {
  // Use array.reverse() to reverse the results
  reverse: false,

  // Sorting function
  by: null,

  // If true, this will skip the sorting and return a randomized order in the array
  randomize: false,

  // Determines which property of each item in the array is passed to the
  // sorting method.
  key: 'element',
};

// You can return `undefined` from the `by` function to revert to DOM order.
export default function sorter(arr, options) {
  let opts = xtend(defaults, options);
  let original = [].slice.call(arr);
  let revert = false;

  if (!arr.length) {
    return [];
  }

  if (opts.randomize) {
    return randomize(arr);
  }

  // Sort the elements by the opts.by function.
  // If we don't have opts.by, default to DOM order
  if (typeof opts.by === 'function') {
    arr.sort(function (a, b) {

      // Exit early if we already know we want to revert
      if (revert) {
        return 0;
      }

      let valA = opts.by(a[opts.key]);
      let valB = opts.by(b[opts.key]);

      // If both values are undefined, use the DOM order
      if (valA === undefined && valB === undefined) {
        revert = true;
        return 0;
      }

      if (valA < valB || valA === 'sortFirst' || valB === 'sortLast') {
        return -1;
      }

      if (valA > valB || valA === 'sortLast' || valB === 'sortFirst') {
        return 1;
      }

      return 0;
    });
  }

  // Revert to the original array if necessary
  if (revert) {
    return original;
  }

  if (opts.reverse) {
    arr.reverse();
  }

  return arr;
}
