'use strict';
var Manipulator = (function (Shuffle) {

  var Manipulator = function (element) {
    this.element = element;
    this.initShuffle();
    this.setupEvents();

    this.addToEnd = true;
    this.sequentialDelay = true;
  };

  // Column width and gutter width options can be functions
  Manipulator.prototype.initShuffle = function () {
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

  Manipulator.prototype.setupEvents = function () {
    document.querySelector('#add').addEventListener('click', this.onAddClick.bind(this));
    document.querySelector('#randomize').addEventListener('click', this.onRandomize.bind(this));
    document.querySelector('#remove').addEventListener('click', this.onRemoveClick.bind(this));
    document.querySelector('#sorter').addEventListener('change', this.onSortChange.bind(this));
    document.querySelector('#mode').addEventListener('change', this.onModeChange.bind(this));

    // Show off some shuffle events
    this.element.addEventListener(Shuffle.EventType.REMOVED, function (evt) {
      var detail = evt.detail;
      console.log(this, evt, detail.collection, detail.shuffle);
    });
  };

  Manipulator.prototype.onAddClick = function () {

    // Creating random elements. You could use an
    // ajax request or clone elements instead
    var itemsToCreate = 5;
    var frag = document.createDocumentFragment();
    var items = [];
    var classes = ['w2', 'h2', 'w3'];
    var i = 0;

    for (i = 0; i < itemsToCreate; i++) {
      var randomClass;
      var random = Math.random();
      var box = document.createElement('div');
      box.className = 'box';
      box.setAttribute('created', this.getRandomInt(1, 150));

      // Randomly add a class
      if (random > 0.8) {
        randomClass = Math.floor(Math.random() * 3);
        box.className = box.className + ' ' + classes[randomClass];
      }

      items.push(box);
      frag.appendChild(box);
    }

    this.element.appendChild(frag);

    // Tell shuffle items have been appended.
    // It expects an array of elements as the parameter.
    this.shuffle.add(items, this.addToEnd, this.sequentialDelay);
  };

  Manipulator.prototype.getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Randomly choose some elements to remove
  Manipulator.prototype.onRemoveClick = function () {
    var total = this.shuffle.visibleItems;
    var numberToRemove = Math.min(3, total);
    var indexesToRemove = [];
    var i = 0;

    // None left
    if (!total) {
      return;
    }

    // This has the possibility to choose the same index for more than
    // one in the array, meaning sometimes less than 3 will be removed
    for (; i < numberToRemove; i++) {
      indexesToRemove.push(this.getRandomInt(0, total - 1));
    }

    // Make an array of elements to remove.
    var collection = indexesToRemove.map(function (index) {
      return this.shuffle.items[index].element;
    }, this);

    // Tell shuffle to remove them
    this.shuffle.remove(collection);
  };

  Manipulator.prototype.onRandomize = function () {
    document.getElementById('sorter').value = 'random';
    this.sortBy('random');
  };

  Manipulator.prototype.onSortChange = function (evt) {
    this.sortBy(evt.target.value);
  };

  Manipulator.prototype.sortBy = function (value) {
    var sortOptions;

    // We're given the element wrapped in jQuery
    if (value === 'created') {
      sortOptions = {
        by: function (el) {
          return parseInt(el.getAttribute('created'), 10);
        },
      };
    } else if (value === 'random') {
      sortOptions = { randomize: true };
    } else {
      sortOptions = {};
    }

    // Filter elements
    this.shuffle.sort(sortOptions);
  };

  Manipulator.prototype.onModeChange = function (evt) {
    var value = evt.target.value;

    if (value === 'end') {
      this.addToEnd = true;
      this.sequentialDelay = false;
    } else if (value === 'end-sequential') {
      this.addToEnd = true;
      this.sequentialDelay = true;
    } else if (value === 'mix') {
      this.addToEnd = false;
      this.sequentialDelay = false;
    }
  };

  return Manipulator;

}(window.shuffle));

new Manipulator(document.getElementById('my-shuffle'));
