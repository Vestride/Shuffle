/**
 * @author Glen Cheney
 */

/*
 * jQuery throttle / debounce - v1.1 - 3/7/2010
 * http://benalman.com/projects/jquery-throttle-debounce-plugin/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function(b,c){var $=b.jQuery||b.Cowboy||(b.Cowboy={}),a;$.throttle=a=function(e,f,j,i){var h,d=0;if(typeof f!=="boolean"){i=j;j=f;f=c}function g(){var o=this,m=+new Date()-d,n=arguments;function l(){d=+new Date();j.apply(o,n)}function k(){h=c}if(i&&!h){l()}h&&clearTimeout(h);if(i===c&&m>e){l()}else{if(f!==true){h=setTimeout(i?k:l,i===c?e-m:e)}}}if($.guid){g.guid=j.guid=j.guid||$.guid++}return g};$.debounce=function(d,e,f){return f===c?a(d,e,false):a(d,f,e!==false)}})(this);



var Modules = {};

Modules.Support = (function( $ ) {
  'use strict';

  var self = {},

  // some small (2x1 px) test images for each feature
  webpImages = {
    basic: 'data:image/webp;base64,UklGRjIAAABXRUJQVlA4ICYAAACyAgCdASoCAAEALmk0mk0iIiIiIgBoSygABc6zbAAA/v56QAAAAA==',
    lossless: 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAQAAAAfQ//73v/+BiOh/AAA='
  };

  self.webp = function( feature ) {
    var dfd = $.Deferred();

    $('<img>')
      .on('load', function() {
        // the images should have these dimensions
        if ( this.width === 2 && this.height === 1 ) {
          dfd.resolve();
        } else {
          dfd.reject();
        }
      })

      // Reject deferred on error
      .on('error', function() {
        dfd.reject();
      })

      // Set the image src
      .attr('src', webpImages[ feature || 'basic' ]);

    return dfd.promise();
  };

  // Fill rAF
  // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

  // requestAnimationFrame polyfill by Erik Möller
  // fixes from Paul Irish and Tino Zijdel
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] ||
        window[vendors[x]+'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }

  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }

  return self;
}( jQuery ));


Modules.Polyfill = (function( $, Support ) {
  'use strict';

  var init = function() {

    // If the deferred object in webp is rejected, call the webp polyfill function
    Support.webp().fail( webp );
  },

  webp = function() {
    $('img[src$=".webp"]').each(function() {
      this.src = this.src.replace('.webp', '.jpg');
    });
  };

  return {
    init: init
  };
}( jQuery, Modules.Support ));


Modules.Nav = (function( $ ) {
  'use strict';

  function NavTray( element ) {
    this.$el = $( element );

    this.isOpen = false;
    this.$window = $( window );
    this.$trigger = this.$el.find('.js-nav-toggle');
    this.$tray = this.$el.find('.js-tray');

    this.openLabel = this.$trigger.text();
    this.closeLabel = this.$trigger.attr('data-close-label');

    this.init();
  }

  NavTray.prototype.init = function() {
    this.setEvenHeights();
    this.listen();

    // Google web font loading affects this.
    // I could use their loader, but don't really want their js too
    // I've changed the fallback font to Verdana, sans-serif to better
    // represent Ubuntu's wideness.
    // Also this isn't needed on load and could be done on window load
    setTimeout( $.proxy( this.saveHeight, this ), 100 );
  };

  NavTray.prototype.saveHeight = function() {
    this.collapseHeight = this.$tray.children()[0].offsetHeight;
  };

  NavTray.prototype.listen = function() {
    this.$trigger.on( 'click', $.proxy( this.toggle, this ) );
    this.$window.on( 'resize', $.proxy( this.onResize, this ) );
  };

  NavTray.prototype.onResize = function() {
    this.$tray.css( 'height', '' );
    this.setEvenHeights();
    this.saveHeight();

    if ( this.isOpen ) {
      this.$tray.css( 'height', this.collapseHeight );
    }
  };

  NavTray.prototype.toggle = function() {
    this.toggleBtnText();

    if ( this.isOpen ) {
      this.close();
    } else {
      this.open();
    }
  };

  NavTray.prototype.open = function() {
    this.$el.removeClass('collapsed');
    this.$tray.css( 'height', this.collapseHeight );
    this.isOpen = true;
  };

  NavTray.prototype.close = function() {
    this.$el.addClass('collapsed');
    this.$tray.css( 'height', '' );
    this.isOpen = false;
  };


  NavTray.prototype.toggleBtnText = function() {
    var label = this.isOpen ? this.openLabel : this.closeLabel;
    this.$trigger.text( label );
  };

  NavTray.prototype.setEvenHeights = function() {
    var groups = [
      this.$el.find('.js-demo'),
      $('#main .js-demo')
    ];
    $.evenHeights( groups );
  };

  return {
    init: function() {
      return new NavTray( document.getElementById('nav') );
    }
  };

}( jQuery ));


Modules.Favicon = (function( doc ) {
  'use strict';

  var Favicon = function( src, numFrames, framesPerAnimation, animationDelay ) {
    var self = this;

    // Variables based on params
    self.src = src;
    self.numFrames = numFrames;
    self.framesPerAnimation = framesPerAnimation;
    self.animationDelay = animationDelay;

    // Elements
    self.canvas = doc.createElement('canvas');
    self.img = doc.createElement('img');
    self.html = doc.documentElement;

    // Calculations
    self.size = window.devicePixelRatio > 1 ? 32 : 16;

    // If it's not a data url, pick apart the filename and add @2x for retina
    if ( !self.src.match(/data:/) && window.devicePixelRatio > 1 ) {
      var dot = self.src.lastIndexOf('.');
      self.src = self.src.substring( 0, dot ) + '@2x' + self.src.substring( dot );
    }

    self.currentFrame = 0;
    // Chrome chokes on this. It looks like it can handle 4 frames per second
    self.fps = 24;

    self.init();
  };

  Favicon.prototype.init = function() {
    var self = this;

    // No #favicon element or browser doesn't support canvas or < IE9, stop
    if ( !doc.getElementById('favicon') || !self.canvas.getContext || self.html.className.indexOf('lt-ie9') > -1 ) {
      return;
    }

    // Save context
    self.ctx = self.canvas.getContext('2d');

    // Set canvas dimensions based on device DPI
    self.canvas.height = self.canvas.width = self.size;

    // Create a new sprite 32x32 size with 32x32 sprites
    self.sprite = new Sprite( self.ctx, self.img, self.size );

    // Bind the image load handler
    self.img.onload = self.onSpriteLoaded.bind( self );

    // Trigger image to load
    self.img.src = self.src;
  };

  Favicon.prototype.getData = function() {
    return this.canvas.toDataURL('image/png');
  };

  // Clone the current #favicon and replace it with a new element
  // which has the updated data URI href
  Favicon.prototype.setFavicon = function() {
    var self = this,
        data = self.getData(),
        originalFavicon = doc.getElementById('favicon'),
        clone = originalFavicon.cloneNode( true );

    clone.setAttribute( 'href', data );
    originalFavicon.parentNode.replaceChild( clone, originalFavicon );
  };

  // Request Animation Frame Loop
  Favicon.prototype.loop = function( timestamp ) {
    var self = this;

    // If not enough time has elapse since the last call
    // immediately call the next rAF
    if ( timestamp - self.lastExecuted < self.timeToElapse ) {
      return requestAnimationFrame( self.loop.bind( self ) );
    }

    // Increment current frame
    self.currentFrame += 1;
    if ( self.currentFrame === self.numFrames ) {
      self.currentFrame = 0;
    }

    // Completed an animation state
    self.timeToElapse = self.currentFrame % self.framesPerAnimation === 0 ?
      self.animationDelay :
      1000 / self.fps;

    // Draw current frame from sprite
    self.sprite.drawFrame( self.currentFrame );

    // Swap <link>
    self.setFavicon();

    // Set a timeout to draw again
    self.lastExecuted = timestamp;

    // Continue loop
    return requestAnimationFrame( self.loop.bind( self ) );
  };

  // Sprite loaded
  Favicon.prototype.onSpriteLoaded = function() {
    var self = this;

    // Draw the first frame when the image loads
    self.sprite.drawFrame( self.currentFrame );

    // Swap <link>
    self.setFavicon();

    // Start loop
    requestAnimationFrame( self.loop.bind( self ) );
  };


  var Sprite = function( context, img, size ) {
    var self = this;
    self.ctx = context;
    self.img = img;
    self.width = size;
    self.height = size;
    self.frameWidth = size;
    self.frameHeight = size;
  };

  // Assuming horizontal sprite
  Sprite.prototype.getFrame = function( frame ) {
    return {
      x: frame * this.frameWidth,
      y: 0
    };
  };

  Sprite.prototype.clearCanvas = function() {
    this.ctx.clearRect( 0, 0, this.width, this.height );
  };

  Sprite.prototype.drawFrame = function( frameNumber ) {
    var self = this;

    var frame = self.getFrame( frameNumber );

    // Clear out the last frame
    self.clearCanvas();

    // Draw to the context. This method is really confusing...
    self.ctx.drawImage(
      self.img,
      frame.x,
      frame.y,
      self.width,
      self.height,
      0,
      0,
      self.width,
      self.height
    );
  };

  return Favicon;
}( document ));


$(document).ready(function() {
  'use strict';

  Modules.Nav.init();
  Modules.Polyfill.init();

  // Only animate the favicon on the homepage so that
  // timeline tests aren't filled with junk
  if ( window.location.pathname === '/Shuffle/' ) {
    var src = site_url + '/img/favicon-sprite.png';
    new Modules.Favicon( src, 21, 7, 3000 * 1 );
  }
});
