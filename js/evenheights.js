
/*!
 * jQuery Even Heights plugin
 * Author: Glen Cheney
 * Modified: 2014-03-08
 * Dependencies: jQuery 1.2.6+
 * Sets a jQuery collection to all be the same height
 * If you need to set multiple collection, please use `$.evenHeights( collectionsArray )`
 * because it is much faster
 */

(function( $ ) {
  'use strict';

  function getTallest( $elements ) {
    var tallest = 0;
    $elements.each(function() {
      if ( this.offsetHeight > tallest ) {
        tallest = this.offsetHeight;
      }
    });
    return tallest;
  }


  $.fn.evenHeights = function() {
    return this.css( 'height', '' ).css( 'height', getTallest( this ) );
  };


  /**
   * For groups of elements which should be the same height. Using this method
   * will create far less style recalculations and layouts.
   * @param {Array.<jQuery>} groups Array of jQuery collections.
   * @return {Array.<number>} An array containing the pixel value of the
   *     tallest element for each group.
   */
  $.evenHeights = function( groups ) {
    var winners = [];

    // First, reset the height for every element.
    // This is done first, otherwise we dirty the DOM on each loop!
    $.each(groups, function( i, $elements ) {
      $elements.css( 'height', '' );
    });

    // Now, measure heights in each group and save the tallest value. Instead of
    // setting the height value for the entire group, save it. If it were set,
    // the next iteration in the loop would have to recalculate styles in the DOM
    $.each(groups, function( i, $elements ) {
      winners.push( getTallest( $elements ) );
    });

    // Lastly, set them all.
    $.each(groups, function( i, $elements ) {
      $elements.css( 'height', winners[ i ] );
    });

    return winners;
  };
})(window.$);

