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

  // Page-level JavaScript used for the demo pages.
  require('evenheights');
  require('page');

  // Get Shuffle.
  var Shuffle = require('shuffle');

  // Create a new shuffle instance.
  var element = document.getElementById('grid');
  window.myShuffle = new Shuffle(element, {
    itemSelector: '.js-item',
    sizer: document.getElementById('js-sizer'),
  });
});
