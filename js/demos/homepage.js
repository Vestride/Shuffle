var DEMO = (function($, window) {
  'use strict';

  var $grid = $('#grid'),
      $filterOptions = $('.filter-options'),

  init = function() {
    setupFilters();
    setupSorting();
    setupSearching();

    // instantiate the plugin
    $grid.shuffle({
      itemSelector: '.picture-item',
      columnWidth: $grid.find('.shuffle__sizer')
    });

    // Destroy it! o_O
    // $grid.shuffle('destroy');

    // You can subscribe to custom events: shrink, shrunk, filter, filtered, and sorted
    // $grid.on('shrink.shuffle shrunk.shuffle filter.shuffle filtered.shuffle sorted.shuffle layout.shuffle', function(evt, shuffle) {
    //   if ( window.console ) {
    //     console.log(evt.type, shuffle, this);
    //   }
    // });
  },

  // Set up button clicks
  setupFilters = function() {
    var $btns = $filterOptions.children();
    $btns.on('click', function() {
      var $this = $(this),
          isActive = $this.hasClass( 'active' ),
          group = isActive ? 'all' : $this.data('group');

      // Hide current label, show current label in title
      if ( !isActive ) {
        $('.filter-options .active').removeClass('active');
      }

      $this.toggleClass('active');

      // Filter elements
      $grid.shuffle( group );
    });

    $btns = null;
  },

  setupSorting = function() {
    // Sorting options
    $('.sort-options button').on('click', function() {
      var $this = $(this),
          sort = $this.data('sort'),
          opts = {};

      // Hide current label, show current label in title
      $('.sort-options .active').removeClass('active');
      $this.addClass('active');

      // We're given the element wrapped in jQuery
      if (sort === 'date-created') {
        opts = {
          by: function($el) {
            return $el.data('date-created');
          }
        }
      } else if (sort === 'title') {
        opts = {
          by: function($el) {
            return $el.data('title').toLowerCase();
          }
        };
      }

      // Filter elements
      $grid.shuffle('sort', opts);
    });
  },

  setupSearching = function() {
    // Advanced filtering
    $('.js-shuffle-search').on('keyup change', function() {
      var val = this.value.toLowerCase();
      $grid.shuffle(function($el, shuffle) {

        // Only search elements in the current group
        // if (shuffle.group !== 'all' && $.inArray(shuffle.group, $el.data('groups')) === -1) {
        //   return false;
        // }

        var text = $.trim($el.text()).toLowerCase();
        console.log(text);
        return text.indexOf(val) != -1;
      });
    });
  };

  return {
    init: init
  };
}(jQuery, window));



$(document).ready(function() {
  DEMO.init();
});