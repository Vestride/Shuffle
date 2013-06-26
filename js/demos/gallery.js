
var Exports = {
  Modules : {}
};

Exports.Modules.Gallery = (function($, undefined) {
  var $grid,
  $features,
  $megapixels,
  features = [],
  megapixels = [],
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
    $grid = $('.products');
    $features = $('.filter-options .features');
    $megapixels = $('.filter-options .megapixels');
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
    // Features
    $features.find('input').on('change', function() {
      var $checked = $features.find('input:checked'),
      groups = [];

      // At least one checkbox is checked, clear the array and loop through the checked checkboxes
      // to build an array of strings
      if ($checked.length !== 0) {
        $checked.each(function() {
            groups.push(this.value);
        });
      }
      features = groups;

      filter();
    });

    // Megapixels
    $megapixels.children().on('click', function() {
      $(this).button('toggle');

      var $checked = $megapixels.find('.active'),
      groups = [];

      // Get all megapixel filters
      if ( $checked.length !== 0 ) {
        $checked.each(function() {
            groups.push(this.getAttribute('data-megapixels'));
        });
      }
      megapixels = groups;

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

    // If a features filter is active
    if ( features.length > 0 && !arrayContainsArray(data.groups, features) ) {
      return false;
    }

    // If a megapixels filter is active
    if ( megapixels.length > 0 && !valueInArray(data.megapixels, megapixels) ) {
      return false;
    }

    return true;
  },

  hasActiveFilters = function() {
    return megapixels.length > 0 || features.length > 0;
  },

  valueInArray = function(value, arr) {
    return $.inArray(value, arr) !== -1;
  },

  arrayContainsArray = function(arrToTest, requiredArr) {
    var i = 0,
    dictionary = {},
    j;

    // Convert groups into object which we can test the keys
    for (j = 0; j < arrToTest.length; j++) {
      dictionary[ arrToTest[j] ] = true;
    }

    // Loop through selected features, if that feature is not in this elements groups, return false
    for (; i < requiredArr.length; i++) {
      if ( dictionary[ requiredArr[i] ] === undefined ) {
        return false;
      }
    }
    return true;
  };

  return {
    init: init
  };
}(jQuery));



$(document).ready(function() {
  Exports.Modules.Gallery.init();
});