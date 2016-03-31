'use strict';

var Shuffle = window.shuffle;
var Viewport = window.Viewport;

var Demo = function () {
  this.element = document.getElementById('grid');
  this.gridItems = this.element.querySelectorAll('.picture-item');
  var sizer = this.element.querySelector('.shuffle__sizer');

  this.shuffle = new Shuffle(this.element, {
    itemSelector: '.picture-item',
    sizer: sizer,
  });

  this.addViewportItems();

  // Add the transition class to the items after ones that are in the viewport
  // have received the `in` class.
  setTimeout(function () {
    this.addTransitionToItems();
  }.bind(this), 100);
};

/**
 * Loop through each grid item and add it to the viewport watcher.
 */
Demo.prototype.addViewportItems = function () {
  for (var i = 0; i < this.gridItems.length; i++) {
    Viewport.add({
      element: this.gridItems[i],
      threshold: 130,
      enter: this.showItemsInViewport,
    });
  }
};

/**
 * Add the `in` class to the element after it comes into view.
 */
Demo.prototype.showItemsInViewport = function () {
  this.classList.add('in');
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

/**
 * Re-layout shuffle when images load. This is only needed below 768 pixels
 * because the .picture-item height is auto and therefore the height of the
 * picture-item is dependent on the image. I recommend using imagesloaded by
 * desandro to determine when all your images have loaded.
 */
Demo.prototype.listenForImageLoads = function () {
  var imgs = this.element.querySelectorAll('img');
  var handler = function () {
    this.shuffle.update();
    Viewport.refresh();
  }.bind(this);

  for (var i = imgs.length - 1; i >= 0; i--) {
    imgs[i].addEventListener('load', handler, false);
  }
};

document.addEventListener('DOMContentLoaded', function () {
  window.demo = new Demo();
});
