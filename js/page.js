/**
 * @author Glen Cheney
 * Debounce plugin is included in shuffle
 */

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
    this.init();
  }

  NavTray.prototype.init = function() {
    this
      .setVars()
      .listen();

    // Google web font loading affects this.
    // I could use their loader, but don't really want their js too
    // I've changed the fallback font to Verdana, sans-serif to better
    // represent Ubuntu's wideness.
    // Also this isn't needed on load and could be done on window load
    setTimeout( $.proxy( this.saveHeight, this ), 100 );
  };

  NavTray.prototype.setVars = function() {
    var self = this;

    self.isOpen = false;
    self.$window = $( window );
    self.$trigger = self.$el.find('.js-nav-toggle');
    self.$tray = self.$el.find('.js-tray');

    self.$trigger.data( 'openLabel', self.$trigger.text() );

    return self;
  };

  NavTray.prototype.saveHeight = function() {
    var self = this,
        height = self.$tray.children().first().outerHeight();

    self.collapseHeight = height;

    return height;
  };

  NavTray.prototype.listen = function() {
    var self = this;

    self.$trigger.on( 'click', $.proxy( self.toggle, self ) );
    self.$window.on( 'resize', $.debounce( 250, $.proxy( self.onResize, self ) ) );

    return self;
  };

  NavTray.prototype.onResize = function() {
    var self = this;

    self.$tray.css( 'height', '' );
    self.saveHeight();

    if ( self.isOpen ) {
      self.$tray.css( 'height', self.collapseHeight );
    }
  };

  NavTray.prototype.toggle = function() {
    var self  = this;

    self.toggleBtnText();

    if ( self.isOpen ) {
      self.close();
    } else {
      self.open();
    }

    return self;
  };

  NavTray.prototype.open = function() {
    var self = this;

    self.$el.removeClass('collapsed');
    self.$tray.css( 'height', self.collapseHeight );

    self.isOpen = true;
  };

  NavTray.prototype.close = function() {
    var self = this;

    self.$el.addClass('collapsed');
    self.$tray.css( 'height', '' );

    self.isOpen = false;
  };


  NavTray.prototype.toggleBtnText = function() {
    var self = this,
        key= self.isOpen ? 'openLabel' : 'closeLabel';

    self.$trigger.text( self.$trigger.data( key ) );

    return self;
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








