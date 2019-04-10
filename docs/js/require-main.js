requirejs.config({
  baseUrl: window.site_url + '/js',
  paths: {
    shufflejs: '../dist/shuffle',
    polyfill: 'https://polyfill.io/v3/polyfill.min.js?features=default%2Ces5%2Ces6%2Ces7',
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
