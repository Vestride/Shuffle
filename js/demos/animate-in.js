var DEMO = (function( $, Viewport ) {
  'use strict';

  var $grid = $('#grid'),
      $gridItems = $grid.find('.picture-item'),
      $sizer = $grid.find('.shuffle__sizer'),
      shuffle,

  init = function() {


    // instantiate the plugin
    $grid.shuffle({
      itemSelector: '.picture-item',
      sizer: $sizer
    });

    shuffle = $grid.data('shuffle');

    addViewportItems();

    setTimeout(function() {
      listen();
      addTransitionToItems();
    }, 100);
  },

  addViewportItems = function() {
    $gridItems.each(function() {
      Viewport.add({
        element: this,
        threshold: 130,
        enter: showItemsInViewport
      });
    });
  },

  // Only the items out of the viewport should transition. This way, the first visible ones
  // will snap into place.
  addTransitionToItems = function() {
    $gridItems.find('.picture-item__inner').addClass('picture-item__inner--transition');
  },

  showItemsInViewport = function() {
    $(this).addClass('in');
  },

  // Re layout shuffle when images load. This is only needed
  // below 768 pixels because the .picture-item height is auto and therefore
  // the height of the picture-item is dependent on the image
  // I recommend using imagesloaded to determine when an image is loaded
  // but that doesn't support IE7
  listen = function() {

    var debouncedLayout = $.throttle( 300, function() {
      $grid.shuffle('update');
      Viewport.refresh();
    });

    var $imgs = $grid.find('img');

    // Get all images inside shuffle
    $imgs.each(function() {
      var proxyImage;

      // Image already loaded
      if ( this.complete && this.naturalWidth !== undefined ) {
        return;
      }

      // If none of the checks above matched, simulate loading on detached element.
      proxyImage = new Image();
      $( proxyImage ).on('load', function() {
        $(this).off('load');
        debouncedLayout();
      });

      proxyImage.src = this.src;
    });

    // Because this method doesn't seem to be perfect.
    setTimeout(function() {
      debouncedLayout();
    }, 500);
  };

  return {
    init: init,
    getShuffle: function() {
      return shuffle;
    }
  };
}( jQuery, window.Viewport ));



$(document).ready(function() {
  DEMO.init();
});
