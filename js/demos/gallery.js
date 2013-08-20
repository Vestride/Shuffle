
var Exports = {
  Modules : {}
};

Exports.Modules.Gallery = (function($, undefined) {
  var $grid,
  $shapes,
  $colors,
  shapes = [],
  colors = [],

  // Using shuffle with specific column widths
  columnWidths = {
    1170: 70,
    940: 60,
    724: 42
  },
  gutterWidths = {
    1170: 30,
    940: 20,
    724: 20
  },

  init = function() {
    setVars();
    initFilters();
    initShuffle();
  },

  setVars = function() {
    $grid = $('.js-shuffle');
    $shapes = $('.js-shapes');
    $colors = $('.js-colors');
  },

  initShuffle = function() {
    // instantiate the plugin
    $grid.shuffle({
      speed : 250,
      easing : 'cubic-bezier(0.165, 0.840, 0.440, 1.000)', // easeOutQuart
      columnWidth: function( containerWidth ) {
        var colW = columnWidths[ containerWidth ];

        // Default to container width
        if ( colW === undefined ) {
          colW = containerWidth;
        }
        return colW;
      },
      gutterWidth: function( containerWidth ) {
        var gutter = gutterWidths[ containerWidth ];

        // Default to zero
        if ( gutter === undefined ) {
          gutter = 0;
        }
        return gutter;
      }
    });
  },

  initFilters = function() {
    // shapes
    $shapes.find('input').on('change', function() {
      var $checked = $shapes.find('input:checked'),
      groups = [];

      // At least one checkbox is checked, clear the array and loop through the checked checkboxes
      // to build an array of strings
      if ($checked.length !== 0) {
        $checked.each(function() {
            groups.push(this.value);
        });
      }
      shapes = groups;

      filter();
    });

    // colors
    $colors.find('button').on('click', function() {
      var $this = $(this),
          $alreadyChecked,
          checked = [],
          active = 'active',
          isActive;

      // Already checked buttons which are not this one
      $alreadyChecked = $this.siblings('.' + active);

      $this.toggleClass( active );

      // Remove active on already checked buttons to act like radio buttons
      if ( $alreadyChecked.length ) {
        $alreadyChecked.removeClass( active );
      }

      isActive = $this.hasClass( active );

      if ( isActive ) {
        checked.push( $this.data( 'filterValue' ) );
      }

      colors = checked;

      filter();
    });
  },

  filter = function() {
    if ( hasActiveFilters() ) {
      $grid.shuffle('shuffle', function($el) {
        return itemPassesFilters( $el.data() );
      });
    } else {
      $grid.shuffle( 'shuffle', 'all' );
    }
  },

  itemPassesFilters = function(data) {

    // If a shapes filter is active
    if ( shapes.length > 0 && !valueInArray(data.shape, shapes) ) {
      return false;
    }

    // If a colors filter is active
    if ( colors.length > 0 && !valueInArray(data.color, colors) ) {
      return false;
    }

    return true;
  },

  hasActiveFilters = function() {
    return colors.length > 0 || shapes.length > 0;
  },

  valueInArray = function(value, arr) {
    return $.inArray(value, arr) !== -1;
  };

  // arrayContainsArray = function(arrToTest, requiredArr) {
  //   var i = 0,
  //   dictionary = {},
  //   j;

  //   // Convert groups into object which we can test the keys
  //   for (j = 0; j < arrToTest.length; j++) {
  //     dictionary[ arrToTest[j] ] = true;
  //   }

  //   // Loop through selected shapes, if that feature is not in this elements groups, return false
  //   for (; i < requiredArr.length; i++) {
  //     if ( dictionary[ requiredArr[i] ] === undefined ) {
  //       return false;
  //     }
  //   }
  //   return true;
  // };

  return {
    init: init
  };
}(jQuery));



$(document).ready(function() {
  Exports.Modules.Gallery.init();
});
