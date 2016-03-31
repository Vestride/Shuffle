// Legacy Viewport helper.

(function( $ ) {

  'use strict';

  var instance = null;
  var $window = $(window);

  var ViewportItem = function( options ) {
    var self = this;

    // Get defaults
    $.extend( self, ViewportItem.options, options, ViewportItem.settings );

    // The whole point is to have a callback function.
    // Don't do anything if it's not given
    if ( !$.isFunction( self.enter ) ) {
      throw new TypeError('Viewport.add :: No `enter` function provided in Viewport options.');
    }

    // Threshold can be a percentage. Parse it.
    if ( (typeof self.threshold === 'string' && self.threshold.indexOf('%') > -1 ) ) {
      self.isThresholdPercentage = true;
      self.threshold = parseFloat( self.threshold ) / 100;

    } else if ( self.threshold < 1 && self.threshold > 0 ) {
      self.isThresholdPercentage = true;
    }

    self.hasLeaveCallback = $.isFunction( self.leave );
    self.$element = $( self.element );

    // Cache element's offsets and dimensions
    self.update();
  };

  ViewportItem.prototype.update = function() {
    var self = this;

    self.offset = self.$element.offset();
    self.height = self.$element.height();
    self.width = self.$element.width();
  };

  ViewportItem.options = {
    threshold: 200,
    delay: 0
  };

  ViewportItem.settings = {
    triggered: false,
    isThresholdPercentage: false
  };

  var Viewport = function() {
    this.init();
  };

  Viewport.prototype = {

    init : function() {
      var self = this;

      self.list = [];
      self.lastScrollY = 0;
      self.windowHeight = $window.height();
      self.windowWidth = $window.width();
      self.throttleTime = 100;

      self.onResize();
      self.bindEvents();

      // What's nice here is that rAF won't execute until the user is on this tab,
      // so if they open the page in a new tab which they aren't looking at,
      // this will execute when they come back to that tab
      self.willProcessNextFrame = true;
      requestAnimationFrame(function() {
        self.setScrollTop();
        self.process();
        self.willProcessNextFrame = false;
      });
    },

    bindEvents : function() {
      var self = this,
          refresh;

      // Updates offsets after a zero timeout
      refresh = function() {
        setTimeout(function refreshWithDelay() {
          self.refresh();
        }, 0);
      };

      // Listen for global resize
      $window.on('resize.viewport', $.proxy( self.onResize, self ));

      // Throttle scrolling because it doesn't need to be super accurate
      $window.on('scroll.viewport', $.proxy( self.onScroll, self ));

      self.hasActiveHandlers = true;
    },

    unbindEvents : function() {
      $window.off('.viewport');

      this.hasActiveHandlers = false;
    },

    maybeUnbindEvents : function() {
      var self = this;

      // Not currently watching anything, unbind events
      if ( !self.list.length ) {
        self.unbindEvents();
      }
    },

    add : function( viewportItem ) {
      var self = this;

      self.list.push( viewportItem );

      // Event handlers are removed if a callback is triggered and the
      // watch list is empty. Because modules are instantiated asynchronously,
      // another module could potentially add itself to the watch list when the events
      // have been unbound.
      // Check here if events have been unbound and bind them again if they have
      if ( !self.hasActiveHandlers ) {
        self.bindEvents();
      }

      if ( !self.willProcessNextFrame ) {
        self.willProcessNextFrame = true;
        requestAnimationFrame(function() {
          self.willProcessNextFrame = false;
          self.process();
        });
      }
    },

    saveDimensions : function() {
      var self = this;

      $.each(self.list, function( i, viewportItem ) {
        viewportItem.update();
      });

      // self.documentHeight
      self.windowHeight = $window.height();
      self.windowWidth = $window.width();
    },

    // Throttled scroll event
    onScroll : function() {
      var self = this;

      // No point in doing anything if there aren't any viewports to watch
      if ( !self.list.length ) {
        return;
      }

      // Save the new scroll top
      self.setScrollTop();

      self.process();
    },

    // Debounced resize event
    onResize : function() {
      this.refresh();
    },

    refresh : function() {

      // No point in doing anything if there aren't any viewports to watch
      if ( !this.list.length ) {
        return;
      }

      // Update offsets and width/height for each viewport item
      this.saveDimensions();

    },

    isInViewport : function( viewportItem ) {
      var self = this,
          offset = viewportItem.offset,
          threshold = viewportItem.threshold,
          percentage = threshold,
          st = self.lastScrollY,
          isTopInView;


      if ( viewportItem.isThresholdPercentage ) {
        threshold = 0;
      }

      // Other checks could be added here in the future
      isTopInView = self.isTopInView( st, self.windowHeight, offset.top, viewportItem.height, threshold );

      // If the top isn't in view with zero threshold,
      // don't bother checking if it's at a percent of the window
      if ( isTopInView && viewportItem.isThresholdPercentage ) {
        isTopInView = self.isTopPastPercent( st, self.windowHeight, offset.top, viewportItem.height, percentage );
      }

      return isTopInView;
    },

    // If  the top of the element (plus the threshold) is past the viewport's top
    // and the top of the element (plus the threshold) is not past the viewport's bottom.
    // Then the top is in view.
    isTopInView : function( viewportTop, viewportHeight, elementTop, elementHeight, threshold ) {
      var viewportBottom = viewportTop + viewportHeight;
      return (elementTop + threshold) >= viewportTop && (elementTop + threshold) < viewportBottom;
    },

    isTopPastPercent : function( viewportTop, viewportHeight, elementTop, elementHeight, percentage ) {
      var viewportBottom = viewportTop + viewportHeight,
          distFromViewportBottomToElementTop = viewportBottom - elementTop,
          percentFromBottom = distFromViewportBottomToElementTop / viewportHeight;
      return percentFromBottom >= percentage;
    },

    isOutOfViewport : function( viewport, side ) {
      var self = this,
          offset = viewport.offset,
          st = self.lastScrollY,
          bool;

      if ( side === 'bottom' ) {
        bool = !self.isBottomInView( st, self.windowHeight, offset.top, viewport.height );
      }

      return bool;
    },

    isBottomInView : function( viewportTop, viewportHeight, elementTop, elementHeight ) {
      var viewportBottom = viewportTop + viewportHeight,
          elementBottom = elementTop + elementHeight;
      return elementBottom > viewportTop && elementBottom <= viewportBottom;
    },

    triggerEnter : function( viewportItem ) {
      var self = this;

      // Queue up the callback with the delay. Default is 0
      setTimeout(function() {
        viewportItem.enter.call( viewportItem.element, viewportItem );
      }, viewportItem.delay);


      if ( $.isFunction( viewportItem.leave ) ) {
        viewportItem.triggered = true;

      // If the leave property is not a function,
      // The module no longer needs to watch it, so remove from list
      // However, the list may have been modified already in this loop, so find the
      // index of the viewport item instead of using the loop index.
      } else {
        self.list.splice( $.inArray( viewportItem, self.list ), 1 );
      }

      // If there are no more, unbind from scroll and resize events
      self.maybeUnbindEvents();
    },

    triggerLeave : function( viewportItem ) {
      // var self = this;

      // Queue up the callback with the delay. Default is 0
      setTimeout(function() {
        viewportItem.leave.call( viewportItem.element, viewportItem );
      }, viewportItem.delay);

      viewportItem.triggered = false;
    },

    setScrollTop : function() {
      // Save the new scroll top
      this.lastScrollY = $window.scrollTop();
    },

    process : function() {
      var self = this,

          // The list can possibly be modified mid loop,
          // so the loop needs a copy of the variable which won't be modified
          list = $.extend( [], self.list );

      $.each(list, function( i, viewportItem ) {
        var isInViewport = self.isInViewport( viewportItem ),
            isBottomOutOfView = viewportItem.hasLeaveCallback && self.isOutOfViewport( viewportItem, 'bottom' );

        // If the enter callback hasn't been triggerd and it's in the viewport,
        // trigger the enter callback
        if ( !viewportItem.triggered && isInViewport ) {
          return self.triggerEnter( viewportItem );
        }

        // This viewport has already come into view once and now it is out of view
        // It's not in view, the bottom is out of view, the list item's enter has been triggered
        if ( !isInViewport && isBottomOutOfView && viewportItem.triggered ) {
          return self.triggerLeave( viewportItem );
        }
      });
    }
  };


  Viewport.add = function( options ) {
    var instance = Viewport.getInstance();

    return instance.add( new ViewportItem( options ) );
  };


  Viewport.refresh = function() {
    Viewport.getInstance().refresh();
  };


  Viewport.getInstance = function() {
    if ( !instance ) {
      instance = new Viewport();
    }

    return instance;
  };


  window.Viewport = Viewport;
}( jQuery ));
