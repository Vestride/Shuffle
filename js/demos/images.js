
// For this demo, shuffle won't be initialized until
// all the images have finished loading.

// Another approach would be to initialize shuffle on document
// ready and as imagesLoaded reports back progress, call shuffle.layout()

// imagesLoaded: https://github.com/desandro/imagesloaded

var ImageDemo = (function( $, imagesLoaded ) {

  var $shuffle = $('.shuffle--images'),
      $imgs = $shuffle.find('img'),
      $loader = $('#loader'),
      sizer = document.getElementById('js-sizer'),
      imgLoad,

  init = function() {

    // Create a new imagesLoaded instance
    imgLoad = new imagesLoaded( $imgs.get() );

    // Listen for when all images are done
    // will be executed even if some images fail
    imgLoad.on( 'always', onAllImagesFinished );
  },

  onAllImagesFinished = function( instance ) {

    if ( window.console && window.console.log ) {
      console.log( instance );
    }

    // Hide loader
    $loader.addClass('hidden');

    // Adds visibility: visible;
    $shuffle.addClass('images-loaded');

    // Initialize shuffle
    $shuffle.shuffle({
      sizer: sizer,
      itemSelector: '.js-item'
    });
  };

  return {
    init: init
  };
}( jQuery, window.imagesLoaded ));

$(document).ready(function() {
  ImageDemo.init();
});
