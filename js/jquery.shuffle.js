// IMPORTANT!
// If you're already using Modernizr, delete it from this file. If you don't know what Modernizr is, leave it :)

/* Modernizr 2.6.2 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-csstransforms-csstransforms3d-csstransitions-prefixed-teststyles-testprop-testallprops-prefixes-domprefixes
 */
;window.Modernizr=function(a,b,c){function y(a){i.cssText=a}function z(a,b){return y(l.join(a+";")+(b||""))}function A(a,b){return typeof a===b}function B(a,b){return!!~(""+a).indexOf(b)}function C(a,b){for(var d in a){var e=a[d];if(!B(e,"-")&&i[e]!==c)return b=="pfx"?e:!0}return!1}function D(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:A(f,"function")?f.bind(d||b):f}return!1}function E(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+n.join(d+" ")+d).split(" ");return A(b,"string")||A(b,"undefined")?C(e,b):(e=(a+" "+o.join(d+" ")+d).split(" "),D(e,b,c))}var d="2.6.2",e={},f=b.documentElement,g="modernizr",h=b.createElement(g),i=h.style,j,k={}.toString,l=" -webkit- -moz- -o- -ms- ".split(" "),m="Webkit Moz O ms",n=m.split(" "),o=m.toLowerCase().split(" "),p={},q={},r={},s=[],t=s.slice,u,v=function(a,c,d,e){var h,i,j,k,l=b.createElement("div"),m=b.body,n=m||b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:g+(d+1),l.appendChild(j);return h=["&#173;",'<style id="s',g,'">',a,"</style>"].join(""),l.id=g,(m?l:n).innerHTML+=h,n.appendChild(l),m||(n.style.background="",n.style.overflow="hidden",k=f.style.overflow,f.style.overflow="hidden",f.appendChild(n)),i=c(l,a),m?l.parentNode.removeChild(l):(n.parentNode.removeChild(n),f.style.overflow=k),!!i},w={}.hasOwnProperty,x;!A(w,"undefined")&&!A(w.call,"undefined")?x=function(a,b){return w.call(a,b)}:x=function(a,b){return b in a&&A(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=t.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(t.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(t.call(arguments)))};return e}),p.csstransforms=function(){return!!E("transform")},p.csstransforms3d=function(){var a=!!E("perspective");return a&&"webkitPerspective"in f.style&&v("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}",function(b,c){a=b.offsetLeft===9&&b.offsetHeight===3}),a},p.csstransitions=function(){return E("transition")};for(var F in p)x(p,F)&&(u=F.toLowerCase(),e[u]=p[F](),s.push((e[u]?"":"no-")+u));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)x(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof enableClasses!="undefined"&&enableClasses&&(f.className+=" "+(b?"":"no-")+a),e[a]=b}return e},y(""),h=j=null,e._version=d,e._prefixes=l,e._domPrefixes=o,e._cssomPrefixes=n,e.testProp=function(a){return C([a])},e.testAllProps=E,e.testStyles=v,e.prefixed=function(a,b,c){return b?E(a,b,c):E(a,"pfx")},e}(this,this.document);

/**
 * jQuery Shuffle Plugin
 * Uses CSS Transforms to filter down a grid of items (degrades to jQuery's animate).
 * Inspired by Isotope http://isotope.metafizzy.co/
 * Use it for whatever you want!
 * @author Glen Cheney (http://glencheney.com)
 * @version 1.6.1
 * @date 12/06/12
 */
;(function($, Modernizr, undefined) {
    'use strict';


    // You can return `undefined` from the `by` function to revert to DOM order
    $.fn.sorted = function(options) {
        var opts = $.extend({}, $.fn.sorted.defaults, options),
            arr = this.get(),
            revert = false;

        // Sort the elements by the opts.by function.
        // If we don't have opts.by, default to DOM order
        if (opts.by !== $.noop && opts.by !== null && opts.by !== undefined) {
            arr.sort(function(a, b) {

                // Exit early if we already know we want to revert
                if ( revert ) {
                    return 0;
                }

                var valA = opts.by($(a)),
                    valB = opts.by($(b));

                // If both values are undefined, use the DOM order
                if ( valA === undefined && valB === undefined ) {
                    revert = true;
                    return 0;
                }

                return (valA < valB) ? -1 :
                    (valA > valB) ? 1 : 0;
            });
        }

        // Revert to the original array if necessary
        if ( revert ) {
            return this.get();
        }

        if ( opts.reverse ) {
            arr.reverse();
        }

        return arr;

    };

    $.fn.sorted.defaults = {
        reverse: false,
        by: null
    };

    var Shuffle = function( $container, options ) {
        var self = this,
            $window = $(window);

        $.extend(self, $.fn.shuffle.options, options, $.fn.shuffle.settings);

        self.$container = $container.addClass('shuffle');
        self.$items = self._getItems().addClass('shuffle-item');
        self.transitionName = self.prefixed('transition'),
        self.transform = self.getPrefixed('transform');

        self.fire('loading');

        // Get offset from container
        self.offset = {
            left: parseInt( ( self.$container.css('padding-left') || 0 ), 10 ),
            top: parseInt( ( self.$container.css('padding-top') || 0 ), 10 )
        };
        self.isFluid = self.columnWidth && typeof self.columnWidth === 'function';

        // Get transitionend event name
        var transEndEventNames = {
            'WebkitTransition' : 'webkitTransitionEnd',
            'MozTransition'    : 'transitionend',
            'OTransition'      : 'oTransitionEnd',
            'msTransition'     : 'MSTransitionEnd',
            'transition'       : 'transitionend'
        };
        self.transitionEndName = transEndEventNames[ self.transitionName ];

        // CSS for each item
        self.itemCss = {
            position: 'absolute',
            top: 0,
            left: 0
        };

        // Set up css for transitions
        self.$container.css('position', 'relative')[0].style[ self.transitionName ] = 'height ' + self.speed + 'ms ' + self.easing;
        self._initItems( !self.showInitialTransition );
        
        // http://stackoverflow.com/questions/1852751/window-resize-event-firing-in-internet-explorer
        self.windowHeight = $window.height();
        self.windowWidth = $window.width();
        $window.on('resize.shuffle', function () {
            var height = $window.height(),
                width = $window.width();

            if (width !== self.windowWidth || height !== self.windowHeight) {
                self.resized();
                self.windowHeight = height;
                self.windowWidth = width;
            }
        });

        self._setColumns();
        self._resetCols();
        self.shuffle( self.group );


        if ( !self.showInitialTransition ) {
            self._initItems();
        }
        self.fire('done');
    };

    Shuffle.prototype = {

        constructor: Shuffle,

        /**
         * The magic. This is what makes the plugin 'shuffle'
         */
        shuffle : function( category ) {
            var self = this;

            if (!category) {
                category = 'all';
            }

            self.filter( category );
            // Save the last filter in case elements are appended.
            self.lastFilter = category;
            
            // How many filtered elements?
            self.visibleItems = self.$items.filter('.filtered').length;

            self._resetCols();

            // Shrink each concealed item
            self.shrink();

            // Update transforms on .filtered elements so they will animate to their new positions
            self._reLayout();
        },

        filter : function( category, $collection ) {
            var self = this,
                isPartialSet = $collection !== undefined,
                $items = isPartialSet ? $collection : self.$items,
                $filtered = $();

            category = category || self.lastFilter;

            self.fire('filter');

            // Default is to show all items
            $items.removeClass('concealed filtered');

            // Loop through each item and use provided function to determine
            // whether to hide it or not.
            if ($.isFunction(category)) {
                $items.each(function() {
                    var $item = $(this),
                    passes = category.call($item[0], $item, self);
                    $item.addClass(passes ? 'filtered' : 'concealed');

                    if ( passes ) {
                        $filtered = $filtered.add($item);
                    }
                });
            }

            // Otherwise we've been passed a category to filter by
            else {
                self.group = category;
                if (category !== 'all') {
                    $items.each(function() {
                        var $this = $(this),
                        groups = $this.data('groups'),
                        keys = self.delimeter && !$.isArray( groups ) ? groups.split( self.delimeter ) : groups,
                        passes = $.inArray(category, keys) > -1,
                        theClass = passes ? 'concealed' : 'filtered';

                        $this.addClass( theClass );

                        if ( passes ) {
                            $filtered = $filtered.add($this);
                        }
                    });
                }

                // category === 'all', add filtered class to everything
                else {
                    $filtered = $items.addClass('filtered');
                }
            }

            return $filtered;
        },

        _initItems : function( withoutTransition ) {
            var self = this;

            self.$items.each(function() {
                $(this).css(self.itemCss);
                
                // Set CSS transition for transforms and opacity
                if ( self.supported && !withoutTransition ) {
                    self._setTransition(this);
                }
            });
        },

        _setTransition : function( element ) {
            var self = this;
            element.style[self.transitionName] = self.transform + ' ' + self.speed + 'ms ' + self.easing + ', opacity ' + self.speed + 'ms ' + self.easing;
        },

        _setSequentialDelay : function( $collection ) {
            var self = this;

            if ( !self.supported ) {
                return;
            }

            $collection.each(function(i) {
                this.style[self.transitionName + 'Delay'] = ((i + 1) * 150) + 'ms';

                // Set the delay back to zero after one transition
                $(this).one($.support.transition.end, function() {
                    this.style[self.transitionName + 'Delay'] = '0ms';
                });
            });
        },

        _getItems : function() {
            return this.$container.children( this.itemSelector );
        },

        // calculates number of columns
        // i.e. this.colWidth = 200
        _setColumns : function() {
            var self = this,
                containerWidth = self.$container.width(),
                gutter = typeof self.gutterWidth === 'function' ? self.gutterWidth( containerWidth ) : self.gutterWidth;

            // use fluid columnWidth function if there
            self.colWidth = self.isFluid ? self.columnWidth( containerWidth ) :
                // if not, how about the explicitly set option?
                self.columnWidth ||
                // or use the size of the first item
                self.$items.outerWidth(true) ||
                // if there's no items, use size of container
                containerWidth;

            self.colWidth += gutter;

            // Was flooring 4.999999999999999 to 4 :(
            self.cols = Math.floor( ( containerWidth + gutter + 0.000000000001 ) / self.colWidth );
            self.cols = Math.max( self.cols, 1 );

            // This can happen when .shuffle is called on something hidden (e.g. display:none for tabs)
            if ( !self.colWidth || isNaN( self.cols ) || !containerWidth ) {
                self.needsUpdate = true;
            } else {
                self.needsUpdate = false;
            }
        },
        
        /**
         * Adjust the height of the grid
         */
        setContainerSize : function() {
            var self = this,
            gridHeight = Math.max.apply( Math, self.colYs );
            self.$container.css( 'height', gridHeight + 'px' );
        },

        /**
         * Fire events with .shuffle namespace
         */
        fire : function( name ) {
            this.$container.trigger(name + '.shuffle', [this]);
        },


        /**
         * Loops through each item that should be shown
         * Calculates the x and y position and then transitions it
         * @param {array} items - array of items that will be shown/layed out in order in their array.
         *     Because jQuery collection are always ordered in DOM order, we can't pass a jq collection
         * @param {function} complete callback function
         * @param {boolean} onlyPosition set this to true to only trigger positioning of the items
         */
        layout: function( items, fn, onlyPosition ) {
            var self = this;

            fn = fn || self.filterEnd;
            
            self.layoutTransitionEnded = false;
            $.each(items, function(index) {
                var $this = $(items[index]),
                //how many columns does this brick span
                colSpan = Math.ceil( $this.outerWidth(true) / self.colWidth );
                colSpan = Math.min( colSpan, self.cols );

                if ( colSpan === 1 ) {
                    // if brick spans only one column, just like singleMode
                    self._placeItem( $this, self.colYs, fn );
                } else {
                    // brick spans more than one column
                    // how many different places could this brick fit horizontally
                    var groupCount = self.cols + 1 - colSpan,
                        groupY = [],
                        groupColY,
                        i;

                    // for each group potential horizontal position
                    for ( i = 0; i < groupCount; i++ ) {
                        // make an array of colY values for that one group
                        groupColY = self.colYs.slice( i, i + colSpan );
                        // and get the max value of the array
                        groupY[i] = Math.max.apply( Math, groupColY );
                    }

                    self._placeItem( $this, groupY, fn, onlyPosition );
                }
            });

            // Adjust the height of the container
            self.setContainerSize();
        },

        _resetCols : function() {
            // reset columns
            var i = this.cols;
            this.colYs = [];
            while (i--) {
                this.colYs.push( 0 );
            }
        },

        _reLayout : function( callback ) {
            var self = this;
            callback = callback || self.filterEnd;
            self._resetCols();

            // If we've already sorted the elements, keep them sorted
            if ( self.keepSorted && self.lastSort ) {
                self.sort( self.lastSort, true );
            } else {
                self.layout( self.$items.filter('.filtered').get(), self.filterEnd );
            }
        },

        // worker method that places brick in the columnSet with the the minY
        _placeItem : function( $item, setY, callback, onlyPosition ) {
            // get the minimum Y value from the columns
            var self = this,
                minimumY = Math.min.apply( Math, setY ),
                shortCol = 0;

            // Find index of short column, the first from the left where this item will go
            for (var i = 0, len = setY.length; i < len; i++) {
                if ( setY[i] === minimumY ) {
                    shortCol = i;
                    break;
                }
            }

            // Position the item
            var x = self.colWidth * shortCol,
            y = minimumY;
            x = Math.round( x + self.offset.left );
            y = Math.round( y + self.offset.top );

            // Save data for shrink
            $item.data( {x: x, y: y} );

            // Apply setHeight to necessary columns
            var setHeight = minimumY + $item.outerHeight(true),
            setSpan = self.cols + 1 - len;
            for ( i = 0; i < setSpan; i++ ) {
                self.colYs[ shortCol + i ] = setHeight;
            }

            if ( onlyPosition ) {
                self._skipTransition($item[0], function() {
                    self.transition({
                        from: 'layout',
                        $this: $item,
                        x: x,
                        y: y,
                        // scale : 1,
                        opacity: 0
                    });
                });
            } else {
                self.transition({
                    from: 'layout',
                    $this: $item,
                    x: x,
                    y: y,
                    scale : 1,
                    opacity: 1,
                    callback: callback
                });
            }

        },
        
        /**
         * Hides the elements that don't match our filter
         */
        shrink : function() {
            var self = this,
                $concealed = self.$items.filter('.concealed');

            // Abort if no items
            if ($concealed.length === 0) {
                return;
            }

            self.fire('shrink');

            self.shrinkTransitionEnded = false;
            $concealed.each(function() {
                var $this = $(this),
                    data = $this.data(),
                    x = parseInt( data.x, 10 ),
                    y = parseInt( data.y, 10 );

                if (!x) x = 0;
                if (!y) y = 0;

                self.transition({
                    from: 'shrink',
                    $this: $this,
                    x: x,
                    y: y,
                    scale : 0.001,
                    opacity: 0,
                    callback: self.shrinkEnd
                });
            });
        },

        /**
         * Gets the .filtered elements, sorts them, and passes them to layout
         *
         * @param {object} opts the options object for the sorted plugin
         * @param {bool} [fromFilter] was called from Shuffle.filter method.
         */
        sort: function(opts, fromFilter) {
            var self = this,
                items = self.$items.filter('.filtered').sorted(opts);
            self._resetCols();
            self.layout(items, function() {
                if (fromFilter) {
                    self.filterEnd();
                }
                self.sortEnd();
            });
            self.lastSort = opts;
        },
        
        /**
         * Uses Modernizr's prefixed() to get the correct vendor property name and sets it using jQuery .css()
         *
         * @param {jq} $el the jquery object to set the css on
         * @param {string} prop the property to set (e.g. 'transition')
         * @param {string} value the value of the prop
         */
        setPrefixedCss : function($el, prop, value) {
            $el.css(this.prefixed(prop), value);
        },


        /**
         * Returns things like webkitTransition or boxSizing
         *
         * @param {string} property to be prefixed.
         * @return {string} the prefixed css property
         */
        getPrefixed : function(prop) {
            var styleName = this.prefixed(prop);
            return styleName ? styleName.replace(/([A-Z])/g, function(str,m1){ return '-' + m1.toLowerCase(); }).replace(/^ms-/,'-ms-') : styleName;
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
         * @param {function} opts.callback complete function for the animation
         */
        transition: function(opts) {
            var self = this,
            transform,
            // Only fire callback once per collection's transition
            complete = function() {
                if (!self.layoutTransitionEnded && opts.from === 'layout') {
                    opts.callback.call(self);
                    self.layoutTransitionEnded = true;
                } else if (!self.shrinkTransitionEnded && opts.from === 'shrink') {
                    opts.callback.call(self);
                    self.shrinkTransitionEnded = true;
                }
            };

            opts.callback = opts.callback || $.noop;

            // Use CSS Transforms if we have them
            if (self.supported) {

                // Make scale one if it's not preset
                if ( opts.scale === undefined ) {
                    opts.scale = 1;
                }

                if (self.threeD) {
                    transform = 'translate3d(' + opts.x + 'px, ' + opts.y + 'px, 0) scale3d(' + opts.scale + ', ' + opts.scale + ', 1)';
                } else {
                    transform = 'translate(' + opts.x + 'px, ' + opts.y + 'px) scale(' + opts.scale + ', ' + opts.scale + ')';
                }

                // Update css to trigger CSS Animation
                opts.$this.css('opacity' , opts.opacity);

                if ( opts.x !== undefined ) {
                    self.setPrefixedCss(opts.$this, 'transform', transform);
                }

                opts.$this.one(self.transitionEndName, complete);
            } else {
                // Use jQuery to animate left/top
                opts.$this.stop().animate({
                    left: opts.x,
                    top: opts.y,
                    opacity: opts.opacity
                }, self.speed, 'swing', complete);
            }
        },

        /**
         * Relayout everthing
         */
        resized: function() {
            // get updated colCount
            this._setColumns();
            this._reLayout();
        },

        shrinkEnd: function() {
            this.fire('shrunk');
        },

        filterEnd: function() {
            this.fire('filtered');
        },

        sortEnd: function() {
            this.fire('sorted');
        },

        destroy: function() {
            var self = this;

            self.$container.removeAttr('style').removeData('shuffle');
            $(window).off('.shuffle');
            self.$items.removeAttr('style').removeClass('concealed filtered shuffle-item');
        },

        _skipTransition : function(element, property, value) {
            var self = this,
                reflow,
                durationName = self.getPrefixed('transitionDuration'),
                duration = element.style[ durationName ];

            // Set the duration to zero so it happens immediately
            element.style[ durationName ] = '0ms'; // ms needed for firefox!

            if ( $.isFunction( property ) ) {
                property();
            } else {
                element.style[ property ] = value;
            }

            reflow = element.offsetWidth; // Force reflow

            // Put the duration back
            element.style[ durationName ] = duration;
        },

        appended : function( $newItems, animateIn, isSequential ) {
            // True if undefined
            animateIn = animateIn === false ? false : true;
            isSequential = isSequential === false ? false : true;

            this._addItems( $newItems, animateIn, isSequential );
        },

        _addItems : function( $newItems, animateIn, isSequential ) {
            var self = this,
                $passed;

            $newItems.addClass('shuffle-item');
            self.$items = self._getItems();
            self._initItems();
            $newItems.not($passed).css('opacity', 0);

            $passed = self.filter( undefined, $newItems );

            // How many filtered elements?
            self.visibleItems = self.$items.filter('.filtered').length;

            if ( animateIn ) {
                self.layout( $passed, null, true );

                if ( isSequential ) {
                    self._setSequentialDelay( $passed );
                }

                self._revealAppended( $passed );
            } else {
                self.layout( $passed );
            }
        },

        _revealAppended : function( $newFilteredItems ) {
            var self = this;

            setTimeout(function() {
                $newFilteredItems.each(function(i, el) {
                    self.transition({
                        from: 'reveal',
                        $this: $(el),
                        opacity: 1
                    });
                });
            }, 100);
        },

        update: function() {
            this.resized();
        }

    };

            
    // Plugin definition
    $.fn.shuffle = function(opts, sortObj) {
        var args = Array.prototype.slice.call( arguments, 1 );
        return this.each(function() {
            var $this = $(this),
                shuffle = $this.data('shuffle');

            // If we don't have a stored shuffle, make a new one and save it
            if (!shuffle) {
                shuffle = new Shuffle($this, opts);
                $this.data('shuffle', shuffle);
            }

            // If passed a string, lets decide what to do with it. Or they've provided a function to filter by
            if ($.isFunction(opts)) {
                shuffle.shuffle(opts);
                
            // Key should be an object with propreties reversed and by.
            } else if (typeof opts === 'string') {
                if (opts === 'sort') {
                    shuffle.sort(sortObj);
                } else if (opts === 'destroy') {
                    shuffle.destroy.apply( shuffle, args );
                } else if (opts === 'update') {
                    shuffle.update.apply( shuffle, args );
                } else if (opts === 'appended') {
                    shuffle.appended.apply( shuffle, args );
                } else if (opts === 'layout') {
                    shuffle._reLayout.apply( shuffle, args );
                } else {
                    shuffle.shuffle(opts);
                }
            }
        });
    };

    // Overrideable options
    $.fn.shuffle.options = {
        group : 'all', // Filter group
        speed : 600, // Transition/animation speed (milliseconds)
        easing : 'ease-out', // css easing function to use
        itemSelector: '', // e.g. '.gallery-item'
        gutterWidth : 0, // a static number or function that tells the plugin how wide the gutters between columns are (in pixels)
        columnWidth : 0,// a static number or function that returns a number which tells the plugin how wide the columns are (in pixels)
        showInitialTransition : true, // If set to false, the shuffle-items will only have a transition applied to them after the first layout
        delimeter : null, // if your group is not json, and is comma delimeted, you could set delimeter to ','
        keepSorted : true
    };

    // Not overrideable
    $.fn.shuffle.settings = {
        supported: Modernizr.csstransforms && Modernizr.csstransitions, // supports transitions and transforms
        prefixed: Modernizr.prefixed,
        threeD: Modernizr.csstransforms3d // supports 3d transforms
    };

})(jQuery, Modernizr);