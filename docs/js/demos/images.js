var Shuffle = window.Shuffle;

window.shuffleInstance = new Shuffle(document.querySelector('.my-grid-with-images'), {
  itemSelector: '.js-item',
  sizer: '.my-sizer-element',
});
