/**
 * Even Heights plugin
 * Author: Glen Cheney
 * Modified: 2016-03-08
 * Sets a collection to all be the same height.
 *
 * Usage:
 *
 * evenHeights([
 *   document.querySelectorAll('.foo'),
 * ]);
 *
 */
window.evenHeights = (function () {
  'use strict';

  function getTallest(elements) {
    var tallest = 0;

    for (var i = elements.length - 1; i >= 0; i--) {
      if (elements[i].offsetHeight > tallest) {
        tallest = elements[i].offsetHeight;
      }
    }

    return tallest;
  }

  function setAllHeights(elements, height) {
    for (var i = elements.length - 1; i >= 0; i--) {
      elements[i].style.height = height;
    }
  }

  /**
   * For groups of elements which should be the same height. Using this method
   * will create far less style recalculations and layouts.
   * @param {ArrayLike.<ArrayLike.<Element>>} groups An array-like collection of
   *     an array-like collection of elements.
   * @return {Array.<number>} An array containing the pixel value of the
   *     tallest element for each group.
   */
  function evenHeights(groups) {
    groups = Array.prototype.slice.call(groups);

    // First, reset the height for every element.
    // This is done first, otherwise we dirty the DOM on each loop!
    groups.forEach(function (elements) {
      setAllHeights(elements, '');
    });

    // Now, measure heights in each group and save the tallest value. Instead of
    // setting the height value for the entire group, save it. If it were set,
    // the next iteration in the loop would have to recalculate styles in the DOM
    var tallests = groups.map(function (elements) {
      return getTallest(elements);
    });

    // Lastly, set them all.
    groups.forEach(function (elements, i) {
      setAllHeights(elements, tallests[i] + 'px');
    });

    return tallests;
  }

  return evenHeights;
})();

