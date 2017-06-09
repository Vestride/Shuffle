'use strict';

var Shuffle = window.Shuffle;

var Demo = function (element) {
  this.shapes = Array.from(document.querySelectorAll('.js-shapes input'));
  this.colors = Array.from(document.querySelectorAll('.js-colors button'));

  this.shuffle = new Shuffle(element, {
    easing: 'cubic-bezier(0.165, 0.840, 0.440, 1.000)', // easeOutQuart
    sizer: '.the-sizer',
  });

  this.filters = {
    shapes: [],
    colors: [],
  };

  this._bindEventListeners();
};

/**
 * Bind event listeners for when the filters change.
 */
Demo.prototype._bindEventListeners = function () {
  this._onShapeChange = this._handleShapeChange.bind(this);
  this._onColorChange = this._handleColorChange.bind(this);

  this.shapes.forEach(function (input) {
    input.addEventListener('change', this._onShapeChange);
  }, this);

  this.colors.forEach(function (button) {
    button.addEventListener('click', this._onColorChange);
  }, this);
};

/**
 * Get the values of each checked input.
 * @return {Array.<string>}
 */
Demo.prototype._getCurrentShapeFilters = function () {
  return this.shapes.filter(function (input) {
    return input.checked;
  }).map(function (input) {
    return input.value;
  });
};

/**
 * Get the values of each `active` button.
 * @return {Array.<string>}
 */
Demo.prototype._getCurrentColorFilters = function () {
  return this.colors.filter(function (button) {
    return button.classList.contains('active');
  }).map(function (button) {
    return button.getAttribute('data-value');
  });
};

/**
 * A shape input check state changed, update the current filters and filte.r
 */
Demo.prototype._handleShapeChange = function () {
  this.filters.shapes = this._getCurrentShapeFilters();
  this.filter();
};

/**
 * A color button was clicked. Update filters and display.
 * @param {Event} evt Click event object.
 */
Demo.prototype._handleColorChange = function (evt) {
  var button = evt.currentTarget;

  // Treat these buttons like radio buttons where only 1 can be selected.
  if (button.classList.contains('active')) {
    button.classList.remove('active');
  } else {
    this.colors.forEach(function (btn) {
      btn.classList.remove('active');
    });

    button.classList.add('active');
  }

  this.filters.colors = this._getCurrentColorFilters();
  this.filter();
};

/**
 * Filter shuffle based on the current state of filters.
 */
Demo.prototype.filter = function () {
  if (this.hasActiveFilters()) {
    this.shuffle.filter(this.itemPassesFilters.bind(this));
  } else {
    this.shuffle.filter(Shuffle.ALL_ITEMS);
  }
};

/**
 * If any of the arrays in the `filters` property have a length of more than zero,
 * that means there is an active filter.
 * @return {boolean}
 */
Demo.prototype.hasActiveFilters = function () {
  return Object.keys(this.filters).some(function (key) {
    return this.filters[key].length > 0;
  }, this);
};

/**
 * Determine whether an element passes the current filters.
 * @param {Element} element Element to test.
 * @return {boolean} Whether it satisfies all current filters.
 */
Demo.prototype.itemPassesFilters = function (element) {
  var shapes = this.filters.shapes;
  var colors = this.filters.colors;
  var shape = element.getAttribute('data-shape');
  var color = element.getAttribute('data-color');

  // If there are active shape filters and this shape is not in that array.
  if (shapes.length > 0 && !shapes.includes(shape)) {
    return false;
  }

  // If there are active color filters and this color is not in that array.
  if (colors.length > 0 && !colors.includes(color)) {
    return false;
  }

  return true;
};

document.addEventListener('DOMContentLoaded', function () {
  window.demo = new Demo(document.querySelector('.js-shuffle'));
});
