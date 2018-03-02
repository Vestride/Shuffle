'use strict';

var Shuffle = window.Shuffle;

var Demo = function (element) {
  this.element = element;
  this.initShuffle();
  this.setupEvents();
};

// Column width and gutter width options can be functions
Demo.prototype.initShuffle = function () {
  this.shuffle = new Shuffle(this.element, {
    itemSelector: '.box',
    speed: 250,
    easing: 'ease',
    columnWidth: function (containerWidth) {
      // .box's have a width of 18%
      return 0.18 * containerWidth;
    },

    gutterWidth: function (containerWidth) {
      // .box's have a margin-left of 2.5%
      return 0.025 * containerWidth;
    },
  });
};

Demo.prototype.setupEvents = function () {
  document.querySelector('#append').addEventListener('click', this.onAppendBoxes.bind(this));
  document.querySelector('#prepend').addEventListener('click', this.onPrependBoxes.bind(this));
  document.querySelector('#randomize').addEventListener('click', this.onRandomize.bind(this));
  document.querySelector('#remove').addEventListener('click', this.onRemoveClick.bind(this));
  document.querySelector('#sorter').addEventListener('change', this.onSortChange.bind(this));
  document.querySelector('#filterer').addEventListener('change', this.onFilterChange.bind(this));
  this.shuffle.element.addEventListener('click', this.onContainerClick.bind(this));

  // Show off some shuffle events
  this.shuffle.on(Shuffle.EventType.REMOVED, function (data) {
    console.log(data);
  });
};

/**
 * Generate random DOM elements.
 * @param {number} itemsToCreate Number of items to create.
 * @return {Array.<Element>} Array of elements.
 */
Demo.prototype._generateBoxes = function (itemsToCreate) {
  // Creating random elements. You could use an ajax request or clone elements instead.
  var items = [];
  var modifierClasses = ['w2', 'h2', 'w3'];
  var i = 0;

  for (i = 0; i < itemsToCreate; i++) {
    var random = Math.random();
    var box = document.createElement('div');
    box.className = 'box';
    box.style.backgroundColor = this.getRandomColor();
    box.setAttribute('data-reviews', this.getRandomInt(1, 150));

    // Randomly add a class
    if (random > 0.8) {
      var randomClass = Math.floor(Math.random() * 3);
      box.className = box.className + ' ' + modifierClasses[randomClass];
    }

    items.push(box);
  }

  return items;
};

/**
 * Return an array of elements which have already been added to the DOM.
 * @return {Array.<Element>}
 */
Demo.prototype._getArrayOfElementsToAdd = function () {
  return this._generateBoxes(5);
};

/**
 * Create an HTML string to insert. This could, for example, come from an XHR request.
 * @return {string} A mock HTML string.
 */
Demo.prototype._getHtmlMarkupToAdd = function () {
  var fragment = document.createDocumentFragment();
  this._generateBoxes(5).forEach(function (item) {
    fragment.appendChild(item);
  });

  var dummy = document.createElement('div');
  dummy.appendChild(fragment);
  return dummy.innerHTML;
};

/**
 * Create some DOM elements, append them to the shuffle container, then notify
 * shuffle about the new items. You could also insert the HTML as a string.
 */
Demo.prototype.onAppendBoxes = function () {
  var elements = this._getArrayOfElementsToAdd();

  elements.forEach(function (element) {
    this.shuffle.element.appendChild(element);
  }, this);

  // Tell shuffle items have been appended.
  // It expects an array of elements as the parameter.
  this.shuffle.add(elements);
};

/**
 * Show that you can prepend elements by inserting before other elements. You
 * can either insert a string like in this method or prepend real elements like
 * the `onAppendBoxes` method.
 */
Demo.prototype.onPrependBoxes = function () {
  var markup = this._getHtmlMarkupToAdd();

  // Prepend HTML string.
  this.element.insertAdjacentHTML('afterbegin', markup);

  // Get the first 5 children of the container (we are inserting 5 items).
  var items = Array.prototype.slice.call(this.element.children, 0, 5);

  // Notify the instance.
  this.shuffle.add(items);
};

Demo.prototype.getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

Demo.prototype.getRandomColor = function () {
  return '#' + Math.random().toString(16).slice(2, 8);
};

// Randomly choose some elements to remove
Demo.prototype.onRemoveClick = function () {
  var total = this.shuffle.visibleItems;

  // None left
  if (!total) {
    return;
  }

  var numberToRemove = Math.min(3, total);
  var indiciesToRemove = [];

  // This has the possibility to choose the same index for more than
  // one in the array, meaning sometimes less than 3 will be removed
  for (var i = 0; i < numberToRemove; i++) {
    indiciesToRemove.push(this.getRandomInt(0, total - 1));
  }

  // Make an array of elements to remove.
  var collection = indiciesToRemove.map(function (index) {
    return this.shuffle.items[index].element;
  }, this);

  // Tell shuffle to remove them
  this.shuffle.remove(collection);
};

Demo.prototype.onRandomize = function () {
  var label = document.getElementById('sorter').querySelector('label.btn.active');
  if (label) {
    var radio = label.querySelector('input');
    radio.checked = false;
    label.classList.remove('active');
  }

  this.sortBy('random');
};

Demo.prototype.toggleActiveClasses = function (event) {
  // Add and remove `active` class from buttons.
  var buttons = Array.from(event.currentTarget.children);
  buttons.forEach(function (button) {
    if (button.querySelector('input').value === event.target.value) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
}

Demo.prototype.onSortChange = function (evt) {
  this.toggleActiveClasses(evt);
  this.sortBy(evt.target.value);
};

Demo.prototype.sortBy = function (value) {
  var sortOptions;

  if (value === 'most-reviews') {
    sortOptions = {
      reverse: true,
      by: this.getReviews,
    };

  } else if (value === 'least-reviews') {
    sortOptions = {
      by: this.getReviews,
    };

  } else if (value === 'random') {
    sortOptions = { randomize: true };

  } else {
    sortOptions = {};
  }

  // Filter elements
  this.shuffle.sort(sortOptions);
};

Demo.prototype.getReviews = function (element) {
  return parseInt(element.getAttribute('data-reviews'), 10);
}

Demo.prototype.onFilterChange = function (event) {
  this.toggleActiveClasses(event);
  this.filterBy(event.target.value);
};

Demo.prototype.filterBy = function (value) {
  var filterBy;
  var _this = this;

  if (value === 'none') {
    filterBy = Shuffle.ALL_ITEMS;
  } else if (value === 'odd-reviews') {
    filterBy = function (element) {
      return _this.getReviews(element) % 2 === 1;
    };
  } else {
    filterBy = function (element) {
      return _this.getReviews(element) % 2 === 0;
    };
  }

  this.shuffle.filter(filterBy);
};

/**
 * Remove a shuffle item when it's clicked.
 * @param {Object} event Event object.
 */
Demo.prototype.onContainerClick = function (event) {
  // Bail in older browsers. https://caniuse.com/#feat=element-closest
  if (typeof event.target.closest !== 'function') {
    return;
  }

  var element = event.target.closest('.box');
  if (element !== null) {
    this.shuffle.remove([element]);
  }
};

document.addEventListener('DOMContentLoaded', function () {
  window.demo = new Demo(document.getElementById('my-shuffle'));
});
