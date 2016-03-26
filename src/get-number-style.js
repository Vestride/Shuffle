'use strict';

import getNumber from './get-number';
import COMPUTED_SIZE_INCLUDES_PADDING from './computed-size';

/**
 * Retrieve the computed style for an element, parsed as a float.
 * @param {Element} element Element to get style for.
 * @param {string} style Style property.
 * @param {CSSStyleDeclaration} [styles] Optionally include clean styles to
 *     use instead of asking for them again.
 * @return {number} The parsed computed value or zero if that fails because IE
 *     will return 'auto' when the element doesn't have margins instead of
 *     the computed style.
 */
export default function getNumberStyle(element, style,
    styles = window.getComputedStyle(element, null)) {
  var value = getNumber(styles[style]);

  // Support IE<=11 and W3C spec.
  if (!COMPUTED_SIZE_INCLUDES_PADDING && style === 'width') {
    value += getNumber(styles.paddingLeft) +
      getNumber(styles.paddingRight) +
      getNumber(styles.borderLeftWidth) +
      getNumber(styles.borderRightWidth);
  } else if (!COMPUTED_SIZE_INCLUDES_PADDING && style === 'height') {
    value += getNumber(styles.paddingTop) +
      getNumber(styles.paddingBottom) +
      getNumber(styles.borderTopWidth) +
      getNumber(styles.borderBottomWidth);
  }

  return value;
}
