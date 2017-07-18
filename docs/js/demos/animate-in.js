'use strict';

var Shuffle = window.Shuffle;

var Demo = function () {
  this.element = document.getElementById('grid');
  this.gridItems = this.element.querySelectorAll('.picture-item');
  var sizer = this.element.querySelector('.my-sizer-element');

  this.shuffle = new Shuffle(this.element, {
    itemSelector: '.picture-item',
    sizer: sizer,
  });

  var callback = this.showItemsInViewport.bind(this);
  this.observer = new window.IntersectionObserver(callback, {
    threshold: 0.5,
  });

  // Loop through each grid item and add it to the viewport watcher.
  for (var i = 0; i < this.gridItems.length; i++) {
    this.observer.observe(this.gridItems[i]);
  }

  // Add the transition class to the items after ones that are in the viewport
  // have received the `in` class.
  setTimeout(function () {
    this.addTransitionToItems();
  }.bind(this), 100);
};

/**
 * Add the `in` class to the element after it comes into view.
 */
Demo.prototype.showItemsInViewport = function (changes) {
  changes.forEach(function (change) {
    if (change.isIntersecting) {
      change.target.classList.add('in');
    }
  });
};

/**
 * Only the items out of the viewport should transition. This way, the first
 * visible ones will snap into place.
 */
Demo.prototype.addTransitionToItems = function () {
  for (var i = 0; i < this.gridItems.length; i++) {
    var inner = this.gridItems[i].querySelector('.picture-item__inner');
    inner.classList.add('picture-item__inner--transition');
  }
};

document.addEventListener('DOMContentLoaded', function () {
  window.demo = new Demo();
});
