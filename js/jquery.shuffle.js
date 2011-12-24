// IMPORTANT!
// If you're already using Modernizr, delete it from this file. If you don't know what Modernizr is, leave it :)

/* Modernizr 2.0.6 (Custom Build) | MIT & BSD
 * Build: http://www.modernizr.com/download/#-csstransforms-csstransforms3d-csstransitions-cssclasses-teststyles-testprop-testallprops-prefixes-domprefixes
 */
;window.Modernizr=function(a,b,c){function C(a,b){var c=a.charAt(0).toUpperCase()+a.substr(1),d=(a+" "+o.join(c+" ")+c).split(" ");return B(d,b)}function B(a,b){for(var d in a)if(k[a[d]]!==c)return b=="pfx"?a[d]:!0;return!1}function A(a,b){return!!~(""+a).indexOf(b)}function z(a,b){return typeof a===b}function y(a,b){return x(n.join(a+";")+(b||""))}function x(a){k.cssText=a}var d="2.0.6",e={},f=!0,g=b.documentElement,h=b.head||b.getElementsByTagName("head")[0],i="modernizr",j=b.createElement(i),k=j.style,l,m=Object.prototype.toString,n=" -webkit- -moz- -o- -ms- -khtml- ".split(" "),o="Webkit Moz O ms Khtml".split(" "),p={},q={},r={},s=[],t=function(a,c,d,e){var f,h,j,k=b.createElement("div");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:i+(d+1),k.appendChild(j);f=["&shy;","<style>",a,"</style>"].join(""),k.id=i,k.innerHTML+=f,g.appendChild(k),h=c(k,a),k.parentNode.removeChild(k);return!!h},u,v={}.hasOwnProperty,w;!z(v,c)&&!z(v.call,c)?w=function(a,b){return v.call(a,b)}:w=function(a,b){return b in a&&z(a.constructor.prototype[b],c)};var D=function(a,c){var d=a.join(""),f=c.length;t(d,function(a,c){var d=b.styleSheets[b.styleSheets.length-1],g=d.cssRules&&d.cssRules[0]?d.cssRules[0].cssText:d.cssText||"",h=a.childNodes,i={};while(f--)i[h[f].id]=h[f];e.csstransforms3d=i.csstransforms3d.offsetLeft===9},f,c)}([,["@media (",n.join("transform-3d),("),i,")","{#csstransforms3d{left:9px;position:absolute}}"].join("")],[,"csstransforms3d"]);p.csstransforms=function(){return!!B(["transformProperty","WebkitTransform","MozTransform","OTransform","msTransform"])},p.csstransforms3d=function(){var a=!!B(["perspectiveProperty","WebkitPerspective","MozPerspective","OPerspective","msPerspective"]);a&&"webkitPerspective"in g.style&&(a=e.csstransforms3d);return a},p.csstransitions=function(){return C("transitionProperty")};for(var E in p)w(p,E)&&(u=E.toLowerCase(),e[u]=p[E](),s.push((e[u]?"":"no-")+u));x(""),j=l=null,e._version=d,e._prefixes=n,e._domPrefixes=o,e.testProp=function(a){return B([a])},e.testAllProps=C,e.testStyles=t,g.className=g.className.replace(/\bno-js\b/,"")+(f?" js "+s.join(" "):"");return e}(this,this.document);

/**
 * jQuery Shuffle Plugin
 * Uses CSS Transforms to filter down a grid of items (degrades to jQuery's animate).
 * Inspired by Isotope http://isotope.metafizzy.co/
 * Copyright (c) 2011 Glen Cheney cheney [dot] glen [at] gmail [dot] com http://glencheney.com
 * @author Glen Cheney
 * @version 1.1
 * @date 10/31/11
 * 
 */
(function($) {
    var methods = {
        shrink : function() {
            var $concealed = $(this).find('.concealed');
            if ($concealed.length === 0) {
                return;
            }
            $concealed.each(function() {
                var $this = $(this),
                    x = parseInt($this.attr('data-x')),
                    y = parseInt($this.attr('data-y')),
                    data = $this.parent().data('shuffle'),
                    transform,
                    left,
                    top;

                if (!x) x = 0;
                if (!y) y = 0;

                if (Modernizr.csstransforms && Modernizr.csstransitions) {
                  if (Modernizr.csstransforms3d) {
                        transform = 'translate3d(' + x + 'px, ' + y + 'px, 0px) scale3d(0.001, 0.001, 1)';
                    } else {
                        transform = 'translate(' + x + 'px, ' + y + 'px) scale(0.001)';
                    }

                    methods.setPrefixedCss($this, 'transform', transform);
                } else {
                    // Use jQuery to animate left/top
                    left = (x + (data.itemWidth / 2));
                    top = (y + (data.itemHeight / 2));
                    $this.animate({
                        left: left + 'px',
                        top: top + 'px',
                        opacity: 0,
                        height: '0px',
                        width: '0px'
                    }, 800, 'swing');
                }


            });
        },

        filter : function(settings) {
            var y = 0, $filtered = $(this).find('.filtered');
            
            $filtered.each(function(index) {
                var $this = $(this),
                    data = $this.parent().data('shuffle'),
                    x = (index % data.itemsPerRow) * (settings.itemWidth + settings.margins),
                    yIndex = Math.floor(index / data.itemsPerRow),
                    transform;

                if (index % data.itemsPerRow == 0) {
                    y = yIndex * (data.itemHeight + settings.margins);
                }

                // Save data for shrink
                $this.attr({'data-x' : x, 'data-y' : y});

                // Use CSS Transforms if we have them
                if (Modernizr.csstransforms && Modernizr.csstransitions) {
                    if (Modernizr.csstransforms3d) {
                        transform = 'translate3d(' + x + 'px, ' + y + 'px, 0px) scale3d(1, 1, 1)';
                    } else {
                        transform = 'translate(' + x + 'px, ' + y + 'px) scale(1, 1)';
                    }

                    // Update css to trigger CSS Animation
                    methods.setPrefixedCss($this, 'transform', transform);
                } else {
                    // Use jQuery to animate left/top
                    $this.animate({
                        left: x + 'px',
                        top: y + 'px',
                        opacity: 1,
                        height: data.itemHeight + 'px',
                        width: data.itemWidth + 'px'
                    }, 800, 'swing');
                }
            });
        },
        
        /**
         * Uses Modernizr's testAllProps (aka prefixed()) to get the correct
         * vendor property name and sets it using jQuery .css()
         * @param {jq} $el the jquery object to set the css on
         * @param {string} prop the property to set (e.g. 'transition')
         * @param {string} value the value of the prop
         */
        setPrefixedCss : function($el, prop, value) {
            $el.css(Modernizr.testAllProps(prop, 'pfx'), value);
        }
    };
    
    $.fn.shuffle = function(options) {
        var settings = {
            'itemWidth' : 230,
            'margins' : 20,
            'key' : 'all'
        };

        return this.each(function() {
            if (options) {
                $.extend(settings, options);
            }

            var $this = $(this),
                numElements,
                gridHeight,
                data = $this.data('shuffle');

            // We're getting initialized, do some setup and
            // calculations and then save them so we don't have to do it again
            if (!data) {
                var $items = $this.children(),
                    itemsPerRow = Math.floor($this.width() / settings.itemWidth),
                    itemHeight = $items.first().outerHeight();

                data = {
                    '$items' : $items,
                    'itemsPerRow' : itemsPerRow,
                    'itemHeight' : itemHeight,
                    'itemWidth' : settings.itemWidth,
                    'margins' : settings.margins
                };
                
                $this.data('shuffle', data);
                
                // Disabled CSS Animations if we're going to use jQuery to animate
                if (!Modernizr.csstransforms || !Modernizr.csstransitions) {
                    methods.setPrefixedCss($items, 'transition', 'none');
                }
            }

            // Hide/show appropriate items
            if (settings.key == 'all') {
                data.$items.removeClass('concealed');
            } else {
                data.$items.removeClass('concealed filtered').each(function() {
                    var keys = $(this).attr('data-key'),
                        kArray = $.parseJSON(keys);
                    if ($.inArray(settings.key, kArray) === -1) {
                        $(this).addClass('concealed');
                    }
                });
            }

            // Shrink each concealed item
            methods.shrink.call(this, settings);

            numElements = data.$items.not('.concealed').addClass('filtered').length;
            // Update transforms on .filtered elements so they will animate to their new positions
            methods.filter.call(this, settings);
            
            // Adjust the height of the grid
            gridHeight = (Math.ceil(numElements / data.itemsPerRow) * (data.itemHeight + settings.margins)) - settings.margins;
            $this.css('height', gridHeight + 'px');
        });

    };
})(jQuery);