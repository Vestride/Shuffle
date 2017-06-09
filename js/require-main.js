requirejs.config({
  baseUrl: window.site_url + '/js',
  paths: {
    shufflejs: '../dist/shuffle',
    polyfill: 'https://unpkg.com/core-js/client/shim.min',
  },

  // Shimming other page javascript.
  shim: {
    shufflejs: {
      deps: ['polyfill'],
    },
    page: {
      deps: ['evenheights'],
      exports: 'Modules',
    },
  },
});

requirejs(['shufflejs', 'evenheights', 'page'], function (Shuffle) {
  'use strict';

  // Create a new shuffle instance.
  var element = document.getElementById('grid');
  window.myShuffle = new Shuffle(element, {
    itemSelector: '.js-item',
    sizer: document.getElementById('js-sizer'),
  });
});
