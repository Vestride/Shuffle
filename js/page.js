/**
 * @author Glen Cheney
 * Debounce plugin is included in shuffle
 */

var Modules = {};

Modules.Support = (function() {
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

    // This is a case for selectors level 4!
    self.$el.find('.js-demos').on('mouseenter', '.js-demo', function( evt ) {
      $( evt.currentTarget ).addClass('hovered');
    });

    self.$el.find('.js-demos').on('mouseleave', '.js-demo', function( evt ) {
      $( evt.currentTarget ).removeClass('hovered');
    });

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



// Analytics
var _gaq = [ ['_setAccount', 'UA-39355642-1'], ['_trackPageview'] ];

(function(doc, script) {
  'use strict';

  var js,
      fjs = doc.scripts[0],
      frag = doc.createDocumentFragment(),
      add = function(url, id) {
          if (doc.getElementById(id)) {return;}
          js = doc.createElement(script);
          js.src = url;
          if ( id ) { js.id = id; }
          frag.appendChild( js );
      };

    // Twitter SDK
    // add('//platform.twitter.com/widgets.js', 'twitter-wjs');

    // Load GA over http, we know it won't be over ssl
    add('//www.google-analytics.com/ga.js');

    fjs.parentNode.insertBefore(frag, fjs);

}(document, 'script'));


$(document).ready(function() {
  'use strict';

  Modules.Nav.init();
  Modules.Polyfill.init();
});