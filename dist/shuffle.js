(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["shuffle"] = factory();
	else
		root["shuffle"] = factory();
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
	
	var _throttle = __webpack_require__(2);
	
	var _throttle2 = _interopRequireDefault(_throttle);
	
	var _point = __webpack_require__(3);
	
	var _point2 = _interopRequireDefault(_point);
	
	var _shuffleItem = __webpack_require__(5);
	
	var _shuffleItem2 = _interopRequireDefault(_shuffleItem);
	
	var _classes = __webpack_require__(6);
	
	var _classes2 = _interopRequireDefault(_classes);
	
	var _getNumberStyle = __webpack_require__(7);
	
	var _getNumberStyle2 = _interopRequireDefault(_getNumberStyle);
	
	var _sorter = __webpack_require__(9);
	
	var _sorter2 = _interopRequireDefault(_sorter);
	
	var _assign = __webpack_require__(10);
	
	var _assign2 = _interopRequireDefault(_assign);
	
	__webpack_require__(11);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function toArray(arrayLike) {
	  return Array.prototype.slice.call(arrayLike);
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
	
	function noop() {}
	
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
	
	    (0, _assign2.default)(this, Shuffle.options, options);
	
	    this.useSizer = false;
	    this.revealAppendedDelay = 300;
	    this.lastSort = {};
	    this.lastFilter = Shuffle.ALL_ITEMS;
	    this.isEnabled = true;
	    this.isDestroyed = false;
	    this.isInitialized = false;
	    this._transitions = [];
	    this._isMovementCanceled = false;
	    this._queue = [];
	
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
	      this.isInitialized = true;
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
	      var containerCss = window.getComputedStyle(this.element, null);
	      var containerWidth = Shuffle.getSize(this.element).width;
	
	      // Add styles to the container if it doesn't have them.
	      this._validateStyles(containerCss);
	
	      // We already got the container's width above, no need to cause another
	      // reflow getting it again... Calculate the number of columns there will be
	      this._setColumns(containerWidth);
	
	      // Kick off!
	      this.filter(this.group, this.initialSort);
	
	      // The shuffle items haven't had transitions set on them yet
	      // so the user doesn't see the first layout. Set them now that the first layout is done.
	      defer(function () {
	        this._setTransitions();
	        this.element.style.transition = 'height ' + this.speed + 'ms ' + this.easing;
	      }, this);
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
	
	      return set;
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
	      if (category === Shuffle.ALL_ITEMS) {
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
	            var attr = item.element.getAttribute('data-' + Shuffle.FILTER_ATTRIBUTE_KEY);
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
	     * Sets css transform transition on a group of elements.
	     * @param {ArrayLike.<Element>} $items Elements to set transitions on.
	     * @private
	     */
	
	  }, {
	    key: '_setTransitions',
	    value: function _setTransitions() {
	      var items = arguments.length <= 0 || arguments[0] === undefined ? this.items : arguments[0];
	
	      var speed = this.speed;
	      var easing = this.easing;
	
	      var str;
	      if (this.useTransforms) {
	        str = 'transform ' + speed + 'ms ' + easing + ', opacity ' + speed + 'ms ' + easing;
	      } else {
	        str = 'top ' + speed + 'ms ' + easing + ', left ' + speed + 'ms ' + easing + ', opacity ' + speed + 'ms ' + easing;
	      }
	
	      each(items, function (item) {
	        item.element.style.transition = str;
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
	
	      // $collection can be an array of dom elements or jquery object
	      // FIXME won't work for noTransforms
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
	          size = Shuffle.getSize(this.sizer).width;
	
	          // if not, how about the explicitly set option?
	        } else if (this.columnWidth) {
	            size = this.columnWidth;
	
	            // or use the size of the first item
	          } else if (this.items.length > 0) {
	              size = Shuffle.getSize(this.items[0].element, true).width;
	
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
	        size = (0, _getNumberStyle2.default)(this.sizer, 'marginLeft');
	      } else {
	        size = this.gutterWidth;
	      }
	
	      return size;
	    }
	
	    /**
	     * Calculate the number of columns to be used. Gets css if using sizer element.
	     * @param {number} [containerWidth] Optionally specify a container width if
	     *    it's already available.
	     */
	
	  }, {
	    key: '_setColumns',
	    value: function _setColumns() {
	      var containerWidth = arguments.length <= 0 || arguments[0] === undefined ? Shuffle.getSize(this.element).width : arguments[0];
	
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
	     */
	
	  }, {
	    key: '_layout',
	    value: function _layout(items) {
	      each(items, this._layoutItem, this);
	    }
	
	    /**
	     * Calculates the position of the item and pushes it onto the style queue.
	     * @param {ShuffleItem} item ShuffleItem which is being positioned.
	     * @private
	     */
	
	  }, {
	    key: '_layoutItem',
	    value: function _layoutItem(item, i) {
	      var currPos = item.point;
	      var currScale = item.scale;
	      var itemSize = Shuffle.getSize(item.element, true);
	      var pos = this._getItemPosition(itemSize);
	
	      // If the item will not change its position, do not add it to the render
	      // queue. Transitions don't fire when setting a property to the same value.
	      if (_point2.default.equals(currPos, pos) && currScale === _shuffleItem2.default.Scale.VISIBLE) {
	        return;
	      }
	
	      item.point = pos;
	      item.scale = _shuffleItem2.default.Scale.VISIBLE;
	
	      this._queue.push({
	        item: item,
	        opacity: 1,
	        visibility: 'visible',
	        transitionDelay: Math.min(i * this.staggerAmount, this.staggerAmountMax)
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
	     * @param {Array.<ShuffleItem>} collection Collection to shrink.
	     * @private
	     */
	
	  }, {
	    key: '_shrink',
	    value: function _shrink() {
	      var _this5 = this;
	
	      var collection = arguments.length <= 0 || arguments[0] === undefined ? this._getConcealedItems() : arguments[0];
	
	      each(collection, function (item, i) {
	        // Continuing would add a transitionend event listener to the element, but
	        // that listener would not execute because the transform and opacity would
	        // stay the same.
	        if (item.scale === _shuffleItem2.default.Scale.FILTERED) {
	          return;
	        }
	
	        item.scale = _shuffleItem2.default.Scale.FILTERED;
	
	        _this5._queue.push({
	          item: item,
	          opacity: 0,
	          transitionDelay: Math.min(i * _this5.staggerAmount, _this5.staggerAmountMax),
	          callback: function callback() {
	            item.element.style.visibility = 'hidden';
	          }
	        });
	      }, this);
	    }
	
	    /**
	     * Resize handler.
	     * @private
	     */
	
	  }, {
	    key: '_handleResize',
	    value: function _handleResize() {
	      // If shuffle is disabled, destroyed, don't do anything
	      if (!this.isEnabled || this.isDestroyed) {
	        return;
	      }
	
	      // Will need to check height in the future if it's layed out horizontaly
	      var containerWidth = Shuffle.getSize(this.element).width;
	
	      // containerWidth hasn't changed, don't do anything
	      if (containerWidth === this.containerWidth) {
	        return;
	      }
	
	      this.update();
	    }
	
	    /**
	     * Returns styles for either jQuery animate or transition.
	     * @param {Object} obj Transition options.
	     * @return {!Object} Transforms for transitions, left/top for animate.
	     * @private
	     */
	
	  }, {
	    key: '_getStylesForTransition',
	    value: function _getStylesForTransition(obj) {
	      var item = obj.item;
	      var styles = {
	        opacity: obj.opacity,
	        visibility: obj.visibility,
	        transitionDelay: (obj.transitionDelay || 0) + 'ms'
	      };
	
	      if (this.useTransforms) {
	        styles.transform = Shuffle._getItemTransformString(item.point, item.scale);
	      } else {
	        styles.left = item.point.x + 'px';
	        styles.top = item.point.y + 'px';
	      }
	
	      return styles;
	    }
	  }, {
	    key: '_transition',
	    value: function _transition(opts) {
	      var _this6 = this;
	
	      var styles = this._getStylesForTransition(opts);
	      var callfront = opts.callfront || noop;
	      var callback = opts.callback || noop;
	      var item = opts.item;
	      var _this = this;
	
	      return new Promise(function (resolve) {
	        var reference = {
	          item: item,
	          handler: function handler(evt) {
	            var element = evt.target;
	
	            // Make sure this event handler has not bubbled up from a child.
	            if (element === evt.currentTarget) {
	              element.removeEventListener('transitionend', reference.handler);
	              element.style.transitionDelay = '';
	              _this._removeTransitionReference(reference);
	              callback();
	              resolve();
	            }
	          }
	        };
	
	        callfront();
	        item.applyCss(styles);
	
	        // Transitions are not set until shuffle has loaded to avoid the initial transition.
	        if (_this6.isInitialized) {
	          item.element.addEventListener('transitionend', reference.handler);
	          _this6._transitions.push(reference);
	        } else {
	          callback();
	          resolve();
	        }
	      });
	    }
	
	    /**
	     * Execute the styles gathered in the style queue. This applies styles to elements,
	     * triggering transitions.
	     * @param {boolean} withLayout Whether to trigger a layout event.
	     * @private
	     */
	
	  }, {
	    key: '_processQueue',
	    value: function _processQueue() {
	      var _this7 = this;
	
	      var withLayout = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
	
	      if (this.isTransitioning) {
	        this._cancelMovement();
	      }
	
	      // Iterate over the queue and keep track of ones that use transitions.
	      var immediates = [];
	      var transitions = [];
	      this._queue.forEach(function (obj) {
	        if (!_this7.isInitialized || _this7.speed === 0) {
	          immediates.push(obj);
	        } else {
	          transitions.push(obj);
	        }
	      });
	
	      immediates.forEach(function (obj) {
	        _this7._styleImmediately(obj);
	      });
	
	      var promises = transitions.map(function (obj) {
	        return _this7._transition(obj);
	      });
	
	      if (transitions.length > 0 && this.speed > 0) {
	        // Set flag that shuffle is currently in motion.
	        this.isTransitioning = true;
	
	        Promise.all(promises).then(this._movementFinished.bind(this));
	
	        // A call to layout happened, but none of the newly filtered items will
	        // change position. Asynchronously fire the callback here.
	      } else if (withLayout) {
	          defer(this._dispatchLayout, this);
	        }
	
	      // Remove everything in the style queue
	      this._queue.length = 0;
	    }
	  }, {
	    key: '_cancelMovement',
	    value: function _cancelMovement() {
	      // Remove the transition end event for each listener.
	      each(this._transitions, function (transition) {
	        transition.item.element.removeEventListener('transitionend', transition.handler);
	      });
	
	      // Reset the array.
	      this._transitions.length = 0;
	
	      // Show it's no longer active.
	      this.isTransitioning = false;
	    }
	  }, {
	    key: '_removeTransitionReference',
	    value: function _removeTransitionReference(ref) {
	      var indexInArray = this._transitions.indexOf(ref);
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
	    value: function _styleImmediately(obj) {
	      var _this8 = this;
	
	      Shuffle._skipTransition(obj.item.element, function () {
	        obj.item.applyCss(_this8._getStylesForTransition(obj));
	      });
	    }
	  }, {
	    key: '_movementFinished',
	    value: function _movementFinished() {
	      this.isTransitioning = false;
	      this._dispatchLayout();
	    }
	  }, {
	    key: '_dispatchLayout',
	    value: function _dispatchLayout() {
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
	      each(this._queue, function (transitionObj) {
	        transitionObj.skipTransition = true;
	      });
	
	      // Apply shrink positions, but do not cause a layout event.
	      this._processQueue(false);
	
	      if (addToEnd) {
	        this._addItemsToEnd($newItems, isSequential);
	      } else {
	        this.filter(this.lastFilter);
	      }
	    }
	  }, {
	    key: '_addItemsToEnd',
	    value: function _addItemsToEnd($newItems, isSequential) {
	      // Get ones that passed the current filter
	      var $passed = this._filter(null, $newItems).filtered;
	      var passed = $passed.get();
	
	      // How many filtered elements?
	      this._updateItemCount();
	
	      // FIXME won't process queue.
	      this._layout(passed, true);
	
	      if (isSequential) {
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
	            scale: _shuffleItem2.default.Scale.VISIBLE
	          });
	        }, this);
	
	        this._whenCollectionDone(window.jQuery(newFilteredItems), 'transitionend', function () {
	          window.jQuery(newFilteredItems).css('transitionDelay', '0ms');
	          this._movementFinished();
	        });
	      }, this, this.revealAppendedDelay);
	    }
	
	    /**
	     * The magic. This is what makes the plugin 'shuffle'
	     * @param {string|Function|Array.<string>} [category] Category to filter by.
	     *     Can be a function, string, or array of strings.
	     * @param {Object} [sortObj] A sort object which can sort the filtered set
	     */
	
	  }, {
	    key: 'filter',
	    value: function filter(category, sortObj) {
	      if (!this.isEnabled) {
	        return;
	      }
	
	      if (!category || category && category.length === 0) {
	        category = Shuffle.ALL_ITEMS;
	      }
	
	      this._filter(category);
	
	      // Shrink each concealed item
	      this._shrink();
	
	      // How many filtered elements?
	      this._updateItemCount();
	
	      // Update transforms on .filtered elements so they will animate to their new positions
	      this.sort(sortObj);
	    }
	
	    /**
	     * Gets the .filtered elements, sorts them, and passes them to layout.
	     * @param {Object} opts the options object for the sorted plugin
	     */
	
	  }, {
	    key: 'sort',
	    value: function sort() {
	      var opts = arguments.length <= 0 || arguments[0] === undefined ? this.lastSort : arguments[0];
	
	      if (!this.isEnabled) {
	        return;
	      }
	
	      this._resetCols();
	
	      var items = this._getFilteredItems();
	      items = (0, _sorter2.default)(items, opts);
	
	      this._layout(items);
	
	      // `_layout` always happens after `_shrink`, so it's safe to process the style
	      // queue here with styles from the shrink method.
	      this._processQueue();
	
	      // Adjust the height of the container.
	      this._setContainerSize();
	
	      this.lastSort = opts;
	    }
	
	    /**
	     * Reposition everything.
	     * @param {boolean} isOnlyLayout If true, column and gutter widths won't be
	     *     recalculated.
	     */
	
	  }, {
	    key: 'update',
	    value: function update(isOnlyLayout) {
	      if (this.isEnabled) {
	
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
	      this.isEnabled = false;
	    }
	
	    /**
	     * Enables shuffle again
	     * @param {boolean} [isUpdateLayout=true] if undefined, shuffle will update columns and gutters
	     */
	
	  }, {
	    key: 'enable',
	    value: function enable(isUpdateLayout) {
	      this.isEnabled = true;
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
	
	      this.$el.one(Shuffle.EventType.LAYOUT + '.shuffle', window.jQuery.proxy(handleRemoved, this));
	    }
	
	    /**
	     * Destroys shuffle, removes events, styles, and classes
	     */
	
	  }, {
	    key: 'destroy',
	    value: function destroy() {
	      window.removeEventListener('resize', this._onResize);
	
	      // Reset container styles
	      this.element.classList.remove('shuffle');
	      this.element.removeAttribute('style');
	
	      // Reset individual item styles
	      this.items.forEach(function (item) {
	        item.dispose();
	      });
	
	      // Null DOM references
	      this.items = null;
	      this.$el = null;
	      this.sizer = null;
	      this.element = null;
	      this._transitions = null;
	
	      // Set a flag so if a debounced resize has been triggered,
	      // it can first check if it is actually isDestroyed and not doing anything
	      this.destroyed = true;
	    }
	
	    /**
	     * Get the CSS transform based on position and scale.
	     * @param {Point} point X and Y positions.
	     * @param {number} scale Scale amount.
	     * @return {string} A normalized string which can be used with the transform style.
	     * @private
	     */
	
	  }], [{
	    key: '_getItemTransformString',
	    value: function _getItemTransformString(point, scale) {
	      return 'translate(' + point.x + 'px, ' + point.y + 'px) scale(' + scale + ')';
	    }
	
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
	     * @return {{width: number, height: number}} The width and height.
	     */
	
	  }, {
	    key: 'getSize',
	    value: function getSize(element, includeMargins) {
	      // Store the styles so that they can be used by others without asking for it again.
	      var styles = window.getComputedStyle(element, null);
	      var width = (0, _getNumberStyle2.default)(element, 'width', styles);
	      var height = (0, _getNumberStyle2.default)(element, 'height', styles);
	
	      // Use jQuery here because it uses getComputedStyle internally and is
	      // cross-browser. Using the style property of the element will only work
	      // if there are inline styles.
	      if (includeMargins) {
	        var marginLeft = (0, _getNumberStyle2.default)(element, 'marginLeft', styles);
	        var marginRight = (0, _getNumberStyle2.default)(element, 'marginRight', styles);
	        var marginTop = (0, _getNumberStyle2.default)(element, 'marginTop', styles);
	        var marginBottom = (0, _getNumberStyle2.default)(element, 'marginBottom', styles);
	        width += marginLeft + marginRight;
	        height += marginTop + marginBottom;
	      }
	
	      return {
	        width: width,
	        height: height
	      };
	    }
	
	    /**
	     * Change a property or execute a function which will not have a transition
	     * @param {Element} element DOM element that won't be transitioned
	     * @param {Function} callback A function which will be called while transition
	     *     is set to 0ms.
	     * @private
	     */
	
	  }, {
	    key: '_skipTransition',
	    value: function _skipTransition(element, callback) {
	      var style = element.style;
	      var duration = style.transitionDuration;
	      var delay = style.transitionDelay;
	
	      // Set the duration to zero so it happens immediately
	      style.transitionDuration = '0ms';
	      style.transitionDelay = '0ms';
	
	      callback();
	
	      // Force reflow
	      var reflow = element.offsetWidth;
	
	      // Avoid jshint warnings: unused variables and expressions.
	      reflow = null;
	
	      // Put the duration back
	      style.transitionDuration = duration;
	      style.transitionDelay = delay;
	    }
	  }]);
	
	  return Shuffle;
	}();
	
	Shuffle.ALL_ITEMS = 'all';
	Shuffle.FILTER_ATTRIBUTE_KEY = 'groups';
	
	/**
	 * @enum {string}
	 */
	Shuffle.EventType = {
	  LOADING: 'shuffle:loading',
	  DONE: 'shuffle:done',
	  LAYOUT: 'shuffle:layout',
	  REMOVED: 'shuffle:removed'
	};
	
	/** @enum {string} */
	Shuffle.ClassName = _classes2.default;
	
	// Overrideable options
	Shuffle.options = {
	  // Initial filter group.
	  group: Shuffle.ALL_ITEMS,
	
	  // Transition/animation speed (milliseconds).
	  speed: 250,
	
	  // CSS easing function to use.
	  easing: 'ease',
	
	  // e.g. '.picture-item'.
	  itemSelector: '*',
	
	  // Sizer element. Use an element to determine the size of columns and gutters.
	  sizer: null,
	
	  // A static number or function that tells the plugin how wide the gutters
	  // between columns are (in pixels).
	  gutterWidth: 0,
	
	  // A static number or function that returns a number which tells the plugin
	  // how wide the columns are (in pixels).
	  columnWidth: 0,
	
	  // If your group is not json, and is comma delimeted, you could set delimeter
	  // to ','.
	  delimeter: null,
	
	  // Useful for percentage based heights when they might not always be exactly
	  // the same (in pixels).
	  buffer: 0,
	
	  // Reading the width of elements isn't precise enough and can cause columns to
	  // jump between values.
	  columnThreshold: 0.01,
	
	  // Shuffle can be isInitialized with a sort object. It is the same object
	  // given to the sort method.
	  initialSort: null,
	
	  // By default, shuffle will throttle resize events. This can be changed or
	  // removed.
	  throttle: _throttle2.default,
	
	  // How often shuffle can be called on resize (in milliseconds).
	  throttleTime: 300,
	
	  // Delay between each item that fades in when adding items.
	  sequentialFadeDelay: 150,
	
	  // Transition delay offset for each item in milliseconds.
	  staggerAmount: 15,
	
	  // It can look a little weird when the last element is in the top row
	  staggerAmountMax: 250,
	
	  // Whether to use transforms or absolute positioning.
	  useTransforms: true
	};
	
	// Expose for testing.
	Shuffle.Point = _point2.default;
	Shuffle.ShuffleItem = _shuffleItem2.default;
	Shuffle.sorter = _sorter2.default;
	
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
/***/ function(module, exports) {

	'use strict';
	
	// Underscore's throttle method.
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function (func, wait, options) {
	  var _this;
	  var args;
	  var result;
	  var timeout = null;
	  var previous = 0;
	  if (!options) options = {};
	  var later = function later() {
	    previous = options.leading === false ? 0 : Date.now();
	    timeout = null;
	    result = func.apply(_this, args);
	    if (!timeout) _this = args = null;
	  };
	
	  return function () {
	    var now = Date.now();
	    if (!previous && options.leading === false) previous = now;
	    var remaining = wait - (now - previous);
	    _this = this;
	    args = arguments;
	    if (remaining <= 0 || remaining > wait) {
	      if (timeout) {
	        clearTimeout(timeout);
	        timeout = null;
	      }
	
	      previous = now;
	      result = func.apply(_this, args);
	      if (!timeout) _this = args = null;
	    } else if (!timeout && options.trailing !== false) {
	      timeout = setTimeout(later, remaining);
	    }
	
	    return result;
	  };
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _getNumber = __webpack_require__(4);
	
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
/* 4 */
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
	    return val;
	  }
	
	  return 0;
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _point = __webpack_require__(3);
	
	var _point2 = _interopRequireDefault(_point);
	
	var _classes = __webpack_require__(6);
	
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
	      this.applyCss(ShuffleItem.css);
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
	    key: 'removeClasses',
	    value: function removeClasses(classes) {
	      var _this2 = this;
	
	      classes.forEach(function (className) {
	        _this2.element.classList.remove(className);
	      });
	    }
	  }, {
	    key: 'applyCss',
	    value: function applyCss(obj) {
	      var _this3 = this;
	
	      Object.keys(obj).forEach(function (key) {
	        _this3.element.style[key] = obj[key];
	      });
	    }
	  }, {
	    key: 'dispose',
	    value: function dispose() {
	      this.removeClasses([_classes2.default.CONCEALED, _classes2.default.FILTERED, _classes2.default.SHUFFLE_ITEM]);
	
	      this.element.removeAttribute('style');
	      this.element = null;
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
/* 6 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = {
	  BASE: 'shuffle',
	  SHUFFLE_ITEM: 'shuffle-item',
	  FILTERED: 'filtered',
	  CONCEALED: 'concealed'
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = getNumberStyle;
	
	var _getNumber = __webpack_require__(4);
	
	var _getNumber2 = _interopRequireDefault(_getNumber);
	
	var _computedSize = __webpack_require__(8);
	
	var _computedSize2 = _interopRequireDefault(_computedSize);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
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
	function getNumberStyle(element, style) {
	  var styles = arguments.length <= 2 || arguments[2] === undefined ? window.getComputedStyle(element, null) : arguments[2];
	
	  var value = (0, _getNumber2.default)(styles[style]);
	
	  // Support IE<=11 and W3C spec.
	  if (!_computedSize2.default && style === 'width') {
	    value += (0, _getNumber2.default)(styles.paddingLeft) + (0, _getNumber2.default)(styles.paddingRight) + (0, _getNumber2.default)(styles.borderLeftWidth) + (0, _getNumber2.default)(styles.borderRightWidth);
	  } else if (!_computedSize2.default && style === 'height') {
	    value += (0, _getNumber2.default)(styles.paddingTop) + (0, _getNumber2.default)(styles.paddingBottom) + (0, _getNumber2.default)(styles.borderTopWidth) + (0, _getNumber2.default)(styles.borderBottomWidth);
	  }
	
	  return value;
	}

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var element = document.body || document.documentElement;
	var e = document.createElement('div');
	e.style.cssText = 'width:10px;padding:2px;box-sizing:border-box;';
	element.appendChild(e);
	
	var width = window.getComputedStyle(e, null).width;
	var ret = width === '10px';
	
	element.removeChild(e);
	
	exports.default = ret;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = sorter;
	
	var _assign = __webpack_require__(10);
	
	var _assign2 = _interopRequireDefault(_assign);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// http://stackoverflow.com/a/962890/373422
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
	  randomize: false,
	
	  // Determines which property of each item in the array is passed to the
	  // sorting method.
	  key: 'element'
	};
	
	// You can return `undefined` from the `by` function to revert to DOM order.
	function sorter(arr, options) {
	  var opts = (0, _assign2.default)({}, defaults, options);
	  var original = [].slice.call(arr);
	  var revert = false;
	
	  if (!arr.length) {
	    return [];
	  }
	
	  if (opts.randomize) {
	    return randomize(arr);
	  }
	
	  // Sort the elements by the opts.by function.
	  // If we don't have opts.by, default to DOM order
	  if (typeof opts.by === 'function') {
	    arr.sort(function (a, b) {
	
	      // Exit early if we already know we want to revert
	      if (revert) {
	        return 0;
	      }
	
	      var valA = opts.by(a[opts.key]);
	      var valB = opts.by(b[opts.key]);
	
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
/* 10 */
/***/ function(module, exports) {

	'use strict';
	
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = assign;
	function assign(target) {
	  var output = Object(target);
	  for (var i = 1, length = arguments.length; i < length; i++) {
	    var source = arguments[i];
	    if (source !== undefined && source !== null) {
	      for (var key in source) {
	        if (source.hasOwnProperty(key)) {
	          output[key] = source[key];
	        }
	      }
	    }
	  }
	
	  return output;
	}

/***/ },
/* 11 */
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