requirejs.config({
  baseUrl: site_url + '/js',
  paths: {
    shuffle: '../dist/shuffle',
  },

  // Shimming other page javascript.
  shim: {
    page: {
      deps: ['evenheights'],
      exports: 'Modules',
    },
  },
});

define(function (require) {
  'use strict';

  // Get Shuffle.
  var Shuffle = require('shuffle');

  // Page-level JavaScript used for the demo pages.
  require('evenheights');
  require('page');

  // Create a new shuffle instance.
  var element = document.getElementById('grid');
  var shuffle = new Shuffle(element, {
    itemSelector: '.js-item',
    sizer: document.getElementById('js-sizer'),
  });

  // DO NOT use this for determining when images load.
  // See http://vestride.github.io/Shuffle/images/
  // Use something like imagesLoaded.
  var imgs = this.element.querySelectorAll('img');

  var handler = function () {
    shuffle.update();
  };

  for (var i = imgs.length - 1; i >= 0; i--) {
    imgs[i].addEventListener('load', handler, false);
  }
});
