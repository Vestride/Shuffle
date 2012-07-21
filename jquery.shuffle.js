// IMPORTANT!
// If you're already using Modernizr, delete it from this file. If you don't know what Modernizr is, leave it :)

/* Modernizr 2.6.1 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-csstransforms-csstransforms3d-csstransitions-prefixed-teststyles-testprop-testallprops-prefixes-domprefixes
 */
;window.Modernizr=function(a,b,c){function y(a){i.cssText=a}function z(a,b){return y(l.join(a+";")+(b||""))}function A(a,b){return typeof a===b}function B(a,b){return!!~(""+a).indexOf(b)}function C(a,b){for(var d in a){var e=a[d];if(!B(e,"-")&&i[e]!==c)return b=="pfx"?e:!0}return!1}function D(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:A(f,"function")?f.bind(d||b):f}return!1}function E(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+n.join(d+" ")+d).split(" ");return A(b,"string")||A(b,"undefined")?C(e,b):(e=(a+" "+o.join(d+" ")+d).split(" "),D(e,b,c))}var d="2.6.1",e={},f=b.documentElement,g="modernizr",h=b.createElement(g),i=h.style,j,k={}.toString,l=" -webkit- -moz- -o- -ms- ".split(" "),m="Webkit Moz O ms",n=m.split(" "),o=m.toLowerCase().split(" "),p={},q={},r={},s=[],t=s.slice,u,v=function(a,c,d,e){var h,i,j,k=b.createElement("div"),l=b.body,m=l?l:b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:g+(d+1),k.appendChild(j);return h=["&#173;",'<style id="s',g,'">',a,"</style>"].join(""),k.id=g,(l?k:m).innerHTML+=h,m.appendChild(k),l||(m.style.background="",f.appendChild(m)),i=c(k,a),l?k.parentNode.removeChild(k):m.parentNode.removeChild(m),!!i},w={}.hasOwnProperty,x;!A(w,"undefined")&&!A(w.call,"undefined")?x=function(a,b){return w.call(a,b)}:x=function(a,b){return b in a&&A(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=t.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(t.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(t.call(arguments)))};return e}),p.csstransforms=function(){return!!E("transform")},p.csstransforms3d=function(){var a=!!E("perspective");return a&&"webkitPerspective"in f.style&&v("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}",function(b,c){a=b.offsetLeft===9&&b.offsetHeight===3}),a},p.csstransitions=function(){return E("transition")};for(var F in p)x(p,F)&&(u=F.toLowerCase(),e[u]=p[F](),s.push((e[u]?"":"no-")+u));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)x(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,enableClasses&&(f.className+=" "+(b?"":"no-")+a),e[a]=b}return e},y(""),h=j=null,e._version=d,e._prefixes=l,e._domPrefixes=o,e._cssomPrefixes=n,e.testProp=function(a){return C([a])},e.testAllProps=E,e.testStyles=v,e.prefixed=function(a,b,c){return b?E(a,b,c):E(a,"pfx")},e}(this,this.document);

/**
 * jQuery Shuffle Plugin
 * Uses CSS Transforms to filter down a grid of items (degrades to jQuery's animate).
 * Inspired by Isotope http://isotope.metafizzy.co/
 * Use it for whatever you want!
 * @author Glen Cheney (http://glencheney.com)
 * @version 1.4
 * @date 7/21/12
 */
;(function($, Modernizr) {
    "use strict";

    var Shuffle = function($container, options) {
        var self = this,
            $this = $(this);

        $.extend(self, {
            itemWidth : 230,
            marginTop : 20,
            marginRight: 20,
            key : 'all',
            speed : 800,
            easing : 'ease-out'
        }, options, {
            $container: $container,
            supported: Modernizr.csstransforms && Modernizr.csstransitions
        });

        // CSS for each item
        self.itemCss = {
            position: 'absolute',
            opacity: 1, // Everything after this is for jQuery fallback
            top: 0,
            left: 0,
            marginTop: self.marginTop,
            marginRight: self.marginRight,
            'float': 'left'
        };
        
        self.$items = self.$container.children();
        self.itemsPerRow = Math.floor(self.$container.width() / self.itemWidth);
        self.itemHeight = self.$items.first().outerHeight();
        self.transitionName = self.prefixed('transition'),
        self.transform = self.getPrefixed('transform');

        // Set up css for transitions
        self.$container.css('position', 'relative').get(0).style[self.transitionName] = 'height ' + self.speed + 'ms ' + self.easing;
        self.$items.each(function(index) {
            var defaults = self.itemCss;
            
            // Set CSS transition for transforms and opacity
            if (self.supported) {
                this.style[self.transitionName] = self.transform + ' ' + self.speed + 'ms ' + self.easing + ', opacity ' + self.speed + 'ms ' + self.easing;
            }
            
            // Set the margin-right to zero for the last item in the row
            if ((index + 1) % self.itemsPerRow === 0) {
                defaults.marginRight = 0;
            }

            $(this).css(self.itemCss);
        });
        
        // Do it
        self.shuffle('all');
    };

    Shuffle.prototype = {

        constructor: Shuffle,

        /**
         * The magic. This is what makes the plugin 'shuffle'
         */
        shuffle : function(category) {
            var self = this,
                numElements,
                gridHeight;

            if (!category) category = 'all';

            // Hide/show appropriate items
            if (category === 'all') {
                self.$items.removeClass('concealed');
            } else {
                self.$items.removeClass('concealed filtered').each(function() {
                    var keys = $(this).attr('data-key'),
                        kArray = $.parseJSON(keys);
                    if ($.inArray(category, kArray) === -1) {
                        $(this).addClass('concealed');
                        return;
                    }
                });
            }
            
            // How many filtered elements?
            numElements = self.$items.not('.concealed').addClass('filtered').length;

            // Shrink each concealed item
            self.$container.trigger('shrink.shuffle', self);
            self.shrink();
            setTimeout(function() {
                self.$container.trigger('shrunk.shuffle', self);
            }, self.speed);

            // Update transforms on .filtered elements so they will animate to their new positions
            self.$container.trigger('filter.shuffle', self);
            self.filter();
            setTimeout(function() {
                self.$container.trigger('filtered.shuffle', self);
            }, self.speed);

            // Adjust the height of the grid
            gridHeight = (Math.ceil(numElements / self.itemsPerRow) * (self.itemHeight + self.marginTop)) - self.marginTop;
            self.$container.css('height', gridHeight + 'px');
        },
        
        
        /**
         * Hides the elements that don't match our filter
         */
        shrink : function() {
            var self = this,
                $concealed = self.$container.find('.concealed');
            if ($concealed.length === 0) {
                return;
            }
            $concealed.each(function() {
                var $this = $(this),
                    x = parseInt($this.attr('data-x'), 10),
                    y = parseInt($this.attr('data-y'), 10);

                if (!x) x = 0;
                if (!y) y = 0;

                self.transition({
                    $this: $this,
                    x: x,
                    y: y,
                    left: (x + (self.itemWidth / 2)) + 'px',
                    top: (y + (self.itemHeight / 2)) + 'px',
                    scale : 0.001,
                    opacity: 0,
                    height: '0px',
                    width: '0px'
                });
            });
        },


        /**
         * Loops through each item that should be shown
         * Calculates the x and y position and then tranitions it
         */
        filter : function() {
            var self = this,
                y = 0,
                $filtered = self.$container.find('.filtered');
            
            $filtered.each(function(index) {
                var $this = $(this),
                    x = (index % self.itemsPerRow) * (self.itemWidth + self.marginRight),
                    row = Math.floor(index / self.itemsPerRow);

                if (index % self.itemsPerRow === 0) {
                    y = row * (self.itemHeight + self.marginTop);
                }

                // Save data for shrink
                $this.attr({'data-x' : x, 'data-y' : y});

                self.transition({
                    $this: $this,
                    x: x,
                    y: y,
                    left: x + 'px',
                    top: y + 'px',
                    scale : 1,
                    opacity: 1,
                    height: self.itemHeight + 'px',
                    width: self.itemWidth + 'px'
                });
            });
        },
        
        /**
         * Uses Modernizr's prefixed() to get the correct vendor property name and sets it using jQuery .css()
         * @param {jq} $el the jquery object to set the css on
         * @param {string} prop the property to set (e.g. 'transition')
         * @param {string} value the value of the prop
         */
        setPrefixedCss : function($el, prop, value) {
            $el.css(Modernizr.prefixed(prop), value);
        },

        prefixed : function(prop) {
            return Modernizr.prefixed(prop);
        },

        /**
         * Returns things like -webkit-transition or -moz-box-sizing
         * @param {string} property to be prefixed.
         * @return {string} the prefixed css property
         */
        getPrefixed : function(prop) {
            return Modernizr.prefixed(prop).replace(/([A-Z])/g, function(str,m1){ return '-' + m1.toLowerCase(); }).replace(/^ms-/,'-ms-');
        },
        
        /**
         * Transitions an item in the grid
         *
         * @param {object}  opts options
         * @param {jQuery}  opts.$this jQuery object representing the current item
         * @param {int}     opts.x translate's x
         * @param {int}     opts.y translate's y
         * @param {String}  opts.left left position (used when no transforms available)
         * @param {String}  opts.top top position (used when no transforms available)
         * @param {float}   opts.scale amount to scale the item
         * @param {float}   opts.opacity opacity of the item
         * @param {String}  opts.height the height of the item (used when no transforms available)
         * @param {String}  opts.width the width of the item (used when no transforms available)
         */
        transition: function(opts) {
            var self = this,
                transform;
            // Use CSS Transforms if we have them
            if (self.supported) {
                if (Modernizr.csstransforms3d) {
                    transform = 'translate3d(' + opts.x + 'px, ' + opts.y + 'px, 0px) scale3d(' + opts.scale + ', ' + opts.scale + ', ' + opts.scale + ')';
                } else {
                    transform = 'translate(' + opts.x + 'px, ' + opts.y + 'px) scale(' + opts.scale + ', ' + opts.scale + ')';
                }

                // Update css to trigger CSS Animation
                opts.$this.css('opacity' , opts.opacity);
                self.setPrefixedCss(opts.$this, 'transform', transform);
            } else {
                // Use jQuery to animate left/top
                opts.$this.animate({
                    left: opts.left,
                    top: opts.top,
                    opacity: opts.opacity,
                    height: opts.height,
                    width: opts.width
                }, self.speed);
            }
        }
    };
            
    // Plugin definition
    $.fn.shuffle = function(opts, key) {
        return this.each(function() {
            var $this = $(this),
                shuffle = $this.data('shuffle');

            if (!shuffle) {
                shuffle = new Shuffle($this, opts);
                $this.data('shuffle', shuffle);
            }

            // Execute a function
            if (typeof opts === 'string') {
                if (opts !== 'shuffle') {
                    key = opts;
                }
                shuffle.shuffle(key);
            }
        });
    };
})(jQuery, Modernizr);