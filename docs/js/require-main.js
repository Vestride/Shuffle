requirejs.config({
  baseUrl: window.site_url + '/js',
  paths: {
    shufflejs: '../dist/shuffle',
  },
});

requirejs(['shufflejs'], (Shuffle) => {
  window.shuffleInstance = new Shuffle(document.getElementById('grid'), {
    itemSelector: '.js-item',
    sizer: document.getElementById('js-sizer'),
  });
});
