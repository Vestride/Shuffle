(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Shuffle"] = factory();
	else
		root["Shuffle"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _matchesSelector = __webpack_require__(1);
	
	var _matchesSelector2 = _interopRequireDefault(_matchesSelector);
	
	var _point = __webpack_require__(2);
	
	var _point2 = _interopRequireDefault(_point);
	
	var _shuffleItem = __webpack_require__(4);
	
	var _shuffleItem2 = _interopRequireDefault(_shuffleItem);
	
	var _classes = __webpack_require__(5);
	
	var _classes2 = _interopRequireDefault(_classes);
	
	var _getNumber = __webpack_require__(3);
	
	var _getNumber2 = _interopRequireDefault(_getNumber);
	
	var _sorter = __webpack_require__(6);
	
	var _sorter2 = _interopRequireDefault(_sorter);
	
	__webpack_require__(7);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function toArray(arrayLike) {
	  return Array.prototype.slice.call(arrayLike);
	}
	
	// Constants
	var SHUFFLE = 'shuffle';
	
	// Configurable. You can change these constants to fit your application.
	// The default scale and concealed scale, however, have to be different values.
	var ALL_ITEMS = 'all';
	var FILTER_ATTRIBUTE_KEY = 'groups';
	var DEFAULT_SCALE = 1;
	var CONCEALED_SCALE = 0.001;
	
	// Underscore's throttle function.
	function throttle(func, wait, options) {
	  var context, args, result;
	  var timeout = null;
	  var previous = 0;
	  options = options || {};
	  var later = function later() {
	    previous = options.leading === false ? 0 : Date.now();
	    timeout = null;
	    result = func.apply(context, args);
	    context = args = null;
	  };
	
	  return function () {
	    var now = Date.now();
	    if (!previous && options.leading === false) {
	      previous = now;
	    }
	
	    var remaining = wait - (now - previous);
	    context = this;
	    args = arguments;
	    if (remaining <= 0 || remaining > wait) {
	      clearTimeout(timeout);
	      timeout = null;
	      previous = now;
	      result = func.apply(context, args);
	      context = args = null;
	    } else if (!timeout && options.trailing !== false) {
	      timeout = setTimeout(later, remaining);
	    }
	
	    return result;
	  };
	}
	
	function each(obj, iterator, context) {
	  for (var i = 0, length = obj.length; i < length; i++) {
	    if (iterator.call(context, obj[i], i, obj) === {}) {
	      return;
	    }
	  }
	}
	
	function defer(fn, context, wait) {
	  return setTimeout(fn.bind(context), wait);
	}
	
	function arrayMax(array) {
	  return Math.max.apply(Math, array);
	}
	
	function arrayMin(array) {
	  return Math.min.apply(Math, array);
	}
	
	var getStyles = window.getComputedStyle;
	
	var COMPUTED_SIZE_INCLUDES_PADDING = function () {
	  var parent = document.body || document.documentElement;
	  var e = document.createElement('div');
	  e.style.cssText = 'width:10px;padding:2px;box-sizing:border-box;';
	  parent.appendChild(e);
	
	  var width = getStyles(e, null).width;
	  var ret = width === '10px';
	
	  parent.removeChild(e);
	
	  return ret;
	}();
	
	// Used for unique instance variables
	var id = 0;
	
	var Shuffle = function () {
	
	  /**
	   * Categorize, sort, and filter a responsive grid of items.
	   *
	   * @param {Element} element An element which is the parent container for the grid items.
	   * @param {Object} [options=Shuffle.options] Options object.
	   * @constructor
	   */
	
	  function Shuffle(element) {
	    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	    _classCallCheck(this, Shuffle);
	
	    Object.assign(this, Shuffle.options, options, Shuffle.settings);
	
	    element = this._getElementOption(element);
	
	    if (!element) {
	      throw new TypeError('Shuffle needs to be initialized with an element.');
	    }
	
	    this.element = element;
	    this.id = 'shuffle_' + id++;
	
	    this._dispatch(Shuffle.EventType.LOADING);
	    this._init();
	
	    // Dispatch the done event asynchronously so that people can bind to it after
	    // Shuffle has been initialized.
	    defer(function () {
	      this.initialized = true;
	      this._dispatch(Shuffle.EventType.DONE);
	    }, this, 16);
	  }
	
	  _createClass(Shuffle, [{
	    key: '_init',
	    value: function _init() {
	      this.items = this._getItems();
	
	      this.sizer = this._getElementOption(this.sizer);
	
	      if (this.sizer) {
	        this.useSizer = true;
	      }
	
	      // Add class and invalidate styles
	      this.element.classList.add(Shuffle.ClassName.BASE);
	
	      // Set initial css for each item
	      this._initItems();
	
	      // Bind resize events
	      this._onResize = this._getResizeFunction();
	      window.addEventListener('resize', this._onResize);
	
	      // Get container css all in one request. Causes reflow
	      var containerCSS = window.getComputedStyle(this.element, null);
	      var containerWidth = Shuffle._getOuterWidth(this.element);
	
	      // Add styles to the container if it doesn't have them.
	      this._validateStyles(containerCSS);
	
	      // We already got the container's width above, no need to cause another
	      // reflow getting it again... Calculate the number of columns there will be
	      this._setColumns(containerWidth);
	
	      // Kick off!
	      this.shuffle(this.group, this.initialSort);
	
	      // The shuffle items haven't had transitions set on them yet
	      // so the user doesn't see the first layout. Set them now that the first layout is done.
	      if (this.supported) {
	        defer(function () {
	          this._setTransitions();
	          this.element.style.transition = 'height ' + this.speed + 'ms ' + this.easing;
	        }, this);
	      }
	    }
	
	    /**
	     * Returns a throttled and proxied function for the resize handler.
	     * @return {Function}
	     * @private
	     */
	
	  }, {
	    key: '_getResizeFunction',
	    value: function _getResizeFunction() {
	      var resizeFunction = this._handleResize.bind(this);
	      return this.throttle ? this.throttle(resizeFunction, this.throttleTime) : resizeFunction;
	    }
	
	    /**
	     * Retrieve an element from an option.
	     * @param {string|jQuery|Element} option The option to check.
	     * @return {?Element} The plain element or null.
	     * @private
	     */
	
	  }, {
	    key: '_getElementOption',
	    value: function _getElementOption(option) {
	      // If column width is a string, treat is as a selector and search for the
	      // sizer element within the outermost container
	      if (typeof option === 'string') {
	        return this.element.querySelector(option);
	
	        // Check for an element
	      } else if (option && option.nodeType && option.nodeType === 1) {
	          return option;
	
	          // Check for jQuery object
	        } else if (option && option.jquery) {
	            return option[0];
	          }
	
	      return null;
	    }
	
	    /**
	     * Ensures the shuffle container has the css styles it needs applied to it.
	     * @param {Object} styles Key value pairs for position and overflow.
	     * @private
	     */
	
	  }, {
	    key: '_validateStyles',
	    value: function _validateStyles(styles) {
	      // Position cannot be static.
	      if (styles.position === 'static') {
	        this.element.style.position = 'relative';
	      }
	
	      // Overflow has to be hidden
	      if (styles.overflow !== 'hidden') {
	        this.element.style.overflow = 'hidden';
	      }
	    }
	
	    /**
	     * Filter the elements by a category.
	     * @param {string} [category] Category to filter by. If it's given, the last
	     *     category will be used to filter the items.
	     * @param {ArrayLike} [$collection] Optionally filter a collection. Defaults to
	     *     all the items.
	     * @return {jQuery} Filtered items.
	     * @private
	     */
	
	  }, {
	    key: '_filter',
	    value: function _filter() {
	      var category = arguments.length <= 0 || arguments[0] === undefined ? this.lastFilter : arguments[0];
	      var collection = arguments.length <= 1 || arguments[1] === undefined ? this.items : arguments[1];
	
	      var set = this._getFilteredSets(category, collection);
	
	      // Individually add/remove concealed/filtered classes
	      this._toggleFilterClasses(set);
	
	      // Save the last filter in case elements are appended.
	      this.lastFilter = category;
	
	      // This is saved mainly because providing a filter function (like searching)
	      // will overwrite the `lastFilter` property every time its called.
	      if (typeof category === 'string') {
	        this.group = category;
	      }
	
	      return set.filtered;
	    }
	
	    /**
	     * Returns an object containing the filtered and concealed elements.
	     * @param {string|Function} category Category or function to filter by.
	     * @param {ArrayLike.<Element>} $items A collection of items to filter.
	     * @return {!{filtered: jQuery, concealed: jQuery}}
	     * @private
	     */
	
	  }, {
	    key: '_getFilteredSets',
	    value: function _getFilteredSets(category, items) {
	      var _this2 = this;
	
	      var filtered = [];
	      var concealed = [];
	
	      // category === 'all', add filtered class to everything
	      if (category === ALL_ITEMS) {
	        filtered = items;
	
	        // Loop through each item and use provided function to determine
	        // whether to hide it or not.
	      } else {
	          items.forEach(function (item) {
	            if (_this2._doesPassFilter(category, item)) {
	              filtered.push(item);
	            } else {
	              concealed.push(item);
	            }
	          });
	        }
	
	      return {
	        filtered: filtered,
	        concealed: concealed
	      };
	    }
	
	    /**
	     * Test an item to see if it passes a category.
	     * @param {string|Function} category Category or function to filter by.
	     * @param {ShuffleItem} item A single item.
	     * @return {boolean} Whether it passes the category/filter.
	     * @private
	     */
	
	  }, {
	    key: '_doesPassFilter',
	    value: function _doesPassFilter(category, item) {
	      var _this3 = this;
	
	      if (typeof category === 'function') {
	        return category.call(item.element, item.element, this);
	
	        // Check each element's data-groups attribute against the given category.
	      } else {
	          var _ret = function () {
	            var attr = item.element.getAttribute('data-' + FILTER_ATTRIBUTE_KEY);
	            var groups = JSON.parse(attr);
	            var keys = _this3.delimeter && !Array.isArray(groups) ? groups.split(_this3.delimeter) : groups;
	
	            if (Array.isArray(category)) {
	              return {
	                v: category.some(function (name) {
	                  return keys.indexOf(name) > -1;
	                })
	              };
	            }
	
	            return {
	              v: keys.indexOf(category) > -1
	            };
	          }();
	
	          if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	        }
	    }
	
	    /**
	     * Toggles the filtered and concealed class names.
	     * @param {jQuery} $filtered Filtered set.
	     * @param {jQuery} $concealed Concealed set.
	     * @private
	     */
	
	  }, {
	    key: '_toggleFilterClasses',
	    value: function _toggleFilterClasses(_ref) {
	      var filtered = _ref.filtered;
	      var concealed = _ref.concealed;
	
	      filtered.forEach(function (item) {
	        item.reveal();
	      });
	
	      concealed.forEach(function (item) {
	        item.conceal();
	      });
	    }
	
	    /**
	     * Set the initial css for each item
	     * @param {Array.<ShuffleItem>} [items] Optionally specifiy at set to initialize.
	     */
	
	  }, {
	    key: '_initItems',
	    value: function _initItems() {
	      var items = arguments.length <= 0 || arguments[0] === undefined ? this.items : arguments[0];
	
	      items.forEach(function (item) {
	        item.init();
	      });
	    }
	
	    /**
	     * Updates the filtered item count.
	     * @private
	     */
	
	  }, {
	    key: '_updateItemCount',
	    value: function _updateItemCount() {
	      this.visibleItems = this._getFilteredItems().length;
	    }
	
	    /**
	     * Sets css transform transition on a an element.
	     * @param {Element} element Element to set transition on.
	     * @private
	     */
	
	  }, {
	    key: '_setTransition',
	    value: function _setTransition(element) {
	      element.style.transition = 'transform ' + this.speed + 'ms ' + this.easing + ', opacity ' + this.speed + 'ms ' + this.easing;
	    }
	
	    /**
	     * Sets css transform transition on a group of elements.
	     * @param {ArrayLike.<Element>} $items Elements to set transitions on.
	     * @private
	     */
	
	  }, {
	    key: '_setTransitions',
	    value: function _setTransitions() {
	      var items = arguments.length <= 0 || arguments[0] === undefined ? this.items : arguments[0];
	
	      each(items, function (item) {
	        this._setTransition(item.element);
	      }, this);
	    }
	
	    /**
	     * Sets a transition delay on a collection of elements, making each delay
	     * greater than the last.
	     * @param {ArrayLike.<Element>} $collection Array to iterate over.
	     */
	
	  }, {
	    key: '_setSequentialDelay',
	    value: function _setSequentialDelay($collection) {
	      if (!this.supported) {
	        return;
	      }
	
	      // $collection can be an array of dom elements or jquery object
	      each($collection, function (el, i) {
	        // This works because the transition-property: transform, opacity;
	        el.style.transitionDelay = '0ms,' + (i + 1) * this.sequentialFadeDelay + 'ms';
	      }, this);
	    }
	  }, {
	    key: '_getItems',
	    value: function _getItems() {
	      var _this4 = this;
	
	      return toArray(this.element.children).filter(function (el) {
	        return (0, _matchesSelector2.default)(el, _this4.itemSelector);
	      }).map(function (el) {
	        return new _shuffleItem2.default(el);
	      });
	    }
	  }, {
	    key: '_getFilteredItems',
	    value: function _getFilteredItems() {
	      return this.items.filter(function (item) {
	        return item.isVisible;
	      });
	    }
	  }, {
	    key: '_getConcealedItems',
	    value: function _getConcealedItems() {
	      return this.items.filter(function (item) {
	        return !item.isVisible;
	      });
	    }
	
	    /**
	     * Returns the column size, based on column width and sizer options.
	     * @param {number} containerWidth Size of the parent container.
	     * @param {number} gutterSize Size of the gutters.
	     * @return {number}
	     * @private
	     */
	
	  }, {
	    key: '_getColumnSize',
	    value: function _getColumnSize(containerWidth, gutterSize) {
	      var size;
	
	      // If the columnWidth property is a function, then the grid is fluid
	      if (typeof this.columnWidth === 'function') {
	        size = this.columnWidth(containerWidth);
	
	        // columnWidth option isn't a function, are they using a sizing element?
	      } else if (this.useSizer) {
	          size = Shuffle._getOuterWidth(this.sizer);
	
	          // if not, how about the explicitly set option?
	        } else if (this.columnWidth) {
	            size = this.columnWidth;
	
	            // or use the size of the first item
	          } else if (this.items.length > 0) {
	              size = Shuffle._getOuterWidth(this.items[0], true);
	
	              // if there's no items, use size of container
	            } else {
	                size = containerWidth;
	              }
	
	      // Don't let them set a column width of zero.
	      if (size === 0) {
	        size = containerWidth;
	      }
	
	      return size + gutterSize;
	    }
	
	    /**
	     * Returns the gutter size, based on gutter width and sizer options.
	     * @param {number} containerWidth Size of the parent container.
	     * @return {number}
	     * @private
	     */
	
	  }, {
	    key: '_getGutterSize',
	    value: function _getGutterSize(containerWidth) {
	      var size;
	      if (typeof this.gutterWidth === 'function') {
	        size = this.gutterWidth(containerWidth);
	      } else if (this.useSizer) {
	        size = Shuffle._getNumberStyle(this.sizer, 'marginLeft');
	      } else {
	        size = this.gutterWidth;
	      }
	
	      return size;
	    }
	
	    /**
	     * Calculate the number of columns to be used. Gets css if using sizer element.
	     * @param {number} [theContainerWidth] Optionally specify a container width if
	     *    it's already available.
	     */
	
	  }, {
	    key: '_setColumns',
	    value: function _setColumns(theContainerWidth) {
	      var containerWidth = theContainerWidth || Shuffle._getOuterWidth(this.element);
	      var gutter = this._getGutterSize(containerWidth);
	      var columnWidth = this._getColumnSize(containerWidth, gutter);
	      var calculatedColumns = (containerWidth + gutter) / columnWidth;
	
	      // Widths given from getStyles are not precise enough...
	      if (Math.abs(Math.round(calculatedColumns) - calculatedColumns) < this.columnThreshold) {
	        // e.g. calculatedColumns = 11.998876
	        calculatedColumns = Math.round(calculatedColumns);
	      }
	
	      this.cols = Math.max(Math.floor(calculatedColumns), 1);
	      this.containerWidth = containerWidth;
	      this.colWidth = columnWidth;
	    }
	
	    /**
	     * Adjust the height of the grid
	     */
	
	  }, {
	    key: '_setContainerSize',
	    value: function _setContainerSize() {
	      this.element.style.height = this._getContainerSize() + 'px';
	    }
	
	    /**
	     * Based on the column heights, it returns the biggest one.
	     * @return {number}
	     * @private
	     */
	
	  }, {
	    key: '_getContainerSize',
	    value: function _getContainerSize() {
	      return arrayMax(this.positions);
	    }
	
	    /**
	     * Fire events with .shuffle namespace
	     * @return {boolean} Whether the event was prevented or not.
	     */
	
	  }, {
	    key: '_dispatch',
	    value: function _dispatch(name) {
	      var details = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	
	      details.shuffle = this;
	      return !this.element.dispatchEvent(new CustomEvent(name, {
	        bubbles: false,
	        cancelable: true,
	        detail: details
	      }));
	    }
	
	    /**
	     * Zeros out the y columns array, which is used to determine item placement.
	     * @private
	     */
	
	  }, {
	    key: '_resetCols',
	    value: function _resetCols() {
	      var i = this.cols;
	      this.positions = [];
	      while (i--) {
	        this.positions.push(0);
	      }
	    }
	
	    /**
	     * Loops through each item that should be shown and calculates the x, y position.
	     * @param {Array.<Element>} items Array of items that will be shown/layed out in
	     *     order in their array. Because jQuery collection are always ordered in DOM
	     *     order, we can't pass a jq collection.
	     * @param {boolean} [isOnlyPosition=false] If true this will position the items
	     *     with zero opacity.
	     */
	
	  }, {
	    key: '_layout',
	    value: function _layout(items, isOnlyPosition) {
	      each(items, function (item) {
	        this._layoutItem(item, !!isOnlyPosition);
	      }, this);
	
	      // `_layout` always happens after `_shrink`, so it's safe to process the style
	      // queue here with styles from the shrink method.
	      this._processStyleQueue();
	
	      // Adjust the height of the container.
	      this._setContainerSize();
	    }
	
	    /**
	     * Calculates the position of the item and pushes it onto the style queue.
	     * @param {ShuffleItem} item ShuffleItem which is being positioned.
	     * @param {boolean} isOnlyPosition Whether to position the item, but with zero
	     *     opacity so that it can fade in later.
	     * @private
	     */
	
	  }, {
	    key: '_layoutItem',
	    value: function _layoutItem(item, isOnlyPosition) {
	      var currPos = item.point;
	      var currScale = item.scale;
	      var itemSize = {
	        width: Shuffle._getOuterWidth(item.element, true),
	        height: Shuffle._getOuterHeight(item.element, true)
	      };
	      var pos = this._getItemPosition(itemSize);
	
	      // If the item will not change its position, do not add it to the render
	      // queue. Transitions don't fire when setting a property to the same value.
	      if (_point2.default.equals(currPos, pos) && currScale === DEFAULT_SCALE) {
	        return;
	      }
	
	      // Save data for shrink
	      item.point = pos;
	      item.scale = DEFAULT_SCALE;
	
	      this.styleQueue.push({
	        $item: window.jQuery(item.element),
	        point: pos,
	        scale: DEFAULT_SCALE,
	        opacity: isOnlyPosition ? 0 : 1,
	
	        // Set styles immediately if there is no transition speed.
	        skipTransition: isOnlyPosition || this.speed === 0,
	        callfront: function callfront() {
	          if (!isOnlyPosition) {
	            item.element.style.visibility = 'visible';
	          }
	        },
	
	        callback: function callback() {
	          if (isOnlyPosition) {
	            item.element.style.visibility = 'hidden';
	          }
	        }
	      });
	    }
	
	    /**
	     * Determine the location of the next item, based on its size.
	     * @param {{width: number, height: number}} itemSize Object with width and height.
	     * @return {Point}
	     * @private
	     */
	
	  }, {
	    key: '_getItemPosition',
	    value: function _getItemPosition(itemSize) {
	      var columnSpan = this._getColumnSpan(itemSize.width, this.colWidth, this.cols);
	
	      var setY = this._getColumnSet(columnSpan, this.cols);
	
	      // Finds the index of the smallest number in the set.
	      var shortColumnIndex = this._getShortColumn(setY, this.buffer);
	
	      // Position the item
	      var point = new _point2.default(Math.round(this.colWidth * shortColumnIndex), Math.round(setY[shortColumnIndex]));
	
	      // Update the columns array with the new values for each column.
	      // e.g. before the update the columns could be [250, 0, 0, 0] for an item
	      // which spans 2 columns. After it would be [250, itemHeight, itemHeight, 0].
	      var setHeight = setY[shortColumnIndex] + itemSize.height;
	      var setSpan = this.cols + 1 - setY.length;
	      for (var i = 0; i < setSpan; i++) {
	        this.positions[shortColumnIndex + i] = setHeight;
	      }
	
	      return point;
	    }
	
	    /**
	     * Determine the number of columns an items spans.
	     * @param {number} itemWidth Width of the item.
	     * @param {number} columnWidth Width of the column (includes gutter).
	     * @param {number} columns Total number of columns
	     * @return {number}
	     * @private
	     */
	
	  }, {
	    key: '_getColumnSpan',
	    value: function _getColumnSpan(itemWidth, columnWidth, columns) {
	      var columnSpan = itemWidth / columnWidth;
	
	      // If the difference between the rounded column span number and the
	      // calculated column span number is really small, round the number to
	      // make it fit.
	      if (Math.abs(Math.round(columnSpan) - columnSpan) < this.columnThreshold) {
	        // e.g. columnSpan = 4.0089945390298745
	        columnSpan = Math.round(columnSpan);
	      }
	
	      // Ensure the column span is not more than the amount of columns in the whole layout.
	      return Math.min(Math.ceil(columnSpan), columns);
	    }
	
	    /**
	     * Retrieves the column set to use for placement.
	     * @param {number} columnSpan The number of columns this current item spans.
	     * @param {number} columns The total columns in the grid.
	     * @return {Array.<number>} An array of numbers represeting the column set.
	     * @private
	     */
	
	  }, {
	    key: '_getColumnSet',
	    value: function _getColumnSet(columnSpan, columns) {
	      // The item spans only one column.
	      if (columnSpan === 1) {
	        return this.positions;
	
	        // The item spans more than one column, figure out how many different
	        // places it could fit horizontally.
	        // The group count is the number of places within the positions this block
	        // could fit, ignoring the current positions of items.
	        // Imagine a 2 column brick as the second item in a 4 column grid with
	        // 10px height each. Find the places it would fit:
	        // [10, 0, 0, 0]
	        //  |   |  |
	        //  *   *  *
	        //
	        // Then take the places which fit and get the bigger of the two:
	        // max([10, 0]), max([0, 0]), max([0, 0]) = [10, 0, 0]
	        //
	        // Next, find the first smallest number (the short column).
	        // [10, 0, 0]
	        //      |
	        //      *
	        //
	        // And that's where it should be placed!
	      } else {
	          var groupCount = columns + 1 - columnSpan;
	          var groupY = [];
	
	          // For how many possible positions for this item there are.
	          for (var i = 0; i < groupCount; i++) {
	            // Find the bigger value for each place it could fit.
	            groupY[i] = arrayMax(this.positions.slice(i, i + columnSpan));
	          }
	
	          return groupY;
	        }
	    }
	
	    /**
	     * Find index of short column, the first from the left where this item will go.
	     *
	     * @param {Array.<number>} positions The array to search for the smallest number.
	     * @param {number} buffer Optional buffer which is very useful when the height
	     *     is a percentage of the width.
	     * @return {number} Index of the short column.
	     * @private
	     */
	
	  }, {
	    key: '_getShortColumn',
	    value: function _getShortColumn(positions, buffer) {
	      var minPosition = arrayMin(positions);
	      for (var i = 0, len = positions.length; i < len; i++) {
	        if (positions[i] >= minPosition - buffer && positions[i] <= minPosition + buffer) {
	          return i;
	        }
	      }
	
	      return 0;
	    }
	
	    /**
	     * Hides the elements that don't match our filter.
	     * @param {jQuery} $collection jQuery collection to shrink.
	     * @private
	     */
	
	  }, {
	    key: '_shrink',
	    value: function _shrink(collection) {
	      var _this5 = this;
	
	      collection = collection || this._getConcealedItems();
	
	      collection.forEach(function (item) {
	        // Continuing would add a transitionend event listener to the element, but
	        // that listener would not execute because the transform and opacity would
	        // stay the same.
	        if (item.scale === CONCEALED_SCALE) {
	          return;
	        }
	
	        item.scale = CONCEALED_SCALE;
	
	        _this5.styleQueue.push({
	          $item: window.jQuery(item.element),
	          point: item.point,
	          scale: CONCEALED_SCALE,
	          opacity: 0,
	          callback: function callback() {
	            item.element.style.visibility = 'hidden';
	          }
	        });
	      });
	    }
	
	    /**
	     * Resize handler.
	     * @private
	     */
	
	  }, {
	    key: '_handleResize',
	    value: function _handleResize() {
	      // If shuffle is disabled, destroyed, don't do anything
	      if (!this.enabled || this.destroyed) {
	        return;
	      }
	
	      // Will need to check height in the future if it's layed out horizontaly
	      var containerWidth = Shuffle._getOuterWidth(this.element);
	
	      // containerWidth hasn't changed, don't do anything
	      if (containerWidth === this.containerWidth) {
	        return;
	      }
	
	      this.update();
	    }
	
	    /**
	     * Returns styles for either jQuery animate or transition.
	     * @param {Object} opts Transition options.
	     * @return {!Object} Transforms for transitions, left/top for animate.
	     * @private
	     */
	
	  }, {
	    key: '_getStylesForTransition',
	    value: function _getStylesForTransition(opts) {
	      var styles = {
	        opacity: opts.opacity
	      };
	
	      if (this.supported) {
	        styles.transform = Shuffle._getItemTransformString(opts.point, opts.scale);
	      } else {
	        styles.left = opts.point.x;
	        styles.top = opts.point.y;
	      }
	
	      return styles;
	    }
	
	    /**
	     * Transitions an item in the grid
	     *
	     * @param {Object} opts options.
	     * @param {jQuery} opts.$item jQuery object representing the current item.
	     * @param {Point} opts.point A point object with the x and y coordinates.
	     * @param {number} opts.scale Amount to scale the item.
	     * @param {number} opts.opacity Opacity of the item.
	     * @param {Function} opts.callback Complete function for the animation.
	     * @param {Function} opts.callfront Function to call before transitioning.
	     * @private
	     */
	
	  }, {
	    key: '_transition',
	    value: function _transition(opts) {
	      var styles = this._getStylesForTransition(opts);
	      this._startItemAnimation(opts.$item, styles, opts.callfront || window.jQuery.noop, opts.callback || window.jQuery.noop);
	    }
	  }, {
	    key: '_startItemAnimation',
	    value: function _startItemAnimation($item, styles, callfront, callback) {
	      var _this = this;
	
	      // Transition end handler removes its listener.
	      function handleTransitionEnd(evt) {
	        // Make sure this event handler has not bubbled up from a child.
	        if (evt.target === evt.currentTarget) {
	          window.jQuery(evt.target).off('transitionend', handleTransitionEnd);
	          _this._removeTransitionReference(reference);
	          callback();
	        }
	      }
	
	      var reference = {
	        $element: $item,
	        handler: handleTransitionEnd
	      };
	
	      callfront();
	
	      // Transitions are not set until shuffle has loaded to avoid the initial transition.
	      if (!this.initialized) {
	        $item.css(styles);
	        callback();
	        return;
	      }
	
	      // Use CSS Transforms if we have them
	      if (this.supported) {
	        $item.css(styles);
	        $item.on('transitionend', handleTransitionEnd);
	        this._transitions.push(reference);
	
	        // Use jQuery to animate left/top
	      } else {
	          // Save the deferred object which jQuery returns.
	          var anim = $item.stop(true).animate(styles, this.speed, 'swing', callback);
	
	          // Push the animation to the list of pending animations.
	          this._animations.push(anim.promise());
	        }
	    }
	
	    /**
	     * Execute the styles gathered in the style queue. This applies styles to elements,
	     * triggering transitions.
	     * @param {boolean} noLayout Whether to trigger a layout event.
	     * @private
	     */
	
	  }, {
	    key: '_processStyleQueue',
	    value: function _processStyleQueue(noLayout) {
	      if (this.isTransitioning) {
	        this._cancelMovement();
	      }
	
	      var $transitions = window.jQuery();
	
	      // Iterate over the queue and keep track of ones that use transitions.
	      each(this.styleQueue, function (transitionObj) {
	        if (transitionObj.skipTransition) {
	          this._styleImmediately(transitionObj);
	        } else {
	          $transitions = $transitions.add(transitionObj.$item);
	          this._transition(transitionObj);
	        }
	      }, this);
	
	      if ($transitions.length > 0 && this.initialized && this.speed > 0) {
	        // Set flag that shuffle is currently in motion.
	        this.isTransitioning = true;
	
	        if (this.supported) {
	          this._whenCollectionDone($transitions, 'transitionend', this._movementFinished);
	
	          // The _transition function appends a promise to the animations array.
	          // When they're all complete, do things.
	        } else {
	            this._whenAnimationsDone(this._movementFinished);
	          }
	
	        // A call to layout happened, but none of the newly filtered items will
	        // change position. Asynchronously fire the callback here.
	      } else if (!noLayout) {
	          defer(this._layoutEnd, this);
	        }
	
	      // Remove everything in the style queue
	      this.styleQueue.length = 0;
	    }
	  }, {
	    key: '_cancelMovement',
	    value: function _cancelMovement() {
	      if (this.supported) {
	        // Remove the transition end event for each listener.
	        each(this._transitions, function (transition) {
	          transition.$element.off('transitionend', transition.handler);
	        });
	      } else {
	        // Even when `stop` is called on the jQuery animation, its promise will
	        // still be resolved. Since it cannot be determine from within that callback
	        // whether the animation was stopped or not, a flag is set here to distinguish
	        // between the two states.
	        this._isMovementCanceled = true;
	        this.items.stop(true);
	        this._isMovementCanceled = false;
	      }
	
	      // Reset the array.
	      this._transitions.length = 0;
	
	      // Show it's no longer active.
	      this.isTransitioning = false;
	    }
	  }, {
	    key: '_removeTransitionReference',
	    value: function _removeTransitionReference(ref) {
	      var indexInArray = window.jQuery.inArray(ref, this._transitions);
	      if (indexInArray > -1) {
	        this._transitions.splice(indexInArray, 1);
	      }
	    }
	
	    /**
	     * Apply styles without a transition.
	     * @param {Object} opts Transitions options object.
	     * @private
	     */
	
	  }, {
	    key: '_styleImmediately',
	    value: function _styleImmediately(opts) {
	      Shuffle._skipTransition(opts.$item[0], function () {
	        opts.$item.css(this._getStylesForTransition(opts));
	      }, this);
	    }
	  }, {
	    key: '_movementFinished',
	    value: function _movementFinished() {
	      this.isTransitioning = false;
	      this._layoutEnd();
	    }
	  }, {
	    key: '_layoutEnd',
	    value: function _layoutEnd() {
	      this._dispatch(Shuffle.EventType.LAYOUT);
	    }
	  }, {
	    key: '_addItems',
	    value: function _addItems($newItems, addToEnd, isSequential) {
	      // Add classes and set initial positions.
	      this._initItems($newItems);
	
	      // Add transition to each item.
	      this._setTransitions($newItems);
	
	      // Update the list of
	      this.items = this._getItems();
	
	      // Shrink all items (without transitions).
	      this._shrink($newItems);
	      each(this.styleQueue, function (transitionObj) {
	        transitionObj.skipTransition = true;
	      });
	
	      // Apply shrink positions, but do not cause a layout event.
	      this._processStyleQueue(true);
	
	      if (addToEnd) {
	        this._addItemsToEnd($newItems, isSequential);
	      } else {
	        this.shuffle(this.lastFilter);
	      }
	    }
	  }, {
	    key: '_addItemsToEnd',
	    value: function _addItemsToEnd($newItems, isSequential) {
	      // Get ones that passed the current filter
	      var $passed = this._filter(null, $newItems);
	      var passed = $passed.get();
	
	      // How many filtered elements?
	      this._updateItemCount();
	
	      this._layout(passed, true);
	
	      if (isSequential && this.supported) {
	        this._setSequentialDelay(passed);
	      }
	
	      this._revealAppended(passed);
	    }
	
	    /**
	     * Triggers appended elements to fade in.
	     * @param {ArrayLike.<Element>} $newFilteredItems Collection of elements.
	     * @private
	     */
	
	  }, {
	    key: '_revealAppended',
	    value: function _revealAppended(newFilteredItems) {
	      defer(function () {
	        each(newFilteredItems, function (el) {
	          var $item = window.jQuery(el);
	          this._transition({
	            $item: $item,
	            opacity: 1,
	            point: $item.data('point'),
	            scale: DEFAULT_SCALE
	          });
	        }, this);
	
	        this._whenCollectionDone(window.jQuery(newFilteredItems), 'transitionend', function () {
	          window.jQuery(newFilteredItems).css('transitionDelay', '0ms');
	          this._movementFinished();
	        });
	      }, this, this.revealAppendedDelay);
	    }
	
	    /**
	     * Execute a function when an event has been triggered for every item in a collection.
	     * @param {jQuery} $collection Collection of elements.
	     * @param {string} eventName Event to listen for.
	     * @param {Function} callback Callback to execute when they're done.
	     * @private
	     */
	
	  }, {
	    key: '_whenCollectionDone',
	    value: function _whenCollectionDone($collection, eventName, callback) {
	      var done = 0;
	      var items = $collection.length;
	      var _this = this;
	
	      function handleEventName(evt) {
	        if (evt.target === evt.currentTarget) {
	          window.jQuery(evt.target).off(eventName, handleEventName);
	          done++;
	
	          // Execute callback if all items have emitted the correct event.
	          if (done === items) {
	            _this._removeTransitionReference(reference);
	            callback.call(_this);
	          }
	        }
	      }
	
	      var reference = {
	        $element: $collection,
	        handler: handleEventName
	      };
	
	      // Bind the event to all items.
	      $collection.on(eventName, handleEventName);
	
	      // Keep track of transitionend events so they can be removed.
	      this._transitions.push(reference);
	    }
	
	    /**
	     * Execute a callback after jQuery `animate` for a collection has finished.
	     * @param {Function} callback Callback to execute when they're done.
	     * @private
	     */
	
	  }, {
	    key: '_whenAnimationsDone',
	    value: function _whenAnimationsDone(callback) {
	      window.jQuery.when.apply(null, this._animations).always(window.jQuery.proxy(function () {
	        this._animations.length = 0;
	        if (!this._isMovementCanceled) {
	          callback.call(this);
	        }
	      }, this));
	    }
	
	    /**
	     * The magic. This is what makes the plugin 'shuffle'
	     * @param {string|Function} [category] Category to filter by. Can be a function
	     * @param {Object} [sortObj] A sort object which can sort the filtered set
	     */
	
	  }, {
	    key: 'shuffle',
	    value: function shuffle(category, sortObj) {
	      if (!this.enabled) {
	        return;
	      }
	
	      if (!category) {
	        category = ALL_ITEMS;
	      }
	
	      this._filter(category);
	
	      // How many filtered elements?
	      this._updateItemCount();
	
	      // Shrink each concealed item
	      this._shrink();
	
	      // Update transforms on .filtered elements so they will animate to their new positions
	      this.sort(sortObj);
	    }
	
	    /**
	     * Gets the .filtered elements, sorts them, and passes them to layout.
	     * @param {Object} opts the options object for the sorted plugin
	     */
	
	  }, {
	    key: 'sort',
	    value: function sort(opts) {
	      if (this.enabled) {
	        this._resetCols();
	
	        var sortOptions = opts || this.lastSort;
	        var items = this._getFilteredItems();
	        items = (0, _sorter2.default)(items, sortOptions);
	
	        this._layout(items);
	
	        this.lastSort = sortOptions;
	      }
	    }
	
	    /**
	     * Reposition everything.
	     * @param {boolean} isOnlyLayout If true, column and gutter widths won't be
	     *     recalculated.
	     */
	
	  }, {
	    key: 'update',
	    value: function update(isOnlyLayout) {
	      if (this.enabled) {
	
	        if (!isOnlyLayout) {
	          // Get updated colCount
	          this._setColumns();
	        }
	
	        // Layout items
	        this.sort();
	      }
	    }
	
	    /**
	     * Use this instead of `update()` if you don't need the columns and gutters updated
	     * Maybe an image inside `shuffle` loaded (and now has a height), which means calculations
	     * could be off.
	     */
	
	  }, {
	    key: 'layout',
	    value: function layout() {
	      this.update(true);
	    }
	
	    /**
	     * New items have been appended to shuffle. Fade them in sequentially
	     * @param {jQuery} $newItems jQuery collection of new items
	     * @param {boolean} [addToEnd=false] If true, new items will be added to the end / bottom
	     *     of the items. If not true, items will be mixed in with the current sort order.
	     * @param {boolean} [isSequential=true] If false, new items won't sequentially fade in
	     */
	
	  }, {
	    key: 'appended',
	    value: function appended($newItems, addToEnd, isSequential) {
	      this._addItems($newItems, addToEnd === true, isSequential !== false);
	    }
	
	    /**
	     * Disables shuffle from updating dimensions and layout on resize
	     */
	
	  }, {
	    key: 'disable',
	    value: function disable() {
	      this.enabled = false;
	    }
	
	    /**
	     * Enables shuffle again
	     * @param {boolean} [isUpdateLayout=true] if undefined, shuffle will update columns and gutters
	     */
	
	  }, {
	    key: 'enable',
	    value: function enable(isUpdateLayout) {
	      this.enabled = true;
	      if (isUpdateLayout !== false) {
	        this.update();
	      }
	    }
	
	    /**
	     * Remove 1 or more shuffle items
	     * @param {jQuery} $collection A jQuery object containing one or more element in shuffle
	     * @return {Shuffle} The shuffle object
	     */
	
	  }, {
	    key: 'remove',
	    value: function remove($collection) {
	
	      // If this isn't a jquery object, exit
	      if (!$collection.length || !$collection.jquery) {
	        return;
	      }
	
	      function handleRemoved() {
	        // Remove the collection in the callback
	        $collection.remove();
	
	        // Update things now that elements have been removed.
	        this.items = this._getItems();
	        this._updateItemCount();
	
	        this._dispatch(Shuffle.EventType.REMOVED, $collection);
	
	        // Let it get garbage collected
	        $collection = null;
	      }
	
	      // Hide collection first.
	      this._toggleFilterClasses(window.jQuery(), $collection);
	      this._shrink($collection);
	
	      this.sort();
	
	      this.$el.one(Shuffle.EventType.LAYOUT + '.' + SHUFFLE, window.jQuery.proxy(handleRemoved, this));
	    }
	
	    /**
	     * Destroys shuffle, removes events, styles, and classes
	     */
	
	  }, {
	    key: 'destroy',
	    value: function destroy() {
	      window.removeEventListener('resize', this._onResize);
	
	      // Reset container styles
	      this.$el.removeClass(SHUFFLE).removeAttr('style').removeData(SHUFFLE);
	
	      // Reset individual item styles
	      this.items.removeAttr('style').removeData('point').removeData('scale').removeClass([Shuffle.ClassName.CONCEALED, Shuffle.ClassName.FILTERED, Shuffle.ClassName.SHUFFLE_ITEM].join(' '));
	
	      // Null DOM references
	      this.items = null;
	      this.$el = null;
	      this.sizer = null;
	      this.element = null;
	      this._transitions = null;
	
	      // Set a flag so if a debounced resize has been triggered,
	      // it can first check if it is actually destroyed and not doing anything
	      this.destroyed = true;
	    }
	  }]);
	
	  return Shuffle;
	}();
	
	/**
	 * Events the container element emits with the .shuffle namespace.
	 * For example, "done.shuffle".
	 * @enum {string}
	 */
	
	
	Shuffle.EventType = {
	  LOADING: 'loading',
	  DONE: 'done',
	  LAYOUT: 'layout',
	  REMOVED: 'removed'
	};
	
	/** @enum {string} */
	Shuffle.ClassName = _classes2.default;
	
	// Overrideable options
	Shuffle.options = {
	  group: ALL_ITEMS, // Initial filter group.
	  speed: 250, // Transition/animation speed (milliseconds).
	  easing: 'ease-out', // CSS easing function to use.
	  itemSelector: '', // e.g. '.picture-item'.
	  sizer: null, // Sizer element. Use an element to determine the size of columns and gutters.
	  gutterWidth: 0, // A static number or function that tells the plugin how wide the gutters between columns are (in pixels).
	  columnWidth: 0, // A static number or function that returns a number which tells the plugin how wide the columns are (in pixels).
	  delimeter: null, // If your group is not json, and is comma delimeted, you could set delimeter to ','.
	  buffer: 0, // Useful for percentage based heights when they might not always be exactly the same (in pixels).
	  columnThreshold: 0.01, // Reading the width of elements isn't precise enough and can cause columns to jump between values.
	  initialSort: null, // Shuffle can be initialized with a sort object. It is the same object given to the sort method.
	  throttle: throttle, // By default, shuffle will throttle resize events. This can be changed or removed.
	  throttleTime: 300, // How often shuffle can be called on resize (in milliseconds).
	  sequentialFadeDelay: 150, // Delay between each item that fades in when adding items.
	  supported: true };
	
	// Not overrideable
	// Whether to use transforms or absolute positioning.
	Shuffle.settings = {
	  useSizer: false,
	  revealAppendedDelay: 300,
	  lastSort: {},
	  lastFilter: ALL_ITEMS,
	  enabled: true,
	  destroyed: false,
	  initialized: false,
	  _animations: [],
	  _transitions: [],
	  _isMovementCanceled: false,
	  styleQueue: []
	};
	
	// Expose for testing.
	Shuffle.Point = _point2.default;
	Shuffle.ShuffleItem = _shuffleItem2.default;
	Shuffle.sorter = _sorter2.default;
	
	/**
	 * Static methods.
	 */
	
	/**
	 * If the browser has 3d transforms available, build a string with those,
	 * otherwise use 2d transforms.
	 * @param {Point} point X and Y positions.
	 * @param {number} scale Scale amount.
	 * @return {string} A normalized string which can be used with the transform style.
	 * @private
	 */
	Shuffle._getItemTransformString = function (point, scale) {
	  return 'translate(' + point.x + 'px, ' + point.y + 'px) scale(' + scale + ')';
	};
	
	/**
	 * Retrieve the computed style for an element, parsed as a float.
	 * @param {Element} element Element to get style for.
	 * @param {string} style Style property.
	 * @param {CSSStyleDeclaration} [styles] Optionally include clean styles to
	 *     use instead of asking for them again.
	 * @return {number} The parsed computed value or zero if that fails because IE
	 *     will return 'auto' when the element doesn't have margins instead of
	 *     the computed style.
	 * @private
	 */
	Shuffle._getNumberStyle = function (element, style, styles) {
	  styles = styles || getStyles(element, null);
	  var value = Shuffle._getFloat(styles[style]);
	
	  // Support IE<=11 and W3C spec.
	  if (!COMPUTED_SIZE_INCLUDES_PADDING && style === 'width') {
	    value += Shuffle._getFloat(styles.paddingLeft) + Shuffle._getFloat(styles.paddingRight) + Shuffle._getFloat(styles.borderLeftWidth) + Shuffle._getFloat(styles.borderRightWidth);
	  } else if (!COMPUTED_SIZE_INCLUDES_PADDING && style === 'height') {
	    value += Shuffle._getFloat(styles.paddingTop) + Shuffle._getFloat(styles.paddingBottom) + Shuffle._getFloat(styles.borderTopWidth) + Shuffle._getFloat(styles.borderBottomWidth);
	  }
	
	  return value;
	};
	
	/**
	 * Parse a string as an float.
	 * @param {string} value String float.
	 * @return {number} The string as an float or zero.
	 * @private
	 */
	Shuffle._getFloat = function (value) {
	  return (0, _getNumber2.default)(parseFloat(value));
	};
	
	/**
	 * Returns the outer width of an element, optionally including its margins.
	 *
	 * There are a few different methods for getting the width of an element, none of
	 * which work perfectly for all Shuffle's use cases.
	 *
	 * 1. getBoundingClientRect() `left` and `right` properties.
	 *   - Accounts for transform scaled elements, making it useless for Shuffle
	 *   elements which have shrunk.
	 * 2. The `offsetWidth` property (or jQuery's CSS).
	 *   - This value stays the same regardless of the elements transform property,
	 *   however, it does not return subpixel values.
	 * 3. getComputedStyle()
	 *   - This works great Chrome, Firefox, Safari, but IE<=11 does not include
	 *   padding and border when box-sizing: border-box is set, requiring a feature
	 *   test and extra work to add the padding back for IE and other browsers which
	 *   follow the W3C spec here.
	 *
	 * @param {Element} element The element.
	 * @param {boolean} [includeMargins] Whether to include margins. Default is false.
	 * @return {number} The width.
	 */
	Shuffle._getOuterWidth = function (element, includeMargins) {
	  // Store the styles so that they can be used by others without asking for it again.
	  var styles = getStyles(element, null);
	  var width = Shuffle._getNumberStyle(element, 'width', styles);
	
	  // Use jQuery here because it uses getComputedStyle internally and is
	  // cross-browser. Using the style property of the element will only work
	  // if there are inline styles.
	  if (includeMargins) {
	    var marginLeft = Shuffle._getNumberStyle(element, 'marginLeft', styles);
	    var marginRight = Shuffle._getNumberStyle(element, 'marginRight', styles);
	    width += marginLeft + marginRight;
	  }
	
	  return width;
	};
	
	/**
	 * Returns the outer height of an element, optionally including its margins.
	 * @param {Element} element The element.
	 * @param {boolean} [includeMargins] Whether to include margins. Default is false.
	 * @return {number} The height.
	 */
	Shuffle._getOuterHeight = function (element, includeMargins) {
	  var styles = getStyles(element, null);
	  var height = Shuffle._getNumberStyle(element, 'height', styles);
	
	  if (includeMargins) {
	    var marginTop = Shuffle._getNumberStyle(element, 'marginTop', styles);
	    var marginBottom = Shuffle._getNumberStyle(element, 'marginBottom', styles);
	    height += marginTop + marginBottom;
	  }
	
	  return height;
	};
	
	/**
	 * Change a property or execute a function which will not have a transition
	 * @param {Element} element DOM element that won't be transitioned
	 * @param {Function} callback A function which will be called while transition
	 *     is set to 0ms.
	 * @param {Object} [context] Optional context for the callback function.
	 * @private
	 */
	Shuffle._skipTransition = function (element, callback, context) {
	  var duration = element.style.transitionDuration;
	
	  // Set the duration to zero so it happens immediately
	  element.style.transitionDuration = '0ms';
	
	  callback.call(context);
	
	  // Force reflow
	  var reflow = element.offsetWidth;
	
	  // Avoid jshint warnings: unused variables and expressions.
	  reflow = null;
	
	  // Put the duration back
	  element.style.transitionDuration = duration;
	};
	
	module.exports = Shuffle;

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	var proto = Element.prototype;
	var vendor = proto.matches
	  || proto.matchesSelector
	  || proto.webkitMatchesSelector
	  || proto.mozMatchesSelector
	  || proto.msMatchesSelector
	  || proto.oMatchesSelector;
	
	module.exports = match;
	
	/**
	 * Match `el` to `selector`.
	 *
	 * @param {Element} el
	 * @param {String} selector
	 * @return {Boolean}
	 * @api public
	 */
	
	function match(el, selector) {
	  if (vendor) return vendor.call(el, selector);
	  var nodes = el.parentNode.querySelectorAll(selector);
	  for (var i = 0; i < nodes.length; i++) {
	    if (nodes[i] == el) return true;
	  }
	  return false;
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _getNumber = __webpack_require__(3);
	
	var _getNumber2 = _interopRequireDefault(_getNumber);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Represents a coordinate pair.
	 * @param {number} [x=0] X.
	 * @param {number} [y=0] Y.
	 */
	var Point = function Point(x, y) {
	  this.x = (0, _getNumber2.default)(x);
	  this.y = (0, _getNumber2.default)(y);
	};
	
	/**
	 * Whether two points are equal.
	 * @param {Point} a Point A.
	 * @param {Point} b Point B.
	 * @return {boolean}
	 */
	Point.equals = function (a, b) {
	  return a.x === b.x && a.y === b.y;
	};
	
	exports.default = Point;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Always returns a numeric value, given a value. Logic from jQuery's `isNumeric`.
	 * @param {*} value Possibly numeric value.
	 * @return {number} `value` or zero if `value` isn't numeric.
	 * @private
	 */
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = getNumber;
	function getNumber(value) {
	  var str = value && value.toString();
	  var val = parseFloat(str);
	  if (val + 1 >= 0) {
	    return value;
	  }
	
	  return 0;
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _point = __webpack_require__(2);
	
	var _point2 = _interopRequireDefault(_point);
	
	var _classes = __webpack_require__(5);
	
	var _classes2 = _interopRequireDefault(_classes);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var ShuffleItem = function () {
	  function ShuffleItem(element) {
	    _classCallCheck(this, ShuffleItem);
	
	    this.element = element;
	    this.isVisible = true;
	  }
	
	  _createClass(ShuffleItem, [{
	    key: 'reveal',
	    value: function reveal() {
	      this.isVisible = true;
	      this.element.classList.remove(_classes2.default.CONCEALED);
	      this.element.classList.add(_classes2.default.FILTERED);
	    }
	  }, {
	    key: 'conceal',
	    value: function conceal() {
	      this.isVisible = false;
	      this.element.classList.remove(_classes2.default.FILTERED);
	      this.element.classList.add(_classes2.default.CONCEALED);
	    }
	  }, {
	    key: 'init',
	    value: function init() {
	      this.addClasses([_classes2.default.SHUFFLE_ITEM, _classes2.default.FILTERED]);
	      this._applyCss(ShuffleItem.css);
	      this.scale = ShuffleItem.Scale.VISIBLE;
	      this.point = new _point2.default();
	    }
	  }, {
	    key: 'addClasses',
	    value: function addClasses(classes) {
	      var _this = this;
	
	      classes.forEach(function (className) {
	        _this.element.classList.add(className);
	      });
	    }
	  }, {
	    key: '_applyCss',
	    value: function _applyCss(obj) {
	      var _this2 = this;
	
	      Object.keys(obj).forEach(function (key) {
	        _this2.element.style[key] = obj[key];
	      });
	    }
	  }]);
	
	  return ShuffleItem;
	}();
	
	ShuffleItem.css = {
	  position: 'absolute',
	  top: 0,
	  left: 0,
	  visibility: 'visible',
	  'will-change': 'transform'
	};
	
	ShuffleItem.Scale = {
	  VISIBLE: 1,
	  FILTERED: 0.001
	};
	
	exports.default = ShuffleItem;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = {
	  BASE: 'shuffle',
	  SHUFFLE_ITEM: 'shuffle-item',
	  FILTERED: 'filtered',
	  CONCEALED: 'concealed'
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';
	
	// http://stackoverflow.com/a/962890/373422
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = sorter;
	function randomize(array) {
	  var tmp;
	  var current;
	  var top = array.length;
	
	  if (!top) {
	    return array;
	  }
	
	  while (--top) {
	    current = Math.floor(Math.random() * (top + 1));
	    tmp = array[current];
	    array[current] = array[top];
	    array[top] = tmp;
	  }
	
	  return array;
	}
	
	var defaults = {
	  // Use array.reverse() to reverse the results
	  reverse: false,
	
	  // Sorting function
	  by: null,
	
	  // If true, this will skip the sorting and return a randomized order in the array
	  randomize: false
	};
	
	// You can return `undefined` from the `by` function to revert to DOM order.
	function sorter(arr, options) {
	  var opts = Object.assign({}, defaults, options);
	  var original = Array.from(arr);
	  var revert = false;
	
	  if (!arr.length) {
	    return [];
	  }
	
	  if (opts.randomize) {
	    return randomize(arr);
	  }
	
	  // Sort the elements by the opts.by function.
	  // If we don't have opts.by, default to DOM order
	  if (typeof options.by === 'function') {
	    arr.sort(function (a, b) {
	
	      // Exit early if we already know we want to revert
	      if (revert) {
	        return 0;
	      }
	
	      var valA = opts.by(a);
	      var valB = opts.by(b);
	
	      // If both values are undefined, use the DOM order
	      if (valA === undefined && valB === undefined) {
	        revert = true;
	        return 0;
	      }
	
	      if (valA < valB || valA === 'sortFirst' || valB === 'sortLast') {
	        return -1;
	      }
	
	      if (valA > valB || valA === 'sortLast' || valB === 'sortFirst') {
	        return 1;
	      }
	
	      return 0;
	    });
	  }
	
	  // Revert to the original array if necessary
	  if (revert) {
	    return original;
	  }
	
	  if (opts.reverse) {
	    arr.reverse();
	  }
	
	  return arr;
	}

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';
	
	(function () {
	  'use strict';
	
	  if (typeof window.CustomEvent === 'function') {
	    return false;
	  }
	
	  function CustomEvent(event, params) {
	    params = params || { bubbles: false, cancelable: false, detail: undefined };
	    var evt = document.createEvent('CustomEvent');
	    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
	    return evt;
	  }
	
	  CustomEvent.prototype = window.Event.prototype;
	
	  window.CustomEvent = CustomEvent;
	})();

/***/ }
/******/ ])
});
;
//# sourceMappingURL=shuffle.js.map