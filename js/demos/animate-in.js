'use strict';

var Shuffle = window.shuffle;
var Viewport = window.viewport;

function toArray(arrayLike) {
  if ('from' in Array) {
    return Array.from(arrayLike);
  }

  return Array.prototype.slice.call(arrayLike);
}

var Demo = function () {
  this.element = document.getElementById('grid');
  this.gridItems = toArray(this.element.querySelectorAll('.picture-item'));
  this.sizer = this.element.querySelector('.shuffle__sizer');

  this.shuffle = new Shuffle(this.element, {
    itemSelector: '.picture-item',
    sizer: this.sizer,
  });

  this.addViewportItems();

  setTimeout(function () {
    this.addTransitionToItems();
  }.bind(this), 100);
};

Demo.prototype.addViewportItems = function () {
  var handler = this.showItemsInViewport;

  this.gridItems.forEach(function () {
    Viewport.add({
      element: this,
      threshold: 130,
      enter: handler,
    });
  });
};

Demo.prototype.showItemsInViewport = function () {
  this.classList.add('in');
};

/**
 * Only the items out of the viewport should transition. This way, the first
 * visible ones will snap into place.
 */
Demo.prototype.addTransitionToItems = function () {
  this.gridItems.forEach(function (item) {
    item.querySelector('.picture-item__inner').classList.add('picture-item__inner--transition');
  });
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
