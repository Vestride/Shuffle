
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

  _init = function() {
    $grid = $('.products');
    $features = $('.filter-options .features');
    $megapixels = $('.filter-options .megapixels');

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

      _filter();
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

      _filter();
    });

        
    // instantiate the plugin
    $grid.shuffle({
      group : 'all',
      speed : 400,
      easing : 'cubic-bezier(0.165, 0.840, 0.440, 1.000)', // easeOutQuart
      columnWidth: function( containerWidth ) {
        var colW = columnWidths[ containerWidth ];
        if ( colW === undefined ) {
          colW = containerWidth;
        }
        return colW;
      },
      gutterWidth: function( containerWidth ) {
        var gutter = 0;
        switch ( containerWidth ) {
          case 1170:
            gutter = 30;
            break;
          case 940: // Falls through
          case 724:
            gutter = 20;
            break;
          default:
            gutter = 0;
        }
        return gutter;
      }
    });
  },

  _filter = function() {
    if ( _hasActiveFilters() ) {
      $grid.shuffle(function($el) {
        return _itemPassesFilters( $el.data() );
      });
    } else {
      $grid.shuffle('all');
    }
  },

  _itemPassesFilters = function(data) {

    // If a features filter is active
    if ( features.length > 0 && !_arrayContainsArray(data.groups, features) ) {
      return false;
    }

    // If a megapixels filter is active
    if ( megapixels.length > 0 && !_valueInArray(data.megapixels, megapixels) ) {
      return false;
    }

    return true;
  },

  _hasActiveFilters = function() {
    return megapixels.length > 0 || features.length > 0;
  },

  _valueInArray = function(value, arr) {
    return $.inArray(value, arr) !== -1;
  },

  _arrayContainsArray = function(arrToTest, requiredArr) {
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
    init: _init
  };
}(jQuery));

$(document).ready(function() {
  Exports.Modules.Gallery.init();
});