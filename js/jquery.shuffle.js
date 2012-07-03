// IMPORTANT!
// If you're already using Modernizr, delete it from this file. If you don't know what Modernizr is, leave it :)

/* Modernizr 2.5.3 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-csstransforms-csstransforms3d-csstransitions-cssclasses-prefixed-teststyles-testprop-testallprops-prefixes-domprefixes
 */
;window.Modernizr=function(a,b,c){function z(a){j.cssText=a}function A(a,b){return z(m.join(a+";")+(b||""))}function B(a,b){return typeof a===b}function C(a,b){return!!~(""+a).indexOf(b)}function D(a,b){for(var d in a)if(j[a[d]]!==c)return b=="pfx"?a[d]:!0;return!1}function E(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:B(f,"function")?f.bind(d||b):f}return!1}function F(a,b,c){var d=a.charAt(0).toUpperCase()+a.substr(1),e=(a+" "+o.join(d+" ")+d).split(" ");return B(b,"string")||B(b,"undefined")?D(e,b):(e=(a+" "+p.join(d+" ")+d).split(" "),E(e,b,c))}var d="2.5.3",e={},f=!0,g=b.documentElement,h="modernizr",i=b.createElement(h),j=i.style,k,l={}.toString,m=" -webkit- -moz- -o- -ms- ".split(" "),n="Webkit Moz O ms",o=n.split(" "),p=n.toLowerCase().split(" "),q={},r={},s={},t=[],u=t.slice,v,w=function(a,c,d,e){var f,i,j,k=b.createElement("div"),l=b.body,m=l?l:b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:h+(d+1),k.appendChild(j);return f=["&#173;","<style>",a,"</style>"].join(""),k.id=h,(l?k:m).innerHTML+=f,m.appendChild(k),l||(m.style.background="",g.appendChild(m)),i=c(k,a),l?k.parentNode.removeChild(k):m.parentNode.removeChild(m),!!i},x={}.hasOwnProperty,y;!B(x,"undefined")&&!B(x.call,"undefined")?y=function(a,b){return x.call(a,b)}:y=function(a,b){return b in a&&B(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=u.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(u.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(u.call(arguments)))};return e});var G=function(a,c){var d=a.join(""),f=c.length;w(d,function(a,c){var d=b.styleSheets[b.styleSheets.length-1],g=d?d.cssRules&&d.cssRules[0]?d.cssRules[0].cssText:d.cssText||"":"",h=a.childNodes,i={};while(f--)i[h[f].id]=h[f];e.csstransforms3d=(i.csstransforms3d&&i.csstransforms3d.offsetLeft)===9&&i.csstransforms3d.offsetHeight===3},f,c)}([,["@media (",m.join("transform-3d),("),h,")","{#csstransforms3d{left:9px;position:absolute;height:3px;}}"].join("")],[,"csstransforms3d"]);q.csstransforms=function(){return!!F("transform")},q.csstransforms3d=function(){var a=!!F("perspective");return a&&"webkitPerspective"in g.style&&(a=e.csstransforms3d),a},q.csstransitions=function(){return F("transition")};for(var H in q)y(q,H)&&(v=H.toLowerCase(),e[v]=q[H](),t.push((e[v]?"":"no-")+v));return z(""),i=k=null,e._version=d,e._prefixes=m,e._domPrefixes=p,e._cssomPrefixes=o,e.testProp=function(a){return D([a])},e.testAllProps=F,e.testStyles=w,e.prefixed=function(a,b,c){return b?F(a,b,c):F(a,"pfx")},g.className=g.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(f?" js "+t.join(" "):""),e}(this,this.document);

/**
 * jQuery Shuffle Plugin
 * Uses CSS Transforms to filter down a grid of items (degrades to jQuery's animate).
 * Inspired by Isotope http://isotope.metafizzy.co/
 * Use it for whatever you want!
 * @author Glen Cheney (http://glencheney.com)
 * @version 1.3
 * @date 7/3/12
 * 
 */
(function($) {
    var supported = Modernizr.csstransforms || Modernizr.csstransitions,
        methods = {
        
        init : function(options) {
            var settings = {
                itemWidth : 230,
                marginTop : 20,
                marginRight: 20,
                key : 'all',
                speed : 800,
                easing : 'ease-out'
            };
            
            if (options) {
                $.extend(settings, options);
            }

            settings.itemCss = {
                position: 'absolute',
                opacity: 1, // Everything after this is for jQuery fallback
                top: 0,
                left: 0,
                marginTop: settings.marginTop,
                marginRight: settings.marginRight,
                float: 'left'
            };
            
            return this.each(function() {
                var $this = $(this),
                    $items = $this.children(),
                    itemsPerRow = Math.floor($this.width() / settings.itemWidth),
                    itemHeight = $items.first().outerHeight(),
                    data,
                    transition = Modernizr.prefixed('transition'),
                    transform = methods.getPrefixed('transform');

                // Set up css for transitions
                $this.css('position', 'relative').get(0).style[transition] = 'height ' + settings.speed + 'ms ' + settings.easing;
                $items.each(function(index) {
                    var defaults = settings.itemCss;
                    
                    // Set CSS transition for transforms and opacity
                    if (supported) {
                        this.style[transition] = transform + ' ' + settings.speed + 'ms ' + settings.easing + ', opacity ' + settings.speed + 'ms ' + settings.easing;
                    }
                    
                    // Set the margin-right to zero for the last item in the row
                    if ((index + 1) % itemsPerRow === 0)
                        defaults.marginRight = 0;

                    $(this).css(settings.itemCss);
                });

                data = {
                    $items : $items,
                    itemsPerRow : itemsPerRow,
                    itemHeight : itemHeight,
                    itemWidth : settings.itemWidth,
                    marginTop : settings.marginTop,
                    marginRight : settings.marginRight,
                    settings : settings
                };

                // Save our settings for recall
                $this.data('shuffle', data);
                
                // Do it
                methods.shuffle.call(this, 'all');
            });
        },
        
        shuffle : function(category) {
            var $this = $(this),
                data = $this.data('shuffle'),
                numElements,
                gridHeight;
            
            // If we somehow don't have data, initialize it
            if (!data) {
                methods.init.call(this);
                data = $(this).data('shuffle');
            }
            
            if (!category) category = 'all';

            // Hide/show appropriate items
            if (category == 'all') {
                data.$items.removeClass('concealed');
            } else {
                data.$items.removeClass('concealed filtered').each(function() {
                    var keys = $(this).attr('data-key'),
                        kArray = $.parseJSON(keys);
                    if ($.inArray(category, kArray) === -1) {
                        $(this).addClass('concealed');
                        return;
                    }
                });
            }
            
            // How many filtered elements?
            numElements = data.$items.not('.concealed').addClass('filtered').length;

            // Shrink each concealed item
            methods.shrink.call(this);

            // Update transforms on .filtered elements so they will animate to their new positions
            methods.filter.call(this);
            
            // Adjust the height of the grid
            gridHeight = (Math.ceil(numElements / data.itemsPerRow) * (data.itemHeight + data.marginTop)) - data.marginTop;
            $this.css('height', gridHeight + 'px');
        },
        
        
        shrink : function() {
            var $concealed = $(this).find('.concealed');
            if ($concealed.length === 0) {
                return;
            }
            $concealed.each(function() {
                var $this = $(this),
                    x = parseInt($this.attr('data-x')),
                    y = parseInt($this.attr('data-y')),
                    data = $this.parent().data('shuffle');

                if (!x) x = 0;
                if (!y) y = 0;

                methods.transition({
                    $this: $this,
                    x: x,
                    y: y,
                    left: (x + (data.itemWidth / 2)) + 'px',
                    top: (y + (data.itemHeight / 2)) + 'px',
                    scale : 0.001,
                    opacity: 0,
                    height: '0px',
                    width: '0px'
                });
            });
        },

        filter : function() {
            var y = 0, $filtered = $(this).find('.filtered');
            
            $filtered.each(function(index) {
                var $this = $(this),
                    data = $this.parent().data('shuffle'),
                    x = (index % data.itemsPerRow) * (data.itemWidth + data.marginRight),
                    row = Math.floor(index / data.itemsPerRow)

                if (index % data.itemsPerRow === 0) {
                    y = row * (data.itemHeight + data.marginTop);
                }

                // Save data for shrink
                $this.attr({'data-x' : x, 'data-y' : y});

                methods.transition({
                    $this: $this,
                    x: x,
                    y: y,
                    left: x + 'px',
                    top: y + 'px',
                    scale : 1,
                    opacity: 1,
                    height: data.itemHeight + 'px',
                    width: data.itemWidth + 'px'
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
            var transform;
            // Use CSS Transforms if we have them
            if (supported) {
                if (Modernizr.csstransforms3d) {
                    transform = 'translate3d(' + opts.x + 'px, ' + opts.y + 'px, 0px) scale3d(' + opts.scale + ', ' + opts.scale + ', ' + opts.scale + ')';
                } else {
                    transform = 'translate(' + opts.x + 'px, ' + opts.y + 'px) scale(' + opts.scale + ', ' + opts.scale + ')';
                }

                // Update css to trigger CSS Animation
                opts.$this.css('opacity' , opts.opacity);
                methods.setPrefixedCss(opts.$this, 'transform', transform);
            } else {
                // Use jQuery to animate left/top
                opts.$this.animate({
                    left: opts.left,
                    top: opts.top,
                    opacity: opts.opacity,
                    height: opts.height,
                    width: opts.width
                }, 800);
            }
        }
    };
        
    $.fn.shuffle = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || ! method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' +  method + ' does not exist on jQuery.shuffle');
            return false;
        }
    };
})(jQuery);