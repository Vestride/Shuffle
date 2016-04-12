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
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	__webpack_require__(1);
	
	var _matchesSelector = __webpack_require__(2);
	
	var _matchesSelector2 = _interopRequireDefault(_matchesSelector);
	
	var _arrayUniq = __webpack_require__(3);
	
	var _arrayUniq2 = _interopRequireDefault(_arrayUniq);
	
	var _xtend = __webpack_require__(4);
	
	var _xtend2 = _interopRequireDefault(_xtend);
	
	var _throttle = __webpack_require__(5);
	
	var _throttle2 = _interopRequireDefault(_throttle);
	
	var _point = __webpack_require__(6);
	
	var _point2 = _interopRequireDefault(_point);
	
	var _shuffleItem = __webpack_require__(8);
	
	var _shuffleItem2 = _interopRequireDefault(_shuffleItem);
	
	var _classes = __webpack_require__(9);
	
	var _classes2 = _interopRequireDefault(_classes);
	
	var _getNumberStyle = __webpack_require__(10);
	
	var _getNumberStyle2 = _interopRequireDefault(_getNumberStyle);
	
	var _sorter = __webpack_require__(12);
	
	var _sorter2 = _interopRequireDefault(_sorter);
	
	var _onTransitionEnd = __webpack_require__(13);
	
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
	
	function arrayIncludes(array, obj) {
	  if (arguments.length === 2) {
	    return arrayIncludes(array)(obj);
	  }
	
	  return function (obj) {
	    return array.indexOf(obj) > -1;
	  };
	}
	
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
	
	    this.options = (0, _xtend2.default)(Shuffle.options, options);
	
	    this.useSizer = false;
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
	
	      this.options.sizer = this._getElementOption(this.options.sizer);
	
	      if (this.options.sizer) {
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
	      this.filter(this.options.group, this.options.initialSort);
	
	      // The shuffle items haven't had transitions set on them yet
	      // so the user doesn't see the first layout. Set them now that the first layout is done.
	      defer(function () {
	        this._setTransitions();
	        this.element.style.transition = 'height ' + this.options.speed + 'ms ' + this.options.easing;
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
	      return this.options.throttle ? this.options.throttle(resizeFunction, this.options.throttleTime) : resizeFunction;
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
	     * @param {Array} [collection] Optionally filter a collection. Defaults to
	     *     all the items.
	     * @return {!{filtered: Array, concealed: Array}}
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
	        this.options.group = category;
	      }
	
	      return set;
	    }
	
	    /**
	     * Returns an object containing the filtered and concealed elements.
	     * @param {string|Function} category Category or function to filter by.
	     * @param {Array.<Element>} items A collection of items to filter.
	     * @return {!{filtered: Array, concealed: Array}}
	     * @private
	     */
	
	  }, {
	    key: '_getFilteredSets',
	    value: function _getFilteredSets(category, items) {
	      var _this = this;
	
	      var filtered = [];
	      var concealed = [];
	
	      // category === 'all', add filtered class to everything
	      if (category === Shuffle.ALL_ITEMS) {
	        filtered = items;
	
	        // Loop through each item and use provided function to determine
	        // whether to hide it or not.
	      } else {
	          items.forEach(function (item) {
	            if (_this._doesPassFilter(category, item.element)) {
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
	     * @param {Element} element An element to test.
	     * @return {boolean} Whether it passes the category/filter.
	     * @private
	     */
	
	  }, {
	    key: '_doesPassFilter',
	    value: function _doesPassFilter(category, element) {
	
	      if (typeof category === 'function') {
	        return category.call(element, element, this);
	
	        // Check each element's data-groups attribute against the given category.
	      } else {
	          var attr = element.getAttribute('data-' + Shuffle.FILTER_ATTRIBUTE_KEY);
	          var groups = JSON.parse(attr);
	          var keys = this.delimeter && !Array.isArray(groups) ? groups.split(this.delimeter) : groups;
	
	          if (Array.isArray(category)) {
	            return category.some(arrayIncludes(keys));
	          }
	
	          return arrayIncludes(keys, category);
	        }
	    }
	
	    /**
	     * Toggles the filtered and concealed class names.
	     * @param {{filtered, concealed}} Object with filtered and concealed arrays.
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
	     * @private
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
	     * Remove element reference and styles.
	     * @private
	     */
	
	  }, {
	    key: '_disposeItems',
	    value: function _disposeItems() {
	      var items = arguments.length <= 0 || arguments[0] === undefined ? this.items : arguments[0];
	
	      items.forEach(function (item) {
	        item.dispose();
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
	     * Sets css transform transition on a group of elements. This is not executed
	     * at the same time as `item.init` so that transitions don't occur upon
	     * initialization of Shuffle.
	     * @param {Array.<ShuffleItem>} items Shuffle items to set transitions on.
	     * @private
	     */
	
	  }, {
	    key: '_setTransitions',
	    value: function _setTransitions() {
	      var items = arguments.length <= 0 || arguments[0] === undefined ? this.items : arguments[0];
	
	      var speed = this.options.speed;
	      var easing = this.options.easing;
	
	      var str;
	      if (this.options.useTransforms) {
	        str = 'transform ' + speed + 'ms ' + easing + ', opacity ' + speed + 'ms ' + easing;
	      } else {
	        str = 'top ' + speed + 'ms ' + easing + ', left ' + speed + 'ms ' + easing + ', opacity ' + speed + 'ms ' + easing;
	      }
	
	      items.forEach(function (item) {
	        item.element.style.transition = str;
	      });
	    }
	  }, {
	    key: '_getItems',
	    value: function _getItems() {
	      var _this2 = this;
	
	      return toArray(this.element.children).filter(function (el) {
	        return (0, _matchesSelector2.default)(el, _this2.options.itemSelector);
	      }).map(function (el) {
	        return new _shuffleItem2.default(el);
	      });
	    }
	
	    /**
	     * When new elements are added to the shuffle container, update the array of
	     * items because that is the order `_layout` calls them.
	     */
	
	  }, {
	    key: '_updateItemsOrder',
	    value: function _updateItemsOrder() {
	      var children = this.element.children;
	      this.items = (0, _sorter2.default)(this.items, {
	        by: function by(element) {
	          return Array.prototype.indexOf.call(children, element);
	        }
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
	          size = Shuffle.getSize(this.options.sizer).width;
	
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
	      if (typeof this.options.gutterWidth === 'function') {
	        size = this.options.gutterWidth(containerWidth);
	      } else if (this.useSizer) {
	        size = (0, _getNumberStyle2.default)(this.options.sizer, 'marginLeft');
	      } else {
	        size = this.options.gutterWidth;
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
	      if (Math.abs(Math.round(calculatedColumns) - calculatedColumns) < this.options.columnThreshold) {
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
	        bubbles: true,
	        cancelable: false,
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
	     *     order in their array.
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
	        transitionDelay: Math.min(i * this.options.staggerAmount, this.options.staggerAmountMax)
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
	      var shortColumnIndex = this._getShortColumn(setY, this.options.buffer);
	
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
	      if (Math.abs(Math.round(columnSpan) - columnSpan) < this.options.columnThreshold) {
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
	      var _this3 = this;
	
	      var collection = arguments.length <= 0 || arguments[0] === undefined ? this._getConcealedItems() : arguments[0];
	
	      each(collection, function (item, i) {
	        // Continuing would add a transitionend event listener to the element, but
	        // that listener would not execute because the transform and opacity would
	        // stay the same.
	        if (item.scale === _shuffleItem2.default.Scale.FILTERED) {
	          return;
	        }
	
	        item.scale = _shuffleItem2.default.Scale.FILTERED;
	
	        _this3._queue.push({
	          item: item,
	          opacity: 0,
	          transitionDelay: Math.min(i * _this3.options.staggerAmount, _this3.options.staggerAmountMax),
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
	     * Returns styles which will be applied to the an item for a transition.
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
	
	      var x = item.point.x;
	      var y = item.point.y;
	
	      if (this.options.useTransforms) {
	        styles.transform = 'translate(' + x + 'px, ' + y + 'px) scale(' + item.scale + ')';
	      } else {
	        styles.left = x + 'px';
	        styles.top = y + 'px';
	      }
	
	      return styles;
	    }
	  }, {
	    key: '_whenTransitionDone',
	    value: function _whenTransitionDone(element, itemCallback) {
	      var _this4 = this;
	
	      // TODO what happens when the transition is canceled and the promise never resolves?
	      return new Promise(function (resolve) {
	        var id = (0, _onTransitionEnd.onTransitionEnd)(element, function (evt) {
	          evt.currentTarget.style.transitionDelay = '';
	
	          if (itemCallback) {
	            itemCallback();
	          }
	
	          resolve();
	        });
	        _this4._transitions.push(id);
	      });
	    }
	  }, {
	    key: '_transition',
	    value: function _transition(opts) {
	      opts.item.applyCss(this._getStylesForTransition(opts));
	      this._whenTransitionDone(opts.item.element, opts.callback);
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
	      var _this5 = this;
	
	      var withLayout = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
	
	      if (this.isTransitioning) {
	        this._cancelMovement();
	      }
	
	      // Iterate over the queue and keep track of ones that use transitions.
	      var immediates = [];
	      var transitions = [];
	      this._queue.forEach(function (obj) {
	        if (!_this5.isInitialized || _this5.options.speed === 0) {
	          immediates.push(obj);
	        } else {
	          transitions.push(obj);
	        }
	      });
	
	      this._styleImmediately(immediates);
	
	      if (transitions.length > 0 && this.options.speed > 0) {
	        this._startTransitions(transitions);
	
	        // A call to layout happened, but none of the newly filtered items will
	        // change position. Asynchronously fire the callback here.
	      } else if (withLayout) {
	          defer(this._dispatchLayout, this);
	        }
	
	      // Remove everything in the style queue
	      this._queue.length = 0;
	    }
	
	    /**
	     * Create a promise for each transition and wait for all of them to complete,
	     * then emit the layout event.
	     * @param {Array.<Object>} transitions Array of transition objects.
	     */
	
	  }, {
	    key: '_startTransitions',
	    value: function _startTransitions(transitions) {
	      var _this6 = this;
	
	      // Set flag that shuffle is currently in motion.
	      this.isTransitioning = true;
	
	      var promises = transitions.map(function (obj) {
	        return _this6._transition(obj);
	      });
	      Promise.all(promises).then(this._movementFinished.bind(this));
	    }
	  }, {
	    key: '_cancelMovement',
	    value: function _cancelMovement() {
	      // Remove the transition end event for each listener.
	      each(this._transitions, _onTransitionEnd.cancelTransitionEnd);
	
	      // Reset the array.
	      this._transitions.length = 0;
	
	      // Show it's no longer active.
	      this.isTransitioning = false;
	    }
	
	    /**
	     * Apply styles without a transition.
	     * @param {Array.<Object>} objects Array of transition objects.
	     * @private
	     */
	
	  }, {
	    key: '_styleImmediately',
	    value: function _styleImmediately(objects) {
	      var _this7 = this;
	
	      if (objects.length) {
	        var elements = objects.map(function (obj) {
	          return obj.item.element;
	        });
	
	        Shuffle._skipTransitions(elements, function () {
	          objects.forEach(function (obj) {
	            obj.item.applyCss(_this7._getStylesForTransition(obj));
	
	            if (obj.callback) {
	              obj.callback();
	            }
	          });
	        });
	      }
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
	     * New items have been appended to shuffle. Mix them in with the current
	     * filter or sort status.
	     * @param {Array.<Element>} newItems Collection of new items.
	     */
	
	  }, {
	    key: 'add',
	    value: function add(newItems) {
	      newItems = (0, _arrayUniq2.default)(newItems).map(function (el) {
	        return new _shuffleItem2.default(el);
	      });
	
	      // Add classes and set initial positions.
	      this._initItems(newItems);
	
	      // Add transition to each item.
	      this._setTransitions(newItems);
	
	      // Update the list of items.
	      this.items = this.items.concat(newItems);
	      this._updateItemsOrder();
	      this.filter(this.lastFilter);
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
	     * @param {Array.<Element>} collection An array containing one or more
	     *     elements in shuffle
	     * @return {Shuffle} The shuffle object
	     */
	
	  }, {
	    key: 'remove',
	    value: function remove(collection) {
	      var _this8 = this;
	
	      collection = (0, _arrayUniq2.default)(collection);
	
	      var items = collection.map(function (element) {
	        return _this8.getItemByElement(element);
	      }).filter(function (item) {
	        return !!item;
	      });
	
	      if (!collection.length) {
	        return;
	      }
	
	      var handleLayout = function handleLayout() {
	        _this8.element.removeEventListener(Shuffle.EventType.LAYOUT, handleLayout);
	        _this8._disposeItems(items);
	
	        // Remove the collection in the callback
	        collection.forEach(function (element) {
	          element.parentNode.removeChild(element);
	        });
	
	        // Update things now that elements have been removed.
	        _this8.items = _this8.items.filter(function (item) {
	          return !arrayIncludes(items, item);
	        });
	        _this8._updateItemCount();
	
	        _this8._dispatch(Shuffle.EventType.REMOVED, { collection: collection });
	
	        // Let it get garbage collected
	        collection = null;
	        items = null;
	      };
	
	      // Hide collection first.
	      this._toggleFilterClasses({
	        filtered: [],
	        concealed: items
	      });
	
	      this._shrink(items);
	
	      this.sort();
	
	      this.element.addEventListener(Shuffle.EventType.LAYOUT, handleLayout);
	    }
	
	    /**
	     * Retrieve a shuffle item by its element.
	     * @param {Element} element Element to look for.
	     * @return {?ShuffleItem} A shuffle item or null if it's not found.
	     */
	
	  }, {
	    key: 'getItemByElement',
	    value: function getItemByElement(element) {
	      for (var i = this.items.length - 1; i >= 0; i--) {
	        if (this.items[i].element === element) {
	          return this.items[i];
	        }
	      }
	
	      return null;
	    }
	
	    /**
	     * Destroys shuffle, removes events, styles, and classes
	     */
	
	  }, {
	    key: 'destroy',
	    value: function destroy() {
	      this._cancelMovement();
	      window.removeEventListener('resize', this._onResize);
	
	      // Reset container styles
	      this.element.classList.remove('shuffle');
	      this.element.removeAttribute('style');
	
	      // Reset individual item styles
	      this._disposeItems();
	
	      // Null DOM references
	      this.items = null;
	      this.options.sizer = null;
	      this.element = null;
	      this._transitions = null;
	
	      // Set a flag so if a debounced resize has been triggered,
	      // it can first check if it is actually isDestroyed and not doing anything
	      this.isDestroyed = true;
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
	     * 2. The `offsetWidth` property.
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
	
	  }], [{
	    key: 'getSize',
	    value: function getSize(element, includeMargins) {
	      // Store the styles so that they can be used by others without asking for it again.
	      var styles = window.getComputedStyle(element, null);
	      var width = (0, _getNumberStyle2.default)(element, 'width', styles);
	      var height = (0, _getNumberStyle2.default)(element, 'height', styles);
	
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
	     * @param {Array.<Element>} elements DOM elements that won't be transitioned.
	     * @param {Function} callback A function which will be called while transition
	     *     is set to 0ms.
	     * @private
	     */
	
	  }, {
	    key: '_skipTransitions',
	    value: function _skipTransitions(elements, callback) {
	      var zero = '0ms';
	
	      // Save current duration and delay.
	      var data = elements.map(function (element) {
	        var style = element.style;
	        var duration = style.transitionDuration;
	        var delay = style.transitionDelay;
	
	        // Set the duration to zero so it happens immediately
	        style.transitionDuration = zero;
	        style.transitionDelay = zero;
	
	        return {
	          duration: duration,
	          delay: delay
	        };
	      });
	
	      callback();
	
	      // Cause reflow.
	      elements[0].offsetWidth; // jshint ignore:line
	
	      // Put the duration back
	      elements.forEach(function (element, i) {
	        element.style.transitionDuration = data[i].duration;
	        element.style.transitionDelay = data[i].delay;
	      });
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

	// Polyfill for creating CustomEvents on IE9/10/11
	
	// code pulled from:
	// https://github.com/d4tocchini/customevent-polyfill
	// https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent#Polyfill
	
	try {
	  new window.CustomEvent("test");
	} catch(e) {
	 var CustomEvent = function(event, params) {
	      var evt;
	      params = params || {
	          bubbles: false,
	          cancelable: false,
	          detail: undefined
	      };
	
	      evt = document.createEvent("CustomEvent");
	      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
	      return evt;
	  };
	
	  CustomEvent.prototype = window.Event.prototype;
	  window.CustomEvent = CustomEvent; // expose definition to window
	}


/***/ },
/* 2 */
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
/* 3 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	// there's 3 implementations written in increasing order of efficiency
	
	// 1 - no Set type is defined
	function uniqNoSet(arr) {
		var ret = [];
	
		for (var i = 0; i < arr.length; i++) {
			if (ret.indexOf(arr[i]) === -1) {
				ret.push(arr[i]);
			}
		}
	
		return ret;
	}
	
	// 2 - a simple Set type is defined
	function uniqSet(arr) {
		var seen = new Set();
		return arr.filter(function (el) {
			if (!seen.has(el)) {
				seen.add(el);
				return true;
			}
		});
	}
	
	// 3 - a standard Set type is defined and it has a forEach method
	function uniqSetWithForEach(arr) {
		var ret = [];
	
		(new Set(arr)).forEach(function (el) {
			ret.push(el);
		});
	
		return ret;
	}
	
	// V8 currently has a broken implementation
	// https://github.com/joyent/node/issues/8449
	function doesForEachActuallyWork() {
		var ret = false;
	
		(new Set([true])).forEach(function (el) {
			ret = el;
		});
	
		return ret === true;
	}
	
	if ('Set' in global) {
		if (typeof Set.prototype.forEach === 'function' && doesForEachActuallyWork()) {
			module.exports = uniqSetWithForEach;
		} else {
			module.exports = uniqSet;
		}
	} else {
		module.exports = uniqNoSet;
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = extend
	
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	
	function extend() {
	    var target = {}
	
	    for (var i = 0; i < arguments.length; i++) {
	        var source = arguments[i]
	
	        for (var key in source) {
	            if (hasOwnProperty.call(source, key)) {
	                target[key] = source[key]
	            }
	        }
	    }
	
	    return target
	}


/***/ },
/* 5 */
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
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _getNumber = __webpack_require__(7);
	
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
/* 7 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Always returns a numeric value, given a value. Logic from jQuery's `isNumeric`.
	 * @param {*} value Possibly numeric value.
	 * @return {number} `value` or zero if `value` isn't numeric.
	 */
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = getNumber;
	function getNumber(value) {
	  return parseFloat(value) || 0;
	}

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _point = __webpack_require__(6);
	
	var _point2 = _interopRequireDefault(_point);
	
	var _classes = __webpack_require__(9);
	
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
/* 9 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = {
	  BASE: 'shuffle',
	  SHUFFLE_ITEM: 'shuffle-item',
	  FILTERED: 'filtered',
	  CONCEALED: 'concealed'
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = getNumberStyle;
	
	var _getNumber = __webpack_require__(7);
	
	var _getNumber2 = _interopRequireDefault(_getNumber);
	
	var _computedSize = __webpack_require__(11);
	
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
/* 11 */
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
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = sorter;
	
	var _xtend = __webpack_require__(4);
	
	var _xtend2 = _interopRequireDefault(_xtend);
	
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
	  var opts = (0, _xtend2.default)(defaults, options);
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
/* 13 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.onTransitionEnd = onTransitionEnd;
	exports.cancelTransitionEnd = cancelTransitionEnd;
	var transitions = {};
	var eventName = 'transitionend';
	var count = 0;
	
	function uniqueId() {
	  return eventName + count++;
	}
	
	function onTransitionEnd(element, callback) {
	  var id = uniqueId();
	  var listener = function listener(evt) {
	    if (evt.currentTarget === evt.target) {
	      cancelTransitionEnd(id);
	      callback(evt);
	    }
	  };
	
	  element.addEventListener(eventName, listener);
	
	  transitions[id] = { element: element, listener: listener };
	
	  return id;
	}
	
	function cancelTransitionEnd(id) {
	  if (transitions[id]) {
	    transitions[id].element.removeEventListener(eventName, transitions[id].listener);
	    delete transitions[id];
	    return true;
	  }
	
	  return false;
	}

/***/ }
/******/ ])
});
;
//# sourceMappingURL=shuffle.js.map