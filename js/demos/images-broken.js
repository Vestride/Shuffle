
var ImageDemo = (function( $ ) {

  var $shuffle = $('.shuffle--images'),
      sizer = document.getElementById('js-sizer'),

  init = function() {

    $shuffle.shuffle({
      sizer: sizer,
      itemSelector: '.js-item'
    });
  };

  return {
    init: init
  };
}( jQuery ));

$(document).ready(function() {
  ImageDemo.init();
});
