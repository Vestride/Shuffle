/**
 * @author Glen Cheney
 * Debounce plugin is included in shuffle
 */

var Support = (function() {
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

  return self;
}());


var Polyfill = (function( $, Support ) {
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
}( jQuery, Support ));


var NAV = (function( $ ) {
  'use strict';

  function NavTray( element ) {
    this.$el = $( element );
    this.init();
  }

  NavTray.prototype.init = function() {
    this
      .setVars()
      .listen();

    setTimeout( $.proxy( this.saveHeight, this ), 0);
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

    self.saveHeight();
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


$(document).ready(function() {
  NAV.init();
  Polyfill.init();
});