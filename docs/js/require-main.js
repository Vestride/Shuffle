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
  },
});

requirejs(['shufflejs'], function (Shuffle) {
  window.myShuffle = new Shuffle(document.getElementById('grid'), {
    itemSelector: '.js-item',
    sizer: document.getElementById('js-sizer'),
  });
});
