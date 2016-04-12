'use strict';

import 'custom-event-polyfill';
import matches from 'matches-selector';
import arrayUnique from 'array-uniq';
import xtend from 'xtend';
import throttle from './throttle';
import Point from './point';
import ShuffleItem from './shuffle-item';
import Classes from './classes';
import getNumberStyle from './get-number-style';
import sorter from './sorter';
import { onTransitionEnd, cancelTransitionEnd } from './on-transition-end';

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
let id = 0;

class Shuffle {

  /**
   * Categorize, sort, and filter a responsive grid of items.
   *
   * @param {Element} element An element which is the parent container for the grid items.
   * @param {Object} [options=Shuffle.options] Options object.
   * @constructor
   */
  constructor(element, options = {}) {
    this.options = xtend(Shuffle.options, options);

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

  _init() {
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
  _getResizeFunction() {
    var resizeFunction = this._handleResize.bind(this);
    return this.options.throttle ?
        this.options.throttle(resizeFunction, this.options.throttleTime) :
        resizeFunction;
  }

  /**
   * Retrieve an element from an option.
   * @param {string|jQuery|Element} option The option to check.
   * @return {?Element} The plain element or null.
   * @private
   */
  _getElementOption(option) {
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
  _validateStyles(styles) {
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
  _filter(category = this.lastFilter, collection = this.items) {
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
  _getFilteredSets(category, items) {
    let filtered = [];
    let concealed = [];

    // category === 'all', add filtered class to everything
    if (category === Shuffle.ALL_ITEMS) {
      filtered = items;

    // Loop through each item and use provided function to determine
    // whether to hide it or not.
    } else {
      items.forEach((item) => {
        if (this._doesPassFilter(category, item.element)) {
          filtered.push(item);
        } else {
          concealed.push(item);
        }
      });
    }

    return {
      filtered,
      concealed,
    };
  }

  /**
   * Test an item to see if it passes a category.
   * @param {string|Function} category Category or function to filter by.
   * @param {Element} element An element to test.
   * @return {boolean} Whether it passes the category/filter.
   * @private
   */
  _doesPassFilter(category, element) {

    if (typeof category === 'function') {
      return category.call(element, element, this);

    // Check each element's data-groups attribute against the given category.
    } else {
      let attr = element.getAttribute('data-' + Shuffle.FILTER_ATTRIBUTE_KEY);
      let groups = JSON.parse(attr);
      let keys = this.delimeter && !Array.isArray(groups) ?
          groups.split(this.delimeter) :
          groups;

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
  _toggleFilterClasses({ filtered, concealed }) {
    filtered.forEach((item) => {
      item.reveal();
    });

    concealed.forEach((item) => {
      item.conceal();
    });
  }

  /**
   * Set the initial css for each item
   * @param {Array.<ShuffleItem>} [items] Optionally specifiy at set to initialize.
   * @private
   */
  _initItems(items = this.items) {
    items.forEach((item) => {
      item.init();
    });
  }

  /**
   * Remove element reference and styles.
   * @private
   */
  _disposeItems(items = this.items) {
    items.forEach((item) => {
      item.dispose();
    });
  }

  /**
   * Updates the filtered item count.
   * @private
   */
  _updateItemCount() {
    this.visibleItems = this._getFilteredItems().length;
  }

  /**
   * Sets css transform transition on a group of elements. This is not executed
   * at the same time as `item.init` so that transitions don't occur upon
   * initialization of Shuffle.
   * @param {Array.<ShuffleItem>} items Shuffle items to set transitions on.
   * @private
   */
  _setTransitions(items = this.items) {
    let speed = this.options.speed;
    let easing = this.options.easing;

    var str;
    if (this.options.useTransforms) {
      str = 'transform ' + speed + 'ms ' + easing +
        ', opacity ' + speed + 'ms ' + easing;
    } else {
      str = 'top ' + speed + 'ms ' + easing +
        ', left ' + speed + 'ms ' + easing +
        ', opacity ' + speed + 'ms ' + easing;
    }

    items.forEach((item) => {
      item.element.style.transition = str;
    });
  }

  _getItems() {
    return toArray(this.element.children)
      .filter(el => matches(el, this.options.itemSelector))
      .map(el => new ShuffleItem(el));
  }

  /**
   * When new elements are added to the shuffle container, update the array of
   * items because that is the order `_layout` calls them.
   */
  _updateItemsOrder() {
    let children = this.element.children;
    this.items = sorter(this.items, {
      by(element) {
        return Array.prototype.indexOf.call(children, element);
      },
    });
  }

  _getFilteredItems() {
    return this.items.filter(item => item.isVisible);
  }

  _getConcealedItems() {
    return this.items.filter(item => !item.isVisible);
  }

  /**
   * Returns the column size, based on column width and sizer options.
   * @param {number} containerWidth Size of the parent container.
   * @param {number} gutterSize Size of the gutters.
   * @return {number}
   * @private
   */
  _getColumnSize(containerWidth, gutterSize) {
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
  _getGutterSize(containerWidth) {
    var size;
    if (typeof this.options.gutterWidth === 'function') {
      size = this.options.gutterWidth(containerWidth);
    } else if (this.useSizer) {
      size = getNumberStyle(this.options.sizer, 'marginLeft');
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
  _setColumns(containerWidth = Shuffle.getSize(this.element).width) {
    var gutter = this._getGutterSize(containerWidth);
    var columnWidth = this._getColumnSize(containerWidth, gutter);
    var calculatedColumns = (containerWidth + gutter) / columnWidth;

    // Widths given from getStyles are not precise enough...
    if (Math.abs(Math.round(calculatedColumns) - calculatedColumns) <
        this.options.columnThreshold) {
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
  _setContainerSize() {
    this.element.style.height = this._getContainerSize() + 'px';
  }

  /**
   * Based on the column heights, it returns the biggest one.
   * @return {number}
   * @private
   */
  _getContainerSize() {
    return arrayMax(this.positions);
  }

  /**
   * Get the clamped stagger amount.
   * @param {number} index Index of the item to be staggered.
   * @return {number}
   */
  _getStaggerAmount(index) {
    return Math.min(index * this.options.staggerAmount, this.options.staggerAmountMax);
  }

  /**
   * @return {boolean} Whether the event was prevented or not.
   */
  _dispatch(name, details = {}) {
    details.shuffle = this;
    return !this.element.dispatchEvent(new CustomEvent(name, {
      bubbles: true,
      cancelable: false,
      detail: details,
    }));
  }

  /**
   * Zeros out the y columns array, which is used to determine item placement.
   * @private
   */
  _resetCols() {
    var i = this.cols;
    this.positions = [];
    while (i--) {
      this.positions.push(0);
    }
  }

  /**
   * Loops through each item that should be shown and calculates the x, y position.
   * @param {Array.<ShuffleItem>} items Array of items that will be shown/layed
   *     out in order in their array.
   */
  _layout(items) {
    let count = 0;
    each(items, (item) => {
      var currPos = item.point;
      var currScale = item.scale;
      var itemSize = Shuffle.getSize(item.element, true);
      var pos = this._getItemPosition(itemSize);

      // If the item will not change its position, do not add it to the render
      // queue. Transitions don't fire when setting a property to the same value.
      if (Point.equals(currPos, pos) && currScale === ShuffleItem.Scale.VISIBLE) {
        return;
      }

      item.point = pos;
      item.scale = ShuffleItem.Scale.VISIBLE;

      this._queue.push({
        item,
        opacity: 1,
        visibility: 'visible',
        transitionDelay: this._getStaggerAmount(count),
      });

      count++;
    });
  }

  /**
   * Determine the location of the next item, based on its size.
   * @param {{width: number, height: number}} itemSize Object with width and height.
   * @return {Point}
   * @private
   */
  _getItemPosition(itemSize) {
    var columnSpan = this._getColumnSpan(itemSize.width, this.colWidth, this.cols);

    var setY = this._getColumnSet(columnSpan, this.cols);

    // Finds the index of the smallest number in the set.
    var shortColumnIndex = this._getShortColumn(setY, this.options.buffer);

    // Position the item
    var point = new Point(
      Math.round(this.colWidth * shortColumnIndex),
      Math.round(setY[shortColumnIndex]));

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
  _getColumnSpan(itemWidth, columnWidth, columns) {
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
  _getColumnSet(columnSpan, columns) {
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
  _getShortColumn(positions, buffer) {
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
  _shrink(collection = this._getConcealedItems()) {
    let count = 0;
    each(collection, (item) => {
      // Continuing would add a transitionend event listener to the element, but
      // that listener would not execute because the transform and opacity would
      // stay the same.
      if (item.scale === ShuffleItem.Scale.FILTERED) {
        return;
      }

      item.scale = ShuffleItem.Scale.FILTERED;

      this._queue.push({
        item,
        opacity: 0,
        transitionDelay: this._getStaggerAmount(count),
        callback() {
          item.element.style.visibility = 'hidden';
        },
      });

      count++;
    });
  }

  /**
   * Resize handler.
   * @private
   */
  _handleResize() {
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
  _getStylesForTransition(obj) {
    let item = obj.item;
    let styles = {
      opacity: obj.opacity,
      visibility: obj.visibility,
      transitionDelay: (obj.transitionDelay || 0) + 'ms',
    };

    let x = item.point.x;
    let y = item.point.y;

    if (this.options.useTransforms) {
      styles.transform = `translate(${x}px, ${y}px) scale(${item.scale})`;
    } else {
      styles.left = x + 'px';
      styles.top = y + 'px';
    }

    return styles;
  }

  _whenTransitionDone(element, itemCallback) {
    // TODO what happens when the transition is canceled and the promise never resolves?
    return new Promise((resolve) => {
      let id = onTransitionEnd(element, (evt) => {
        evt.currentTarget.style.transitionDelay = '';

        if (itemCallback) {
          itemCallback();
        }

        resolve();
      });
      this._transitions.push(id);
    });
  }

  _transition(opts) {
    opts.item.applyCss(this._getStylesForTransition(opts));
    this._whenTransitionDone(opts.item.element, opts.callback);
  }

  /**
   * Execute the styles gathered in the style queue. This applies styles to elements,
   * triggering transitions.
   * @param {boolean} withLayout Whether to trigger a layout event.
   * @private
   */
  _processQueue(withLayout = true) {
    if (this.isTransitioning) {
      this._cancelMovement();
    }

    // Iterate over the queue and keep track of ones that use transitions.
    let immediates = [];
    let transitions = [];
    this._queue.forEach((obj) => {
      if (!this.isInitialized || this.options.speed === 0) {
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
  _startTransitions(transitions) {
    // Set flag that shuffle is currently in motion.
    this.isTransitioning = true;

    let promises = transitions.map(obj => this._transition(obj));
    Promise.all(promises).then(this._movementFinished.bind(this));
  }

  _cancelMovement() {
    // Remove the transition end event for each listener.
    each(this._transitions, cancelTransitionEnd);

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
  _styleImmediately(objects) {
    if (objects.length) {
      let elements = objects.map(obj => obj.item.element);

      Shuffle._skipTransitions(elements, () => {
        objects.forEach((obj) => {
          obj.item.applyCss(this._getStylesForTransition(obj));

          if (obj.callback) {
            obj.callback();
          }
        });
      });
    }
  }

  _movementFinished() {
    this.isTransitioning = false;
    this._dispatchLayout();
  }

  _dispatchLayout() {
    this._dispatch(Shuffle.EventType.LAYOUT);
  }

  /**
   * The magic. This is what makes the plugin 'shuffle'
   * @param {string|Function|Array.<string>} [category] Category to filter by.
   *     Can be a function, string, or array of strings.
   * @param {Object} [sortObj] A sort object which can sort the filtered set
   */
  filter(category, sortObj) {
    if (!this.isEnabled) {
      return;
    }

    if (!category || (category && category.length === 0)) {
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
  sort(opts = this.lastSort) {
    if (!this.isEnabled) {
      return;
    }

    this._resetCols();

    var items = this._getFilteredItems();
    items = sorter(items, opts);

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
  update(isOnlyLayout) {
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
  layout() {
    this.update(true);
  }

  /**
   * New items have been appended to shuffle. Mix them in with the current
   * filter or sort status.
   * @param {Array.<Element>} newItems Collection of new items.
   */
  add(newItems) {
    newItems = arrayUnique(newItems).map(el => new ShuffleItem(el));

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
  disable() {
    this.isEnabled = false;
  }

  /**
   * Enables shuffle again
   * @param {boolean} [isUpdateLayout=true] if undefined, shuffle will update columns and gutters
   */
  enable(isUpdateLayout) {
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
  remove(collection) {
    collection = arrayUnique(collection);

    let items = collection
      .map(element => this.getItemByElement(element))
      .filter(item => !!item);

    if (!collection.length) {
      return;
    }

    let handleLayout = () => {
      this.element.removeEventListener(Shuffle.EventType.LAYOUT, handleLayout);
      this._disposeItems(items);

      // Remove the collection in the callback
      collection.forEach((element) => {
        element.parentNode.removeChild(element);
      });

      // Update things now that elements have been removed.
      this.items = this.items.filter(item => !arrayIncludes(items, item));
      this._updateItemCount();

      this._dispatch(Shuffle.EventType.REMOVED, { collection });

      // Let it get garbage collected
      collection = null;
      items = null;
    };

    // Hide collection first.
    this._toggleFilterClasses({
      filtered: [],
      concealed: items,
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
  getItemByElement(element) {
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
  destroy() {
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
  static getSize(element, includeMargins) {
    // Store the styles so that they can be used by others without asking for it again.
    var styles = window.getComputedStyle(element, null);
    var width = getNumberStyle(element, 'width', styles);
    var height = getNumberStyle(element, 'height', styles);

    if (includeMargins) {
      var marginLeft = getNumberStyle(element, 'marginLeft', styles);
      var marginRight = getNumberStyle(element, 'marginRight', styles);
      var marginTop = getNumberStyle(element, 'marginTop', styles);
      var marginBottom = getNumberStyle(element, 'marginBottom', styles);
      width += marginLeft + marginRight;
      height += marginTop + marginBottom;
    }

    return {
      width,
      height,
    };
  }

  /**
   * Change a property or execute a function which will not have a transition
   * @param {Array.<Element>} elements DOM elements that won't be transitioned.
   * @param {Function} callback A function which will be called while transition
   *     is set to 0ms.
   * @private
   */
  static _skipTransitions(elements, callback) {
    let zero = '0ms';

    // Save current duration and delay.
    let data = elements.map((element) => {
      let style = element.style;
      let duration = style.transitionDuration;
      let delay = style.transitionDelay;

      // Set the duration to zero so it happens immediately
      style.transitionDuration = zero;
      style.transitionDelay = zero;

      return {
        duration,
        delay,
      };
    });

    callback();

    // Cause reflow.
    elements[0].offsetWidth; // jshint ignore:line

    // Put the duration back
    elements.forEach((element, i) => {
      element.style.transitionDuration = data[i].duration;
      element.style.transitionDelay = data[i].delay;
    });
  }
}

Shuffle.ALL_ITEMS = 'all';
Shuffle.FILTER_ATTRIBUTE_KEY = 'groups';

/**
 * @enum {string}
 */
Shuffle.EventType = {
  LOADING: 'shuffle:loading',
  DONE: 'shuffle:done',
  LAYOUT: 'shuffle:layout',
  REMOVED: 'shuffle:removed',
};

/** @enum {string} */
Shuffle.ClassName = Classes;

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
  throttle: throttle,

  // How often shuffle can be called on resize (in milliseconds).
  throttleTime: 300,

  // Transition delay offset for each item in milliseconds.
  staggerAmount: 15,

  // It can look a little weird when the last element is in the top row
  staggerAmountMax: 250,

  // Whether to use transforms or absolute positioning.
  useTransforms: true,
};

// Expose for testing.
Shuffle.Point = Point;
Shuffle.ShuffleItem = ShuffleItem;
Shuffle.sorter = sorter;

module.exports = Shuffle;
