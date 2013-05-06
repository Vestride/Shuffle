// IMPORTANT!
// If you're already using Modernizr, delete it from this file. If you don't know what Modernizr is, leave it :)

/* Modernizr 2.6.2 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-csstransforms-csstransforms3d-csstransitions-shiv-cssclasses-prefixed-teststyles-testprop-testallprops-prefixes-domprefixes-load
 */
;window.Modernizr=function(a,b,c){function z(a){j.cssText=a}function A(a,b){return z(m.join(a+";")+(b||""))}function B(a,b){return typeof a===b}function C(a,b){return!!~(""+a).indexOf(b)}function D(a,b){for(var d in a){var e=a[d];if(!C(e,"-")&&j[e]!==c)return b=="pfx"?e:!0}return!1}function E(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:B(f,"function")?f.bind(d||b):f}return!1}function F(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+o.join(d+" ")+d).split(" ");return B(b,"string")||B(b,"undefined")?D(e,b):(e=(a+" "+p.join(d+" ")+d).split(" "),E(e,b,c))}var d="2.6.2",e={},f=!0,g=b.documentElement,h="modernizr",i=b.createElement(h),j=i.style,k,l={}.toString,m=" -webkit- -moz- -o- -ms- ".split(" "),n="Webkit Moz O ms",o=n.split(" "),p=n.toLowerCase().split(" "),q={},r={},s={},t=[],u=t.slice,v,w=function(a,c,d,e){var f,i,j,k,l=b.createElement("div"),m=b.body,n=m||b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:h+(d+1),l.appendChild(j);return f=["&#173;",'<style id="s',h,'">',a,"</style>"].join(""),l.id=h,(m?l:n).innerHTML+=f,n.appendChild(l),m||(n.style.background="",n.style.overflow="hidden",k=g.style.overflow,g.style.overflow="hidden",g.appendChild(n)),i=c(l,a),m?l.parentNode.removeChild(l):(n.parentNode.removeChild(n),g.style.overflow=k),!!i},x={}.hasOwnProperty,y;!B(x,"undefined")&&!B(x.call,"undefined")?y=function(a,b){return x.call(a,b)}:y=function(a,b){return b in a&&B(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=u.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(u.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(u.call(arguments)))};return e}),q.csstransforms=function(){return!!F("transform")},q.csstransforms3d=function(){var a=!!F("perspective");return a&&"webkitPerspective"in g.style&&w("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}",function(b,c){a=b.offsetLeft===9&&b.offsetHeight===3}),a},q.csstransitions=function(){return F("transition")};for(var G in q)y(q,G)&&(v=G.toLowerCase(),e[v]=q[G](),t.push((e[v]?"":"no-")+v));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)y(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof f!="undefined"&&f&&(g.className+=" "+(b?"":"no-")+a),e[a]=b}return e},z(""),i=k=null,function(a,b){function k(a,b){var c=a.createElement("p"),d=a.getElementsByTagName("head")[0]||a.documentElement;return c.innerHTML="x<style>"+b+"</style>",d.insertBefore(c.lastChild,d.firstChild)}function l(){var a=r.elements;return typeof a=="string"?a.split(" "):a}function m(a){var b=i[a[g]];return b||(b={},h++,a[g]=h,i[h]=b),b}function n(a,c,f){c||(c=b);if(j)return c.createElement(a);f||(f=m(c));var g;return f.cache[a]?g=f.cache[a].cloneNode():e.test(a)?g=(f.cache[a]=f.createElem(a)).cloneNode():g=f.createElem(a),g.canHaveChildren&&!d.test(a)?f.frag.appendChild(g):g}function o(a,c){a||(a=b);if(j)return a.createDocumentFragment();c=c||m(a);var d=c.frag.cloneNode(),e=0,f=l(),g=f.length;for(;e<g;e++)d.createElement(f[e]);return d}function p(a,b){b.cache||(b.cache={},b.createElem=a.createElement,b.createFrag=a.createDocumentFragment,b.frag=b.createFrag()),a.createElement=function(c){return r.shivMethods?n(c,a,b):b.createElem(c)},a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+l().join().replace(/\w+/g,function(a){return b.createElem(a),b.frag.createElement(a),'c("'+a+'")'})+");return n}")(r,b.frag)}function q(a){a||(a=b);var c=m(a);return r.shivCSS&&!f&&!c.hasCSS&&(c.hasCSS=!!k(a,"article,aside,figcaption,figure,footer,header,hgroup,nav,section{display:block}mark{background:#FF0;color:#000}")),j||p(a,c),a}var c=a.html5||{},d=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,e=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,f,g="_html5shiv",h=0,i={},j;(function(){try{var a=b.createElement("a");a.innerHTML="<xyz></xyz>",f="hidden"in a,j=a.childNodes.length==1||function(){b.createElement("a");var a=b.createDocumentFragment();return typeof a.cloneNode=="undefined"||typeof a.createDocumentFragment=="undefined"||typeof a.createElement=="undefined"}()}catch(c){f=!0,j=!0}})();var r={elements:c.elements||"abbr article aside audio bdi canvas data datalist details figcaption figure footer header hgroup mark meter nav output progress section summary time video",shivCSS:c.shivCSS!==!1,supportsUnknownElements:j,shivMethods:c.shivMethods!==!1,type:"default",shivDocument:q,createElement:n,createDocumentFragment:o};a.html5=r,q(b)}(this,b),e._version=d,e._prefixes=m,e._domPrefixes=p,e._cssomPrefixes=o,e.testProp=function(a){return D([a])},e.testAllProps=F,e.testStyles=w,e.prefixed=function(a,b,c){return b?F(a,b,c):F(a,"pfx")},g.className=g.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(f?" js "+t.join(" "):""),e}(this,this.document),function(a,b,c){function d(a){return"[object Function]"==o.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){("c"==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&&(r=1,y[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),"img"!=a&&(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i("c"==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&"[object Opera]"==o.call(a.opera),l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return"[object Array]"==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),y[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(w(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}}(this,document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))};

/*!
 * jQuery Shuffle Plugin
 * Uses CSS Transforms to filter down a grid of items. Requires jQuery 1.9+.
 * Inspired by Isotope http://isotope.metafizzy.co/
 * Licensed under the MIT license.
 * @author Glen Cheney (http://glencheney.com)
 * @version 1.6.5
 * @date 05/05/13
 */
(function($, Modernizr, undefined) {
    'use strict';

    // You can return `undefined` from the `by` function to revert to DOM order
    // This plugin does NOT return a jQuery object. It returns a plain array because
    // jQuery sorts everything in DOM order.
    $.fn.sorted = function(options) {
        var opts = $.extend({}, $.fn.sorted.defaults, options),
            arr = this.get(),
            revert = false;

        if ( !arr.length ) {
            return [];
        }

        if ( opts.randomize ) {
            return $.fn.sorted.randomize( arr );
        }

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

                if ( valA === 'sortFirst' || valB === 'sortLast' ) {
                    return -1;
                }

                if ( valA === 'sortLast' || valB === 'sortFirst' ) {
                    return 1;
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
        reverse: false, // Use array.reverse() to reverse the results
        by: null, // Sorting function
        randomize: false // If true, this will skip the sorting and return a randomized order in the array
    };


    // http://stackoverflow.com/a/962890/373422
    $.fn.sorted.randomize = function( array ) {
        var top = array.length,
            tmp, current;

        if ( !top ) {
            return array;
        }

        while ( --top ) {
            current = Math.floor( Math.random() * (top + 1) );
            tmp = array[ current ];
            array[ current ] = array[ top ];
            array[ top ] = tmp;
        }

        return array;
    };



    var Shuffle = function( $container, options ) {
        var self = this;
        $.extend(self, $.fn.shuffle.options, options, $.fn.shuffle.settings);

        self.$container = $container.addClass('shuffle');
        self.$window = $(window);
        self.unique = 'shuffle_' + $.now();

        self.fire('loading');
        self._init();
        self.fire('done');
    };

    Shuffle.prototype = {

        constructor: Shuffle,

        _init : function() {
            var self = this,
                containerCSS,
                transEndEventNames,
                afterResizeFunc,
                debouncedAfterResize,
                beforeResizeFunc,
                debouncedBeforeResize;

            self.$items = self._getItems().addClass('shuffle-item filtered');
            self.transitionName = self.prefixed('transition'),
            self.transitionDelayName = self.prefixed('transitionDelay');
            self.transitionDuration = self.prefixed('transitionDuration');
            self.transform = self.getPrefixed('transform');

            self.isFluid = self.columnWidth && typeof self.columnWidth === 'function';

            // Get transitionend event name
            transEndEventNames = {
                'WebkitTransition' : 'webkitTransitionEnd',
                'MozTransition'    : 'transitionend',
                'OTransition'      : 'oTransitionEnd',
                'msTransition'     : 'MSTransitionEnd',
                'transition'       : 'transitionend'
            };
            self.transitionend = transEndEventNames[ self.transitionName ];

            // Set up css for transitions
            self.$container[0].style[ self.transitionName ] = 'height ' + self.speed + 'ms ' + self.easing;
            self._initItems( self.showInitialTransition );

            // Bind resize events (http://stackoverflow.com/questions/1852751/window-resize-event-firing-in-internet-explorer)
            // Get debounced versions of our resize methods
            afterResizeFunc = $.proxy( self._afterResize, self );
            debouncedAfterResize = self.throttle ? self.throttle( self.throttleTime, afterResizeFunc ) : afterResizeFunc;
            self.$window.on('resize.' + self.unique, debouncedAfterResize);

            // If we need to hide layouts with a fade instead, we need another event on window resize
            // which is only fired the first time window resize is triggered
            if ( self.hideLayoutWithFade ) {
                beforeResizeFunc = $.proxy( self._beforeResize, self );
                debouncedBeforeResize = self.throttle ? self.throttle( self.throttleTime, true, beforeResizeFunc ) : beforeResizeFunc;
                self.$window.on('resize.shuffle', debouncedBeforeResize);
            }

            // Position cannot be static
            containerCSS = self.$container.css(['paddingLeft', 'paddingRight', 'position', 'width']);
            if ( containerCSS.position === 'static' ) {
                self.$container.css('position', 'relative');
            }

            // Get offset from container
            self.offset = {
                left: parseInt( containerCSS.paddingLeft, 10 ) || 0,
                top: parseInt( containerCSS.paddingTop, 10 ) || 0
            };
            self._resetCols();
            // We already got the container's width above, no need to cause another reflow getting it again...
            self._setColumns( parseInt( containerCSS.width, 10 ) );
            self.shuffle( self.group );

            // If we've hidden the initial layout, we need to now add the transition to the elements
            if ( !self.showInitialTransition && self.supported && self.useTransition ) {
                setTimeout(function() {
                    self._setTransitions();
                }, 0);
            }
        },

        filter : function( category, $collection ) {
            var self = this,
                isPartialSet = $collection !== undefined,
                $items = isPartialSet ? $collection : self.$items,
                $filtered = $();

            category = category || self.lastFilter;

            self.fire('filter');

            // Loop through each item and use provided function to determine
            // whether to hide it or not.
            if ( $.isFunction(category) ) {
                $items.each(function() {
                    var $item = $(this),
                    passes = category.call($item[0], $item, self);

                    if ( passes ) {
                        $filtered = $filtered.add( $item );
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
                        passes = $.inArray(category, keys) > -1;

                        if ( passes ) {
                            $filtered = $filtered.add( $this );
                        }
                    });
                }

                // category === 'all', add filtered class to everything
                else {
                    $filtered = $items;
                }
            }

            // Individually add/remove concealed/filtered classes
            var concealed = 'concealed',
                filtered = 'filtered';
            $items.filter( $filtered ).each(function() {
                var $filteredItem = $(this);
                // Remove concealed if it's there
                if ( $filteredItem.hasClass( concealed ) ) {
                    $filteredItem.removeClass( concealed );
                }
                // Add filtered class if it's not there
                if ( !$filteredItem.hasClass( filtered ) ) {
                    $filteredItem.addClass( filtered );
                }
            });
            $items.not( $filtered ).each(function() {
                var $filteredItem = $(this);
                // Add concealed if it's not there
                if ( !$filteredItem.hasClass( concealed ) ) {
                    $filteredItem.addClass( concealed );
                }
                // Remove filtered class if it's there
                if ( $filteredItem.hasClass( filtered ) ) {
                    $filteredItem.removeClass( filtered );
                }
            });

            $items = null;
            $collection = null;

            return $filtered;
        },

        _initItems : function( withTransition, $items ) {
            var self = this;

            // Default to true if unspecified
            withTransition = withTransition === false ? false : true;
            $items = $items || self.$items;

            $items.each(function() {
                $(this).css(self.itemCss);

                // Set CSS transition for transforms and opacity
                if ( self.supported && self.useTransition && withTransition ) {
                    self._setTransition(this);
                }
            });
        },

        _setTransition : function( element ) {
            var self = this;
            element.style[self.transitionName] = self.transform + ' ' + self.speed + 'ms ' + self.easing + ', opacity ' + self.speed + 'ms ' + self.easing;
        },

        _setTransitions : function() {
            var self = this;
            self.$items.each(function() {
                self._setTransition( this );
            });
        },


        _setSequentialDelay : function( $collection ) {
            var self = this;

            if ( !self.supported ) {
                return;
            }

            // $collection can be an array of dom elements or jquery object
            $.each( $collection, function(i) {
                // This works because the transition-property: transform, opacity;
                this.style[ self.transitionDelayName ] = '0ms,' + ((i + 1) * self.sequentialFadeDelay) + 'ms';

                // Set the delay back to zero after one transition
                $(this).one(self.transitionend, function() {
                    this.style[ self.transitionDelayName ] = '0ms';
                });
            });
        },

        _resetDelay : function( $collection ) {
            var self = this;

            if ( !self.supported ) {
                return;
            }

            $.each( $collection, function() {
                $(this).off( self.transitionend );
                this.style[ self.transitionDelayName ] = '0ms';
            });
        },

        _orderItemsByDelay : function( $items ) {
            var self = this,
                $ordered = $(),
                $randomized = $(),
                ordered, randomized, merged,

            by = function( $el ) {
                return $el.data('delayOrder');
            };

            if ( !self.$ordered ) {

                $items.each(function() {
                    var delayOrder = $(this).data('delayOrder');

                    if ( delayOrder ) {
                        $ordered = $ordered.add( this );
                    } else {
                        $randomized = $randomized.add( this );
                    }
                });

                ordered = $ordered.sorted({ by: by });

            } else {
                $ordered = self.$ordered;
                ordered = self.ordered;
                $randomized = $items.not( $ordered );
            }

            // Sort randomly
            randomized = $randomized.sorted({ randomize: true });

            // Merge with the ordered array
            merged = ordered.concat( randomized );

            // Save values
            self.$ordered = $ordered;
            self.ordered = ordered;
            self.itemsOrderedByDelay = merged;
        },

        _getItems : function() {
            return this.$container.children( this.itemSelector );
        },

        // calculates number of columns
        // i.e. this.colWidth = 200
        _setColumns : function( theContainerWidth ) {
            var self = this,
                containerWidth = theContainerWidth || self.$container.width(),
                gutter = typeof self.gutterWidth === 'function' ? self.gutterWidth( containerWidth ) : self.gutterWidth;

            // use fluid columnWidth function if there
            self.colWidth = self.isFluid ? self.columnWidth( containerWidth ) :
                // if not, how about the explicitly set option?
                self.columnWidth ||
                // or use the size of the first item
                self.$items.outerWidth(true) ||
                // if there's no items, use size of container
                containerWidth;

            // Don't let them set a column width of zero.
            self.colWidth = self.colWidth || containerWidth;

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

            self.containerWidth = containerWidth;
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
         * @param {boolean} isOnlyPosition set this to true to only trigger positioning of the items
         */
        _layout: function( items, fn, isOnlyPosition, isHide ) {
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
                    self._placeItem( $this, self.colYs, fn, isOnlyPosition, isHide );
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

                    self._placeItem( $this, groupY, fn, isOnlyPosition, isHide );
                }
            });

            // `_layout` always happens after `shrink`, so it's safe to process the style
            // queue here with styles from the shrink method
            self._processStyleQueue();

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

        _reLayout : function( callback, isOnlyPosition ) {
            var self = this;
            callback = callback || self.filterEnd;
            self._resetCols();

            // If we've already sorted the elements, keep them sorted
            if ( self.keepSorted && self.lastSort ) {
                self.sort( self.lastSort, true, isOnlyPosition );
            } else {
                self._layout( self.$items.filter('.filtered').get(), self.filterEnd, isOnlyPosition );
            }
        },

        // worker method that places brick in the columnSet with the the minY
        _placeItem : function( $item, setY, callback, isOnlyPosition, isHide ) {
            // get the minimum Y value from the columns
            var self = this,
                minimumY = Math.min.apply( Math, setY ),
                shortCol = 0;

            // Find index of short column, the first from the left where this item will go
            // if ( setY[i] === minimumY ) requires items' height to be exact every time.
            // The buffer value is very useful when the height is a percentage of the width
            for (var i = 0, len = setY.length; i < len; i++) {
                if ( setY[i] >= minimumY - self.buffer && setY[i] <= minimumY + self.buffer ) {
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

            var transitionObj = {
                from: 'layout',
                $this: $item,
                x: x,
                y: y,
                scale: 1
            };

            if ( !isOnlyPosition ) {
                transitionObj.opacity = 1;
                transitionObj.callback = callback;
            } else {
                transitionObj.skipTransition = true;
            }

            if ( isHide ) {
                transitionObj.opacity = 0;
            }

            self.styleQueue.push( transitionObj );
        },

        /**
         * Hides the elements that don't match our filter
         */
        shrink : function( $collection, fn ) {
            var self = this,
                $concealed = $collection || self.$items.filter('.concealed'),
                transitionObj = {},
                callback = fn || self.shrinkEnd;

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

                if (!x) { x = 0; }
                if (!y) { y = 0; }

                transitionObj = {
                    from: 'shrink',
                    $this: $this,
                    x: x,
                    y: y,
                    scale : 0.001,
                    opacity: 0,
                    callback: callback
                };

                self.styleQueue.push( transitionObj );
            });
        },

        _afterResize : function() {
            var self = this,
                containerWidth;

            // If shuffle is disabled, destroyed, don't do anything
            if ( !self.enabled || self.destroyed ) {
                return;
            }

            // Will need to check height in the future if it's layed out horizontaly
            containerWidth = self.$container.width();

            // containerWidth hasn't changed, don't do anything
            if ( containerWidth === self.containerWidth ) {
                return;
            }

            // If we're hiding the layout with a fade,
            if ( self.hideLayoutWithFade && self.supported ) {
                // recaculate column and gutter values
                self._setColumns( containerWidth );
                // Layout the items with only a position
                self._reLayout( false, true );
                // Change the transition-delay value accordingly
                self._setSequentialDelay( self.itemsOrderedByDelay || self.$items.get() );
                self.fire('done');
                self.$items.css('opacity', 1);
            } else {
                self.resized();
            }
        },

        _beforeResize : function() {
            var self = this,
                containerWidth;

            // If shuffle is disabled, destroyed, don't do anything
            if ( !self.hideLayoutWithFade || !self.supported || !self.enabled || self.destroyed ) {
                return;
            }

            // Will need to check height in the future if it's layed out horizontaly
            containerWidth = self.$container.width();

            // containerWidth hasn't changed, don't do anything
            if ( containerWidth === self.containerWidth ) {
                return;
            }

            self.$items.css('opacity', 0);

            self.fire('loading');
            self._resetDelay( self.$items );
            self._orderItemsByDelay( self.$items );
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
         * Returns things like `-webkit-transition` or `box-sizing` from `transition` or `boxSizing`, respectively
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
                    self.fire('layout');
                    opts.callback.call(self);
                    self.layoutTransitionEnded = true;
                } else if (!self.shrinkTransitionEnded && opts.from === 'shrink') {
                    opts.callback.call(self);
                    self.shrinkTransitionEnded = true;
                }
            };

            opts.callback = opts.callback || $.noop;

            // Use CSS Transforms if we have them
            if ( self.supported ) {

                // Make scale one if it's not preset
                if ( opts.scale === undefined ) {
                    opts.scale = 1;
                }

                if (self.threeD) {
                    transform = 'translate3d(' + opts.x + 'px, ' + opts.y + 'px, 0) scale3d(' + opts.scale + ', ' + opts.scale + ', 1)';
                } else {
                    transform = 'translate(' + opts.x + 'px, ' + opts.y + 'px) scale(' + opts.scale + ', ' + opts.scale + ')';
                }

                if ( opts.x !== undefined ) {
                    self.setPrefixedCss(opts.$this, 'transform', transform);
                }

                if ( opts.opacity !== undefined && self.useTransition ) {
                    // Update css to trigger CSS Animation
                    opts.$this.css('opacity' , opts.opacity);
                }

                if ( self.useTransition ) {
                    opts.$this.one(self.transitionend, complete);
                } else {
                    complete();
                }
            } else {

                var cssObj = {
                    left: opts.x,
                    top: opts.y,
                    opacity: opts.opacity
                };

                if ( self.useTransition ) {
                    // Use jQuery to animate left/top
                    opts.$this.stop(true, true).animate( cssObj, self.speed, 'swing', complete);
                } else {
                    opts.$this.css( cssObj );
                    complete();
                }
            }
        },

        _processStyleQueue : function() {
            var self = this,
                queue = self.styleQueue;

            $.each( queue, function(i, transitionObj) {

                if ( transitionObj.skipTransition ) {
                    self._skipTransition( transitionObj.$this[0], function() {
                        self.transition( transitionObj );
                    });
                } else {
                    self.transition( transitionObj );
                }
            });

            // Remove everything in the style queue
            self.styleQueue.length = 0;
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

        /**
         * Change a property or execute a function which will not have a transition
         * @param  {Element}         element    DOM element that won't be transitioned
         * @param  {string|function} property   the new style property which will be set or a function which will be called
         * @param  {string}          [value]    the value that `property` should be.
         */
        _skipTransition : function( element, property, value ) {
            var self = this,
                reflow,
                durationName = self.transitionDuration,
                duration = element.style[ durationName ];

            // Set the duration to zero so it happens immediately
            element.style[ durationName ] = '0ms'; // ms needed for firefox!

            if ( $.isFunction( property ) ) {
                property();
            } else {
                element.style[ property ] = value;
            }

            // Force reflow
            reflow = element.offsetWidth;

            // Put the duration back
            element.style[ durationName ] = duration;
        },

        _addItems : function( $newItems, animateIn, isSequential ) {
            var self = this,
                $passed,
                passed;

            if ( !self.supported ) {
                animateIn = false;
            }

            $newItems.addClass('shuffle-item');
            self._initItems( undefined, $newItems );
            self.$items = self._getItems();
            $newItems.not($passed).css('opacity', 0);

            $passed = self.filter( undefined, $newItems );
            passed = $passed.get();

            // How many filtered elements?
            self.visibleItems = self.$items.filter('.filtered').length;

            if ( animateIn ) {
                self._layout( passed, null, true, true );

                if ( isSequential ) {
                    self._setSequentialDelay( $passed );
                }

                self._revealAppended( $passed );
            } else {
                self._layout( passed );
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
            }, self.revealAppendedDelay);
        },

        /**
         * Public Methods
         */

        /**
         * The magic. This is what makes the plugin 'shuffle'
         * @param  {String|Function} category category to filter by. Can be a function
         * @param {Object} [sortObj] A sort object which can sort the filtered set
         */
        shuffle : function( category, sortObj ) {
            var self = this;

            if ( !self.enabled ) {
                return;
            }

            if ( !category ) {
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

            // If given a valid sort object, save it so that _reLayout() will sort the items
            if ( sortObj ) {
                self.lastSort = sortObj;
            }
            // Update transforms on .filtered elements so they will animate to their new positions
            self._reLayout();
        },

        /**
         * Gets the .filtered elements, sorts them, and passes them to layout
         *
         * @param {object} opts the options object for the sorted plugin
         * @param {Boolean} [fromFilter] was called from Shuffle.filter method.
         */
        sort: function( opts, fromFilter, isOnlyPosition ) {
            var self = this,
                items = self.$items.filter('.filtered').sorted(opts);

            if ( !fromFilter ) {
                self._resetCols();
            }

            self._layout(items, function() {
                if (fromFilter) {
                    self.filterEnd();
                }
                self.sortEnd();
            }, isOnlyPosition);

            self.lastSort = opts;
        },

        /**
         * Relayout everything
         */
        resized: function( isOnlyLayout ) {
            if ( this.enabled ) {

                if ( !isOnlyLayout ) {
                    // Get updated colCount
                    this._setColumns();
                }

                // Layout items
                this._reLayout();
            }
        },

        /**
         * Use this instead of `update()` if you don't need the columns and gutters updated
         * Maybe an image inside `shuffle` loaded (and now has a height), which means calculations
         * could be off.
         */
        layout : function() {
            this.update( true );
        },

        update : function( isOnlyLayout ) {
            this.resized( isOnlyLayout );
        },

        /**
         * New items have been appended to shuffle. Fade them in sequentially
         * @param  {jQuery}  $newItems    jQuery collection of new items
         * @param  {Boolean}  [animateIn]    If false, the new items won't animate in
         * @param  {Boolean} [isSequential] If false, new items won't sequentially fade in
         */
        appended : function( $newItems, animateIn, isSequential ) {
            // True if undefined
            animateIn = animateIn === false ? false : true;
            isSequential = isSequential === false ? false : true;

            this._addItems( $newItems, animateIn, isSequential );
        },

        disable : function() {
            this.enabled = false;
        },

        enable : function( isUpdateLayout ) {
            this.enabled = true;
            if ( isUpdateLayout !== false ) {
                this.update();
            }
        },

        remove : function( $collection ) {

            // If this isn't a jquery object, exit
            if ( !$collection.length || !$collection.jquery ) {
                return;
            }

            var self = this,
            remove = function() {
                var shuffle = this;
                $collection.remove();
                $collection = null;
                setTimeout(function() {
                    shuffle.$items = shuffle._getItems();
                    shuffle.layout();
                }, 0);
            };

            self.shrink( $collection, remove );
            self._processStyleQueue();
        },

        destroy: function() {
            var self = this;

            self.$window.off('.' + self.unique);
            self.$container
                .removeClass('shuffle')
                .removeAttr('style')
                .removeData('shuffle');
            self.$items
                .removeAttr('style')
                .removeClass('concealed filtered shuffle-item');
            self.destroyed = true;
        }

    };


    // Plugin definition
    $.fn.shuffle = function( opts ) {
        var args = Array.prototype.slice.call( arguments, 1 );
        return this.each(function() {
            var $this = $(this),
                shuffle = $this.data('shuffle');

            // If we don't have a stored shuffle, make a new one and save it
            if ( !shuffle ) {
                shuffle = new Shuffle($this, opts);
                $this.data('shuffle', shuffle);
            }

            // If passed a string, lets decide what to do with it. Or they've provided a function to filter by
            if ( $.isFunction(opts) ) {
                shuffle.shuffle.apply( shuffle, args );

            // Key should be an object with propreties reversed and by.
            } else if (typeof opts === 'string') {
                switch( opts ) {
                    case 'sort':
                    case 'destroy':
                    case 'update':
                    case 'appended':
                    case 'enable':
                    case 'disable':
                    case 'layout':
                    case 'remove':
                        shuffle[ opts ].apply( shuffle, args );
                        break;
                    default:
                        shuffle.shuffle( opts );
                        break;
                }
            }
        });
    };

    // Overrideable options
    $.fn.shuffle.options = {
        group : 'all', // Filter group
        speed : 400, // Transition/animation speed (milliseconds)
        easing : 'ease-out', // css easing function to use
        itemSelector: '', // e.g. '.gallery-item'
        gutterWidth : 0, // a static number or function that tells the plugin how wide the gutters between columns are (in pixels)
        columnWidth : 0,// a static number or function that returns a number which tells the plugin how wide the columns are (in pixels)
        showInitialTransition : true, // If set to false, the shuffle-items will only have a transition applied to them after the first layout
        delimeter : null, // if your group is not json, and is comma delimeted, you could set delimeter to ','
        buffer: 0, // useful for percentage based heights when they might not always be exactly the same (in pixels)
        throttle: $.debounce || null,
        throttleTime: 300,
        keepSorted : true, // Keep sorted when shuffling/layout
        hideLayoutWithFade: false,
        sequentialFadeDelay: 150,
        useTransition: true // You don't want transitions on shuffle items? Fine, but you're weird
    };

    // Not overrideable
    $.fn.shuffle.settings = {
        itemCss : { // default CSS for each item
            position: 'absolute',
            top: 0,
            left: 0
        },
        revealAppendedDelay: 300,
        enabled: true,
        destroyed: false,
        styleQueue: [],
        supported: Modernizr.csstransforms && Modernizr.csstransitions, // supports transitions and transforms
        prefixed: Modernizr.prefixed,
        threeD: Modernizr.csstransforms3d // supports 3d transforms
    };

})(jQuery, Modernizr);