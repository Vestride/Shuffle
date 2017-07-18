requirejs.config({
  baseUrl: window.site_url + '/js',
  paths: {
    shufflejs: '../dist/shuffle',
    polyfill: 'https://unpkg.com/core-js/client/shim.min',
  },

  // Load the polyfill before Shuffle.
  shim: {
    shufflejs: {
      deps: ['polyfill'],
    },
  },
});

requirejs(['shufflejs'], function (Shuffle) {
  window.shuffleInstance = new Shuffle(document.getElementById('grid'), {
    itemSelector: '.js-item',
    sizer: document.getElementById('js-sizer'),
  });
});
